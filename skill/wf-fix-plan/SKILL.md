---
name: wf-fix-plan
description: Workflow for creating a fix plan from bug analysis
---

# Fix Planning Workflow

Create an actionable fix plan from a bug analysis report.

## Overview

```
Input: bug-analysis.md from @bug-analyzer
Output: fix-plan.md with implementation tasks
```

---

## Phase 1: Load Context

### 1.1 Read Bug Analysis

```
.opencode/debug/YYYY-MM-DD-bug-name/bug-analysis.md
```

Extract:
- Root cause location (file:line)
- Fix recommendation
- Affected files
- Risk assessment

### 1.2 Read Related Spec (if exists)

If bug analysis references a spec:
- Read `spec.md` for original requirements
- Query tickets via `tk show <id>` for implementation context
- Understand what the code SHOULD do

### 1.3 Read Affected Code

Use `read` to examine:
- The buggy code
- Related functions/modules
- Existing tests for the area

---

## Phase 2: Design the Fix

### 2.1 Determine Fix Strategy

| Strategy | When to Use |
|----------|-------------|
| **Patch** | Simple fix, minimal changes |
| **Refactor** | Fix requires restructuring |
| **Rewrite** | Code is fundamentally broken |
| **Workaround** | Can't fix root cause now |

### 2.2 Identify All Changes Needed

For each affected file:
1. What specific changes are needed?
2. Are there related changes in other files?
3. What tests need to be added/modified?

### 2.3 Assess Dependencies

- Does fix A need to happen before fix B?
- Are there database migrations needed?
- Are there config changes needed?

---

## Phase 3: Create Fix Plan

Save to `.opencode/debug/YYYY-MM-DD-bug-name/fix-plan.md`

### Fix Plan Template

```markdown
# Fix Plan

**Bug:** [bug-name]
**Date:** [YYYY-MM-DD]
**Planner:** @fix-planner

---

## Summary

**Root Cause:** [One-line summary from analysis]
**Fix Strategy:** [Patch / Refactor / Rewrite / Workaround]
**Estimated Effort:** [Small / Medium / Large]

---

## Tasks

### Task 1: [Primary fix]

**File:** `path/to/file.py`
**Priority:** High
**Depends on:** None

**Changes:**
- [ ] [Specific change 1]
- [ ] [Specific change 2]

**Acceptance Criteria:**
- [ ] [How to verify this task is complete]

---

### Task 2: [Secondary fix or related change]

**File:** `path/to/other-file.py`
**Priority:** Medium
**Depends on:** Task 1

**Changes:**
- [ ] [Specific change]

**Acceptance Criteria:**
- [ ] [How to verify]

---

### Task 3: Add tests

**File:** `tests/test_*.py`
**Priority:** High
**Depends on:** Task 1, Task 2

**Changes:**
- [ ] Add test for the bug scenario
- [ ] Add test for edge cases
- [ ] Verify existing tests still pass

**Acceptance Criteria:**
- [ ] New test fails before fix, passes after
- [ ] No regression in existing tests

---

## Verification Checklist

After implementation:
- [ ] Bug no longer reproduces
- [ ] All new tests pass
- [ ] All existing tests pass
- [ ] No new warnings/errors
- [ ] Code review completed (if applicable)

---

## Rollback Plan

If fix causes issues:
1. [How to revert]
2. [What to monitor]

---

## Next Steps

To implement this fix, run:
```
@implementer .opencode/debug/YYYY-MM-DD-bug-name/fix-plan.md
```
```

---

## Task Breakdown Guidelines

### Good Task

```markdown
### Task: Fix null check in user validation

**File:** `src/auth/validator.py`
**Line:** 45-52

**Changes:**
- [ ] Add null check before accessing user.email
- [ ] Return early with ValidationError if user is None

**Acceptance Criteria:**
- [ ] No crash when user is None
- [ ] Returns proper error message
```

### Bad Task (Too Vague)

```markdown
### Task: Fix the bug

**Changes:**
- [ ] Make it work
```

---

## Risk Classification

Assign risk to each task:

| Risk | Criteria | Review Required |
|------|----------|-----------------|
| **Low** | Isolated change, good test coverage | No |
| **Medium** | Multiple files, some test coverage | Recommended |
| **High** | Core logic, shared code, low coverage | Yes |
| **Critical** | Data handling, auth, payments | Mandatory |

---

## Tool Usage

### Allowed (Read-Only)

| Tool | Purpose |
|------|---------|
| `read` | Read analysis, specs, code |
| `glob` | Find related files |
| `grep` | Search for usages |
| `list` | List directories |

### Allowed (Write)

| Tool | Purpose |
|------|---------|
| `write` | Save fix-plan.md |

### Forbidden

| Tool | Why |
|------|-----|
| `edit` | Planner plans, doesn't implement |
| `bash` (write) | No code execution |

---

## Handoff

After completing fix plan:

1. Save `fix-plan.md` to debug folder
2. Summarize plan to user
3. Recommend: `@implementer` to execute the fix

---

## Constraints

- NEVER implement fixes yourself
- ALWAYS create specific, actionable tasks
- ALWAYS include acceptance criteria
- ALWAYS assess risk for each task
- ALWAYS include test tasks
- ALWAYS provide rollback plan for high-risk fixes
