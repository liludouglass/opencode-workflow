---
name: wf-completion
description: Phase 6 completion workflow - Wrap up work and prepare for merge
---

# Completion Workflow (Phase 6)

Wrap up completed work, generate summary documentation, and prepare for merge or human review.

## When to Use

- After Phase 5 (Integration) passes all checks
- When all acceptance criteria are verified
- Ready to finalize and potentially merge the work

## Agent Reference

**Primary Agent**: `@finalizer`

## Input Requirements

- `integration-report.md` - Passing integration results
- `spec.md` - Original specification
- `acceptance.md` - All criteria verified
- All tickets closed (via `tk query`)
- `progress.md` - Full implementation log
- Git history of commits made during implementation

## Workflow Steps

### Step 1: Verify Completion Prerequisites

Confirm all prerequisites are met:

```markdown
## Completion Checklist

- [ ] All tickets have status 'closed'
- [ ] Integration report shows PASS status
- [ ] All acceptance criteria verified
- [ ] CI is green (tests, lint, type-check, build)
- [ ] No open bugs from integration phase
```

If any prerequisite fails, loop back to the appropriate phase.

### Step 2: Generate Summary

Create a comprehensive summary of what was accomplished:

```markdown
## What Was Done

### Features Implemented
- [Feature 1]: [Brief description]
- [Feature 2]: [Brief description]

### Key Decisions Made
- [Decision 1]: [Reasoning]
- [Decision 2]: [Reasoning]

### Technical Approach
[Brief description of the technical approach taken]
```

### Step 3: Document Changes

Compile a list of all files changed:

```markdown
## Files Changed

### Created
- src/components/NewFeature.tsx
- src/services/featureService.ts
- tests/newFeature.test.ts

### Modified
- src/routes/index.ts (added new route)
- src/types/index.ts (added new types)

### Deleted
- [None / List any removed files]

Total: X files changed, Y insertions, Z deletions
```

### Step 4: Update Documentation (if needed)

Check if documentation updates are required:

- README updates for new features
- API documentation for new endpoints
- Configuration documentation for new settings
- Changelog entries

Only update documentation if explicitly required by the feature or requested.

### Step 5: Clean Up Work Folder

Prepare work folder for archival:

1. **Remove temporary files** (if any)
2. **Compact context bundles** (no longer needed)
3. **Ensure all logs are complete**

```bash
# Remove context bundles (no longer needed)
rm -rf .work/features/FEAT-XXX/context/

# Keep for archive:
# - approach.md
# - spec.md
# - acceptance.md
# - tickets/ directory
# - progress.md
# - integration-report.md
# - summary.md
```

### Step 6: Create Final Commit(s)

Ensure all changes are properly committed:

```bash
# Verify no uncommitted changes
git status

# If changes exist, create final commit
git add -A
git commit -m "feat(FEAT-XXX): Complete [feature name]

- Implemented [key feature 1]
- Added [key feature 2]
- Updated [affected areas]

Closes #XXX"
```

### Step 7: Prepare Review Notes (if manual_review flag)

If the feature has `manual_review: true` flag:

```markdown
## Review Notes

### Areas Requiring Attention
- [Area 1]: [Why it needs review]
- [Area 2]: [Why it needs review]

### Testing Instructions
1. [Step 1 to test the feature]
2. [Step 2 to verify behavior]
3. [Expected outcome]

### Known Limitations
- [Limitation 1]
- [Limitation 2]

### Questions for Reviewer
- [Question 1]
- [Question 2]
```

### Step 8: Archive or Complete

Based on configuration:

**If auto-complete**:
```bash
# Move to archive
mv .work/features/FEAT-XXX .work/archive/

# Update index.md
# Remove from Active Features, add to Recently Completed
```

**If manual_review required**:
- Set status to `pending_review`
- Notify human reviewer
- Wait for approval before archiving

## Output Format

Create `summary.md`:

```markdown
# Summary: [Feature Name]

## Overview
- **Feature ID**: FEAT-XXX
- **Completed**: [YYYY-MM-DD]
- **Duration**: [X days/hours]
- **Complexity**: [simple | medium | complex]

## What Was Built
[1-2 paragraphs describing the feature]

## Key Decisions
1. **[Decision]**: [Reasoning and outcome]
2. **[Decision]**: [Reasoning and outcome]

## Implementation Highlights
- [Notable implementation detail 1]
- [Notable implementation detail 2]

## Files Changed
- **Created**: X files
- **Modified**: Y files
- **Deleted**: Z files

[List key files]

## Test Coverage
- Unit tests: X
- Integration tests: Y
- Total: Z tests added

## Acceptance Criteria Status
- [x] AC-1: [Description]
- [x] AC-2: [Description]
- [x] AC-3: [Description]

All acceptance criteria verified.

## Documentation Updated
- [ ] README
- [ ] API docs
- [x] Changelog

## Commits
- abc1234: feat: Initial implementation
- def5678: feat: Add edge case handling
- ghi9012: test: Add integration tests
- jkl3456: docs: Update changelog

## Status
[complete | pending_review]

## Next Steps
- [Future enhancement 1]
- [Future enhancement 2]
- [Technical debt to address]
```

## Success Criteria

- [ ] All completion prerequisites verified
- [ ] Summary document generated
- [ ] All files documented
- [ ] Documentation updated (if required)
- [ ] Work folder cleaned up
- [ ] Final commits created with good messages
- [ ] Review notes prepared (if manual_review)
- [ ] Work archived or marked for review

## Gate Logic

| Configuration | Action |
|---------------|--------|
| `manual_review: false` | Auto-complete, archive work folder |
| `manual_review: true` | Pause for human review, then archive |

## Human Review Gate (Optional)

When `manual_review: true`:

1. Summary and review notes presented to human
2. Human can:
   - **Approve**: Work is archived, feature complete
   - **Request changes**: Loop back to appropriate phase
   - **Reject**: Work marked as rejected, archived separately

## Archive Process

After completion (or review approval):

```bash
# Move completed work to archive
mv .work/features/FEAT-XXX .work/archive/FEAT-XXX-[feature-name]/

# Archive includes:
# - approach.md
# - spec.md
# - acceptance.md
# - tickets/ directory
# - progress.md
# - integration-report.md
# - summary.md

# Update .work/index.md:
# Remove from "Active Features"
# Add to "Recently Completed" with completion date
```

## Example Usage

```
Finalizer:
1. Verifies: All tickets closed (`tk query '.status == "closed"'`), integration passed
2. Generates summary:
   - 3 main features implemented
   - 5 key decisions documented
   - 12 files changed
3. Compiles file changes from git
4. Updates: Changelog with new feature
5. Cleans up: Removes context/ folder
6. Commits: "feat(FEAT-042): Complete user favorites"
7. Checks: manual_review = false
8. Archives: Moves to .work/archive/
9. Updates: index.md with completion
10. Done!
```

## Next Steps

After completion:
- Feature is ready for merge/deployment
- Work folder is archived
- index.md reflects completion
- Ready for next feature cycle
