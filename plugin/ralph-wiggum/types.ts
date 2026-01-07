/**
 * Shared TypeScript interfaces for Ralph Wiggum plugin
 * 
 * Re-exports all types from other modules for easy importing.
 */

// Task Executor types
export type {
  RalphConfig,
  TaskResult,
  TaskContext
} from "./task-executor"

// Epic Coordinator types
export type {
  Epic,
  EpicResult
} from "./epic-coordinator"

// CI Enforcer types
export type {
  CIConfig,
  CIResult
} from "./ci-enforcer"

// Additional shared types
export interface PluginContext {
  sessionID?: string
  workdir?: string
  featureDir?: string
}

export interface LogEntry {
  timestamp: string
  taskId: string
  iteration: number
  status: string
  message: string
}

export interface TaskProgress {
  taskId: string
  status: "pending" | "in_progress" | "complete" | "failed"
  iterations: number
  lastUpdate: string
  errorMessage?: string
}

export interface EpicProgress {
  epicNumber: number
  totalTasks: number
  completedTasks: number
  failedTasks: number
  status: "pending" | "running" | "complete" | "failed"
  startTime?: string
  endTime?: string
}

// OpenCode client interface (using any for compatibility with actual client)
export type OpenCodeClient = any

export interface LogParams {
  service: string
  level: "debug" | "info" | "warn" | "error"
  message: string
  extra?: Record<string, unknown>
}

// Shell function type (using any for compatibility with Bun shell)
export type ShellFunction = any