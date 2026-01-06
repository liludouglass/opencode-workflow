---
name: wf-write-spec
description: Phase 2 specification workflow - Create zero-ambiguity specs at L2/L3/L4 depth with parallel verification
---

# Specification Workflow (Phase 2)

Create zero-ambiguity specifications at the appropriate depth level (L2/L3/L4) with parallel verification by auditors.

## When to Use

- After Phase 1 (Shaping) is approved
- When `approach.md` has `status: approved`
- Before task decomposition (Phase 3)

## Agent References

**Primary Agent**: `@spec-writer`

**Verification Agents** (run in parallel):
- `@spec-auditor` - Find gaps, ambiguities, contradictions
- `@feasibility-checker` - Validate spec against codebase constraints

## Input Requirements

- Approved `approach.md` from Phase 1
- Determined spec depth (L2/L3/L4) from shaping
- Access to codebase for pattern research
- Visual assets (if any) in `planning/visuals/`

## Specification Depth Levels

| Level | When to Use | What's Included |
|-------|-------------|-----------------|
| **L2** | Simple features (1-3 tasks) | Clear acceptance criteria, design decisions documented |
| **L3** | Medium features (4-7 tasks) | API contracts, data schemas, explicit behaviors |
| **L4** | Complex features (8+ tasks) | Pseudocode-level detail for critical sections |

## Workflow Steps

### Step 1: Load Context

Read and analyze all inputs:

```bash
# Read approach document
cat .work/features/FEAT-XXX/approach.md

# Check for visual assets
ls -la .work/features/FEAT-XXX/planning/visuals/ 2>/dev/null

# Note the spec depth required from approach.md
```

### Step 2: Research Codebase

Before writing specs, search for existing patterns:

1. **Similar features** - How are related features implemented?
2. **UI components** - What components can be reused?
3. **API patterns** - What conventions are established?
4. **Data models** - What schemas already exist?
5. **Naming conventions** - What patterns to follow?

Document findings for the spec.

### Step 3: Write Specification at Correct Depth

#### L2 Depth (Simple)
```markdown
# Specification: [Feature Name]

## Overview
[1-2 paragraphs describing the feature]

## Acceptance Criteria
- [ ] AC-1: [Clear, testable criterion]
- [ ] AC-2: [Clear, testable criterion]

## Design Decisions
- [Decision 1]: [Reasoning]
- [Decision 2]: [Reasoning]

## Existing Code to Leverage
- [Component/pattern to reuse]

## Out of Scope
- [Explicit exclusions]
```

#### L3 Depth (Medium)
```markdown
# Specification: [Feature Name]

## Overview
[1-2 paragraphs describing the feature]

## Acceptance Criteria
- [ ] AC-1: [Criterion with measurable outcome]
- [ ] AC-2: [Criterion with measurable outcome]
...

## Technical Design

### Data Models
[Data structures with field definitions]

### API Contracts
[Endpoints with request/response formats]

### Behavior Specifications
[Explicit behavior descriptions]

## Edge Cases
| Case | Expected Behavior |
|------|-------------------|
| [Case 1] | [Behavior] |

## Error Handling
| Error | Response | User Message |
|-------|----------|--------------|
| [Error 1] | [Code] | [Message] |

## Existing Code to Leverage
- [Component/pattern to reuse]

## Out of Scope
- [Explicit exclusions]

## Risks and Unknowns
- [Risk 1]
```

#### L4 Depth (Complex)
```markdown
# Specification: [Feature Name]

## Overview
[Detailed description of the feature]

## Acceptance Criteria
- [ ] AC-1: [Detailed criterion with all conditions]
- [ ] AC-2: [Detailed criterion with all conditions]
...

## Technical Design

### Data Models
[Complete schemas with validations]

### API Contracts
[Full endpoint specifications with examples]

### Behavior Specifications
[Step-by-step behavior descriptions]

### Critical Section: [Name]
**Pseudocode**:
```
1. Validate input
2. Check authorization
3. If condition A:
   - Do X
   - Then Y
4. Else:
   - Do Z
5. Return result
```

## Edge Cases
[Comprehensive edge case matrix]

## Error Handling
[Complete error handling strategy]

## Performance Requirements
| Metric | Target |
|--------|--------|
| [Metric] | [Target] |

## Security Considerations
- [Security requirement 1]

## Existing Code to Leverage
[Detailed analysis of reusable components]

## Out of Scope
[Detailed exclusions with reasoning]

## Risks and Unknowns
[Risk analysis with mitigation strategies]
```

