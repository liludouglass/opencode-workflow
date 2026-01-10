# Approach: Move spec/tickets context under feature folder (.opencode/features/FEAT-XXX/spec)

<!-- Phase 1 Shaping Output Template -->
<!-- Created by @shaper agent after discovery and clarification -->

## Request Type

<!-- One of: feature | bug | improve -->
improve

## Complexity

<!-- One of: simple | medium | complex -->
<!-- simple: max 3 tasks, L2 spec, no voting -->
<!-- medium: max 7 tasks, L3 spec, voting on uncertain steps -->
<!-- complex: unlimited tasks, L4 spec, voting on all complex steps -->
medium

## Summary

Shift the workflow so each feature owns its spec context at `.opencode/features/FEAT-XXX/spec/`, containing `spec.md`, `acceptance.md`, `tickets/`, and `progress.md`. This aligns with context-manager expectations and removes the split between `.opencode/features/` and `.opencode/spec/`, fixing the mismatch surfaced while running FEAT-013 in openchamber.

Update workflow docs, agent instructions, templates, and tk CLI paths (including `/ralph` references) to the new location, and define a minimal migration plan to move existing `.opencode/spec/FEAT-XXX/` content into each feature’s `spec/` folder. No code changes beyond documentation/structure updates.

## Research Findings

- Existing spec context lives in `.opencode/spec/FEAT-XXX/` with `spec.md`, `acceptance.md`, `progress.md`, and `tickets/` (e.g. `FEAT-001-ticket-integration-workflow-enhancement`).
- Feature folders already store spec artifacts at the root (e.g. `FEAT-001-twitter-viral-posting-subagent/spec.md`), creating duplication and path ambiguity.
- Multiple agent docs reference `.opencode/spec/FEAT-XXX/tickets` (orchestrator, decomposer, integrator, spec-writer, coverage-auditor).
- `agent/context-manager.md` assumes the work folder is `.opencode/spec/FEAT-XXX/` and writes context bundles under `.opencode/spec/FEAT-XXX/context/`.
- `command/setup.md` creates `.opencode/spec` as a top-level directory.
- No master specification found in repo root or `.opencode/`.

## Options Considered

### Option A: Move spec context into feature folders

**Description**: Standardize on `.opencode/features/FEAT-XXX/spec/` as the only location. Update docs/commands/agents/templates to reference the new path and include a migration checklist to relocate existing spec/ticket assets.

**Pros**:
- Single authoritative location aligned with context-manager expectations.
- Removes duplication and confusion between `.opencode/features/` and `.opencode/spec/`.

**Cons**:
- Requires broad documentation updates and a one-time migration for existing features.
- Old paths break unless cleaned or redirected.

### Option B: Dual-path compatibility (feature-first, fallback to `.opencode/spec`)

**Description**: Allow both layouts in docs and agent instructions, recommending feature-local spec but keeping `.opencode/spec/FEAT-XXX/` as a supported legacy path.

**Pros**:
- Minimal migration pressure for existing specs.
- Reduces immediate breaking changes.

**Cons**:
- Preserves ambiguity and ongoing confusion about the source of truth.
- Harder to enforce consistent context-manager behavior.

## Selected Approach

**Selected**: Option A

**Rationale**: This provides a single, feature-scoped source of truth and resolves the FEAT-013 mismatch directly. The migration cost is manageable and keeps the workflow predictable for future features.

## Spec Depth Required

**Level**: L3

**Justification**: The change spans multiple workflow documents, templates, and command paths, and requires explicit migration steps plus updated tk CLI references.

## Dependencies

### External Dependencies
- None.

### Internal Dependencies
- Agent docs and commands referencing `.opencode/spec/FEAT-XXX/` paths.
- Workflow templates in `templates/.work/templates/`.
- Existing `.opencode/spec/FEAT-XXX/` assets needing migration into feature folders.
- `/setup` command directory creation instructions.

## Status

<!-- One of: pending_approval | approved | rejected -->
**Status**: approved

---

<!-- Human gate: This document requires approval before proceeding to Phase 2 (Specification) -->
