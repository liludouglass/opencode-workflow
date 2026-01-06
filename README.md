# OpenCode Workflow

A comprehensive agentic workflow system for [OpenCode](https://opencode.ai), implementing a 6-phase spec-driven development approach with the Ralph Wiggum execution pattern.

## Overview

This repository contains customizations for OpenCode that enable:

- **6-Phase Workflow**: Shaping → Specification → Decomposition → Implementation → Integration → Completion
- **Ralph Wiggum Execution**: Fresh context iterations with clear stop conditions
- **Parallel Task Execution**: Wave-based coordination for independent tasks
- **CI-Green Enforcement**: Mandatory passing tests before commits
- **Context Management**: Minimal, focused context bundles per task

## Installation

```bash
# Clone the repository
git clone git@github.com:liludouglass/opencode-workflow.git ~/code/opencode-workflow

# Run the installer (creates symlinks to ~/.config/opencode/)
cd ~/code/opencode-workflow
./install.sh
```

## Structure

```
opencode-workflow/
├── agent/                    # Custom AI agents
│   ├── orchestrator.md       # Main workflow coordinator
│   ├── implementer.md        # Task execution agent
│   ├── shaper.md             # Phase 1: Requirements shaping
│   ├── spec-writer.md        # Phase 2: Specification writing
│   └── ...
│
├── command/                  # Custom slash commands
│   ├── feature.md            # /feature - Start new feature
│   ├── bug.md                # /bug - Fix a bug
│   ├── ralph.md              # /ralph - Run Ralph loop on task
│   └── ...
│
├── plugin/                   # TypeScript plugins
│   ├── ralph-wiggum/         # Task execution engine
│   │   ├── index.ts
│   │   ├── task-executor.ts
│   │   ├── wave-coordinator.ts
│   │   └── ci-enforcer.ts
│   │
│   └── context-manager/      # Context bundle generation
│       ├── index.ts
│       └── bundle-generator.ts
│
├── skill/                    # Workflow skills
│   ├── wf-implement-tasks/   # Phase 4 implementation guide
│   ├── wf-shaping/           # Phase 1 shaping guide
│   └── ...
│
├── tool/                     # Custom tools
│   └── count_tokens.py       # Token counting utility
│
├── templates/                # Workflow templates
│   └── .work/
│       ├── config.yaml       # Default workflow configuration
│       └── templates/        # File templates
│
├── install.sh                # Installation script
├── uninstall.sh              # Removal script
└── README.md
```

## The 6-Phase Workflow

```
Phase 1: SHAPING      → @shaper           → HUMAN GATE (approve approach)
Phase 2: SPECIFICATION → @spec-writer     → HUMAN GATE (approve spec)
Phase 3: DECOMPOSITION → @decomposer      → AUTO (validation only)
Phase 4: IMPLEMENTATION → Ralph loops      → AUTO (per-task verification)
Phase 5: INTEGRATION   → @integrator      → AUTO (loops back on failure)
Phase 6: COMPLETION    → @finalizer       → HUMAN GATE (if flagged)
```

## Ralph Wiggum Execution Pattern

The Ralph Wiggum approach ensures reliable task completion through:

1. **Fresh Context**: Each iteration starts with minimal, focused context
2. **Clear Stop Condition**: `<complete/>` signal indicates task completion
3. **Progress Persistence**: Append-only `progress.md` survives crashes
4. **CI Enforcement**: Tests must pass before any commit

```
for iteration in 1..max_iterations:
    1. Generate fresh context bundle (~5-10K tokens)
    2. Invoke @implementer with clean slate
    3. Check for <complete/> signal
    4. Enforce CI-green before commit
    5. Append to progress.md
    
If max_iterations reached: escalate to human
```

## Plugins

### ralph-wiggum

Task-level execution engine with:
- Single task Ralph loops
- Wave-based parallel execution
- CI enforcement (bun test, lint, type-check)
- Progress logging

### context-manager

Context bundle generation with:
- Spec section extraction
- Acceptance criteria filtering
- Token budget management
- Sliding window for progress history

## Configuration

Global defaults in `templates/.work/config.yaml`:

```yaml
workflow:
  max_parallel_tasks: 3

ralph:
  max_iterations_per_task: 10
  complete_signal: "<complete/>"
  require_ci_green: true

context:
  max_tokens_per_task: 8000
  progress_history: 10

ci:
  type_check: "bun run type-check"
  lint: "bun run lint"
  test: "bun test"
```

Project-specific overrides in `<project>/.opencode/config.yaml`.

## Usage

### Start a New Feature

```bash
# In OpenCode
/feature Add user authentication with OAuth2
```

### Fix a Bug

```bash
/bug Login fails on Safari when clicking submit
```

### Run Ralph Loop on Specific Task

```bash
/ralph TASK-001
```

## Development

### Adding a New Agent

1. Create `agent/my-agent.md` with YAML frontmatter
2. Run `./install.sh` to symlink
3. Use `@my-agent` in OpenCode

### Adding a Plugin

1. Create `plugin/my-plugin/index.ts`
2. Add `package.json` with dependencies
3. Run `./install.sh` to symlink
4. Restart OpenCode

## License

MIT

## Credits

- [Ralph Wiggum Technique](https://ghuntley.com/ralph/) by Geoffrey Huntley
- [MAKER Paper](https://arxiv.org/abs/2511.09030) - Multi-agent decomposition
- [OpenCode](https://opencode.ai) - The AI coding assistant
