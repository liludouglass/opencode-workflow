---
name: wf-bug-analyze
description: Workflow for analyzing bugs - report, reproduce, and diagnose
---

# Bug Analysis Workflow

This workflow consolidates bug reporting, reproduction, and diagnosis into a single comprehensive analysis phase.

## Overview

```
Input: Bug description / error message / unexpected behavior
Output: bug-analysis.md with root cause and fix recommendations
```

## Phase 1: Capture Bug Report

### 1.1 Gather Information

Collect from user or context:

| Field | Description | Required |
|-------|-------------|----------|
| **Summary** | One-line description | Yes |
| **Expected** | What should happen | Yes |
| **Actual** | What actually happens | Yes |
| **Steps** | How to trigger the bug | Yes |
| **Error** | Error message/stack trace | If applicable |
| **Environment** | OS, runtime version, etc. | If relevant |
| **Frequency** | Always, sometimes, once | Helpful |

### 1.2 Check for Related Spec

Before proceeding, check if this bug relates to a spec:

```bash
ls .opencode/specs/
```

If a relevant spec exists:
- Read `spec.md` and query tickets via `tk query`
- Note which requirements might be affected
- This helps determine if it's a spec violation vs implementation bug

---

## Phase 2: Reproduce the Bug

### 2.1 Confirm Reproduction

1. Follow the steps provided
2. Verify you see the same error/behavior
3. If cannot reproduce:
   - Ask for more details
   - Check environment differences
   - Note as "intermittent" if applicable

### 2.2 Isolate the Bug

Narrow down the trigger:

| Question | Purpose |
|----------|---------|
| What's the minimal input that triggers it? | Reduce noise |
| Does it happen with different data? | Data-dependent? |
| Does it happen in isolation? | Interaction bug? |
| When did it start? | Recent regression? |

### 2.3 Check Recent Changes

```bash
git log --oneline -10
git diff HEAD~5 --stat
```

If bug is recent, correlate with commits.

---

## Phase 3: Diagnose Root Cause

### 3.1 Trace the Code Path

1. Start from the entry point (API endpoint, UI action, etc.)
2. Follow the execution path using `read` and `grep`
3. Identify where behavior diverges from expected

### 3.2 Generate Hypotheses

Create ranked hypotheses:

```markdown
### Hypotheses (ranked by likelihood)

1. **[Most likely]** - [Description]
   - Evidence: [What points to this]
   - Location: [file:line]

2. **[Second likely]** - [Description]
   - Evidence: [What points to this]
   - Location: [file:line]

3. **[Less likely]** - [Description]
   - Evidence: [What points to this]
   - Location: [file:line]
```

### 3.3 Verify Hypothesis

For the top hypothesis:
1. Read the suspected code
2. Check if the logic matches the bug behavior
3. Look for:
   - Off-by-one errors
   - Null/undefined handling
   - Race conditions
   - Wrong assumptions
   - Missing edge cases

### 3.4 Common Bug Patterns

| Pattern | Signs |
|---------|-------|
| **Null reference** | "undefined is not a function", "NoneType has no attribute" |
| **Off-by-one** | Works for some inputs, fails at boundaries |
| **Race condition** | Intermittent, timing-dependent |
| **State mutation** | Works first time, fails on repeat |
| **Missing validation** | Bad input causes crash |
| **Wrong type** | Type coercion issues |
| **Async/await missing** | Promise not awaited |
| **Import error** | Module not found, circular dependency |

---

## Phase 4: Generate Analysis Report

Save to `.opencode/debug/YYYY-MM-DD-bug-name/bug-analysis.md`

### Report Template

```markdown
# Bug Analysis Report

**Date:** [YYYY-MM-DD]
**Analyst:** @bug-analyzer
**Status:** Diagnosed

---

## Bug Summary

**Title:** [One-line description]
**Severity:** [Critical / High / Medium / Low]
**Type:** [Regression / New Bug / Edge Case / Spec Violation]

---

## Reproduction

**Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected:** [What should happen]
**Actual:** [What happens]

**Reproducible:** [Always / Sometimes / Once]
**Environment:** [Relevant details]

---

## Root Cause Analysis

### Location
- **File:** [path/to/file.py]
- **Line:** [line number]
- **Function:** [function name]

### Cause
[Clear explanation of why the bug occurs]

### Evidence
[Code snippets, logs, or traces that confirm the cause]

---

## Related Spec (if applicable)

- **Spec:** [.opencode/specs/NNN-name/]
- **Requirement:** [Which requirement is violated]
- **Violation Type:** [WRONG_BEHAVIOR / MISSING_EDGE_CASE / etc.]

---

## Fix Recommendation

### Approach
[High-level description of how to fix]

### Affected Files
- [ ] `path/to/file1.py` - [what needs to change]
- [ ] `path/to/file2.py` - [what needs to change]

### Risk Assessment
- **Risk Level:** [Low / Medium / High]
- **Regression Risk:** [What could break]
- **Testing Required:** [What tests to add/run]

---

## Next Steps

To create a fix plan, run:
```
@fix-planner .opencode/debug/YYYY-MM-DD-bug-name/
```
```

---

## Tool Usage

### Allowed (Read-Only)

| Tool | Purpose |
|------|---------|
| `read` | Read source files, logs, specs |
| `glob` | Find files |
| `grep` | Search for patterns |
| `list` | List directories |
| `bash` (read-only) | `git log`, `git blame`, `git diff`, run tests |

### Allowed (Write)

| Tool | Purpose |
|------|---------|
| `write` | Save bug-analysis.md report |
| `bash mkdir` | Create debug folder |

### Forbidden

| Tool | Why |
|------|-----|
| `edit` | Analyzer diagnoses, doesn't fix |

---

## Handoff

After completing analysis:

1. Save `bug-analysis.md` to `.opencode/debug/YYYY-MM-DD-bug-name/`
2. Summarize findings to user
3. Recommend next step: `@fix-planner` to create fix plan

---

## Constraints

- NEVER implement fixes yourself
- ALWAYS save analysis report before handoff
- ALWAYS provide file:line references
- ALWAYS rank hypotheses by likelihood
- ALWAYS check for related specs first
