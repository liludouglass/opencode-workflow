---
id: TASK-002
status: closed
type: task
priority: 1
deps:
  - TASK-001
parent: EPIC-001
spec-section: "5.3"
files-touched:
  - agent/context-manager.md
acceptance-criteria:
  - Memory files added to "Gather Source Files" section
  - Context bundle template includes Memory Context section
---

# Update @context-manager to Include Memory Files

## Description

Update the context-manager agent to include memory files in its context bundles. Add the following to the sources list around line 42-52:
- .opencode/memory/current-focus.md (ready/blocked tasks, active epic)
- .opencode/memory/master-spec-coverage.md (spec section implementation status)
- .opencode/memory/deferred.md (deferred items, if exists)

Also add a "Memory Context" section to the context bundle template.
