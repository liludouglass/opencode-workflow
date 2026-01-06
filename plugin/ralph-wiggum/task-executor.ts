/**
 * Task Executor - Core Ralph Wiggum loop implementation
 * 
 * Executes a single task through iterations until:
 * - <complete/> signal is detected
 * - Max iterations reached (escalate to human)
 * - Unrecoverable error occurs
 */

import type { CIEnforcer } from "./ci-enforcer"
import type { OpenCodeClient, ShellFunction } from "./types"
import * as fs from "fs"
import * as path from "path"

export interface RalphConfig {
  maxIterations: number
  completeSignal: string
  requireCIGreen: boolean
  progressHistory: number
  model?: {
    providerID: string
    modelID: string
  }
}

export interface TaskResult {
  status: "complete" | "max_iterations" | "ci_failed" | "error"
  iterations: number
  finalOutput: string
  errorMessage?: string
}

export interface TaskContext {
  taskId: string
  featureDir: string
  iteration: number
  specSections: string[]
  acceptanceCriteria: string[]
  filesToModify: string[]
  recentProgress: string[]
}

export class TaskExecutor {
  constructor(
    private client: OpenCodeClient,
    private shell: ShellFunction,
    private config: RalphConfig,
    private ciEnforcer: CIEnforcer
  ) {}

  /**
   * Execute a task using Ralph Wiggum loop
   */
  async executeTask(
    taskId: string,
    featureDir: string,
    maxIterations: number,
    parentSessionId?: string
  ): Promise<TaskResult> {
    const iterations = maxIterations || this.config.maxIterations

    for (let i = 1; i <= iterations; i++) {
      try {
        // 1. Generate fresh context
        const context = await this.generateContext(taskId, featureDir, i)

        // 2. Create child session for this iteration
        const session = await this.createChildSession(
          `${taskId} - Iteration ${i}`,
          parentSessionId
        )

        // 3. Run implementer with context
        const output = await this.runImplementer(session.id, context)

        // 4. Check for completion signal
        if (this.detectComplete(output)) {
          await this.logProgress(taskId, i, "completed", featureDir, output)
          
          // 5. Final CI check
          if (this.config.requireCIGreen) {
            const ciResult = await this.ciEnforcer.enforce(featureDir)
            if (!ciResult.passed) {
              await this.logProgress(taskId, i, "ci_failed_final", featureDir, output)
              return {
                status: "ci_failed",
                iterations: i,
                finalOutput: output,
                errorMessage: "CI checks failed after completion"
              }
            }
          }

          return {
            status: "complete",
            iterations: i,
            finalOutput: output
          }
        }

        // 6. CI check before next iteration
        if (this.config.requireCIGreen) {
          const ciResult = await this.ciEnforcer.enforce(featureDir)
          if (!ciResult.passed) {
            await this.logProgress(taskId, i, "ci_failed", featureDir, output)
            // Continue to next iteration to fix CI issues
            continue
          }
        }

        // 7. Log progress
        await this.logProgress(taskId, i, "in_progress", featureDir, output)

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        await this.logProgress(taskId, i, "error", featureDir, errorMessage)
        
        // Continue to next iteration unless it's a critical error
        if (errorMessage.includes("CRITICAL")) {
          return {
            status: "error",
            iterations: i,
            finalOutput: "",
            errorMessage
          }
        }
      }
    }

    // Max iterations reached
    return {
      status: "max_iterations",
      iterations,
      finalOutput: "Maximum iterations reached. Task requires human intervention.",
      errorMessage: `Task ${taskId} did not complete after ${iterations} iterations`
    }
  }

  /**
   * Generate fresh context bundle for the task
   */
  private async generateContext(
    taskId: string,
    featureDir: string,
    iteration: number
  ): Promise<TaskContext> {
    const context: TaskContext = {
      taskId,
      featureDir,
      iteration,
      specSections: [],
      acceptanceCriteria: [],
      filesToModify: [],
      recentProgress: []
    }

    // Read spec.md
    const specPath = path.join(featureDir, "spec.md")
    if (fs.existsSync(specPath)) {
      const specContent = fs.readFileSync(specPath, "utf-8")
      context.specSections = [specContent] // Full spec content for now
    }

    // Read acceptance.md
    const acceptancePath = path.join(featureDir, "acceptance.md")
    if (fs.existsSync(acceptancePath)) {
      const acceptanceContent = fs.readFileSync(acceptancePath, "utf-8")
      context.acceptanceCriteria = [acceptanceContent] // Full acceptance criteria for now
    }

    // Read tasks.md to get files to modify
    const tasksPath = path.join(featureDir, "tasks.md")
    if (fs.existsSync(tasksPath)) {
      const tasksContent = fs.readFileSync(tasksPath, "utf-8")
      context.filesToModify = this.extractFilesToModify(tasksContent, taskId)
    }

    // Read recent progress (sliding window)
    const progressPath = path.join(featureDir, "progress.md")
    if (fs.existsSync(progressPath)) {
      const progressContent = fs.readFileSync(progressPath, "utf-8")
      context.recentProgress = this.extractRecentProgress(
        progressContent,
        this.config.progressHistory
      )
    }

    return context
  }

