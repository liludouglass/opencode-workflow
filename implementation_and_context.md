Section 1:
Here's the comprehensive prompt for the implementation session:

---

# Implementation Prompt: Agentic Workflow Orchestration System

## Context & Vision

We are building an elegant, minimal, spec-driven agentic workflow system that integrates with OpenCode. The system must handle everything from simple bug fixes to complex multi-week features with equal grace, producing high-quality outcomes with minimal human intervention.

### Core Problems We're Solving

1. **Features implemented incorrectly** → Lengthy debugging cycles
2. **Context rot** → Quality degrades as agent context fills up
3. **Insufficient decomposition** → Tasks too large for reliable execution
4. **No verification until end** → Errors compound
5. **Lost progress** → Work doesn't survive session restarts

### Key Insights Incorporated

1. **MAKER Paper (arXiv:2511.09030)**: Extreme decomposition + multi-agent voting enables million-step tasks with zero errors. Complex tasks fail not because LLMs are dumb, but because we give them too much at once.

2. **Ralph Wiggum Approach**: Fresh context + clear stop condition + progress persistence = reliable long-running agents. Run clean slate iterations until `<complete/>` signal.

3. **Ticket/Beads Analysis**: Markdown files + Git is sufficient for work tracking. No database needed. Human-readable, AI-parseable.

---

## Architecture Overview

### Three Layers

```
LAYER 1: WORKFLOW ORCHESTRATION (code/config)
  - Phase transitions, gates, agent coordination
  - NOT stored as tickets

LAYER 2: WORK ITEMS (tickets in .work/)
  - Features, bugs, tasks - persistent markdown files
  - Git-backed, human-readable

LAYER 3: MICRO-TASKS (ephemeral)
  - Atomic execution steps within tasks
  - Logged but not formal tickets
```

### Six Phases

```
Phase 1: SHAPING      → Transform ambiguous input into clear direction
Phase 2: SPECIFICATION → Create zero-ambiguity spec at appropriate depth
Phase 3: DECOMPOSITION → Break spec into tasks with dependencies + parallelization
Phase 4: IMPLEMENTATION → Execute tasks via Ralph loops with MAKER-style voting
Phase 5: INTEGRATION   → Verify everything works together
Phase 6: COMPLETION    → Final review and merge
```

### Human Gates (Minimal)

- **Required**: After Shaping (approve approach), After Spec (approve specification)
- **Optional**: Final review (per-feature flag)
- **Everything else**: Automated

---

## Detailed Phase Specifications

### Phase 1: SHAPING
**Agent**: `@shaper`

**Purpose**: Transform any input (vague idea, requirement, bug report) into approved direction.

**Steps**:
1. Classify request type (feature/bug/improve) and complexity (simple/medium/complex)
2. Research codebase - find relevant patterns, constraints, existing code
3. Ask clarifying questions until no ambiguity remains
4. Identify constraints and dependencies
5. Propose approach options with tradeoffs
6. Determine spec depth needed (L2/L3/L4)

**Output**: `approach.md` with approved direction
**Gate**: HUMAN APPROVAL required
**Creates**: Work folder (`.work/features/FEAT-XXX/` or `.work/bugs/BUG-XXX/`)

**Skip if**: Bug with clear reproduction steps (go directly to simplified spec)

---

### Phase 2: SPECIFICATION
**Agent**: `@spec-writer`
**Verifiers**: `@spec-auditor`, `@feasibility-checker` (parallel)

**Purpose**: Create zero-ambiguity specification at determined depth level.

**Depth Levels**:
- **L2**: Clear acceptance criteria, design decisions documented
- **L3**: API contracts, data schemas, explicit behaviors
- **L4**: Pseudocode-level detail for critical sections

**Steps**:
1. Write spec at determined depth (from Phase 1)
2. Define acceptance criteria (checkable, measurable, testable)
3. Document edge cases and error handling
4. Validate feasibility against codebase
5. Identify risks and unknowns

**Parallel Verification**:
- `@spec-auditor`: Gaps? Ambiguities? Contradictions?
- `@feasibility-checker`: Can this actually be built as specified?

**Output**: 
- `spec.md` - Full specification
- `acceptance.md` - Extracted checkable criteria
- `audit-report.md` - Verification results

