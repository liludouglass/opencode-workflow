---
id: TASK-004
status: closed
type: task
priority: 2
deps: []
parent: EPIC-001
spec-section: ""
files-touched:
  - plugin/ralph-wiggum/wave-coordinator.ts
  - plugin/ralph-wiggum/epic-coordinator.ts
  - plugin/ralph-wiggum/index.ts
acceptance-criteria:
  - wave-coordinator.ts renamed to epic-coordinator.ts
  - Class WaveCoordinator renamed to EpicCoordinator
  - All "wave" references in class updated to "epic"
  - Imports updated in index.ts
---

# Rename wave-coordinator.ts to epic-coordinator.ts

## Description

Rename the wave-coordinator.ts file and update its contents:
1. Rename file: wave-coordinator.ts → epic-coordinator.ts
2. Rename class: WaveCoordinator → EpicCoordinator
3. Rename interfaces: Wave → Epic, WaveResult → EpicResult
4. Update all method names and comments with "wave" → "epic"
5. Update imports in index.ts
