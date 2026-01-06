---
name: wf-implement-tasks
description: Phase 4 implementation workflow - Execute tasks via Ralph loops with micro-decomposition and CI-green enforcement
---

# Implementation Workflow (Phase 4)

Execute tasks using the Ralph Wiggum approach with fresh context, micro-decomposition, MAKER-style voting, and CI-green enforcement.

**CRITICAL**: Load `/skill std-production-code` before implementing. All code must be production-ready.

## When to Use

- After Phase 3 (Decomposition) is validated
- When `tasks.md` contains validated task breakdown with waves
- When ready to write actual code

## Agent References

**Primary Agent**: `@implementer` (multiple instances via Ralph loops)

**Supporting Agents**:
- `@context-manager` - Generates minimal context bundles per task
- `@alignment-checker` - Verifies code matches spec section
- `@quality-gate` - Checks code quality and patterns

## Input Requirements

- `tasks.md` with wave assignments
- `spec.md` for reference
- `acceptance.md` for criteria
- `progress.md` for continuity
- Access to codebase

## Core Concepts

### Ralph Wiggum Approach

```
Fresh context + Clear stop condition + Progress persistence = Reliable execution
```

Each task runs in a **Ralph loop**:
1. Generate fresh context (no context rot)
2. Execute with clean slate
3. Check for `<complete/>` signal
4. If not complete, iterate with fresh context
5. Persist progress between iterations

### The `<complete/>` Signal

Emit `<complete/>` when:
- All acceptance criteria for the task pass
- Tests are green
- Code is committed
- Progress is logged

```markdown
## Example
After completing all work:

<complete/>

Task TASK-003 finished. All acceptance criteria verified.
```

## Execution Model

```
For each Wave (parallel group of independent tasks):
  
  Spawn up to N Ralph loops in parallel (max_parallel_tasks: 3):
  
  Ralph Loop for Task X:
    for iteration in 1..max_iterations (default: 10):
      
      1. CONTEXT GENERATION (@context-manager)
      2. MICRO-DECOMPOSITION (inside @implementer)
      3. EXECUTION WITH VOTING (if enabled)
      4. VERIFICATION
      5. CI-GREEN ENFORCEMENT
      6. PROGRESS UPDATE
      7. COMPLETION CHECK
    
    If max_iterations reached: escalate to human

  Wait for all tasks in wave to complete
  Proceed to next wave
```

## Workflow Steps

### Step 1: Context Generation

`@context-manager` generates minimal context bundle:

```markdown
# Context: TASK-003

## Task Details
- **ID**: TASK-003
- **Description**: Implement favorites API endpoints
- **Acceptance Criteria**: AC-4, AC-5
- **Dependencies**: TASK-001 (complete)

## Relevant Spec Sections
[Only sections 2.3 and 2.4 from spec.md]

## Files to Modify
- src/routes/favorites.ts
- src/controllers/favoritesController.ts

## Recent Progress (last 5 entries)
[From progress.md]

## Token Count: ~5,000 (target: 8,000 max)
```

Context rules:
- Extract ONLY relevant spec sections
- Include ONLY files to be modified
- Include last N progress entries (configurable)
- Target ~5-10K tokens

### Step 2: Micro-Decomposition

Break task into atomic steps:

```markdown
## Micro-Steps for TASK-003

1. [ ] Create favoritesController.ts file
2. [ ] Implement getFavorites() handler
3. [ ] Implement addFavorite() handler
4. [ ] Implement removeFavorite() handler
5. [ ] Add error handling
6. [ ] Add input validation
7. [ ] Write unit tests
8. [ ] Verify all tests pass
```

Each step = one clear action that is trivial to execute.

### Step 3: Execution with Voting

For each micro-step:

```
Execute step
  ↓
Self-verify: matches intent?
  ↓
If complex/uncertain AND voting enabled:
  Spawn N voting agents (default: 3)
  Each attempts independently
  Compare results
  Majority wins
  ↓
If failed: retry with correction
```

**Voting configuration** (from complexity):
- Simple (1-2): No voting
- Medium (3): Vote on uncertain steps
- Complex (4-5): Vote on all complex steps

### Step 4: Verification

After implementation:

```markdown
## Verification Checklist

### @alignment-checker
- [ ] Code matches spec section 2.3
- [ ] All acceptance criteria addressed
- [ ] No deviations from specification

### Tests
- [ ] All new tests pass
- [ ] No regressions introduced
- [ ] Coverage meets requirements

### @quality-gate
- [ ] Code follows project patterns
- [ ] Naming conventions followed
- [ ] No code smells introduced
```

### Step 5: CI-Green Enforcement

**MANDATORY** before ANY commit:

```bash
# Must ALL pass before committing
npm run type-check    # Type checking
npm run lint          # Linting  
npm test              # Tests
npm run build         # Build (if applicable)
```

**If ANY fail**:
1. DO NOT commit
2. Fix the issue
3. Retry verification
4. Only commit when ALL green

This is **ENFORCED**, not optional.

### Step 6: Progress Update

Append to `progress.md`:

