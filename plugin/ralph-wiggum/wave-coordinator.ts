/**
 * Wave Coordinator - Parallel task execution
 * 
 * Coordinates execution of independent tasks in waves.
 * Tasks within a wave can run in parallel (up to maxParallel).
 * Waves must complete before the next wave starts.
 */

import { TaskExecutor, type TaskResult } from "./task-executor"
import type { OpenCodeClient } from "./types"

export interface Wave {
  waveNumber: number
  tasks: string[]
  status: "pending" | "running" | "complete" | "failed"
}

export interface WaveResult {
  waveNumber: number
  results: Map<string, TaskResult>
  allComplete: boolean
  duration: number
}

export class WaveCoordinator {
  constructor(
    private taskExecutor: TaskExecutor,
    private maxParallel: number = 3,
    private client?: OpenCodeClient
  ) {}

  /**
   * Execute all tasks in a wave
   * Tasks are batched by maxParallel for concurrent execution
   */
  async executeWave(
    wave: Wave,
    featureDir: string,
    parentSessionId?: string
  ): Promise<WaveResult> {
    const startTime = Date.now()
    const results = new Map<string, TaskResult>()

    // Update wave status
    wave.status = "running"

    // Batch tasks for parallel execution
    const batches = this.batchTasks(wave.tasks, this.maxParallel)

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

    wave.status = allComplete ? "complete" : "failed"

    return {
      waveNumber: wave.waveNumber,
      results,
      allComplete,
      duration: Date.now() - startTime
    }
  }

  /**
   * Execute multiple waves in sequence
   */
  async executeAllWaves(
    waves: Wave[],
    featureDir: string,
    parentSessionId?: string
  ): Promise<WaveResult[]> {
    const results: WaveResult[] = []

    for (const wave of waves) {
      const waveResult = await this.executeWave(wave, featureDir, parentSessionId)
      results.push(waveResult)

      // Stop if wave failed and has dependent tasks
      if (!waveResult.allComplete) {
        // Log that subsequent waves are blocked
        if (this.client) {
          try {
            await this.client.app.log({
              body: {
                service: "ralph-wiggum",
                level: "warn",
                message: `Wave ${wave.waveNumber} failed. Subsequent waves blocked.`,
                extra: { waveNumber: wave.waveNumber, failedTasks: Array.from(waveResult.results.entries()).filter(([, result]) => result.status !== "complete").map(([taskId]) => taskId) }
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
