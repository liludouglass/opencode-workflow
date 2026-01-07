---
id: TASK-003
status: closed
type: task
priority: 1
deps: []
parent: EPIC-001
spec-section: ""
files-touched:
  - install.sh
acceptance-criteria:
  - Line referencing tasks-creator.md is removed from install.sh
  - Install script still functions correctly
---

# Fix install.sh tasks-creator Reference

## Description

Remove line 52 from install.sh that references non-existent tasks-creator.md:
```
["tasks-creator"]="agent/tasks-creator.md"
```

This file doesn't exist in the repository and causes an invalid reference.
