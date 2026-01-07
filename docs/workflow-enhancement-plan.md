# Implementation Specification: Workflow Enhancement with Ticket Integration

## Document Overview

This specification details all changes required to implement:
1. **Ticket integration** (replacing tasks.md)
2. **Memory layer** (master-spec-coverage, auto-generated current-focus)
3. **Agent modifications** (master spec awareness, deferred tracking)
4. **/plan-product integration** (Phase 0 setup)

---

## Phase A: Prerequisites

### A.1 Ticket CLI Installation Documentation

**File to create**: `docs/prerequisites.md`

Ticket CLI is REQUIRED for the workflow. Install before using.

#### Installation

```bash
# macOS
brew install wedow/tools/ticket

# From source
git clone https://github.com/wedow/ticket
cd ticket
sudo cp ticket /usr/local/bin/
```

#### Verify Installation

```bash
tk --version
```

#### Key Commands

| Command | Purpose |
|---------|---------|
| `tk create "<title>" --type task` | Create task ticket |
| `tk create "<title>" --type epic` | Create epic (feature container) |
| `tk create "<title>" --type deferred` | Create deferred item |
| `tk start <id>` | Mark task in progress |
| `tk close <id>` | Mark task complete |
| `tk dep <id> <dep-id>` | Add dependency |
| `tk ready` | List tasks ready to work on |
| `tk blocked` | List blocked tasks |
| `tk query '<jq-filter>'` | Query tickets with JQ |

Always use `--dir .opencode/spec/FEAT-XXX/tickets` when creating tickets.

---

## Phase B: Foundation

### B.1 Ticket Templates

#### Task Ticket Template
File: `templates/.work/templates/ticket.md`

```yaml
---
id: ${ID}
status: open
type: ${TYPE}
priority: ${PRIORITY}
deps: []
parent: ${PARENT}
spec-section: ""
files-touched: []
acceptance-criteria: []
---
```

#### Epic Ticket Template
File: `templates/.work/templates/epic-ticket.md`

```yaml
---
id: ${ID}
status: open
type: epic
priority: 1
master-spec-sections: []
---
```

#### Deferred Ticket Template
File: `templates/.work/templates/deferred-ticket.md`

```yaml
---
id: ${ID}
status: open
type: deferred
priority: ${PRIORITY}
parent: ${PARENT}
spec-section: "${SPEC_SECTION}"
deferred-from: ${DEFERRED_FROM}
target-after: ${TARGET_AFTER}
reason: "${REASON}"
---
```

### B.2 Memory Templates

#### master-spec-coverage.md
File: `templates/.work/templates/memory/master-spec-coverage.md`

Tracks which master spec sections are implemented, deferred, or missing.

#### current-focus.md
File: `templates/.work/templates/memory/current-focus.md`

Auto-generated at session start from `tk ready`, `tk blocked`, and deferred queries.

#### project.md
File: `templates/.work/templates/memory/project.md`

Project context summary for agent recitation.

### B.3 Spec Template Update

Add "Master Spec Coverage" section to `templates/.work/templates/spec.md` with:
- Sections Implemented table
- Sections Deferred table

---

## Phase C: /plan-product Integration

### C.1 Command Updates

Update `/plan-product` to:
1. Create `.opencode/memory/` structure
2. Initialize `master-spec-coverage.md`
3. Optionally assist with master spec creation

### C.2 Product Planner Agent Updates

Add Phase 4.5: Master Spec Assistance
- Help structure requirements into `master-spec.md`
- For multiple domains: `master-spec-ui.md`, `master-spec-api.md`
- Initialize coverage tracking

---

## Phase D: Agent Modifications

### D.1 @shaper Enhancement
- Add Step 3.5: Check Master Spec
- Read relevant sections before clarifying questions
- Include master spec sections in approach.md

### D.2 @spec-writer Enhancement
- Step 0: Check Master Spec and extract requirements
- Step 0.5: Create Deferred Tickets for out-of-scope items
- Step 0.6: Update master-spec-coverage.md
- Add Master Spec Coverage table to spec.md

### D.3 @decomposer Enhancement
- Replace tasks.md creation with Ticket creation
- Create Epic ticket for feature
- Create Task tickets with dependencies
- Use `tk dep` for dependency management

### D.4 @coverage-auditor Enhancement
- Add master spec coverage verification
- Verify each master spec requirement has a ticket
- Verify deferred items are tracked as tickets
- Fail if gaps exist

### D.5 @deferred-tracker Agent (NEW)
- Scan specs for "out of scope" items
- Query deferred tickets when feature starts
- Alert when deferred items should be addressed
- Convert deferred tickets to tasks when ready

### D.6 @integrator Enhancement
- Add Epic Completion Verification via `tk query`
- Add Deferred Items Check
- Update master-spec-coverage.md on completion

### D.7 Context Recitation (All Agents)
- Regenerate current-focus.md at session start
- Read memory files before starting work
- Maintain awareness of ready tasks, blocked tasks, deferred items

---

## Phase E: Workflow Integration

### E.1 Updated Workflow Phases

```
Phase 0: SETUP         → @coordination-files  → AUTO
Phase 1: SHAPING       → @shaper              → HUMAN GATE
Phase 2: SPECIFICATION → @spec-writer         → HUMAN GATE
                         + creates deferred tickets
                         + updates master-spec-coverage.md
Phase 3: DECOMPOSITION → @decomposer          → AUTO (creates tickets)
Phase 4: IMPLEMENTATION → Ralph loops         → AUTO (uses tk start/close)
Phase 5: INTEGRATION   → @integrator          → AUTO (verifies via tk queries)
                         + checks deferred items
                         + updates master-spec-coverage.md
Phase 6: COMPLETION    → @finalizer           → HUMAN GATE (optional)
```

### E.2 Work Folder Structure

```
.opencode/spec/FEAT-001-user-auth/
├── approach.md
├── spec.md (with master spec coverage table)
├── acceptance.md
├── audit-report.md
├── tickets/
│   ├── EPIC-001.md
│   ├── TASK-001.md
│   ├── TASK-002.md
│   └── DEFERRED-001.md
├── progress.md
├── integration-report.md
├── summary.md
└── context/
```

### E.3 Memory Structure

```
.opencode/memory/
├── master-spec-coverage.md (traceability matrix)
├── current-focus.md (auto-generated)
├── project.md (project context)
└── decisions.md (architecture decisions)
```

---

## Files Summary

### New Files to Create (9)
1. `docs/prerequisites.md` - Ticket installation
2. `templates/.work/templates/ticket.md` - Task template
3. `templates/.work/templates/epic-ticket.md` - Epic template
4. `templates/.work/templates/deferred-ticket.md` - Deferred template
5. `templates/.work/templates/memory/master-spec-coverage.md`
6. `templates/.work/templates/memory/current-focus.md`
7. `templates/.work/templates/memory/project.md`
8. `agent/deferred-tracker.md` - New agent

### Files to Modify (10)
1. `AGENTS.md` - Add Ticket CLI section
2. `templates/.work/templates/spec.md` - Add master spec table
3. `command/setup.md` - Add memory folder creation
4. `command/plan-product.md` - Add memory structure
5. `command/feature.md` - Update workflow description
6. `agent/product-planner.md` - Add memory creation
7. `agent/shaper.md` - Add master spec check
8. `agent/spec-writer.md` - Add master spec integration
9. `agent/decomposer.md` - Replace tasks.md with tickets
10. `agent/coverage-auditor.md` - Add master spec verification
11. `agent/integrator.md` - Add epic verification
12. `agent/orchestrator.md` - Update phase routing
