# Ralph Wiggum Plugin

A task execution engine for OpenCode that implements the Ralph Wiggum pattern for reliable, iterative task completion.

## Overview

The Ralph Wiggum plugin provides a robust execution framework for complex development tasks with:

- **Fresh context per iteration** - Each iteration starts with clean, focused context
- **Clear completion signals** - Tasks emit `<complete/>` when done
- **CI-green enforcement** - All code must pass CI checks before proceeding
- **Progress persistence** - All iterations are logged for debugging
- **Wave-based parallel execution** - Independent tasks can run concurrently

## Installation

1. Copy the plugin to your OpenCode plugins directory:
   ```bash
   cp -r ralph-wiggum ~/.config/opencode/plugins/
   ```

2. Install dependencies:
   ```bash
   cd ~/.config/opencode/plugins/ralph-wiggum
   bun install
   ```

3. The plugin will be automatically loaded by OpenCode.

## Available Tools

### `ralph_execute_task`

Execute a single task using the Ralph Wiggum iteration loop.

**Parameters:**
- `taskId` (string): Task identifier (e.g., "TASK-001")
- `featureDir` (string): Path to feature directory containing spec.md, tasks.md, etc.
- `maxIterations` (number, optional): Maximum iterations before escalation (default: 10)

**Example:**
```typescript
await ralph_execute_task({
  taskId: "TASK-001",
  featureDir: "/path/to/feature",
  maxIterations: 15
})
```

**Returns:**
- ✅ Success: Task completed with iteration count and final output
- ⚠️ Max iterations: Task needs human intervention
- ❌ CI failed: Task failed CI checks
- ❌ Error: Task failed with error message

### `ralph_execute_wave`

Execute multiple independent tasks in parallel.

**Parameters:**
- `waveNumber` (number): Wave identifier for logging
- `taskIds` (string[]): Array of task IDs to execute in parallel
- `featureDir` (string): Path to feature directory
- `maxParallel` (number, optional): Maximum parallel tasks (default: 3)

**Example:**
```typescript
await ralph_execute_wave({
  waveNumber: 1,
  taskIds: ["TASK-001", "TASK-002", "TASK-003"],
  featureDir: "/path/to/feature",
  maxParallel: 2
})
```

**Returns:**
Summary of all task results with completion status.

### `ralph_ci_check`

Run CI checks on a directory.

**Parameters:**
- `workdir` (string): Directory to run CI checks in

**Example:**
```typescript
await ralph_ci_check({
  workdir: "/path/to/project"
})
```

**Returns:**
Results of type-check, lint, test, and optional build commands.

## Configuration

### Default CI Commands

The plugin uses these default CI commands (configurable):

```typescript
{
  typeCheck: "bun run type-check",
  lint: "bun run lint", 
  test: "bun test"
}
```

### Ralph Configuration

```typescript
{
  maxIterations: 10,           // Max iterations per task
  completeSignal: "<complete/>", // Completion signal to detect
  requireCIGreen: true,        // Enforce CI checks
  progressHistory: 10          // Number of progress entries to keep
}
```

## File Structure

A feature directory should contain:

```
feature-name/
├── spec.md           # Feature specification
├── tasks.md          # Task breakdown
├── acceptance.md     # Acceptance criteria
├── progress.md       # Execution progress log
└── ...              # Implementation files
```

## Task Execution Flow

1. **Context Generation**: Extract relevant spec sections, acceptance criteria, and recent progress
2. **Iteration Loop**: 
   - Create child session for isolation
   - Run implementer agent with fresh context
   - Check for `<complete/>` signal
   - Run CI checks if required
   - Log progress
3. **Completion**: Task completes when signal detected and CI passes
4. **Escalation**: Human intervention needed if max iterations reached

## Wave Execution

Waves allow parallel execution of independent tasks:

1. **Batching**: Tasks are grouped by `maxParallel` setting
2. **Parallel Execution**: Each batch runs concurrently
3. **Sequential Batches**: Next batch starts when current batch completes
4. **Failure Handling**: Wave fails if any task fails

## Progress Logging

All iterations are logged to `progress.md`:

```markdown
## [2026-01-06 14:30:00] - TASK-001 - Iteration 1
**Status**: in_progress
**Output Summary**: Created UserService class with validation...

---
```

## Error Handling

- **Transient Errors**: Retry in next iteration
- **CI Failures**: Continue to next iteration to fix issues
- **Critical Errors**: Stop execution and escalate
- **Max Iterations**: Escalate to human for intervention

## Development

### Running Tests

```bash
bun test
```

### Type Checking

```bash
bun run typecheck
```

### Building

```bash
bun run build
```

## Examples

### Single Task Execution

```typescript
// Execute a single task
const result = await ralph_execute_task({
  taskId: "TASK-001", 
  featureDir: "./features/user-auth"
})

console.log(result) // "✅ Task TASK-001 completed successfully in 3 iteration(s)."
```

### Wave Execution

```typescript
// Execute multiple tasks in parallel
const result = await ralph_execute_wave({
  waveNumber: 1,
  taskIds: ["TASK-001", "TASK-002", "TASK-003"],
  featureDir: "./features/user-auth",
  maxParallel: 2
})

console.log(result)
// Wave 1 Results:
//   ✅ TASK-001: complete (2 iterations)
//   ✅ TASK-002: complete (1 iterations) 
//   ⚠️ TASK-003: max_iterations (10 iterations)
//
// ⚠️ Some tasks need attention.
```

### CI Checks

```typescript
// Run CI checks
const result = await ralph_ci_check({
  workdir: "./my-project"
})

console.log(result)
// CI Check Results:
//   ✅ type-check
//   ✅ lint
//   ❌ test
//
// ❌ Some CI checks failed.
```

## License

MIT