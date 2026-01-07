# OpenCode Context Manager Plugin

A plugin that generates minimal context bundles for tasks, following the Ralph Wiggum pattern of fresh context per iteration.

## Overview

The Context Manager plugin extracts only the relevant information needed for a specific task, keeping context bundles small and focused. This enables the Ralph Wiggum pattern where each iteration starts with fresh, minimal context rather than carrying forward the full conversation history.

## Features

- **Task-specific context extraction**: Only includes spec sections, acceptance criteria, and progress relevant to the current task
- **Token budget management**: Keeps context bundles under a configurable token limit (default: 8000)
- **Priority-based content selection**: Ensures critical information (acceptance criteria, files to modify) is always included
- **Sliding window progress history**: Includes recent progress entries with priority for task-specific updates
- **Intelligent spec section filtering**: Uses keyword matching and file references to find relevant spec sections

## Installation

```bash
npm install
npm run build
```

## Usage

### Generate Context Bundle

```typescript
import ContextManagerPlugin from './index.js';

const plugin = new ContextManagerPlugin();

const bundle = await plugin.generateContext({
  taskId: 'TASK-001',
  featureDir: '/path/to/feature',
  maxTokens: 8000,        // optional, default: 8000
  progressHistory: 10     // optional, default: 10
});

console.log(bundle);
// {
//   taskId: 'TASK-001',
//   specSections: ['...'],
//   acceptanceCriteria: ['AC-001: ...', 'AC-002: ...'],
//   filesToModify: ['src/user.ts', 'src/auth.ts'],
//   recentProgress: ['## [2026-01-06 14:23] - [TASK-001] - Iteration [1]...'],
//   totalTokens: 7234
// }
```

### Get Token Count

```typescript
const result = await plugin.getTokenCount({
  text: 'Some text to count tokens for'
});

console.log(result.tokens); // 7
```

## File Structure

The plugin expects the following files in the feature directory:

- `spec.md` - Feature specification with markdown headers
- `acceptance.md` - Acceptance criteria in checkbox format
- `tickets/` - Task tickets (managed via `tk` CLI)
- `progress.md` - Progress log with timestamped entries

## Context Bundle Structure

```typescript
interface ContextBundle {
  taskId: string;                // The task ID (e.g., 'TASK-001')
  specSections: string[];        // Relevant spec sections
  acceptanceCriteria: string[];  // Acceptance criteria for this task
  filesToModify: string[];       // Files the task needs to modify
  recentProgress: string[];      // Recent progress entries
  totalTokens: number;           // Total estimated tokens
}
```

## Token Budget Allocation

The plugin uses priority-based token allocation:

- **15%** - Acceptance criteria (highest priority)
- **5%** - Files to modify (critical for implementation)
- **30%** - Recent progress (important context)
- **50%** - Spec sections (detailed context)

## Progress Entry Format

Progress entries should follow this format in `progress.md`:

```markdown
## [YYYY-MM-DD HH:MM] - [TASK-ID] - Iteration [N]
Agent: @implementer
Action: What was done in this iteration
Files: file1.ts, file2.ts
Tests: 5 passing, 0 failing
Commit: abc1234 or "no commit - CI failing"
Status: in_progress | <complete/>
```

## Task Format

Tasks are managed via the `tk` CLI. Query tasks with:

```bash
tk show TASK-001           # View task details
tk query '[.type == "task"]' # List all tasks
```

## Acceptance Criteria Format

Acceptance criteria in `acceptance.md` should follow this format:

```markdown
- [ ] AC-001: User can log in with email and password
- [ ] AC-002: Invalid credentials show error message
- [ ] AC-003: Successful login redirects to dashboard
```

## API Reference

### Tools

#### `context_generate`

Generates a minimal context bundle for a specific task.

**Parameters:**
- `taskId` (string, required) - The task ID to generate context for
- `featureDir` (string, required) - Path to the feature directory
- `maxTokens` (number, optional) - Maximum tokens for the bundle (default: 8000)
- `progressHistory` (number, optional) - Number of recent progress entries (default: 10)

**Returns:** `ContextBundle`

#### `context_get_tokens`

Estimates token count for given text.

**Parameters:**
- `text` (string, required) - Text to count tokens for

**Returns:** `{ tokens: number }`

## Ralph Wiggum Pattern

This plugin enables the Ralph Wiggum pattern where:

1. Each iteration starts fresh with minimal context
2. Only task-relevant information is provided
3. Token budgets prevent context bloat
4. Progress history provides continuity without overwhelming detail

This approach improves focus, reduces token costs, and prevents context drift in long-running implementations.