---
id: F0tiwe-d584
status: open
deps: []
links: []
created: 2026-01-07T20:44:35Z
type: task
priority: 1
assignee: Lilu Douglas
parent: F0tiwe-30ff
spec-section: "5.3"
files-touched:
  - install.sh
acceptance-criteria:
  - Line 52 with tasks-creator reference is removed
  - install.sh runs without errors
---
# Fix install.sh tasks-creator reference

Remove line 52 that references non-existent tasks-creator.md: ["tasks-creator"]="agent/tasks-creator.md"

