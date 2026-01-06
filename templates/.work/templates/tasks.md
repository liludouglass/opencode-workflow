# Tasks: [Feature Name]

<!-- Phase 3 Task Breakdown Template -->
<!-- Created by @decomposer agent -->
<!-- Verified by @coverage-auditor and @dependency-validator -->

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | X |
| Estimated Effort | X hours |
| Waves | X |
| Critical Path | X hours |

---

## Wave 1 (Parallel)

<!-- Independent tasks that can run simultaneously -->

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

## Wave 2 (Depends on Wave 1)

<!-- Tasks that depend on Wave 1 completion -->

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

## Wave 3 (Depends on Wave 2)

<!-- Tasks that depend on Wave 2 completion -->

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
Wave 1 (Parallel):
TASK-001 ──┐
           ├── Wave 2: TASK-003 ──── Wave 3: TASK-004
TASK-002 ──┘
```

---

## File Conflict Analysis

<!-- Tasks touching the same files cannot run in parallel -->

| File | Tasks | Conflict Resolution |
|------|-------|---------------------|
| `path/to/file1.ts` | TASK-001, TASK-003 | Sequential (Wave 1 → Wave 2) |

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