### Step 4: Extract Acceptance Criteria

Create separate `acceptance.md` file:

```markdown
# Acceptance Criteria: [Feature Name]

## Status
Total: X criteria
Verified: 0
Remaining: X

## Criteria

### AC-1: [Title]
- **Description**: [What must be true]
- **Test**: [How to verify]
- **Status**: [ ] Not verified

### AC-2: [Title]
- **Description**: [What must be true]
- **Test**: [How to verify]
- **Status**: [ ] Not verified

...
```

### Step 5: Parallel Verification

Spawn verification agents simultaneously:

#### @spec-auditor Check
Reviews spec for:
- **Gaps**: Missing requirements or edge cases
- **Ambiguities**: Unclear or vague language
- **Contradictions**: Conflicting requirements
- **Testability**: Can criteria be verified?

#### @feasibility-checker Check
Validates against codebase:
- **Technical feasibility**: Can this be built as specified?
- **Dependency availability**: Are required dependencies available?
- **Pattern compatibility**: Does it fit existing architecture?
- **Performance viability**: Can targets be met?

### Step 6: Generate Audit Report

Compile verification results:

```markdown
# Audit Report: [Feature Name]

## Spec Auditor Findings

### Gaps Found
| ID | Description | Severity | Recommendation |
|----|-------------|----------|----------------|
| GAP-1 | [Description] | [HIGH/MED/LOW] | [Fix] |

### Ambiguities Found
| ID | Section | Issue | Recommendation |
|----|---------|-------|----------------|
| AMB-1 | [Section] | [Issue] | [Clarification] |

### Contradictions Found
| ID | Sections | Conflict | Resolution |
|----|----------|----------|------------|
| [None found / List] |

## Feasibility Checker Findings

### Technical Assessment
- **Feasible**: [YES/NO/PARTIAL]
- **Confidence**: [HIGH/MED/LOW]

### Blockers Identified
| ID | Blocker | Impact | Mitigation |
|----|---------|--------|------------|
| [None / List] |

### Recommendations
1. [Recommendation 1]
2. [Recommendation 2]

## Overall Status
- **Spec Quality**: [APPROVED/NEEDS_REVISION]
- **Feasibility**: [APPROVED/BLOCKED]
- **Ready for Decomposition**: [YES/NO]
```

### Step 7: Address Findings

If issues found:
1. Revise spec to address gaps and ambiguities
2. Clarify contradictions
3. Re-run verification
4. Repeat until approved

## Output Files

| File | Description |
|------|-------------|
| `spec.md` | Full specification at appropriate depth |
| `acceptance.md` | Extracted checkable criteria |
| `audit-report.md` | Verification results |

## Success Criteria

- [ ] Spec written at correct depth level (L2/L3/L4)
- [ ] All acceptance criteria are checkable and testable
- [ ] Edge cases documented
- [ ] Error handling specified
- [ ] Codebase patterns researched and referenced
- [ ] @spec-auditor finds no critical gaps
- [ ] @feasibility-checker confirms buildability
- [ ] Audit report generated
- [ ] All verification issues addressed

## Human Gate

**HUMAN APPROVAL REQUIRED** before proceeding to Phase 3 (Decomposition).

Present to user:
- spec.md summary
- Key decisions
- Audit report highlights
- Any risks or concerns

## Example Usage

```
Spec Writer (L3 depth):
1. Loads approach.md (user favorites feature)
2. Researches: finds bookmark patterns, user preferences API
3. Writes spec with:
   - 5 acceptance criteria
   - User Favorite data model
   - 3 API endpoints (GET, POST, DELETE)
   - 4 edge cases
   - 3 error scenarios
4. Extracts acceptance.md with testable criteria
5. Spawns parallel verification:
   - @spec-auditor: finds 1 ambiguity (limit clarification)
   - @feasibility-checker: confirms feasible, notes rate limit concern
6. Addresses ambiguity, updates spec
7. Generates audit-report.md
8. Presents to user for approval
```

## Next Steps

After human approval, proceed to Phase 3: Decomposition using `/skill wf-create-tasks`.
