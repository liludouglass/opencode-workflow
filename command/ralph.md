---
description: "Run Ralph loop on specific task until completion"
agent: orchestrator
---

# /ralph

Run a Ralph Wiggum loop on a specific task. Each iteration uses fresh context and runs until the task emits `<complete/>` or max iterations is reached.

## Usage

```
/ralph <task-id> [max-iterations]
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| task-id | Yes | Task identifier (e.g., `TASK-001` or `001`) |
| max-iterations | No | Maximum iterations before escalation (default: 10 from config) |

## Behavior

When invoked, this command:

1. **Locates task** in active work folder's `tasks.md`
2. **Generates context bundle** via `@context-manager`
3. **Runs `@implementer`** with clean slate
4. **Monitors for `<complete/>`** signal
5. **Iterates** with fresh context until completion
6. **Escalates to human** after max iterations

### Ralph Loop Execution Model

```
for iteration in 1..max_iterations:
    
    1. CONTEXT GENERATION (@context-manager)
       - Extract ONLY relevant spec sections for this task
       - Extract ONLY acceptance criteria for this task
       - Include ONLY files to be modified
       - Include last N progress entries
       - Target: ~5-10K tokens
    
    2. FRESH IMPLEMENTER RUN
       - New @implementer instance with clean slate
       - Receives context bundle (not full files)
       - Performs micro-decomposition internally
       
    3. EXECUTION WITH VERIFICATION
       - Execute atomic steps
       - Self-verify each step
       - Spawn voting agents if uncertain (configurable)
       
    4. CI-GREEN ENFORCEMENT
       Before ANY commit:
       - npm run type-check ✓
       - npm run lint ✓
       - npm test ✓
       - Only commit if ALL pass
       
    5. PROGRESS UPDATE
       - Append to progress.md
       - Commit with descriptive message
       
    6. COMPLETION CHECK
       - If <complete/> emitted: EXIT SUCCESS
       - Else: continue to next iteration

If max_iterations reached:
    - Mark task as "blocked"
    - Escalate to human with context
```

### The `<complete/>` Signal

The `@implementer` agent emits `<complete/>` when:

- All acceptance criteria for the task pass
- All tests are green
- Code is committed
- Progress is logged

Example output:

```markdown
## Task TASK-001 Complete

All acceptance criteria verified:
- [x] AC-1: User model created with required fields
- [x] AC-2: Email validation implemented
- [x] AC-3: Password hashing works correctly

Tests: 5 passing
Commit: abc123

<complete/>
```

## Examples

### Run Single Task

```
/ralph TASK-001
```

Runs Ralph loop on TASK-001 with default max iterations (10).

### Run with Custom Iterations

```
/ralph TASK-003 5
```

Runs Ralph loop on TASK-003 with max 5 iterations.

### Run with Short ID

```
/ralph 002
```

Runs Ralph loop on TASK-002.

## Context Bundle Contents

Each iteration generates a fresh context bundle:

```markdown
# Context Bundle: TASK-001

## Task Details
- ID: TASK-001
- Description: Create User model with validation
- Wave: 1
- Dependencies: none
- Complexity: 3

## Relevant Spec Sections
[Only sections pertaining to this task]

## Acceptance Criteria
- [ ] AC-1: User model has id, email, password_hash fields
- [ ] AC-2: Email validation rejects invalid formats
- [ ] AC-3: Password hash uses bcrypt with 12 rounds

## Files to Modify
- src/models/user.ts (create)
- src/models/index.ts (modify)

## Recent Progress
[Last 5-10 entries from progress.md]
```

## Progress.md Format

Each Ralph iteration appends to `progress.md`:

```markdown
## 2026-01-04 14:23 - TASK-001 - Iteration 1
Agent: @implementer
Action: Created User model with id, email, password_hash fields
Files: src/models/user.ts (created)
Tests: 3 passing
Commit: abc123

## 2026-01-04 14:31 - TASK-001 - Iteration 2
Agent: @implementer
Action: Added email validation, password length check
Files: src/models/user.ts (modified)
Tests: 5 passing
Commit: def456
Status: <complete/>
```

## Escalation

When max iterations is reached without `<complete/>`:

```markdown
## Task Escalation Required

**Task**: TASK-001
**Iterations**: 10/10
**Status**: Blocked

### Last Attempt Summary
[What was tried in final iteration]

### Blocking Issues
- [Issue preventing completion]

### Recommendation
[Suggested manual intervention]

### Context
Work folder: .work/features/FEAT-001-user-auth/
Progress: 15 entries in progress.md
Last commit: xyz789
```

## Configuration

Read from `.work/config.yaml`:

```yaml
ralph:
  max_iterations_per_task: 10  # Default max iterations
  complete_signal: "<complete/>"
  require_ci_green: true       # Must pass CI before commit

context:
  max_tokens_per_task: 8000    # Target context bundle size
  progress_history: 10         # Last N entries to include

workflow:
  voting_agents: 3             # For MAKER-style voting on uncertain steps
```

## Fresh Context Benefits

Each iteration starts with:

- **Clean slate**: No accumulated context rot
- **Minimal context**: Only task-relevant information
- **Latest progress**: Sees what previous iterations accomplished
- **Updated files**: Reads current file state

This prevents the degradation that occurs when agents run too long with accumulating context.

## Related Commands

- `/convoy` - Orchestrate full workflow (uses Ralph internally)
- `/feature` - Start feature workflow (Phase 4 uses Ralph)
- `/bug` - Start bug workflow (Phase 4 uses Ralph)

## Prerequisites

- Active work folder with `tasks.md`
- Task must exist and not be completed
- `.work/config.yaml` with Ralph settings

Task to run: $ARGUMENTS