**Gate**: HUMAN APPROVAL required

---

### Phase 3: DECOMPOSITION
**Agent**: `@decomposer`
**Verifiers**: `@coverage-auditor`, `@dependency-validator` (parallel)

**Purpose**: Break spec into implementable tasks with dependencies and parallelization strategy.

**Steps**:
1. Identify logical work units from spec
2. Size tasks appropriately:
   - Target: 1-2 hours of work per task
   - If larger: recursive decomposition into subtasks
3. Map dependencies (blocks, requires)
4. **Analyze parallelization**:
   - Track task dependencies via tickets
   - Detect file conflicts (tasks touching same files cannot parallelize)
   - Calculate critical path
5. Assign complexity scores per task

**Parallel Verification**:
- `@coverage-auditor`: Do tasks fully cover entire spec?
- `@dependency-validator`: Valid DAG? No cycles? Missing dependencies?

**Output**: `tasks.md` with:
- Task list with descriptions
- Dependencies between tasks
- Ticket dependencies
- Complexity scores
- File touch predictions

**Gate**: AUTOMATED (validation only)

---

### Phase 4: IMPLEMENTATION
**Agent**: `@implementer` (multiple instances via Ralph loops)
**Supporting**: `@context-manager`, `@alignment-checker`, `@quality-gate`

**Purpose**: Execute tasks with high confidence using Ralph Wiggum approach and MAKER-style decomposition.

**Configuration**:
```yaml
max_parallel_tasks: 3      # Simultaneous task Ralph loops
max_iterations_per_task: 10 # Before escalating to human
voting_agents: 3           # For MAKER-style voting
complete_signal: "<complete/>"
```

**Execution Model**:

```
Loop until all tickets complete:
  
  Spawn up to N Ralph loops in parallel for ready tickets (dependencies met):
  
  Ralph Loop for Task X:
    for iteration in 1..max_iterations:
      
      1. CONTEXT GENERATION (@context-manager)
         - Extract ONLY relevant spec sections
         - Extract ONLY acceptance criteria for this task
         - Include ONLY files to be modified
         - Include last N progress entries
         - Target: ~5-10K tokens
      
      2. MICRO-DECOMPOSITION (inside @implementer)
         - Break task into atomic steps
         - Each step = one clear action
         - Generate step sequence
      
      3. EXECUTION WITH VOTING
         For each micro-step:
           - Execute step
           - Self-verify: matches intent?
           - If complex/uncertain: spawn N voting agents
             - Each attempts independently
             - Majority wins (configurable N)
           - If failed: retry with correction
      
      4. VERIFICATION
         - @alignment-checker: code matches spec section?
         - Run tests (must pass)
         - @quality-gate: code quality acceptable?
      
      5. CI-GREEN ENFORCEMENT (mandatory)
         Before ANY commit:
         - npm run type-check ✓
         - npm run lint ✓
         - npm test ✓
         - Only commit if ALL pass
      
      6. PROGRESS UPDATE
         - Append to progress.md (what was done)
         - Commit with good message
      
      7. COMPLETION CHECK
         - If all acceptance criteria pass: emit <complete/>
         - Else: continue to next iteration
    
    If max_iterations reached: escalate to human

  When a ticket completes, check for newly unblocked tickets
  Continue until all tickets are complete
```

**Output per task**:
- Implemented code (committed)
- Test results
- Progress entries in `progress.md`
- Updated status in `tasks.md`

**Gate**: AUTOMATED (per-task verification)

---

### Phase 5: INTEGRATION
**Agent**: `@integrator`
**Verifiers**: `@spec-compliance`, `@regression-detector`, `@security-auditor` (parallel)

**Purpose**: Verify all pieces work together correctly.

**Steps**:
1. Run full test suite
2. Integration testing (cross-component flows)
3. Edge case testing (from spec)
4. Performance check (if applicable)

**Parallel Verification**:
- `@spec-compliance`: Does full output match full spec?
- `@regression-detector`: Existing functionality intact?
- `@security-auditor`: Vulnerabilities? (if applicable)

**If issues found**:
- Create bug entries in `tasks.md`
- Loop back to Phase 4 for targeted fixes

**Output**: `integration-report.md`
**Gate**: AUTOMATED (pass/fail, loops back on failure)

---

