---
description: Initialize .opencode/ project structure with profile-based standards
---

# /setup Command

Initialize the `.opencode/` project structure in the current working directory.

## Usage

```
/setup [profile]
```

**Profiles:** `web`, `mobile`, `api`, `cli` (default: `web`)

## Your Task

Create the folder structure and skeleton files based on the selected profile.

### Step 1: Create Directories

Use a single `bash` command with `mkdir -p`. The folders depend on the profile:

**web** (default):
```bash
mkdir -p .opencode/product .opencode/specs .opencode/memory .opencode/standards/global .opencode/standards/backend .opencode/standards/frontend .opencode/standards/testing
```

**mobile**:
```bash
mkdir -p .opencode/product .opencode/specs .opencode/memory .opencode/standards/global .opencode/standards/mobile .opencode/standards/backend .opencode/standards/testing
```

**api**:
```bash
mkdir -p .opencode/product .opencode/specs .opencode/memory .opencode/standards/global .opencode/standards/backend .opencode/standards/testing
```

**cli**:
```bash
mkdir -p .opencode/product .opencode/specs .opencode/memory .opencode/standards/global .opencode/standards/cli .opencode/standards/testing
```

### Step 2: Create Skeleton Files

Create all skeleton files using the `write` tool. Use the templates below.

#### Product Files (all profiles)

**.opencode/product/mission.md**:
```markdown
# Mission

## Vision
<!-- What does success look like? What future are we building toward? -->

## Users
<!-- Who are we building this for? What are their needs and pain points? -->

## Differentiators
<!-- What makes this different from alternatives? Why will users choose this? -->

## Non-Goals
<!-- What are we explicitly NOT building? What's out of scope? -->
```

**.opencode/product/roadmap.md**:
```markdown
# Roadmap

## Current Phase
<!-- What are we working on right now? -->

## Upcoming
<!-- What's next after the current phase? -->

| Priority | Feature | Status | Notes |
|----------|---------|--------|-------|
| P0 | | planned | |
| P1 | | planned | |
| P2 | | planned | |

## Completed
<!-- What has been shipped? -->
```

**.opencode/product/tech-stack.md** (varies by profile):

**web**:
```markdown
# Tech Stack

## Frontend
<!-- Framework, styling, state management -->

## Backend
<!-- Language, framework, API style -->

## Database
<!-- Primary database, caching, search -->

## Infrastructure
<!-- Hosting, CI/CD, monitoring -->

## Key Libraries
<!-- Important dependencies and why they were chosen -->
```

**mobile**:
```markdown
# Tech Stack

## Mobile Framework
<!-- React Native, Flutter, Swift, Kotlin, etc. -->

## Navigation
<!-- Navigation library and patterns -->

## State Management
<!-- State management approach -->

## Backend/API
<!-- Backend services, API style -->

## Native Modules
<!-- Any native code requirements -->

## Key Libraries
<!-- Important dependencies and why they were chosen -->
```

**api**:
```markdown
# Tech Stack

## Language & Framework
<!-- Primary language and API framework -->

## API Style
<!-- REST, GraphQL, gRPC, etc. -->

## Database
<!-- Primary database, caching, search -->

## Authentication
<!-- Auth approach and providers -->

## Infrastructure
<!-- Hosting, CI/CD, monitoring -->

## Key Libraries
<!-- Important dependencies and why they were chosen -->
```

**cli**:
```markdown
# Tech Stack

## Language
<!-- Primary language for the CLI -->

## CLI Framework
<!-- Argument parsing, output formatting -->

## Distribution
<!-- How will users install this? npm, brew, binary, etc. -->

## Key Libraries
<!-- Important dependencies and why they were chosen -->
```

#### Memory Files (all profiles)

**.opencode/memory/decisions.md**:
```markdown
# Decisions

Architectural and design decisions made during development.

## Template
<!--
### [YYYY-MM-DD] Decision Title
**Context:** Why did this come up?
**Decision:** What did we decide?
**Alternatives:** What else was considered?
**Consequences:** What are the tradeoffs?
-->
```

**.opencode/memory/patterns.md**:
```markdown
# Patterns

Recurring patterns and conventions in this codebase.

## Code Patterns
<!-- Common code patterns used in this project -->

## File Organization
<!-- How files and folders are organized -->

## Naming Conventions
<!-- Naming patterns for files, functions, variables -->
```

**.opencode/memory/learnings.md**:
```markdown
# Learnings

Insights discovered during development.

## What Works
<!-- Approaches that proved effective -->

## What Doesn't
<!-- Approaches that failed or caused issues -->

## Gotchas
<!-- Non-obvious things to watch out for -->
```

#### Standards Files (profile-specific)

Create placeholder files in each standards folder:

**standards/global/conventions.md** (all profiles):
```markdown
# Global Conventions

## Code Style
<!-- Formatting, linting rules -->

## Git Workflow
<!-- Branch naming, commit messages, PR process -->

## Documentation
<!-- How and where to document -->
```

**standards/backend/api.md** (web, mobile, api):
```markdown
# Backend Standards

## API Design
<!-- Endpoint naming, request/response format -->

## Error Handling
<!-- Error codes, error response format -->

## Authentication
<!-- Auth flow, token handling -->
```

**standards/backend/database.md** (web, mobile, api):
```markdown
# Database Standards

## Schema Conventions
<!-- Naming, relationships, indexes -->

## Migrations
<!-- How to handle schema changes -->

## Queries
<!-- Query patterns, N+1 prevention -->
```

**standards/frontend/components.md** (web only):
```markdown
# Frontend Standards

## Component Structure
<!-- File organization, naming -->

## Styling
<!-- CSS approach, design tokens -->

## State Management
<!-- When to use local vs global state -->
```

**standards/mobile/components.md** (mobile only):
```markdown
# Mobile Standards

## Component Structure
<!-- File organization, naming -->

## Navigation
<!-- Navigation patterns, deep linking -->

## Platform Differences
<!-- Handling iOS vs Android differences -->
```

**standards/cli/commands.md** (cli only):
```markdown
# CLI Standards

## Command Structure
<!-- Command naming, subcommands, flags -->

## Output
<!-- Output formatting, colors, verbosity levels -->

## Errors
<!-- Error messages, exit codes -->
```

**standards/testing/unit.md** (all profiles):
```markdown
# Testing Standards

## Unit Tests
<!-- What to test, naming conventions -->

## Test Organization
<!-- File location, grouping -->

## Mocking
<!-- When and how to mock -->
```

### Step 3: Confirm to User

After creating all files, output:

```
Created .opencode/ structure (profile: {profile}):

  product/
    mission.md
    roadmap.md
    tech-stack.md
  
  specs/                    (empty - created per-feature)
  
  memory/
    decisions.md
    patterns.md
    learnings.md
  
  standards/
    global/conventions.md
    {profile-specific folders and files}
    testing/unit.md

Next: Run /plan-product to fill in mission, roadmap, and tech-stack.
```

## Notes

- This command is idempotent - existing files are NOT overwritten
- Before writing each file, check if it exists using `list` or `glob`
- Only create files that don't already exist
- The structure is required for the spec-driven workflow
