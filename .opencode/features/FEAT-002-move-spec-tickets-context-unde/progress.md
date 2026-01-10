# Progress Log: [Feature Name]

<!-- Phase 4 Ralph Iteration Log Template -->
<!-- Append-only log - never modify existing entries -->
<!-- Used by @implementer to track progress across iterations -->

---

## Entry Format

Each entry follows this format:

```
## [YYYY-MM-DD HH:MM] - [Task ID] - Iteration [N]
Agent: @implementer
Action: [What was done in this iteration]
Files: [Files created/modified with action]
Tests: [X passing, Y failing, Z pending]
Commit: [commit hash or "uncommitted"]
Status: [in_progress | <complete/>]
```

---

## Log Entries

<!-- Entries are appended below, newest at bottom -->
<!-- When task is complete, agent emits <complete/> in Status -->

### Example Entry (for reference, delete when first real entry added)

## 2026-01-04 10:00 - TASK-001 - Iteration 1
Agent: @implementer
Action: Created initial file structure and base implementation
Files: 
  - src/models/example.ts (created)
  - src/services/example.ts (created)
Tests: 3 passing, 0 failing, 2 pending
Commit: abc1234
Status: in_progress

---

## 2026-01-04 10:15 - TASK-001 - Iteration 2
Agent: @implementer
Action: Added validation logic and completed remaining tests
Files:
  - src/models/example.ts (modified)
  - src/services/example.ts (modified)
Tests: 5 passing, 0 failing, 0 pending
Commit: def5678
Status: <complete/>

---

## Signal Reference

### `<complete/>` Signal

The `<complete/>` signal indicates:
- All acceptance criteria for the task PASS
- All tests are GREEN
- Code is COMMITTED
- Progress entry is LOGGED

When an agent emits `<complete/>`:
1. The Ralph loop for this task terminates successfully
2. Ticket is closed and marked complete
3. Orchestrator checks if more tasks are ready via `tk ready`
4. If tickets closed, newly unblocked tasks become ready

### Iteration Limit

If `max_iterations_per_task` (default: 10) is reached without `<complete/>`:
1. Task is flagged for human escalation
2. Error entry is logged
3. Other in-progress tasks continue
4. Human intervention required to unblock

---

<!-- Log continues below -->
