---
id: TASK-001
status: closed
type: task
priority: 1
deps: []
parent: EPIC-001
spec-section: "5.3"
files-touched:
  - skill/wf-context-recitation/SKILL.md
acceptance-criteria:
  - Skill file exists at skill/wf-context-recitation/SKILL.md
  - Skill includes instructions for generating current-focus.md
  - Skill includes instructions for reading memory files
  - Skill includes context recitation pattern
---

# Create Context Recitation Skill (wf-context-recitation)

## Description

Create a new skill file that provides agents with relevant project context at session start to prevent goal drift. This skill will instruct agents to:
1. Auto-generate current-focus.md using tk CLI commands
2. Read all memory files (current-focus.md, master-spec-coverage.md, deferred.md)
3. Recite context following a standard pattern

## Technical Notes

The skill should contain:
- When to use section (at start of sessions, before phases, after context switch)
- Step 1: Generate Current Focus (tk ready, tk blocked, tk query commands)
- Step 2: Read Memory Files (list of files to read)
- Step 3: Recite Context (pattern for using the context)
