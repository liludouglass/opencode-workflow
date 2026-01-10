# Specification: Feature-Local Spec Context Paths

## Overview
Move all feature specification context into a single, feature-local directory at `.opencode/features/FEAT-XXX/spec/`. This directory becomes the sole source of truth for `spec.md`, `acceptance.md`, `progress.md`, `tickets/`, and `context/`, eliminating the split between `.opencode/spec/` and `.opencode/features/`.

Update workflow documentation, agent instructions, command docs, and templates to reference the new paths. Provide a migration plan for existing features currently stored under `.opencode/spec/FEAT-XXX/`, including explicit steps to resolve duplicate spec artifacts and retire the old `.opencode/spec/` directory. This is documentation-only work and introduces no new runtime dependencies.

## Spec Depth
L3 - Medium complexity because multiple workflow documents, templates, and command references must be updated and a migration plan must be explicit.

## Acceptance Criteria
- [ ] AC-1: The canonical spec context path is defined as `.opencode/features/FEAT-XXX/spec/` with required contents (`spec.md`, `acceptance.md`, `progress.md`, `tickets/`) and optional `context/`.
- [ ] AC-2: All references to `.opencode/spec/FEAT-XXX/` and `.opencode/spec.md` in the specified docs/agents/skills/templates are updated to the new path, with no remaining `.opencode/spec/FEAT-XXX` mentions.
- [ ] AC-3: `/setup` documentation creates `.opencode/features/` and removes `.opencode/spec` from the directory list and the example tree output.
- [ ] AC-4: All `tk` CLI examples and instructions use `--dir .opencode/features/FEAT-XXX/spec/tickets`.
- [ ] AC-5: Context-manager instructions use `work_folder: ".opencode/features/FEAT-XXX/spec/"` and output context bundles under `.opencode/features/FEAT-XXX/spec/context/`.
- [ ] AC-6: A migration plan is documented covering moving legacy spec assets, handling duplicates, and deprecating `.opencode/spec/`.
- [ ] AC-7: Documentation clarifies that `.opencode/specs/` (plural) remains reserved for debug/bug workflows and is not repointed.
- [ ] AC-8: The update scope is documentation/instructions/templates only; no runtime code changes are introduced.
- [ ] AC-9: No new runtime dependencies or tooling requirements are introduced.

## Technical Design

### Data Models
**Feature Spec Context (filesystem layout)**

| Path | Type | Required | Description |
|------|------|----------|-------------|
| `.opencode/features/FEAT-XXX/spec/` | directory | yes | Feature-local spec root. |
| `.opencode/features/FEAT-XXX/spec/spec.md` | file | yes | Technical specification. |
| `.opencode/features/FEAT-XXX/spec/acceptance.md` | file | yes | Checkable acceptance criteria. |
| `.opencode/features/FEAT-XXX/spec/progress.md` | file | yes | Ralph loop progress log. |
| `.opencode/features/FEAT-XXX/spec/tickets/` | directory | yes | `tk` CLI ticket storage. |
| `.opencode/features/FEAT-XXX/spec/context/` | directory | optional | Context bundles created by the context manager. |

**Ticket Format**
- Ticket file format and metadata remain unchanged; only the directory path changes.

### API Contracts
No network APIs are introduced. CLI and documentation contracts are updated:

**tk CLI Path Contract**
- All `tk` commands must use `--dir .opencode/features/FEAT-XXX/spec/tickets`.
- Applies to `tk create`, `tk query`, `tk show`, `tk ready`, `tk blocked`, and any `/ralph`-referenced workflows.

**Context Manager Input/Output Contract**
- `work_folder` value must be `.opencode/features/FEAT-XXX/spec/`.
- Context bundle output path must be `.opencode/features/FEAT-XXX/spec/context/task-XXX-context.md`.
- Bug context path `.opencode/bugs/BUG-XXX/context/` remains unchanged.

### Behavior Specifications

#### Path Standardization
- `.opencode/features/FEAT-XXX/spec/` is the only valid location for feature specs, tickets, and progress logs.
- `.opencode/spec/FEAT-XXX/` is deprecated and must not be referenced in any workflow documents after this change.

