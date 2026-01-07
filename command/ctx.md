---
description: "Save or load project context snapshot"
---

# Context Management

Save and load project context snapshots for continuity across sessions.

## Action: $1

### If action is "save":
1. Read key project files:
   - `.opencode/spec.md` (if exists)
   - Query tickets via `tk query` (if tickets exist)
   - `.opencode/scratchpad.md` (if exists)
   - `README.md` or `package.json` or `pyproject.toml`

2. Create `.opencode/context.md` with:

```markdown
# Project Context Snapshot

Generated: !`date +%Y-%m-%d %H:%M`

## Current State

[Summary of project state based on files read]

## Active Work

[Extract from `tk query '[.status == "in_progress"]'` - what's in progress]

## Key Decisions

[Extract from scratchpad.md - important decisions]

## Next Steps

[What should be done next based on context]
```

### If action is "load" or empty:
1. Read `.opencode/context.md`
2. Display the context summary
3. Suggest what to work on next

### If action is "refresh":
1. Re-analyze all project files
2. Update `.opencode/context.md` with fresh snapshot

## Usage

- `/ctx` - Load and display current context
- `/ctx save` - Save context snapshot
- `/ctx refresh` - Refresh context from current state
