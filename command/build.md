---
description: "Spec-driven build workflow: shape requirements, write spec, create tasks, implement, verify"
agent: build-v2
---

# Build Command

Execute the full spec-driven development workflow for: $ARGUMENTS

## Workflow Phases

1. **Shape** - Clarify requirements with user
2. **Spec** - Write technical specification  
3. **Tasks** - Break down into implementable tasks
4. **Implement** - Execute tasks with verification
5. **Verify** - Final validation and cleanup

## Context Files

If these exist in the project, load them:
- `.opencode/features/FEAT-XXX/spec/spec.md` - Technical specification
- `.opencode/requirements.md` - User requirements  
- Query tickets via `tk query` - Task breakdown

## Instructions

Start by understanding what the user wants to build. If unclear, delegate to @spec-shaper to clarify requirements through conversation.

Once requirements are clear, follow the routing table in your system prompt to delegate to the appropriate subagent for each phase.

User request: $ARGUMENTS