#### Documentation and Instruction Updates
Replace `.opencode/spec/FEAT-XXX` and `.opencode/spec.md` references in the following files:
- `agent/orchestrator.md`
- `agent/spec-writer.md`
- `agent/integrator.md`
- `agent/decomposer.md`
- `agent/coverage-auditor.md`
- `agent/context-manager.md` (includes work folder and output paths)
- `agent/deferred-tracker.md`
- `command/build.md`
- `command/ctx.md`
- `command/status.md`
- `command/feature.md`
- `docs/prerequisites.md`
- `skill/wf-context-recitation/SKILL.md`
- `skill/wf-implement-tasks/SKILL.md`
- `skill/wf-orchestrate/SKILL.md`
- `skill/wf-initialize-spec/SKILL.md`

Template updates:
- Search `templates/.work/templates/` for `.opencode/spec` references. If any exist, update them to `.opencode/features/FEAT-XXX/spec/` (none are currently found via repo search).

Explicit non-changes:
- Any references to `.opencode/specs/` (plural) remain unchanged because they belong to the debug/bug workflows.

#### /setup Updates
- Remove `.opencode/spec` from the `mkdir -p` command lists.
- Add `.opencode/features` to the `mkdir -p` command lists.
- Update the sample output tree to include `features/` and remove the `spec/` entry.

#### Migration Plan (Existing Features)
For each existing feature currently in `.opencode/spec/FEAT-XXX/`:
1. Ensure `.opencode/features/FEAT-XXX/` exists; create if missing.
2. Move the entire folder from `.opencode/spec/FEAT-XXX/` to `.opencode/features/FEAT-XXX/spec/`.
3. If a legacy spec file exists at `.opencode/features/FEAT-XXX/spec.md` (feature-root):
   - Compare it with the moved `spec/spec.md`.
   - Merge any unique content into `spec/spec.md`.
   - Delete the duplicate feature-root `spec.md` after merge.
   - Record the merge action in `spec/progress.md`.
4. If a feature has no `.opencode/spec/FEAT-XXX/` directory, it is already in the new layout; do not create duplicates.
5. After all features are migrated, delete the top-level `.opencode/spec/` directory to eliminate ambiguity.

### State Transitions

| State | Definition | Trigger | Next State |
|-------|------------|---------|------------|
| Legacy | Spec assets live under `.opencode/spec/FEAT-XXX/` | Migration starts | Migrated |
| Migrated | Assets moved to `.opencode/features/FEAT-XXX/spec/` | Duplicate resolution completed | Cleaned |
| Cleaned | `.opencode/spec/` removed and docs updated | All references updated | Stable |
| Stable | Only feature-local spec path used | New feature created | Stable |

### Edge Cases
- Feature folder missing during migration: create `.opencode/features/FEAT-XXX/` before moving assets.
- Feature already migrated (no `.opencode/spec/FEAT-XXX/`): skip move and avoid duplication.
- Tickets folder missing after migration: create `.opencode/features/FEAT-XXX/spec/tickets/` before running `tk` commands.

### Error Handling
- If an agent or command expects spec files and they are missing, instruct to verify `.opencode/features/FEAT-XXX/spec/` and recreate missing files rather than falling back to `.opencode/spec/`.
- Context manager error responses should point to the new spec path when reporting a missing work folder.

## Security Considerations
- No sensitive data is introduced or moved beyond existing `.opencode/` project folders.
- Migration steps must not move or copy `.env` files or other secrets.

## Traceability

### From Discovery
| Discovery Item | Spec Section | Status |
|----------------|--------------|--------|
| No discovery.md provided | Overview | ✅ Covered |

### From Approach
| Approach Decision | Spec Section | Status |
|-------------------|--------------|--------|
| Selected approach: Option A (feature-local spec) | Technical Design → Path Standardization | ✅ Covered |
| Update docs/agents/templates/setup | Technical Design → Documentation and Instruction Updates, /setup Updates | ✅ Covered |
| Migration plan required | Technical Design → Migration Plan | ✅ Covered |
| Update tk CLI paths | API Contracts → tk CLI Path Contract | ✅ Covered |
| Update context-manager paths | API Contracts → Context Manager Input/Output Contract | ✅ Covered |

## Risks and Unknowns
- Risk: Duplicate spec sources require manual merge; mitigate by explicit merge-and-delete steps and logging in `progress.md`.
- Risk: Hidden references to `.opencode/spec/` outside the listed files; mitigate by repo-wide search before finalizing updates.
- Unknown: Additional workflow templates outside `templates/.work/templates/` may exist; verify in the repository before execution.

## Open Questions
- None.
