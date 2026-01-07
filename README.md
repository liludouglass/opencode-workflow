# OpenCode Workflow

A comprehensive agentic workflow system for [OpenCode](https://opencode.ai), implementing a 6-phase spec-driven development approach with the Ralph Wiggum execution pattern.

## Quick Start

### Install Everything
```bash
./install.sh --only bundle:full-workflow
```

### Install Just One Plugin and One Agent
```bash
./install.sh --only plugin:ralph-wiggum,agent:implementer
```

### Install Just the Agent Workflow (No Plugins)
```bash
./install.sh --only bundle:core
```

### See What's Available
```bash
./install.sh --list
```

### Preview Before Installing
```bash
./install.sh --only bundle:core --dry-run
```

## Installation Options

The installer is the **PRIMARY feature** of this repository, designed for selective, safe installation:

| Flag | Description |
|------|-------------|
| `--only <components>` | **PRIMARY**: Install only specified components (comma-separated) |
| `--list` | List all available components and bundles |
| `--dry-run` | Preview changes without making any modifications |
| `--backup` | Backup existing files to `~/.config/opencode/.backup/` before replacing |
| `--force` | Overwrite conflicting files without prompting |

## Component Naming Convention

```
agent:<name>      # e.g., agent:orchestrator, agent:implementer
command:<name>    # e.g., command:feature, command:ralph
plugin:<name>     # e.g., plugin:ralph-wiggum, plugin:context-manager
skill:<name>      # e.g., skill:wf-orchestrate, skill:std-api
tool:<name>       # e.g., tool:count_tokens
bundle:<name>     # e.g., bundle:core, bundle:full-workflow
templates         # Workflow templates (.work directory)
```

## Available Bundles

| Bundle | Contents |
|--------|----------|
| `bundle:core` | Orchestrator, coordination-files, shaper agents + feature/setup/status commands |
| `bundle:full-workflow` | All agents, commands, skills, plugins, tools, and templates |
| `bundle:plugins-only` | All plugins |
| `bundle:ralph` | Ralph-Wiggum pattern (ralph-wiggum plugin + implementer agent + ralph command) |
| `bundle:research` | Research workflow (research/youtube agents + tools) |
| `bundle:agents-only` | All agents |
| `bundle:commands-only` | All commands |
| `bundle:skills-only` | All skills |
| `bundle:tools-only` | All tools |

## Safety Features

The installer **MERGES instead of REPLACES** - no `rm -rf` on user files:

- **Conflict detection**: Warns when a file exists that isn't already linked to this repo
- **Symlink detection**: Safely skips files already linked to this repo  
- **Backup support**: Use `--backup` to save existing files before replacing
- **Dry run**: Preview all changes with `--dry-run` before committing
- **Force override**: Use `--force` only when you want to replace conflicts

### Output Examples

```
Installing OpenCode Workflow Components...

Selected: plugin:ralph-wiggum, agent:implementer

[INSTALL] agent:implementer -> ~/.config/opencode/agent/implementer.md
[SKIP] plugin:ralph-wiggum (already linked to this repo)
[CONFLICT] agent:orchestrator.md exists (use --force to replace, --backup to save first)

Installed: 1 | Skipped: 1 | Conflicts: 1
```

## More Examples

```bash
# Install core workflow only
./install.sh --only bundle:core

# Install Ralph execution pattern
./install.sh --only bundle:ralph

# Install specific components with backup
./install.sh --only agent:orchestrator,plugin:context-manager --backup

# Preview full installation
./install.sh --only bundle:full-workflow --dry-run

# Install research workflow
./install.sh --only bundle:research

# Install all skills but no agents
./install.sh --only bundle:skills-only

# Force replace conflicts with backup
./install.sh --only bundle:core --force --backup
```

## Overview

This repository contains customizations for OpenCode that enable:

- **6-Phase Workflow**: Shaping -> Specification -> Decomposition -> Implementation -> Integration -> Completion
- **Ralph Wiggum Execution**: Fresh context iterations with clear stop conditions
- **Parallel Task Execution**: Ticket-based dependency tracking for parallel task execution
- **CI-Green Enforcement**: Mandatory passing tests before commits
- **Context Management**: Minimal, focused context bundles per task

## Structure

```
opencode-workflow/
|-- agent/                    # Custom AI agents
|   |-- orchestrator.md       # Main workflow coordinator
|   |-- implementer.md        # Task execution agent
|   |-- shaper.md             # Phase 1: Requirements shaping
|   |-- spec-writer.md        # Phase 2: Specification writing
|   |-- ...
|
|-- command/                  # Custom slash commands
|   |-- feature.md            # /feature - Start new feature
|   |-- bug.md                # /bug - Fix a bug
|   |-- ralph.md              # /ralph - Run Ralph loop on task
|   |-- ...
|
|-- plugin/                   # TypeScript plugins
|   |-- visual-feedback/      # Visual feedback plugin
|   |-- ralph-wiggum/         # Ralph execution plugin
|   |-- context-manager/      # Context management plugin
|   |-- ...
|
|-- skill/                    # Workflow skills
|   |-- wf-orchestrate/       # Orchestration guide
|   |-- std-api/              # API standards
|   |-- ...
|
|-- tool/                     # Custom tools
|   |-- count_tokens.py       # Token counting utility
|   |-- google_search.py      # Web search
|   |-- ...
|
|-- templates/                # Workflow templates
|   |-- .work/
|       |-- config.yaml       # Default workflow configuration
|       |-- templates/        # File templates
|
|-- install.sh                # Modular installation script
|-- uninstall.sh              # Removal script
|-- README.md
```

## The 6-Phase Workflow

```
Phase 1: SHAPING       -> @shaper           -> HUMAN GATE (approve approach)
Phase 2: SPECIFICATION -> @spec-writer      -> HUMAN GATE (approve spec)
Phase 3: DECOMPOSITION -> @decomposer       -> AUTO (validation only)
Phase 4: IMPLEMENTATION -> Ralph loops      -> AUTO (per-task verification)
Phase 5: INTEGRATION   -> @integrator       -> AUTO (loops back on failure)
Phase 6: COMPLETION    -> @finalizer        -> HUMAN GATE (if flagged)
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
2. Run `./install.sh --only agent:my-agent` to symlink
3. Use `@my-agent` in OpenCode

### Adding a Plugin

1. Create `plugin/my-plugin/index.ts`
2. Add `package.json` with dependencies
3. Run `./install.sh --only plugin:my-plugin` to symlink
4. Restart OpenCode

## Uninstallation

```bash
./uninstall.sh
```

## License

MIT

## Credits

- [Ralph Wiggum Technique](https://ghuntley.com/ralph/) by Geoffrey Huntley
- [MAKER Paper](https://arxiv.org/abs/2511.09030) - Multi-agent decomposition
- [OpenCode](https://opencode.ai) - The AI coding assistant