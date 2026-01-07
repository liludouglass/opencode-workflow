# Tasks: [Feature Name]

<!-- Phase 3 Task Breakdown Template -->
<!-- NOTE: Tickets (`tk` CLI) are now preferred over this file for task management -->
<!-- This template is preserved for reference/legacy projects -->
<!-- Created by @decomposer agent -->

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | X |
| Estimated Effort | X hours |
| Critical Path | X hours |

---

## Tasks

<!-- Tasks are organized by dependencies, not waves -->
<!-- Use `tk create` to create tickets for each task -->

### TASK-001: [Description]

- **Status**: [ ] pending
- **Complexity**: [1-5]
- **Estimated Time**: [X hours]
- **Files**:
  - `path/to/file1.ts` (create)
  - `path/to/file2.ts` (modify)
- **Acceptance Criteria**: AC-1, AC-2
- **Dependencies**: none

**Details**:
[Detailed description of what needs to be done]

---

### TASK-002: [Description]

- **Status**: [ ] pending
- **Complexity**: [1-5]
- **Estimated Time**: [X hours]
- **Files**:
  - `path/to/file3.ts` (create)
- **Acceptance Criteria**: AC-3
- **Dependencies**: none

**Details**:
[Detailed description of what needs to be done]

---

### TASK-003: [Description]

- **Status**: [ ] pending
- **Complexity**: [1-5]
- **Estimated Time**: [X hours]
- **Files**:
  - `path/to/file1.ts` (modify)
  - `path/to/file4.ts` (create)
- **Acceptance Criteria**: AC-4, AC-5
- **Dependencies**: TASK-001, TASK-002

**Details**:
[Detailed description of what needs to be done]

---

### TASK-004: [Description]

- **Status**: [ ] pending
- **Complexity**: [1-5]
- **Estimated Time**: [X hours]
- **Files**:
  - `path/to/file5.ts` (create)
- **Acceptance Criteria**: AC-6
- **Dependencies**: TASK-003

**Details**:
[Detailed description of what needs to be done]

---

## Dependency Graph

```
Independent:
TASK-001 ──┐
           ├── TASK-003 ──── TASK-004
TASK-002 ──┘
```

---

## File Conflict Analysis

<!-- Tasks touching the same files cannot run in parallel -->

| File | Tasks | Conflict Resolution |
|------|-------|---------------------|
| `path/to/file1.ts` | TASK-001, TASK-003 | Sequential (dependency enforced) |

---

## Status Summary

| Status | Count | Tasks |
|--------|-------|-------|
| Pending | X | TASK-001, TASK-002, ... |
| In Progress | 0 | - |
| Complete | 0 | - |
| Blocked | 0 | - |

---

<!-- Gate: AUTOMATED - validated by @coverage-auditor and @dependency-validator -->
