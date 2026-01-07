---
description: "Initiate enhancement/refactor workflow with lighter spec depth"
agent: orchestrator
---

# /improve

Initiate an enhancement or refactoring workflow with lighter specification depth (L2).

## Usage

```
/improve <description>
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| description | Yes | Description of the enhancement or refactoring to perform |

## Behavior

When invoked, this command:

1. **Routes to @orchestrator** with improve mode enabled
2. **Creates work folder**: `.work/features/FEAT-XXX-<slug>/`
   - Uses feature folder structure (improvements are treated as features)
   - Generates sequential ID
3. **Sets spec depth to L2** (lighter requirements)
4. **Executes full workflow** with reduced specification overhead

### Full Workflow with L2 Depth

```
Phase 1: SHAPING      → @shaper (lighter)  → HUMAN GATE
Phase 2: SPECIFICATION → @spec-writer (L2)  → HUMAN GATE
Phase 3: DECOMPOSITION → @decomposer        → AUTO
Phase 4: IMPLEMENTATION → Ralph loops        → AUTO
Phase 5: INTEGRATION   → @integrator        → AUTO
Phase 6: COMPLETION    → @finalizer         → HUMAN (optional)
```

### L2 Spec Depth

L2 specifications are lighter than L3/L4:

| Level | Description | Use Case |
|-------|-------------|----------|
| L2 | Clear acceptance criteria, design decisions documented | Improvements, refactoring |
| L3 | API contracts, data schemas, explicit behaviors | Standard features |
| L4 | Pseudocode-level detail for critical sections | Complex/critical features |

### What L2 Includes

- Clear acceptance criteria (checkable, testable)
- Design decisions with rationale
- Files to be modified
- Basic edge cases

### What L2 Excludes

- Detailed API contracts
- Comprehensive data schemas
- Pseudocode for every function
- Exhaustive edge case documentation

## Examples

### Code Refactoring

```
/improve Refactor UserService to use dependency injection pattern
```

Creates: `.work/features/FEAT-001-userservice-di/`
Spec depth: L2 (focus on refactoring goals, not detailed implementation)

### Performance Enhancement

```
/improve Optimize database queries in the reporting module
```

Creates: `.work/features/FEAT-002-reporting-optimization/`
Spec depth: L2 (focus on performance targets, not query details)

### Code Quality Improvement

```
/improve Add TypeScript strict mode and fix type errors
```

Creates: `.work/features/FEAT-003-typescript-strict/`
Spec depth: L2 (focus on scope and acceptance criteria)

### UI Enhancement

```
/improve Improve form validation UX with inline error messages
```

Creates: `.work/features/FEAT-004-inline-validation/`
Spec depth: L2 (focus on UX goals, not detailed component specs)

## When to Use /improve vs /feature

| Use `/improve` when | Use `/feature` when |
|---------------------|---------------------|
| Refactoring existing code | Building new functionality |
| Performance optimization | Adding new user-facing features |
| Code quality improvements | Implementing new business logic |
| Tech debt reduction | Creating new APIs or integrations |
| Migrating to new patterns | Adding new data models |
| Enhancing existing UX | Building new UI components |

## Work Folder Structure

Same structure as `/feature`:

```
.work/features/FEAT-001-userservice-di/
├── approach.md            # Lighter shaping output
├── spec.md                # L2 depth specification
├── acceptance.md          # Focused acceptance criteria
├── audit-report.md        # Verification results
├── tasks.md               # Task breakdown
├── progress.md            # Implementation log
├── integration-report.md  # Integration results
└── summary.md             # Final summary
```

## L2 Spec Template

```markdown
# Specification: [Improvement Name]

## Overview
[1-2 paragraphs describing the improvement]

## Goals
- [Primary goal]
- [Secondary goal]

## Acceptance Criteria
- [ ] AC-1: [Criterion 1]
- [ ] AC-2: [Criterion 2]
- [ ] AC-3: [Criterion 3]

## Design Decisions
| Decision | Rationale |
|----------|-----------|
| [Decision 1] | [Why] |
| [Decision 2] | [Why] |

## Files to Modify
- `path/to/file1.ts`
- `path/to/file2.ts`

## Risks
- [Risk 1]
- [Risk 2]
```

## Related Commands

- `/feature` - Full feature workflow with L3/L4 spec depth
- `/bug` - Bug fix workflow (simplified phases)
- `/ralph` - Run Ralph loop on specific task

## Prerequisites

- `.work/` folder structure must exist
- Clear improvement goal
- Understanding of existing code to be improved

Enhancement request: $ARGUMENTS
