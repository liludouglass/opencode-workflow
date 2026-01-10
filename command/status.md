---
description: "Quick project status check"
---

# Project Status

Provide a quick status overview of the current project.

## Check These Files

1. **Spec Status**: Check if `.opencode/features/FEAT-XXX/spec/spec.md` exists
2. **Tasks Status**: Query tickets via `tk query` and count open/closed
3. **Scratchpad**: Check if `.opencode/scratchpad.md` has content
4. **Git Status**: Run `git status --short` if in a git repo

## Output Format

```
## Project Status

**Spec**: [EXISTS/MISSING] - [brief description if exists]
**Tasks**: [X/Y completed] or [NO TASKS FILE]
**Scratchpad**: [X notes] or [EMPTY]
**Git**: [clean/X files changed]

### Current Focus
[Based on `tk ready`, what's the current work item]

### Blockers
[Any issues noted in scratchpad or failing tests]
```

## Quick Actions

Based on status, suggest:
- If no spec: "Run `/build <feature>` to start"
- If spec but no tasks: "Ready for task breakdown"
- If tasks exist: "Continue with: [next unchecked task]"
- If all done: "Ready for verification"