### Phase 6: COMPLETION
**Agent**: `@finalizer`

**Purpose**: Wrap up and prepare for merge.

**Steps**:
1. Generate summary (what was done, key decisions)
2. Update documentation if needed
3. Clean up work folder (archive or compact)
4. Create final commit(s) with good messages
5. If `manual_review` flag set: prepare review notes

**Output**: 
- `summary.md` 
- Ready-to-merge changes

**Gate**: HUMAN REVIEW (if flagged) or AUTO-COMPLETE

---

## Agent Definitions to Create

### Core Workflow Agents (in `~/.config/opencode/agent/`)

| Agent | File | Purpose |
|-------|------|---------|
| `@orchestrator` | `orchestrator.md` | Routes entry points, manages phase transitions |
| `@shaper` | `shaper.md` | Discovery, clarification, approach options |
| `@spec-writer` | `spec-writer.md` | Creates zero-ambiguity specifications |
| `@decomposer` | `decomposer.md` | Breaks specs into tasks with dependencies |
| `@implementer` | `implementer.md` | Executes tasks with micro-decomposition |
| `@integrator` | `integrator.md` | Verifies integration |
| `@finalizer` | `finalizer.md` | Completes work, generates summary |
| `@context-manager` | `context-manager.md` | Generates minimal context bundles |

### Verification Agents (invoked via Task tool)

| Agent | Purpose |
|-------|---------|
| `@spec-auditor` | Find gaps, ambiguities, contradictions in specs |
| `@feasibility-checker` | Validate spec against codebase constraints |
| `@coverage-auditor` | Ensure tasks cover entire spec |
| `@dependency-validator` | Validate task DAG, no cycles |
| `@alignment-checker` | Verify code matches spec section |
| `@quality-gate` | Check code quality, patterns |
| `@spec-compliance` | Full output matches full spec |
| `@regression-detector` | Existing tests still pass |
| `@security-auditor` | Security vulnerabilities (optional) |

---

## File Structure

```
.work/
├── config.yaml                    # Workflow configuration
├── index.md                       # Overview of all active work
│
├── features/
│   └── FEAT-001-user-auth/
│       ├── approach.md            # Approved direction (Phase 1)
│       ├── spec.md                # Full specification (Phase 2)
│       ├── acceptance.md          # Checkable criteria (Phase 2)
│       ├── audit-report.md        # Spec verification (Phase 2)
│       ├── tasks.md               # Task breakdown + dependencies (Phase 3)
│       ├── progress.md            # Append-only Ralph log (Phase 4)
│       ├── integration-report.md  # Integration results (Phase 5)
│       ├── summary.md             # Final summary (Phase 6)
│       ├── context/               # Auto-generated context bundles
│       │   ├── task-001-context.md
│       │   └── task-002-context.md
│       └── log.md                 # Detailed execution log
│
├── bugs/
│   └── BUG-042-safari-login/
│       ├── report.md
│       ├── analysis.md
│       ├── fix.md
│       └── tasks.md
│
└── archive/                       # Completed work (moved after done)
```

---

## Configuration

```yaml
# .work/config.yaml

workflow:
  max_parallel_tasks: 3        # Simultaneous Ralph loops
  voting_agents: 3             # For MAKER-style voting (configurable)

ralph:
  max_iterations_per_task: 10  # Before escalating to human
  complete_signal: "<complete/>"
  require_ci_green: true       # MUST pass tests before commit

context:
  max_tokens_per_task: 8000    # Target context bundle size
  progress_history: 10         # Last N entries to include
  prune_completed_tasks: true  # Only keep IDs of done tasks

gates:
  require_human:
    - shaping_approval         # After Phase 1
    - spec_approval            # After Phase 2
  optional_human:
    - final_review             # Per-feature flag

ci:
  type_check: "npm run type-check"
  lint: "npm run lint"
  test: "npm test"
  build: "npm run build"       # Optional

complexity:
  simple:
    max_tasks: 3
    spec_depth: L2
    enable_voting: false
  medium:
    max_tasks: 7
    spec_depth: L3
    enable_voting: true        # On uncertain steps
  complex:
    max_tasks: unlimited
    spec_depth: L4
    enable_voting: true        # On all complex steps
```

---

## Slash Commands to Create

