---
name: wf-context-recitation
description: Load project memory context at session start - prevents goal drift and maintains awareness
---

# Context Recitation

Load this skill at the start of any workflow session to maintain awareness of project state.

## When to Use

- At the START of any workflow session
- When resuming work on a feature
- Before Phase 1, 2, 3, 4, 5, or 6 begins
- After session interruption or context switch

## Step 1: Generate Current Focus

Run these commands to generate the current-focus.md file:

```bash
# Get ready tasks
tk ready --dir .opencode/spec/FEAT-XXX/tickets

# Get blocked tasks  
tk blocked --dir .opencode/spec/FEAT-XXX/tickets

# Get deferred items targeting current feature
tk query '.type == "deferred"' --dir .opencode/spec/FEAT-XXX/tickets
```

Write the output to `.opencode/memory/current-focus.md`.

## Step 2: Read Memory Files

Read the following memory files:

1. `.opencode/memory/current-focus.md` - Ready/blocked tasks, active epic
2. `.opencode/memory/master-spec-coverage.md` - Spec section implementation status
3. `.opencode/memory/deferred.md` - Deferred items (if exists)

## Step 3: Recite Context

After reading, state your awareness:

1. **Current Epic/Feature**: What feature am I working on?
2. **Ready Tasks**: What tasks can be started now?
3. **Blocked Tasks**: What tasks are waiting on others?
4. **Deferred Items**: What has been postponed?
5. **Coverage Status**: How much of the spec is implemented?

Example recitation:
> "I'm working on FEAT-001 (User Authentication). 3 tasks are ready: TASK-001, TASK-003, TASK-005. 
> TASK-002 is blocked by TASK-001. No deferred items target this feature.
> Master spec coverage: 85% complete, 3 sections deferred."

## Integration Instructions

Add this instruction to agent "Before Starting" sections:

```markdown
## Before Starting

Load context awareness:
- `/skill wf-context-recitation` - Load project memory context
```