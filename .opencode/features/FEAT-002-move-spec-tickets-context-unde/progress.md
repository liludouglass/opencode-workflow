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

## 2026-01-10 12:55 - FEAT-002-docs - Iteration 1
Agent: @implementer
Action: Updated doc/agent/skill paths to feature-local spec directories and tk CLI flags; refreshed setup output and prerequisites note.
Files:
  - command/build.md (modified)
  - command/ctx.md (modified)
  - command/status.md (modified)
  - command/feature.md (modified)
  - command/setup.md (modified)
  - docs/prerequisites.md (modified)
  - agent/orchestrator.md (modified)
  - agent/spec-writer.md (modified)
  - agent/integrator.md (modified)
  - agent/decomposer.md (modified)
  - agent/coverage-auditor.md (modified)
  - agent/context-manager.md (modified)
  - agent/deferred-tracker.md (modified)
  - skill/wf-context-recitation/SKILL.md (modified)
  - skill/wf-implement-tasks/SKILL.md (modified)
  - skill/wf-orchestrate/SKILL.md (modified)
  - skill/wf-initialize-spec/SKILL.md (modified)
Tests: not run (docs only)
Commit: uncommitted
Status: in_progress
