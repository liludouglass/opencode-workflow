# 🚀 OpenCode Workflow

**Stop watching AI spin in circles.** This workflow system makes Claude actually finish what it starts.

## The Problem

AI coding assistants are powerful but unreliable. They:
- Lose context mid-task and forget what they were doing
- Skip steps and leave features half-implemented
- Don't know when they're actually done
- Can't handle complex multi-file changes

## The Solution

A **6-phase workflow** that guides AI through complex features from idea to completion, with:

- ✅ **Human approval gates** - You stay in control of direction
- ✅ **Automatic task decomposition** - Complex work broken into parallel tracks
- ✅ **Fresh context per task** - No more context rot or forgotten goals
- ✅ **CI-green enforcement** - Nothing ships until tests pass
- ✅ **Progress persistence** - Survives crashes, continues where it left off

## Try It in 60 Seconds

```bash
# 1. Clone the repo
git clone https://github.com/liludouglass/opencode-workflow.git
cd opencode-workflow

# 2. Install to OpenCode
./install.sh

# 3. Open your project in OpenCode and say:
```

```
Add user authentication with Google OAuth
```

That's it. The orchestrator takes over:

```
Phase 1: SHAPING       → Clarifies requirements, proposes approaches
                         ⏸️ HUMAN GATE: Approve direction

Phase 2: SPECIFICATION → Creates detailed spec with acceptance criteria
                         ⏸️ HUMAN GATE: Approve spec

Phase 3: DECOMPOSITION → Breaks work into parallel tasks with dependencies

Phase 4: IMPLEMENTATION → Executes tasks in parallel, fresh context each

Phase 5: INTEGRATION   → Verifies everything works together

Phase 6: COMPLETION    → Summarizes changes, ready to merge
```

## How It Works

### 🎯 Human Gates Keep You in Control

You approve the **direction** (Phase 1) and **spec** (Phase 2). After that, it's autonomous until completion.

```
You: "Add dark mode"

AI: "I've analyzed your codebase. Here are two approaches:

     Option A: CSS variables (simpler, 2-3 tasks)
     Option B: Theme provider (more flexible, 4-5 tasks)
     
     I recommend Option A. Approve?"

You: "approved"

AI: [Writes spec, decomposes into tasks, implements, tests, done]
```

### 🔄 Fresh Context = No More "Forgetting"

Each task gets a **minimal, focused context bundle** (~5K tokens) containing only:
- The specific spec section for this task
- Files being modified
- Acceptance criteria to check

No accumulated garbage. No "wait, what was I doing?"

### ⚡ Parallel Execution

Independent tasks run simultaneously:

```
TASK-001: Create User model     ─┐
TASK-002: Add password hashing  ─┼─► run in parallel
TASK-003: Setup OAuth config    ─┘
              │
              ▼
TASK-004: Implement AuthService  ─► waits for 001-003
              │
              ▼
TASK-005: Add login endpoint     ─► waits for 004
```

### 🛡️ CI-Green Enforcement

Nothing gets committed until:
- TypeScript compiles ✓
- Linter passes ✓
- Tests pass ✓

No more "it works on my machine" from AI.

## Installation

### Full Workflow (Recommended)
```bash
./install.sh
```

### Just the Core Agents
```bash
./install.sh --only bundle:core
```

### Preview First
```bash
./install.sh --dry-run
```

### See All Options
```bash
./install.sh --list
```

## Commands

| Command | What it does |
|---------|--------------|
| `/feature <description>` | Start a new feature (full 6 phases) |
| `/bug <description>` | Fix a bug (streamlined phases) |
| `/improve <description>` | Refactor/enhance existing code |
| `/status` | Check current workflow progress |

Or just describe what you want naturally—the orchestrator figures it out.

## Prerequisites

1. **[OpenCode](https://opencode.ai)** - The AI coding CLI this extends
2. **[Ticket CLI](https://github.com/wedow/ticket)** - Task tracking (install via `brew install wedow/tools/ticket`)

## The Agents

| Agent | Role |
|-------|------|
| `@orchestrator` | Routes requests, manages phases |
| `@shaper` | Clarifies requirements, proposes approaches |
| `@spec-writer` | Creates detailed specifications |
| `@decomposer` | Breaks specs into parallel tasks |
| `@implementer` | Executes individual tasks |
| `@integrator` | Verifies components work together |
| `@finalizer` | Wraps up and prepares summary |

Plus verification agents: `@coverage-auditor`, `@quality-gate`, `@security-auditor`, and more.

## Configuration

Customize in your project's `.opencode/config.yaml`:

```yaml
workflow:
  max_parallel_tasks: 3    # How many tasks run simultaneously

ralph:
  max_iterations: 10       # Retries before escalating to human
  require_ci_green: true   # Enforce passing tests

context:
  max_tokens: 8000         # Context budget per task
```

## Why "Ralph Wiggum"?

Named after [Geoffrey Huntley's technique](https://ghuntley.com/ralph/) for reliable AI task completion:

> "Give the AI fresh context each iteration. Let it run until it says it's done. If it can't finish in N tries, escalate to a human."

Simple but powerful.

## Credits

- [Ralph Wiggum Technique](https://ghuntley.com/ralph/) by Geoffrey Huntley
- [MAKER Paper](https://arxiv.org/abs/2511.09030) - Multi-agent decomposition research
- [OpenCode](https://opencode.ai) - The AI coding assistant this extends

## License

MIT

---

**Questions?** Open an issue or ping [@liludouglass](https://github.com/liludouglass)