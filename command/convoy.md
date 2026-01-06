---
description: "Continue/orchestrate workflow from current state"
agent: orchestrator
---

# /convoy

Continue or orchestrate an existing workflow from its current state. Handles resumption after crashes and coordinates parallel execution.

## Usage

```
/convoy [work-folder]
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| work-folder | No | Path or ID of work folder (e.g., `FEAT-001` or `.work/features/FEAT-001-user-auth/`). If omitted, uses most recent active work item. |

## Behavior

When invoked, this command:

1. **Locates work folder**:
   - If specified: Uses provided path or ID
   - If omitted: Finds most recently modified active work item
2. **Detects current phase** from work folder state
3. **Continues workflow** from detected position
4. **Handles resumption** after crashes or interruptions
5. **Coordinates parallel execution** for Phase 4 waves

### Phase Detection Logic

The orchestrator determines the current phase by examining work folder contents:

| Files Present | Current Phase | Action |
|---------------|---------------|--------|
| None | Phase 1 | Start shaping |
| `approach.md` (status: pending) | Awaiting Gate | Request approval for approach |
| `approach.md` (status: approved) | Phase 2 | Start specification |
| `spec.md` (status: pending) | Awaiting Gate | Request approval for spec |
| `spec.md` (status: approved), no `tasks.md` | Phase 3 | Start decomposition |
| `tasks.md`, incomplete tasks | Phase 4 | Resume implementation |
| All tasks complete, no `integration-report.md` | Phase 5 | Start integration |
| `integration-report.md` (status: pass) | Phase 6 | Start completion |
| `summary.md` | Complete | Archive and report completion |

### Crash Recovery

When resuming after a crash:

1. **Reads `progress.md`** to find last successful state
2. **Checks task statuses** in `tasks.md`
3. **Resumes from last checkpoint**:
   - Incomplete tasks continue with fresh Ralph iteration
   - Completed tasks are skipped
   - Failed tasks are retried or escalated

### Parallel Execution Coordination

For Phase 4 (Implementation):

1. **Reads wave assignments** from `tasks.md`
2. **Identifies incomplete tasks** in current wave
3. **Spawns Ralph loops** up to `max_parallel_tasks` (default: 3)
4. **Waits for wave completion** before proceeding
5. **Handles individual failures** without blocking other tasks

## Examples

### Resume Most Recent Work

```
/convoy
```

Finds most recently modified work item and continues from current phase.

### Resume Specific Feature

```
/convoy FEAT-001
```

Resumes `.work/features/FEAT-001-*/` from detected phase.

### Resume Specific Bug

```
/convoy BUG-042
```

Resumes `.work/bugs/BUG-042-*/` from detected phase.

### Resume with Full Path

```
/convoy .work/features/FEAT-001-user-auth/
```

Resumes specific work folder.

## Recovery Scenarios

### Scenario 1: Crashed During Shaping

```
State: approach.md exists but incomplete
Action: Invoke @shaper to complete approach
```

### Scenario 2: Awaiting Approval

```
State: approach.md or spec.md with status: pending
Action: Display approval request, wait for human input
```

### Scenario 3: Crashed During Implementation

```
State: tasks.md with incomplete tasks
Action: 
  - Check progress.md for last completed iteration
  - Resume incomplete tasks with fresh Ralph loops
  - Skip completed tasks
```

### Scenario 4: Partial Wave Completion

```
State: Wave 1 has 3 tasks, 2 complete, 1 in-progress
Action:
  - Complete remaining task in Wave 1
  - Wait for completion
  - Proceed to Wave 2
```

### Scenario 5: Integration Failure

```
State: integration-report.md with status: fail
Action:
  - Read failure details
  - Create bug entries in tasks.md
  - Loop back to Phase 4 for targeted fixes
```

## Work Item Discovery

When no work folder is specified, `/convoy` searches:

1. **Active features**: `.work/features/FEAT-*` (no summary.md)
2. **Active bugs**: `.work/bugs/BUG-*` (no summary.md)
3. **Sorts by modification time** (most recent first)
4. **Selects most recently modified** active item

### Multiple Active Items

If multiple active items exist:

```markdown
## Multiple Active Work Items Found

| ID | Type | Phase | Last Modified |
|----|------|-------|---------------|
| FEAT-001 | feature | Phase 4 | 2 hours ago |
| BUG-042 | bug | Phase 2 | 5 hours ago |
| FEAT-003 | feature | Phase 1 | 1 day ago |

Specify which to continue: `/convoy FEAT-001`
```

## Progress Preservation

The convoy command ensures:

- **No duplicate work**: Completed iterations are not repeated
- **Progress persists**: All work is logged to `progress.md`
- **State is recoverable**: Workflow can resume from any point
- **Parallel safety**: Multiple tasks can run without conflicts

## Related Commands

- `/feature` - Start new feature workflow
- `/bug` - Start new bug fix workflow
- `/improve` - Start new enhancement workflow
- `/ralph` - Run Ralph loop on specific task

## Prerequisites

- At least one active work item in `.work/features/` or `.work/bugs/`
- `.work/config.yaml` with workflow settings

Work folder: $ARGUMENTS
