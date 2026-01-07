---
id: TASK-005
status: closed
type: task
priority: 3
deps: []
parent: EPIC-001
spec-section: ""
files-touched:
  - agent/shaper.md
  - agent/context-manager.md
acceptance-criteria:
  - All .work/ paths updated to .opencode/ in shaper.md
  - All .work/ paths updated to .opencode/ in context-manager.md
---

# Fix Path Inconsistencies (.work/ → .opencode/)

## Description

Update path references in agent files:

1. In agent/shaper.md (lines 210-213):
   - .work/features/FEAT-XXX/ → .opencode/features/FEAT-XXX/
   - .work/bugs/BUG-XXX/ → .opencode/bugs/BUG-XXX/

2. In agent/context-manager.md (lines 37-38, 147-149):
   - .work/features/FEAT-001/ → .opencode/spec/FEAT-001/
   - All other .work/ → .opencode/
