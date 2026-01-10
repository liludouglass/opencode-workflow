# Acceptance Criteria: Feature-Local Spec Context Paths

## Status
- Total Criteria: 11
- Verified: 0
- Pending: 11

## Criteria

### Functional
- [ ] AC-1: Canonical spec context path is `.opencode/features/FEAT-XXX/spec/` with required contents (`spec.md`, `acceptance.md`, `progress.md`, `tickets/`) and optional `context/`. - Testable by: verify spec defines the layout and no other path is stated as canonical.
- [ ] AC-2: All references to `.opencode/spec/FEAT-XXX/` and `.opencode/spec.md` in the specified docs/agents/skills/templates are updated to the new path. - Testable by: search for `.opencode/spec/FEAT-` and `.opencode/spec.md` and confirm none remain in the listed files.
- [ ] AC-3: `/setup` documentation creates `.opencode/features/` and removes `.opencode/spec` from directory lists and example output. - Testable by: inspect `command/setup.md` updates.
- [ ] AC-4: All `tk` CLI instructions use `--dir .opencode/features/FEAT-XXX/spec/tickets`. - Testable by: verify `tk` examples in updated docs.
- [ ] AC-5: Context-manager instructions use `work_folder: ".opencode/features/FEAT-XXX/spec/"` and output to `.opencode/features/FEAT-XXX/spec/context/`. - Testable by: inspect `agent/context-manager.md` updates.
- [ ] AC-6: A migration plan is documented covering moving legacy spec assets, handling duplicates, and deleting `.opencode/spec/`. - Testable by: read the Migration Plan section in `spec.md`.
- [ ] AC-7: Documentation explicitly states `.opencode/specs/` (plural) remains for debug/bug workflows and is not repointed. - Testable by: verify the non-change note in `spec.md` and any updated docs.
- [ ] AC-8: Only documentation/instruction/template updates are in scope; no runtime code changes are introduced. - Testable by: confirm scope statements in `spec.md` and review planned change list.

### Non-Functional
- [ ] AC-9: No new tool or runtime dependencies are required. - Testable by: confirm spec states no new dependencies and no code changes.

### Edge Cases
- [ ] AC-E1: Migration plan includes steps for missing feature folders (create before moving). - Testable by: verify Migration Plan steps.
- [ ] AC-E2: Migration plan covers features already in the new layout (skip move to avoid duplication). - Testable by: verify Migration Plan steps.
