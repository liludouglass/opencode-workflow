---
description: "Initiate bug fix workflow with simplified phases"
agent: orchestrator
---

# /bug

Initiate a bug fix workflow with simplified phases optimized for quick resolution.

## Usage

```
/bug <description>
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| description | Yes | Description of the bug including reproduction steps if known |

## Behavior

When invoked, this command:

1. **Routes to @orchestrator** with bug mode enabled
2. **Creates work folder**: `.work/bugs/BUG-XXX-<slug>/`
   - Generates sequential ID by scanning existing folders
   - Creates URL-safe slug from description (max 30 chars)
3. **Evaluates bug clarity**:
   - If clear reproduction steps: **Skip Phase 1**, go directly to simplified spec
   - If unclear: Run Phase 1 for clarification
4. **Executes simplified workflow**: Phases 2, 4, 5, 6

### Simplified Workflow Phases

```
Phase 1: SHAPING      → (OPTIONAL - only if unclear)  → HUMAN GATE
Phase 2: SPECIFICATION → @spec-writer (simplified)    → HUMAN GATE (approve fix approach)
Phase 4: IMPLEMENTATION → Ralph loops                  → AUTO (per-task verification)
Phase 5: INTEGRATION   → @integrator                  → AUTO (loops back on failure)
Phase 6: COMPLETION    → @finalizer                   → HUMAN GATE (optional)
```

### Phase Details

| Phase | Agent | Output | Notes |
|-------|-------|--------|-------|
| 1. Shaping (optional) | @shaper | approach.md | Only if bug is unclear |
| 2. Specification | @spec-writer | spec.md (simplified), acceptance.md | Lighter depth, focused on fix |
| 4. Implementation | @context-manager, @implementer | Fix code, tests, progress.md | Standard Ralph loops |
| 5. Integration | @integrator, @regression-detector | integration-report.md | Focus on regression prevention |
| 6. Completion | @finalizer | summary.md | Archive and cleanup |

### Skip Logic

The bug workflow automatically skips Phase 1 when:

- Bug description includes clear reproduction steps
- Error message or stack trace is provided
- Specific behavior vs expected behavior is defined

Phase 1 is triggered when:

- Bug is vague ("something is broken")
- Reproduction steps are unknown
- Multiple possible causes exist

## Examples

### Clear Bug (Skips Phase 1)

```
/bug Login fails with "Invalid token" error when refreshing page after OAuth callback
```

Creates: `.work/bugs/BUG-001-login-invalid-token/`
Starts: Phase 2 directly (clear reproduction steps)

### Unclear Bug (Triggers Phase 1)

```
/bug Users are reporting occasional login issues
```

Creates: `.work/bugs/BUG-002-login-issues/`
Starts: Phase 1 with @shaper to clarify the bug

### Bug with Stack Trace

```
/bug TypeError: Cannot read property 'map' of undefined in UserList.tsx line 42
```

Creates: `.work/bugs/BUG-003-userlist-typeerror/`
Starts: Phase 2 directly (specific error provided)

## Work Folder Structure

After completion, the work folder contains:

```
.work/bugs/BUG-001-login-invalid-token/
├── report.md              # Bug report and reproduction steps
├── analysis.md            # Root cause analysis
├── spec.md                # Simplified fix specification
├── acceptance.md          # Fix verification criteria
├── tasks.md               # Task breakdown (usually 1-3 tasks)
├── progress.md            # Implementation log
├── integration-report.md  # Regression test results
└── summary.md             # Fix summary
```

## Simplified Spec Format

Bug specs use L2 depth with focused sections:

```markdown
# Bug Fix Specification: BUG-XXX

## Problem Statement
[Clear description of the bug]

## Root Cause
[Analysis of why the bug occurs]

## Fix Approach
[How to fix it]

## Acceptance Criteria
- [ ] AC-1: Bug no longer reproduces
- [ ] AC-2: Existing tests pass
- [ ] AC-3: New test covers the fix

## Regression Prevention
[Tests or guards to prevent recurrence]
```

## Related Commands

- `/feature` - Full feature workflow (all 6 phases)
- `/improve` - Enhancement workflow with lighter spec
- `/debug` - Analyze and diagnose bugs before fixing

## Prerequisites

- `.work/` folder structure must exist
- For best results, include:
  - Error messages or stack traces
  - Steps to reproduce
  - Expected vs actual behavior

Bug report: $ARGUMENTS