  /**
   * Create a child session for the task iteration
   */
  private async createChildSession(
    title: string,
    parentSessionId?: string
  ): Promise<{ id: string }> {
    try {
      const response = await this.client.session.create({
        body: {
          title,
          parentID: parentSessionId
        }
      })
      return response.data || response || { id: `fallback-${Date.now()}` }
    } catch (error) {
      // Fallback: return a mock session if creation fails
      return { id: `mock-${Date.now()}` }
    }
  }

  /**
   * Run the implementer agent with the given context
   */
  private async runImplementer(
    sessionId: string,
    context: TaskContext
  ): Promise<string> {
    const prompt = this.buildImplementerPrompt(context)

    try {
      const response = await this.client.session.prompt({
        path: { id: sessionId },
        body: {
          model: this.config.model || {
            providerID: "anthropic",
            modelID: "claude-sonnet-4-20250514"
          },
          parts: [{
            type: "text",
            text: prompt
          }]
        }
      })

      // Extract response text
      const result = response.data || response
      if (typeof result === "string") {
        return result
      } else if (result && typeof result === "object") {
        if ("content" in result && result.content) {
          return result.content
        } else if ("message" in result && result.message) {
          return result.message
        }
      }
      return JSON.stringify(result)
    } catch (error) {
      throw new Error(`Implementer failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Build the prompt for the implementer agent
   */
  private buildImplementerPrompt(context: TaskContext): string {
    return `# Task Execution: ${context.taskId} (Iteration ${context.iteration})

## Instructions

Execute the task following these steps:
1. Micro-decompose into atomic steps
2. Execute each step with self-verification
3. Run tests after implementation
4. Emit <complete/> when ALL acceptance criteria pass

## Specification

${context.specSections.join("\n\n")}

## Acceptance Criteria

${context.acceptanceCriteria.join("\n\n")}

## Files to Modify

${context.filesToModify.join("\n")}

## Recent Progress

${context.recentProgress.join("\n\n")}

## Completion Signal

When ALL acceptance criteria pass and tests are green, emit:

<complete/>

This signals that the task is done and no more iterations are needed.

---

Begin implementation now.`
  }

  /**
   * Check if output contains completion signal
   */
  private detectComplete(output: string): boolean {
    return output.includes(this.config.completeSignal)
  }

  /**
   * Append progress entry to progress.md
   */
  private async logProgress(
    taskId: string,
    iteration: number,
    status: string,
    featureDir: string,
    output: string
  ): Promise<void> {
    const progressPath = path.join(featureDir, "progress.md")
    const timestamp = new Date().toISOString().replace("T", " ").split(".")[0]

    const entry = `
## [${timestamp}] - ${taskId} - Iteration ${iteration}
**Status**: ${status}
**Output Summary**: ${output.slice(0, 500)}${output.length > 500 ? "..." : ""}

---
`

    try {
      fs.appendFileSync(progressPath, entry)
    } catch (error) {
      // Log error but don't fail the task
      try {
        await this.client.app.log({
          body: {
            service: "ralph-wiggum",
            level: "warn",
            message: `Failed to log progress for ${taskId}`,
            extra: { error: error instanceof Error ? error.message : String(error) }
          }
        })
      } catch (logError) {
        // Ignore logging errors
      }
    }
  }

  /**
   * Extract files to modify from tasks.md content
   */
  private extractFilesToModify(tasksContent: string, taskId: string): string[] {
    const lines = tasksContent.split('\n')
    const files: string[] = []
    let inTask = false
    let inFilesSection = false
    
    for (const line of lines) {
      // Check if we're entering the target task section
      if (line.includes(taskId)) {
        inTask = true
        continue
      }
      
      // Check if we've hit the next task section (exit)
      if (inTask && line.match(/^###?\s+TASK-\d+/)) {
        break
      }
      
      // Check for "Files to Modify" or similar section headers
      if (inTask && line.match(/files?\s*(to\s*)?(modify|change|touch)/i)) {
        inFilesSection = true
        continue
      }
      
      // Extract file paths from list items
      if (inTask && inFilesSection) {
        // Match patterns like: - `src/file.ts` or - src/file.ts (create)
        const backtickMatch = line.match(/^\s*-\s*`([^`]+)`/)
        const plainMatch = line.match(/^\s*-\s*([^\s(]+)/)
        
        if (backtickMatch && backtickMatch[1]) {
          files.push(backtickMatch[1])
        } else if (plainMatch && plainMatch[1] && plainMatch[1].includes('/')) {
          files.push(plainMatch[1])
        }
        
        // Exit files section if we hit another section header
        if (line.match(/^#+\s/) || line.match(/^\*\*/)) {
          inFilesSection = false
        }
      }
    }
    
    return files
  }

  /**
   * Extract recent progress entries (sliding window)
   */
  private extractRecentProgress(progressContent: string, count: number): string[] {
    const entries = progressContent.split(/^## \[/m).filter(e => e.trim())
    return entries.slice(-count).map(e => "## [" + e)
  }
}
