---
description: "Initiate new feature workflow through all 6 phases"
agent: orchestrator
---

# /feature

Initiate a new feature workflow through the complete 6-phase agentic development cycle.

## Usage

```
/feature <description>
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| description | Yes | Natural language description of the feature to build |

## Behavior

When invoked, this command:

1. **Routes to @orchestrator** with feature mode enabled
2. **Creates work folder**: `.work/features/FEAT-XXX-<slug>/`
   - Generates sequential ID by scanning existing folders
   - Creates URL-safe slug from description (max 30 chars)
3. **Copies templates** from `.work/templates/` to work folder
4. **Initiates Phase 1 (Shaping)** via `@shaper` agent

### Full Workflow Phases

```
Phase 0: SETUP         → @coordination-files  → AUTO (create work folder)
Phase 1: SHAPING       → @shaper              → HUMAN GATE (approve approach.md)
                         + checks master spec if exists
Phase 2: SPECIFICATION → @spec-writer         → HUMAN GATE (approve spec.md)
                         + creates deferred tickets
                         + updates master-spec-coverage.md
Phase 3: DECOMPOSITION → @decomposer          → AUTO (creates tickets)
Phase 4: IMPLEMENTATION → Ralph loops         → AUTO (uses tk start/close)
Phase 5: INTEGRATION   → @integrator          → AUTO (verifies via tk queries)
                         + checks deferred items
Phase 6: COMPLETION    → @finalizer           → HUMAN GATE (optional)
```

### Phase Details

| Phase | Agent | Output | Gate |
|-------|-------|--------|------|
| 1. Shaping | @shaper | approach.md | Human approval required |
| 2. Specification | @spec-writer, @spec-auditor, @feasibility-checker | spec.md, acceptance.md, audit-report.md | Human approval required |
| 3. Decomposition | @decomposer, @coverage-auditor, @dependency-validator | tickets/ with dependencies | Automated validation |
| 4. Implementation | @context-manager, @implementer (Ralph loops) | Code commits, progress.md | Automated per-task |
| 5. Integration | @integrator, @spec-compliance, @regression-detector | integration-report.md | Automated (loops on failure) |
| 6. Completion | @finalizer | summary.md | Human review (optional) |

### Human Gates

After Phase 1 and Phase 2, the workflow **pauses** for human approval:

```markdown
## Awaiting Approval

**Phase**: Shaping
**Work Item**: FEAT-001
**File**: approach.md

### Summary
[Key points requiring review]

### Approval Required
Reply with:
- "approved" to continue
- Feedback to request changes
```

## Examples

```
/feature Add user authentication with OAuth2 support
```

Creates: `.work/features/FEAT-001-user-auth-oauth2/`
Starts: Phase 1 with @shaper for requirements clarification

```
/feature Implement real-time notifications using WebSockets
```

Creates: `.work/features/FEAT-002-realtime-notifications/`
Starts: Phase 1 with @shaper

```
/feature Add dark mode toggle to settings page
```

Creates: `.work/features/FEAT-003-dark-mode-settings/`
Starts: Phase 1 with @shaper

## Work Folder Structure

After completion, the work folder contains:

```
.opencode/spec/FEAT-001-user-auth-oauth2/
├── approach.md            # Phase 1 - Approved direction (with master spec sections)
├── spec.md                # Phase 2 - Full specification (with coverage table)
├── acceptance.md          # Phase 2 - Checkable criteria
├── audit-report.md        # Phase 2 - Verification results
├── tickets/               # Phase 3 - Individual ticket files
│   ├── EPIC-001.md        # Epic ticket for the feature
│   ├── TASK-001.md        # Task tickets
│   ├── TASK-002.md
│   └── DEFERRED-001.md    # Deferred items (if any)
├── progress.md            # Phase 4 - Append-only Ralph log
├── integration-report.md  # Phase 5 - Integration results
├── summary.md             # Phase 6 - Final summary
└── context/               # Auto-generated context bundles
```

## Related Commands

- `/bug` - Simplified workflow for bug fixes (skips Phase 1)
- `/improve` - Enhancement workflow with lighter spec depth (L2)
- `/convoy` - Continue workflow from current state
- `/ralph` - Run Ralph loop on specific task

## Prerequisites

- `.work/` folder structure must exist (created automatically if missing)
- Templates in `.work/templates/` (created automatically if missing)
- `config.yaml` with workflow settings
- **Ticket CLI** installed (`brew install wedow/tools/ticket`) - see `docs/prerequisites.md`

Feature request: $ARGUMENTS
