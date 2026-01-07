/**
 * Ralph Wiggum Plugin for OpenCode
 * 
 * Implements the Ralph Wiggum execution pattern for reliable task completion:
 * - Fresh context per iteration
 * - Clear stop condition (<complete/> signal)
 * - Progress persistence
 * - CI-green enforcement
 * - Epic-based parallel execution
 */

import type { Plugin } from "@opencode-ai/plugin"
import { tool } from "@opencode-ai/plugin"
import { TaskExecutor, type RalphConfig, type TaskResult } from "./task-executor"
import { EpicCoordinator, type Epic, type EpicResult } from "./epic-coordinator"
import { CIEnforcer, type CIConfig } from "./ci-enforcer"

// Default configuration
const DEFAULT_CONFIG: RalphConfig = {
  maxIterations: 10,
  completeSignal: "<complete/>",
  requireCIGreen: true,
  progressHistory: 10,
  model: {
    providerID: "anthropic",
    modelID: "claude-sonnet-4-20250514"
  }
}

const DEFAULT_CI_CONFIG: CIConfig = {
  typeCheck: "bun run type-check",
  lint: "bun run lint",
  test: "bun test"
}

/**
 * Ralph Wiggum Plugin
 * 
 * Provides tools for executing tasks using the Ralph Wiggum pattern:
 * - ralph_execute_task: Execute a single task with iteration loop
 * - ralph_execute_epic: Execute an epic of parallel tasks
 * - ralph_task_status: Check status of a task
 */
export const RalphWiggumPlugin: Plugin = async ({ client, $, directory }) => {
  // Initialize components
  const ciEnforcer = new CIEnforcer(DEFAULT_CI_CONFIG, $, client)
  const executor = new TaskExecutor(client, $, DEFAULT_CONFIG, ciEnforcer)
  const coordinator = new EpicCoordinator(executor, 3, client) // Max 3 parallel tasks

  // Log plugin initialization
  await client.app.log({
    body: {
      service: "ralph-wiggum",
      level: "info",
      message: "Ralph Wiggum plugin initialized",
      extra: { 
        maxIterations: DEFAULT_CONFIG.maxIterations,
        completeSignal: DEFAULT_CONFIG.completeSignal 
      }
    }
  })

  return {
    tool: {
      /**
       * Execute a single task using Ralph Wiggum loop
       */
      ralph_execute_task: tool({
        description: "Execute a single task using Ralph Wiggum iteration loop. Runs until <complete/> signal or max iterations.",
        args: {
          taskId: tool.schema.string().describe("Task ID (e.g., TASK-001)"),
          featureDir: tool.schema.string().describe("Path to feature directory containing spec.md, tasks.md, etc."),
          maxIterations: tool.schema.number().optional().describe("Maximum iterations before escalation (default: 10)")
        },
        async execute(args, ctx) {
          await client.app.log({
            body: {
              service: "ralph-wiggum",
              level: "info",
              message: `Starting Ralph loop for ${args.taskId}`,
              extra: { featureDir: args.featureDir, maxIterations: args.maxIterations || DEFAULT_CONFIG.maxIterations }
            }
          })

          try {
            const result = await executor.executeTask(
              args.taskId,
              args.featureDir,
              args.maxIterations || DEFAULT_CONFIG.maxIterations,
              ctx.sessionID
            )

            // Format result message
            if (result.status === "complete") {
              return `✅ Task ${args.taskId} completed successfully in ${result.iterations} iteration(s).\n\nFinal output:\n${result.finalOutput}`
            } else if (result.status === "max_iterations") {
              return `⚠️ Task ${args.taskId} reached maximum iterations (${result.iterations}). Escalate to human.\n\nLast output:\n${result.finalOutput}`
            } else if (result.status === "ci_failed") {
              return `❌ Task ${args.taskId} failed CI checks after ${result.iterations} iteration(s).\n\nError: ${result.errorMessage}`
            } else {
              return `❌ Task ${args.taskId} failed with error: ${result.errorMessage}`
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            await client.app.log({
              body: {
                service: "ralph-wiggum",
                level: "error",
                message: `Ralph loop failed for ${args.taskId}`,
                extra: { error: errorMessage }
              }
            })
            return `❌ Ralph loop failed: ${errorMessage}`
          }
        }
      }),

       /**
        * Execute an epic of parallel tasks
        */
       ralph_execute_epic: tool({
        description: "Execute an epic of independent tasks in parallel. Tasks must not have dependencies on each other.",
        args: {
          epicNumber: tool.schema.number().describe("Epic number for logging"),
          taskIds: tool.schema.array(tool.schema.string()).describe("Array of task IDs to execute in parallel"),
          featureDir: tool.schema.string().describe("Path to feature directory"),
          maxParallel: tool.schema.number().optional().describe("Maximum parallel tasks (default: 3)")
        },
        async execute(args, ctx) {
          await client.app.log({
            body: {
              service: "ralph-wiggum",
              level: "info",
              message: `Starting epic ${args.epicNumber} with ${args.taskIds.length} tasks`,
              extra: { taskIds: args.taskIds }
            }
          })

          try {
            const epic: Epic = {
              epicNumber: args.epicNumber,
              tasks: args.taskIds,
              status: "pending"
            }

            // Update coordinator max parallel if specified
            const maxParallel = args.maxParallel || 3
            const customCoordinator = new EpicCoordinator(executor, maxParallel, client)

            const result = await customCoordinator.executeEpic(
              epic,
              args.featureDir,
              ctx.sessionID
            )

            // Format results summary
            const summaryLines = [`Epic ${args.epicNumber} Results:`]
            for (const [taskId, taskResult] of result.results) {
              const status = taskResult.status === "complete" ? "✅" : 
                             taskResult.status === "max_iterations" ? "⚠️" : "❌"
              summaryLines.push(`  ${status} ${taskId}: ${taskResult.status} (${taskResult.iterations} iterations)`)
            }

            const allComplete = result.allComplete
            summaryLines.push("")
            summaryLines.push(allComplete ? "✅ All tasks in epic completed successfully!" : "⚠️ Some tasks need attention.")

            return summaryLines.join("\n")
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            return `❌ Epic execution failed: ${errorMessage}`
          }
        }
      }),

      /**
       * Run CI checks on a directory
       */
      ralph_ci_check: tool({
        description: "Run CI checks (type-check, lint, test) on a directory",
        args: {
          workdir: tool.schema.string().describe("Directory to run CI checks in")
        },
        async execute(args) {
          try {
            const result = await ciEnforcer.enforce(args.workdir)

            const lines = ["CI Check Results:"]
            for (const [check, passed] of result.results) {
              lines.push(`  ${passed ? "✅" : "❌"} ${check}`)
            }
            lines.push("")
            lines.push(result.passed ? "✅ All CI checks passed!" : "❌ Some CI checks failed.")

            return lines.join("\n")
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            return `❌ CI check failed: ${errorMessage}`
          }
        }
      })
    },

    // Event hooks for monitoring
    event: async ({ event }) => {
      // Log session events for debugging
      if (event.type === "session.idle") {
        await client.app.log({
          body: {
            service: "ralph-wiggum",
            level: "debug",
            message: "Session idle",
            extra: { sessionId: event.properties?.sessionID }
          }
        })
      }
    }
  }
}

export default RalphWiggumPlugin
