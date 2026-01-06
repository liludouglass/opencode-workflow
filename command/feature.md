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
Phase 1: SHAPING      → @shaper           → HUMAN GATE (approve approach.md)
Phase 2: SPECIFICATION → @spec-writer     → HUMAN GATE (approve spec.md)
Phase 3: DECOMPOSITION → @decomposer      → AUTO (validation only)
Phase 4: IMPLEMENTATION → Ralph loops      → AUTO (per-task verification)
Phase 5: INTEGRATION   → @integrator      → AUTO (loops back on failure)
Phase 6: COMPLETION    → @finalizer       → HUMAN GATE (if manual_review flag)
```

### Phase Details

| Phase | Agent | Output | Gate |
|-------|-------|--------|------|
| 1. Shaping | @shaper | approach.md | Human approval required |
| 2. Specification | @spec-writer, @spec-auditor, @feasibility-checker | spec.md, acceptance.md, audit-report.md | Human approval required |
| 3. Decomposition | @decomposer, @coverage-auditor, @dependency-validator | tasks.md with waves | Automated validation |
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
.work/features/FEAT-001-user-auth-oauth2/
├── approach.md            # Phase 1 - Approved direction
├── spec.md                # Phase 2 - Full specification
├── acceptance.md          # Phase 2 - Checkable criteria
├── audit-report.md        # Phase 2 - Verification results
├── tasks.md               # Phase 3 - Task breakdown with waves
├── progress.md            # Phase 4 - Append-only Ralph log
├── integration-report.md  # Phase 5 - Integration results
├── summary.md             # Phase 6 - Final summary
└── context/               # Auto-generated context bundles
    ├── summary.md
    ├── task-001-context.md
    └── task-002-context.md
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

Feature request: $ARGUMENTS
