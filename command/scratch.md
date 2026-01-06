---
description: "Manage scratchpad for persistent notes across sessions"
---

# Scratchpad Management

Manage the project scratchpad at `.opencode/scratchpad.md` for persistent context.

## Action: $1

### If action is "show" or empty:
Read and display `.opencode/scratchpad.md` contents.

### If action is "add":
Append the following to `.opencode/scratchpad.md`:

```
## $2
Added: !`date +%Y-%m-%d`

$ARGUMENTS
```

### If action is "clear":
Ask for confirmation, then reset `.opencode/scratchpad.md` to empty template.

### If action is "summary":
Read `.opencode/scratchpad.md` and provide a concise summary of all notes.

## Scratchpad Template

If file doesn't exist, create with:

```markdown
# Project Scratchpad

Persistent notes and context for this project.

---

```

## Usage Examples

- `/scratch` - Show current scratchpad
- `/scratch add "API Design"` - Add a new section
- `/scratch clear` - Reset scratchpad
- `/scratch summary` - Get summary of all notes
