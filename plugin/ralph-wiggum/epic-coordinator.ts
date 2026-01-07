/**
 * Epic Coordinator - Parallel task execution
 * 
 * Coordinates execution of independent tasks in epics.
 * Tasks within an epic can run in parallel (up to maxParallel).
 * Epics must complete before the next epic starts.
 */

import { TaskExecutor, type TaskResult } from "./task-executor"
import type { OpenCodeClient } from "./types"

export interface Epic {
  epicNumber: number
  tasks: string[]
  status: "pending" | "running" | "complete" | "failed"
}

export interface EpicResult {
  epicNumber: number
  results: Map<string, TaskResult>
  allComplete: boolean
  duration: number
}

export class EpicCoordinator {
  constructor(
    private taskExecutor: TaskExecutor,
    private maxParallel: number = 3,
    private client?: OpenCodeClient
  ) {}

  /**
   * Execute all tasks in an epic
   * Tasks are batched by maxParallel for concurrent execution
   */
  async executeEpic(
    epic: Epic,
    featureDir: string,
    parentSessionId?: string
  ): Promise<EpicResult> {
    const startTime = Date.now()
    const results = new Map<string, TaskResult>()

    // Update epic status
    epic.status = "running"

    // Batch tasks for parallel execution
    const batches = this.batchTasks(epic.tasks, this.maxParallel)

    for (const batch of batches) {
      // Execute batch in parallel
      const batchPromises = batch.map(taskId =>
        this.executeTaskWithErrorHandling(taskId, featureDir, parentSessionId)
      )

      const batchResults = await Promise.all(batchPromises)

      // Store results
      batch.forEach((taskId, index) => {
        const result = batchResults[index]
        if (result) {
          results.set(taskId, result)
        }
      })
    }

    // Determine if all tasks completed successfully
    const allComplete = Array.from(results.values()).every(
      result => result.status === "complete"
    )

    epic.status = allComplete ? "complete" : "failed"

    return {
      epicNumber: epic.epicNumber,
      results,
      allComplete,
      duration: Date.now() - startTime
    }
  }

  /**
   * Execute multiple epics in sequence
   */
  async executeAllEpics(
    epics: Epic[],
    featureDir: string,
    parentSessionId?: string
  ): Promise<EpicResult[]> {
    const results: EpicResult[] = []

    for (const epic of epics) {
      const epicResult = await this.executeEpic(epic, featureDir, parentSessionId)
      results.push(epicResult)

      // Stop if epic failed and has dependent tasks
      if (!epicResult.allComplete) {
        // Log that subsequent epics are blocked
        if (this.client) {
          try {
            await this.client.app.log({
              body: {
                service: "ralph-wiggum",
                level: "warn",
                message: `Epic ${epic.epicNumber} failed. Subsequent epics blocked.`,
                extra: { epicNumber: epic.epicNumber, failedTasks: Array.from(epicResult.results.entries()).filter(([, result]) => result.status !== "complete").map(([taskId]) => taskId) }
              }
            })
          } catch (logError) {
            // Ignore logging errors
          }
        }
        break
      }
    }

    return results
  }

  /**
   * Batch tasks into groups of maxParallel
   */
  private batchTasks(tasks: string[], batchSize: number): string[][] {
    const batches: string[][] = []
    
    for (let i = 0; i < tasks.length; i += batchSize) {
      batches.push(tasks.slice(i, i + batchSize))
    }

    return batches
  }

  /**
   * Execute a task with error handling
   * Returns a TaskResult even if execution fails
   */
  private async executeTaskWithErrorHandling(
    taskId: string,
    featureDir: string,
    parentSessionId?: string
  ): Promise<TaskResult> {
    try {
      return await this.taskExecutor.executeTask(
        taskId,
        featureDir,
        10, // Use default max iterations
        parentSessionId
      )
    } catch (error) {
      return {
        status: "error",
        iterations: 0,
        finalOutput: "",
        errorMessage: error instanceof Error ? error.message : String(error)
      }
    }
  }
}