| Command | Entry Point | Phases |
|---------|-------------|--------|
| `/feature <description>` | New feature | All 6 phases |
| `/bug <description>` | Bug fix | Phases 2,4,5,6 (simplified) |
| `/improve <description>` | Enhancement/refactor | All 6 phases (lighter spec) |
| `/plan-product` | Full product planning | Extended Phase 1 |
| `/ask <question>` | Research only | Phase 1 only, no implementation |

---

## Implementation Order

### Week 1: Foundation
1. Create folder structure and templates
   - `.work/` directory structure
   - Template files for spec.md, tasks.md, etc.
   - config.yaml
2. Create core agent definitions
   - `@orchestrator.md`
   - `@shaper.md`
   - `@spec-writer.md`
3. Create slash commands
   - `/feature`, `/bug`, `/improve`

### Week 2: Specification Flow
1. Implement `@spec-auditor`
2. Implement `@feasibility-checker`
3. Test end-to-end: input → approved spec
4. Create `acceptance.md` extraction logic

### Week 3: Decomposition
1. Implement `@decomposer`
2. Add parallelization analysis (ticket dependency tracking)
3. Implement `@coverage-auditor`
4. Implement `@dependency-validator`
5. Generate `tasks.md` with ticket dependencies

### Week 4-5: Implementation Engine
1. Implement `@context-manager`
2. Implement `@implementer` with:
   - Micro-decomposition
   - Voting mechanism (configurable N)
   - CI-green enforcement
3. Create Ralph loop bash script
4. Implement parallel ticket-based execution
5. Implement `@alignment-checker`
6. Implement `@quality-gate`

### Week 6: Integration & Completion
1. Implement `@integrator`
2. Implement `@spec-compliance`
3. Implement `@regression-detector`
4. Implement `@finalizer`
5. Full end-to-end testing

### Week 7: Polish
1. Error handling and recovery
2. Progress visibility improvements
3. Configuration refinement
4. Documentation

---

## Key Principles to Follow

1. **Minimal context per agent** - Each agent gets only what it needs
2. **Fresh slate per iteration** - Ralph loops start clean
3. **CI must be green** - Never commit broken code
4. **Verify proactively** - Don't wait until the end to find issues
5. **Progress persists** - Append-only logs survive crashes
6. **Parallel where independent** - Ticket-based dependency tracking
7. **Decompose until atomic** - Micro-steps should be trivial to execute
8. **Vote when uncertain** - Multiple attempts, majority wins

---

## Critical Implementation Notes

### Agent Prompt Requirements

Every agent prompt MUST include:
1. Clear role definition
2. What context it will receive
3. What output format is expected
4. Stop conditions (when to emit `<complete/>`)
5. Quality requirements (CI-green, etc.)
6. What to do on failure

### Ralph Loop Requirements

