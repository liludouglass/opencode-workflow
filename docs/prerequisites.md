# Prerequisites

## Ticket CLI (Required)

The workflow uses Ticket for task management. Install before using the workflow.

### Installation

```bash
# macOS
brew install wedow/tools/ticket

# From source
git clone https://github.com/wedow/ticket
cd ticket
sudo cp ticket /usr/local/bin/
```

### Verify Installation

```bash
tk --version
tk init  # In project directory to create .tickets/
```

### Key Commands

| Command | Purpose |
|---------|---------|
| `tk create "<title>" --type task` | Create task ticket |
| `tk create "<title>" --type epic` | Create epic (feature container) |
| `tk create "<title>" --type deferred` | Create deferred item |
| `tk start <id>` | Mark task in progress |
| `tk close <id>` | Mark task complete |
| `tk dep <id> <dep-id>` | Add dependency |
| `tk ready` | List tasks ready to work on |
| `tk blocked` | List blocked tasks |
| `tk query '<jq-filter>'` | Query tickets with JQ |
| `tk dep tree <id>` | Show dependency tree |

### Directory Placement

For our workflow, tickets are created per-feature:
```
.opencode/spec/FEAT-001-user-auth/tickets/
```

Use `--dir` flag: `tk create "Task" --type task --dir .opencode/spec/FEAT-XXX/tickets`

## Other Requirements

- Git (for version control)
- Node.js or Python (depending on project type)
- OpenCode CLI configured