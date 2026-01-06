---
name: wf-create-tasks
description: Phase 3 decomposition workflow - Break spec into tasks with wave analysis and file conflict detection
---

# Task Decomposition Workflow (Phase 3)

Break specifications into implementable tasks with dependencies, wave-based parallelization, and file conflict detection.

## When to Use

- After Phase 2 (Specification) is approved
- When `spec.md` and `acceptance.md` are complete
- Before implementation (Phase 4)

## Agent References

**Primary Agent**: `@decomposer`

**Verification Agents** (run in parallel):
- `@coverage-auditor` - Ensure tasks fully cover entire spec
- `@dependency-validator` - Validate DAG structure, no cycles

## Input Requirements

- Approved `spec.md` from Phase 2
- `acceptance.md` with all criteria
- `approach.md` for context
- Access to codebase for file analysis

## Workflow Steps

### Step 1: Analyze Specification

Read and understand the full specification:

```bash
# Load specification
cat .work/features/FEAT-XXX/spec.md

# Load acceptance criteria
cat .work/features/FEAT-XXX/acceptance.md

# Load approach for context
cat .work/features/FEAT-XXX/approach.md
```

Identify:
- All requirements to implement
- Acceptance criteria to satisfy
- Technical components needed
- Integration points

### Step 2: Identify Logical Work Units

Break the spec into distinct work units:

1. **Group by domain** - Database, API, UI, etc.
2. **Group by feature** - Related functionality together
3. **Identify dependencies** - What must be done first?

```markdown
## Work Units Identified

1. Data Layer
   - Create User Favorite model
   - Add database migration
   
2. API Layer
   - Implement favorites endpoints
   - Add authentication middleware
   
3. UI Layer
   - Build favorites list component
   - Add favorite toggle button
```

### Step 3: Size Tasks Appropriately

Target task size: **1-2 hours of work**

```markdown
## Task Sizing

| Task | Estimated Hours | Action |
|------|-----------------|--------|
| Create model | 0.5 | Keep as-is |
| Build UI component | 4 | Split into subtasks |
| Add API endpoint | 1 | Keep as-is |
```

**If task > 2 hours**: Apply recursive decomposition

```markdown
## Recursive Decomposition

Original: Build favorites UI (4 hours)
Split into:
- 3.1 Create FavoritesList component (1 hour)
- 3.2 Create FavoriteToggle component (1 hour)
- 3.3 Integrate with state management (1 hour)
- 3.4 Add loading/error states (1 hour)
```

### Step 4: Map Dependencies

Create dependency graph:

```markdown
## Dependencies

| Task | Depends On | Blocks |
|------|------------|--------|
| TASK-001 | None | TASK-003, TASK-004 |
| TASK-002 | None | TASK-004 |
| TASK-003 | TASK-001 | TASK-005 |
| TASK-004 | TASK-001, TASK-002 | TASK-005 |
| TASK-005 | TASK-003, TASK-004 | None |
```

Verify no circular dependencies!

### Step 5: Analyze Parallelization (Waves)

Group independent tasks into execution waves:

```markdown
## Wave Analysis

### Wave 1 (Parallel - no dependencies)
- TASK-001: Create Favorite model
- TASK-002: Set up API routes

### Wave 2 (Depends on Wave 1)
- TASK-003: Implement API endpoints
- TASK-004: Create service layer

### Wave 3 (Depends on Wave 2)
- TASK-005: Build UI components
- TASK-006: Add integration tests
```

**Wave rules**:
- Tasks in same wave run in parallel
- Wave N+1 starts only after Wave N completes
- Tasks with dependencies wait for dependencies

### Step 6: Detect File Conflicts

Tasks touching same files **cannot parallelize**:

```markdown
## File Conflict Analysis

| Task A | Task B | Shared Files | Can Parallelize? |
|--------|--------|--------------|------------------|
| TASK-001 | TASK-002 | None | YES |
| TASK-003 | TASK-004 | src/types.ts | NO - move to different waves |
| TASK-005 | TASK-006 | None | YES |

### Conflicts Resolved
- Moved TASK-004 to Wave 3 (was Wave 2) to avoid conflict with TASK-003
```

### Step 7: Assign Complexity Scores

Rate each task 1-5:

```markdown
## Complexity Scores

| Task | Complexity | Reasoning |
|------|------------|-----------|
| TASK-001 | 2 | Standard model creation |
| TASK-002 | 1 | Simple route setup |
| TASK-003 | 3 | Multiple endpoints with auth |
| TASK-004 | 4 | Complex state management |
| TASK-005 | 2 | Component with props |
```