The Ralph loop MUST:
1. Generate fresh context each iteration
2. Pass context file to agent (not inline)
3. Check for `<complete/>` signal
4. Verify CI passes before allowing commit
5. Append to progress.md after each iteration
6. Handle max_iterations gracefully (escalate, don't crash)

### Voting Requirements

When voting is enabled:
1. Spawn N independent attempts (configurable, default 3)
2. Each attempt works in isolation
3. Compare results
4. Majority wins (or best if no majority)
5. Log voting outcome

### Context Bundle Requirements

Context bundles MUST:
1. Stay under token limit (target 8K)
2. Include ONLY relevant spec sections
3. Include ONLY files being modified
4. Include recent progress (last N entries)
5. Exclude completed task details (just IDs)

---

## Success Criteria

The system is working when:
1. A complex feature can run overnight and be mostly done by morning
2. Simple bugs can be fixed with zero human intervention (except final review)
3. Specs are comprehensive enough that implementation matches intent
4. CI is always green (no broken commits)
5. Progress survives session crashes
6. Parallel execution works without conflicts
7. Voting catches uncertain steps before they become bugs

---

## Start Here

Begin implementation with:

1. **Create the agent folder structure** in `~/.config/opencode/agent/`
2. **Create `@orchestrator.md`** - This is the entry point for everything
3. **Create the `.work/` folder structure** with templates
4. **Create the first slash command** (`/feature`)
5. **Test the flow manually** before automating

Once the foundation works, iterate to add more agents and capabilities.

---

**Questions to consider as you implement:**
- How will agents reference spec sections? (Markdown headers? Tags?)
- How will file conflicts be detected during parallel execution?
- How will the orchestrator know which phase to resume after a crash?
- What happens if a verification agent and implementer disagree?

Good luck! This is an ambitious system, but the architecture is sound. Build it incrementally, test each piece, and it will come together.

===============================================================================
===============================================================================

Section 2: 

## Auto Context Management

This is critical because:
1. Long tasks exhaust context windows
2. Agents get "context rot" - quality degrades as context fills
3. Each new agent run should start clean with only relevant context

### Context Management Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│  CONTEXT MANAGEMENT LAYER                                        │
│  "Right information, right time, right agent"                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PRINCIPLE: Each agent gets MINIMAL context to do its job       │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  @orchestrator context:                                     │ │
│  │  - Current phase and status                                 │ │
│  │  - Work item summary (not full spec)                        │ │
│  │  - Which agents to invoke                                   │ │
│  │  - Progress summary                                         │ │
│  │  Size: ~2K tokens                                           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  @implementer context (per task):                           │ │
│  │  - ONLY the relevant spec section                           │ │
│  │  - ONLY the acceptance criteria for this task               │ │
│  │  - ONLY the files it needs to touch                         │ │
│  │  - Previous task outcomes (summary)                         │ │
│  │  Size: ~5-10K tokens per task                               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  @micro-executor context (per step):                        │ │
│  │  - ONLY the single step to execute                          │ │
│  │  - ONLY the file being modified                             │ │
│  │  - Immediate context (function/class level)                 │ │
│  │  Size: ~1-3K tokens per step                                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Context Files Structure

```
.work/features/FEAT-001-user-auth/
├── spec.md                    # Full spec (loaded by @spec-writer, @spec-auditor)
├── acceptance.md              # Extracted criteria (loaded by verifiers)
├── tasks.md                   # Task breakdown with status
│
├── context/                   # AUTO-MANAGED context files
│   ├── summary.md             # 1-paragraph summary for @orchestrator
│   ├── task-001-context.md    # Context bundle for task 001
│   ├── task-002-context.md    # Context bundle for task 002
│   └── ...
│
├── progress.md                # Append-only progress log (Ralph-style)
└── log.md                     # Detailed execution log
```

### Context Bundle Generator

```
┌─────────────────────────────────────────────────────────────────┐
│  @context-manager (runs before each agent invocation)           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Before invoking any agent:                                      │
│  1. Determine what context that agent NEEDS                      │
│  2. Extract ONLY that context from source files                  │
│  3. Generate minimal context bundle                              │
│  4. Pass bundle to agent (not full files)                        │
│                                                                  │
│  Example for @implementer on Task 002:                           │
│                                                                  │
│  Input sources:                                                  │
│  - spec.md (section 2.3 only)                                    │
│  - acceptance.md (criteria 4-7 only)                             │
│  - tasks.md (task 002 details only)                              │
│  - progress.md (last 5 entries only)                             │
│  - src/auth/service.ts (the file to modify)                      │
│                                                                  │
│  Output: task-002-context.md (~3K tokens)                        │
│  Contains: Everything needed, nothing extra                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Context Pruning Rules

| Context Type | Keep | Prune |
|--------------|------|-------|
| Spec | Only sections relevant to current task | Other sections |
| Acceptance criteria | Only criteria for current task | Completed criteria, other tasks |
| Code files | Only files being modified | Unrelated files |
| Progress log | Last N entries (configurable) | Old entries |
| Task status | Current task + blockers | Completed tasks (just IDs) |
| Errors/Issues | Only if relevant to current work | Resolved issues |

---

## Ralph Wiggum Integration

This is brilliant for long-running autonomous execution. The key insight: **fresh context + clear stop condition + progress persistence = reliable long-running agents**.

### Where Ralph Fits

Looking at the options:

| Level | Pros | Cons |
|-------|------|------|
| **Micro-tasks** | Most granular, highest reliability | Overhead of bash loop per micro-step |
| **Tasks** | Good balance, natural unit of work | Some tasks may still be too large |
| **Orchestrator** | Simplest implementation | May try to do too much per iteration |

**My recommendation: TASK LEVEL with micro-decomposition inside**

```
┌─────────────────────────────────────────────────────────────────┐
│  RALPH WIGGUM @ TASK LEVEL                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Each task runs in a fresh agent session:                        │
│                                                                  │
│  bash loop (max N iterations per task):                          │
│    1. Load task-specific context bundle                          │
│    2. Run @implementer with clean slate                          │
│    3. Agent does micro-decomposition internally                  │
│    4. Agent implements, tests, commits                           │
│    5. Agent appends to progress.md                               │
│    6. Check for <complete/> signal                               │
│    7. If not complete, loop with fresh context                   │
│                                                                  │
│  Stop conditions:                                                │
│  - Agent emits <complete/>                                       │
│  - All acceptance criteria pass                                  │
│  - Max iterations reached (escalate to human)                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Why Task Level (Not Micro or Orchestrator)

**Task level is the sweet spot because:**

1. **Natural work boundary** - Tasks are already sized for ~1-2 hours
2. **Clear acceptance criteria** - Each task has testable completion conditions
3. **Independent commits** - Each task can be a clean commit
4. **Parallelizable** - Multiple task loops can run simultaneously
5. **Recoverable** - If one task fails, others continue

**Micro-level Ralph would be overkill:**
- Too much bash loop overhead
- Micro-steps are already verified inline
- Context is already minimal at micro level

**Orchestrator-level Ralph would be risky:**
- Too much scope per iteration
- Context rot across phases
- Hard to define clear stop condition

### The Ralph Loop Implementation

```bash
#!/bin/bash
# ralph-task.sh - Run a single task to completion

TASK_ID="$1"
MAX_ITERATIONS="${2:-10}"
FEATURE_DIR=".work/features/$FEATURE_ID"

for i in $(seq 1 $MAX_ITERATIONS); do
    echo "=== Ralph iteration $i for $TASK_ID ==="
    
    # 1. Generate fresh context bundle
    opencode --agent @context-manager \
        --prompt "Generate context bundle for task $TASK_ID"
    
    # 2. Run implementer with clean slate
    RESULT=$(opencode --agent @implementer \
        --context "$FEATURE_DIR/context/$TASK_ID-context.md" \
        --prompt "Implement task $TASK_ID. 
                  When complete with all acceptance criteria passing, 
                  emit <complete/>.
                  Always commit working code.
                  Always run tests before committing.
                  Append progress to progress.md.")
    
    # 3. Check for completion
    if echo "$RESULT" | grep -q "<complete/>"; then
        echo "Task $TASK_ID complete!"
        # Update task status
        opencode --agent @orchestrator \
            --prompt "Mark task $TASK_ID as complete in tasks.md"
        exit 0
    fi
    
    # 4. Check if tests pass (safety net)
    if ! npm test 2>/dev/null; then
        echo "Tests failing, continuing to next iteration"
    fi
done

echo "Max iterations reached for $TASK_ID - escalating to human"
exit 1
```

### Parallel Ralph Execution

```
┌─────────────────────────────────────────────────────────────────┐
│  TICKET EXECUTOR (coordinates parallel Ralph loops)             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Tickets with no blockers: [Task A, Task B, Task C]              │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Ralph(A)    │  │ Ralph(B)    │  │ Ralph(C)    │              │
│  │ iteration 1 │  │ iteration 1 │  │ iteration 1 │              │
│  │ iteration 2 │  │ iteration 2 │  │ <complete/> │ ← done       │
│  │ <complete/> │  │ iteration 3 │  └─────────────┘              │
│  └─────────────┘  │ <complete/> │         │                     │
│        │         └─────────────┘         │                     │
│        │                │                 │                     │
│        └────────────────┴─────────────────┘                     │
│                         │                                        │
│                         ▼                                        │
│  Task D (blocked by A) and Task E (blocked by B) now unblocked  │
│  Start immediately as dependencies complete                      │
│                                                                  │
│  Loop continues until all tickets complete                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Progress.md Format (Ralph-style)

```markdown
# Progress Log - FEAT-001 User Authentication

## 2025-01-03 14:23 - Task 001 - Iteration 1
Agent: @implementer
Action: Created User model with id, email, password_hash fields
Files: src/models/user.ts (created)
Tests: 3 passing
Commit: abc123

## 2025-01-03 14:31 - Task 001 - Iteration 2  
Agent: @implementer
Action: Added email validation, password length check
Files: src/models/user.ts (modified)
Tests: 5 passing
Commit: def456
Status: <complete/>

## 2025-01-03 14:35 - Task 002 - Iteration 1
Agent: @implementer
Action: Created AuthService skeleton with hashPassword
Files: src/services/auth.ts (created)
Tests: 2 passing (3 pending)
Commit: ghi789

## 2025-01-03 14:42 - Task 002 - Iteration 2
Agent: @implementer
Action: Implemented verifyPassword, login method
Files: src/services/auth.ts (modified)
Tests: 5 passing
Commit: jkl012
Status: <complete/>
```

### CI-Green Enforcement

```
┌─────────────────────────────────────────────────────────────────┐
│  PRE-COMMIT VERIFICATION (mandatory)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Before ANY commit, agent MUST:                                  │
│                                                                  │
│  1. Run type check:  npm run type-check                          │
│  2. Run linter:      npm run lint                                │
│  3. Run tests:       npm test                                    │
│  4. Run build:       npm run build (if applicable)               │
│                                                                  │
│  If ANY fail:                                                    │
│  - DO NOT commit                                                 │
│  - Fix the issue                                                 │
│  - Retry verification                                            │
│  - Only commit when green                                        │
│                                                                  │
│  This is ENFORCED in agent prompts, not optional                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Updated Complete Architecture

```
╔═══════════════════════════════════════════════════════════════════╗
║                     COMPLETE WORKFLOW ARCHITECTURE                 ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  ┌──────────────────────────────────────────────────────────────┐ ║
║  │  @orchestrator                                                │ ║
║  │  - Routes entry points                                        │ ║
║  │  - Manages phase transitions                                  │ ║
║  │  - Minimal context (summary only)                             │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                              │                                     ║
║        ┌─────────────────────┼─────────────────────┐              ║
║        ▼                     ▼                     ▼              ║
║  ┌───────────┐        ┌───────────┐        ┌───────────┐         ║
║  │  PHASE 1  │        │  PHASE 2  │        │  PHASE 3  │         ║
║  │  Shaping  │───────▶│   Spec    │───────▶│  Decomp   │         ║
║  │           │        │           │        │           │         ║
║  │ @shaper   │        │@spec-writer│       │@decomposer│         ║
║  │           │        │@spec-audit │       │@coverage  │         ║
║  │           │        │@feasibility│       │@dep-valid │         ║
║  │           │        │           │        │           │         ║
║  │  HUMAN ✓  │        │  HUMAN ✓  │        │  AUTO ✓   │         ║
║  └───────────┘        └───────────┘        └───────────┘         ║
║                                                   │                ║
║                                                   ▼                ║
║  ┌──────────────────────────────────────────────────────────────┐ ║
║  │  PHASE 4: IMPLEMENTATION (Ralph Wiggum @ Task Level)         │ ║
║  │                                                               │ ║
║  │  ┌─────────────────────────────────────────────────────────┐ │ ║
║  │  │  @context-manager                                        │ │ ║
║  │  │  - Generates minimal context bundle per task             │ │ ║
║  │  │  - Extracts only relevant spec sections                  │ │ ║
║  │  │  - Includes only files to be modified                    │ │ ║
║  │  └─────────────────────────────────────────────────────────┘ │ ║
║  │                              │                                │ ║
║  │                              ▼                                │ ║
║  │  Ticket Executor (parallel tasks by dependency)               │ ║
║  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │ ║
║  │  │ Ralph(T1)   │  │ Ralph(T2)   │  │ Ralph(T3)   │          │ ║
║  │  │             │  │             │  │             │          │ ║
║  │  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │          │ ║
║  │  │ │ Fresh   │ │  │ │ Fresh   │ │  │ │ Fresh   │ │          │ ║
║  │  │ │ Context │ │  │ │ Context │ │  │ │ Context │ │          │ ║
║  │  │ └────┬────┘ │  │ └────┬────┘ │  │ └────┬────┘ │          │ ║
║  │  │      ▼      │  │      ▼      │  │      ▼      │          │ ║
║  │  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │          │ ║
║  │  │ │@implmtr │ │  │ │@implmtr │ │  │ │@implmtr │ │          │ ║
║  │  │ │ micro-  │ │  │ │ micro-  │ │  │ │ micro-  │ │          │ ║
║  │  │ │ decomp  │ │  │ │ decomp  │ │  │ │ decomp  │ │          │ ║
║  │  │ │ +voting │ │  │ │ +voting │ │  │ │ +voting │ │          │ ║
║  │  │ └────┬────┘ │  │ └────┬────┘ │  │ └────┬────┘ │          │ ║
║  │  │      ▼      │  │      ▼      │  │      ▼      │          │ ║
║  │  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │          │ ║
║  │  │ │Verify   │ │  │ │Verify   │ │  │ │Verify   │ │          │ ║
║  │  │ │CI Green │ │  │ │CI Green │ │  │ │CI Green │ │          │ ║
║  │  │ │Commit   │ │  │ │Commit   │ │  │ │Commit   │ │          │ ║
║  │  │ └────┬────┘ │  │ └────┬────┘ │  │ └────┬────┘ │          │ ║
║  │  │      ▼      │  │      ▼      │  │      ▼      │          │ ║
║  │  │ <complete/> │  │ Loop or    │  │ <complete/> │          │ ║
║  │  │     ?       │  │ <complete/>│  │     ?       │          │ ║
║  │  └─────────────┘  └─────────────┘  └─────────────┘          │ ║
║  │                                                               │ ║
║  │  Progress.md ← append after each iteration                    │ ║
║  │                                                               │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                              │                                     ║
║                              ▼                                     ║
║  ┌───────────┐        ┌───────────┐                               ║
║  │  PHASE 5  │        │  PHASE 6  │                               ║
║  │Integration│───────▶│ Complete  │                               ║
║  │           │        │           │                               ║
║  │@integrator│        │@finalizer │                               ║
║  │@spec-compl│        │           │                               ║
║  │@regression│        │  HUMAN?   │                               ║
║  │           │        │ (if flag) │                               ║
║  │  AUTO ✓   │        │           │                               ║
║  └───────────┘        └───────────┘                               ║
║                                                                    ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## Configuration Update

```yaml
# .work/config.yaml

workflow:
  max_parallel_tasks: 3
  voting_agents: 3

ralph:
  max_iterations_per_task: 10    # Before escalating to human
  complete_signal: "<complete/>"
  require_ci_green: true         # MUST pass tests before commit
  
context:
  max_tokens_per_task: 8000      # Target context size
  progress_history: 10           # Last N entries to include
  prune_completed_tasks: true    # Only keep IDs of done tasks
  
gates:
  require_human:
    - shaping_approval
    - spec_approval
  optional_human:
    - final_review               # Per-feature flag

ci:
  type_check: "npm run type-check"
  lint: "npm run lint"
  test: "npm test"
  build: "npm run build"         # Optional
```

---

## Summary: What We've Built

The complete system now has:

| Component | Purpose |
|-----------|---------|
| **@orchestrator** | Routes work, manages phases, minimal context |
| **Phase 1-3** | Shaping → Spec → Decomposition (front-loaded quality) |
| **@context-manager** | Generates minimal context bundles per task |
| **Ralph loops @ task level** | Fresh context, clean slate, iterate until done |
| **Ticket-based parallel execution** | Independent tasks run simultaneously based on dependencies |
| **MAKER-style voting** | Complex steps get N parallel attempts |
| **Verification agents** | Check each phase proactively |
| **CI-green enforcement** | Only commit working code |
| **Progress.md** | Append-only log for continuity |
| **Minimal human gates** | Just approach + spec approval |

### Key Innovations

1. **Context never rots** - Fresh bundle per task iteration
2. **Work is sized correctly** - Tasks are ~1-2 hours, micro-steps are atomic
3. **Parallel where possible** - Ticket-based dependency tracking
4. **Long-running is safe** - Ralph loops with clear stop conditions
5. **Quality is enforced** - CI must pass before any commit
6. **Progress persists** - Even if agent crashes, progress.md survives

---

## Remaining Decisions

### 1. Folder Structure

Going with Option A (folder per feature)?

```
.work/features/FEAT-001-user-auth/
├── spec.md
├── acceptance.md
├── tasks.md
├── progress.md
├── context/
│   └── task-XXX-context.md
└── log.md
```