```markdown
## [YYYY-MM-DD HH:MM] - TASK-003 - Iteration 1
**Agent**: @implementer
**Action**: Created favorites controller with GET/POST/DELETE endpoints
**Files**: 
- src/controllers/favoritesController.ts (created)
- src/routes/favorites.ts (modified)
**Tests**: 5 passing
**Commit**: abc1234
**Status**: in_progress

## [YYYY-MM-DD HH:MM] - TASK-003 - Iteration 2
**Agent**: @implementer
**Action**: Added input validation and error handling
**Files**:
- src/controllers/favoritesController.ts (modified)
**Tests**: 8 passing
**Commit**: def5678
**Status**: <complete/>
```

### Step 7: Completion Check

```markdown
## Completion Checklist

- [ ] All acceptance criteria pass (AC-4, AC-5)
- [ ] All tests green
- [ ] CI checks pass
- [ ] Code committed
- [ ] Progress logged

If ALL checked → emit <complete/>
If ANY unchecked → continue to next iteration
```

## Wave Execution

```
Wave 1: [TASK-001, TASK-002] - independent
   ↓
┌─────────────┐  ┌─────────────┐
│ Ralph(001)  │  │ Ralph(002)  │  (parallel)
│ iter 1      │  │ iter 1      │
│ iter 2      │  │ <complete/> │
│ <complete/> │  └─────────────┘
└─────────────┘
         ↓
All Wave 1 complete → proceed
         ↓
Wave 2: [TASK-003, TASK-004] - depend on Wave 1
   ↓
┌─────────────┐  ┌─────────────┐
│ Ralph(003)  │  │ Ralph(004)  │  (parallel)
│ iter 1      │  │ iter 1      │
│ <complete/> │  │ iter 2      │
└─────────────┘  │ <complete/> │
                 └─────────────┘
         ↓
All Wave 2 complete → proceed to Wave 3...
```

## Configuration

From `.work/config.yaml`:

```yaml
workflow:
  max_parallel_tasks: 3        # Simultaneous Ralph loops

ralph:
  max_iterations_per_task: 10  # Before escalating
  complete_signal: "<complete/>"
  require_ci_green: true       # Enforced

context:
  max_tokens_per_task: 8000    # Target bundle size
  progress_history: 10         # Last N entries

complexity:
  simple:
    enable_voting: false
  medium:
    enable_voting: true        # On uncertain steps
  complex:
    enable_voting: true        # On all complex steps
```

## Output Per Task

| Output | Description |
|--------|-------------|
| Implemented code | Committed to repository |
| Test results | All tests passing |
| Progress entries | Appended to progress.md |
| Task status | Updated in tasks.md |

## Success Criteria

For each task:
- [ ] Context bundle generated (~5-10K tokens)
- [ ] Micro-steps identified and executed
- [ ] Voting applied where configured
- [ ] @alignment-checker confirms spec match
- [ ] @quality-gate confirms quality
- [ ] CI checks pass (type-check, lint, test, build)
- [ ] Code committed with good message
- [ ] Progress appended to progress.md
- [ ] `<complete/>` signal emitted
- [ ] Task marked [x] in tasks.md

## Failure Handling

| Scenario | Action |
|----------|--------|
| Step fails | Retry with correction |
| Tests fail | Fix and re-run |
| CI fails | Fix before commit |
| Max iterations reached | Escalate to human |
| Blocker found | Report and pause |

### Escalation

After `max_iterations` (default: 10):

```markdown
## Escalation: TASK-003

**Iterations**: 10
**Status**: BLOCKED

### Attempts Summary
- Iter 1-5: Worked on endpoint implementation
- Iter 6-8: Struggled with auth integration
- Iter 9-10: Still failing tests

### Specific Issue
Cannot resolve: [Description of blocking issue]

### Files Involved
- src/controllers/favoritesController.ts
- src/middleware/auth.ts

### Recommendation
Human review needed for auth middleware integration.
```

## Example Usage

```
Ralph Loop for TASK-003:

Iteration 1:
1. @context-manager: Generates 5K token bundle
2. @implementer: Micro-decomposes into 8 steps
3. Executes steps 1-4 (basic implementation)
4. Self-verifies: partial match
5. CI: lint fails (missing semicolon)
6. Fixes lint error
7. CI: all pass
8. Commits: "feat: Add favorites controller skeleton"
9. Updates progress.md
10. Checks completion: 3/5 acceptance criteria - NOT COMPLETE

Iteration 2:
1. Fresh context bundle generated
2. Reviews progress, continues from step 5
3. Executes steps 5-8 (validation, tests)
4. Self-verifies: full match
5. CI: all pass
6. Commits: "feat: Complete favorites API with validation"
7. Updates progress.md
8. Checks completion: 5/5 acceptance criteria - COMPLETE
9. Emits: <complete/>

Task marked [x] in tasks.md
Proceeds to next task in wave
```

## Loading Standards

Before implementing, load relevant standards:

```
/skill std-production-code   # REQUIRED - no mocks/stubs
/skill std-coding-style      # Code style
/skill std-error-handling    # Error handling
```

Load additional standards based on task domain:
- For API work: `/skill std-api`
- For testing: `/skill std-test-writing`

## Next Steps

After all waves complete, proceed to Phase 5: Integration using `/skill wf-integration`.