Complexity affects voting in Phase 4:
- 1-2: No voting needed
- 3: Vote on uncertain steps
- 4-5: Vote on all complex steps

### Step 8: Calculate Critical Path

Identify the longest dependency chain:

```markdown
## Critical Path Analysis

Path: TASK-001 -> TASK-003 -> TASK-005
Duration: 2 + 3 + 2 = 7 complexity units

This is the minimum time to complete regardless of parallelization.
```

### Step 9: Parallel Verification

Spawn verification agents:

#### @coverage-auditor Check
Verifies:
- Every spec requirement has a task
- Every acceptance criterion is covered
- No orphaned tasks (not tied to requirements)

#### @dependency-validator Check
Verifies:
- DAG structure is valid
- No circular dependencies
- No missing dependencies
- Wave assignments are correct

### Step 10: Generate Tasks Document

## Output Format

Create `tasks.md`:

```markdown
# Tasks: [Feature Name]

## Summary
- **Total Tasks**: X
- **Estimated Effort**: X hours
- **Waves**: X
- **Critical Path**: [List of tasks]

## Wave 1 (Parallel)
- [ ] TASK-001: [Description]
  - **Complexity**: 2
  - **Files**: [files to touch]
  - **Acceptance**: AC-1, AC-2
  - **Dependencies**: none

- [ ] TASK-002: [Description]
  - **Complexity**: 1
  - **Files**: [files to touch]
  - **Acceptance**: AC-3
  - **Dependencies**: none

## Wave 2 (Depends on Wave 1)
- [ ] TASK-003: [Description]
  - **Complexity**: 3
  - **Files**: [files to touch]
  - **Acceptance**: AC-4, AC-5
  - **Dependencies**: TASK-001

- [ ] TASK-004: [Description]
  - **Complexity**: 3
  - **Files**: [files to touch]
  - **Acceptance**: AC-6
  - **Dependencies**: TASK-001, TASK-002

## Wave 3 (Depends on Wave 2)
- [ ] TASK-005: [Description]
  - **Complexity**: 4
  - **Files**: [files to touch]
  - **Acceptance**: AC-7, AC-8
  - **Dependencies**: TASK-003, TASK-004

## Dependency Graph
```
TASK-001 ──┬── TASK-003 ──┐
           │              ├── TASK-005
TASK-002 ──┴── TASK-004 ──┘
```

## File Touch Matrix
| File | Tasks |
|------|-------|
| src/models/favorite.ts | TASK-001 |
| src/routes/favorites.ts | TASK-002, TASK-003 |
| src/components/FavoritesList.tsx | TASK-005 |

## Verification Results
- Coverage: 100% of spec requirements mapped
- Dependencies: Valid DAG, no cycles
- File conflicts: Resolved
```

## Success Criteria

- [ ] All spec requirements mapped to tasks
- [ ] All acceptance criteria assigned to tasks
- [ ] Tasks sized appropriately (1-2 hours each)
- [ ] Dependencies mapped correctly
- [ ] Waves assigned for parallelization
- [ ] File conflicts detected and resolved
- [ ] Complexity scores assigned
- [ ] Critical path calculated
- [ ] @coverage-auditor confirms 100% coverage
- [ ] @dependency-validator confirms valid DAG
- [ ] tasks.md generated with all metadata

## Gate

**AUTOMATED GATE** - Proceeds automatically if:
- @coverage-auditor confirms full coverage
- @dependency-validator confirms valid DAG
- No unresolved file conflicts

If verification fails, revise tasks and re-run.

## Example Usage

```
Decomposer:
1. Analyzes spec for user favorites feature
2. Identifies 6 work units across 3 domains
3. Sizes tasks:
   - 4 tasks are 1-2 hours
   - 2 tasks need recursive decomposition
4. Maps dependencies:
   - Model before API
   - API before UI
5. Creates 3 waves:
   - Wave 1: Model + routes (parallel)
   - Wave 2: Endpoints + service (parallel)
   - Wave 3: UI + tests (parallel)
6. Detects file conflict in Wave 2, adjusts
7. Assigns complexity: 1-4 range
8. Critical path: TASK-001 -> TASK-003 -> TASK-005
9. Verification:
   - @coverage-auditor: 100% coverage
   - @dependency-validator: Valid DAG
10. Generates tasks.md
```

## Next Steps

After tasks are validated, proceed to Phase 4: Implementation using `/skill wf-implement-tasks`.
