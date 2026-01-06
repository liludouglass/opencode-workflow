---
name: wf-shaping
description: Phase 1 shaping workflow - Transform vague input into approved direction
---

# Shaping Workflow (Phase 1)

Transform any input (vague idea, requirement, bug report) into an approved direction with clear scope and approach.

## When to Use

- Starting a new feature development
- Clarifying a vague user request
- Before writing detailed specifications
- When `/feature` or `/improve` commands are invoked

## Agent Reference

**Primary Agent**: `@shaper`

## Input Requirements

- User request or feature description
- Access to the codebase for pattern research
- Optional: existing documentation or context

## Workflow Steps

### Step 1: Classify the Request

Determine request type and complexity:

```markdown
## Classification

**Request Type**: [feature | bug | improve]
**Complexity**: [simple | medium | complex]

Complexity criteria:
- Simple: 1-3 tasks, L2 spec depth, no voting
- Medium: 4-7 tasks, L3 spec depth, voting on uncertain steps
- Complex: 8+ tasks, L4 spec depth, voting on all complex steps
```

### Step 2: Research Codebase

Before proposing approaches, research existing patterns:

1. **Find similar features** - Search for related functionality
2. **Identify patterns** - Note architectural patterns in use
3. **Discover constraints** - Understand technical limitations
4. **Locate reusable code** - Find components that can be leveraged

Document findings for the approach document.

### Step 3: Clarify Requirements

Ask clarifying questions until no ambiguity remains:

- What is the core problem being solved?
- Who are the users affected?
- What are the success criteria?
- Are there constraints (performance, compatibility, timeline)?
- What is explicitly out of scope?

**Continue asking until you have zero ambiguity.**

### Step 4: Identify Dependencies

Map both external and internal dependencies:

```markdown
## Dependencies

**External**:
- [Third-party services required]
- [APIs to integrate with]

**Internal**:
- [Existing features this depends on]
- [Features that depend on this]
```

### Step 5: Propose Approach Options

Present 2-3 approach options with tradeoffs:

```markdown
## Options Considered

### Option A: [Name]
**Description**: [1-2 sentences]
**Pros**: [Benefits]
**Cons**: [Drawbacks]
**Effort**: [Estimate]

### Option B: [Name]
**Description**: [1-2 sentences]
**Pros**: [Benefits]
**Cons**: [Drawbacks]
**Effort**: [Estimate]

## Recommended Approach
[Which option and why]
```

### Step 6: Determine Spec Depth

Based on complexity, specify required specification depth:

| Level | When to Use | What's Included |
|-------|-------------|-----------------|
| L2 | Simple features | Clear acceptance criteria, design decisions |
| L3 | Medium features | API contracts, data schemas, explicit behaviors |
| L4 | Complex features | Pseudocode-level detail for critical sections |

### Step 7: Create Work Folder

Create the work folder structure:

```
.work/features/FEAT-XXX-[feature-name]/
  approach.md    <- Output of this phase
```

Or for bugs:
```
.work/bugs/BUG-XXX-[bug-name]/
  report.md
  approach.md    <- Output of this phase
```

## Output Format

Create `approach.md` with this structure:

```markdown
# Approach: [Feature Name]

## Request Type
[feature | bug | improve]

## Complexity
[simple | medium | complex]

## Summary
[1-2 paragraphs describing the request and approved approach]

## Research Findings
- [Relevant patterns found in codebase]
- [Existing code that can be reused]
- [Constraints discovered]

## Options Considered
1. **Option A**: [description] - [tradeoffs]
2. **Option B**: [description] - [tradeoffs]

## Selected Approach
[Which option and why]

## Spec Depth Required
[L2 | L3 | L4] - [justification]

## Dependencies
- [External dependencies]
- [Internal dependencies]

## Out of Scope
- [Items explicitly excluded]

## Status
pending_approval
```

## Success Criteria

- [ ] Request type and complexity classified
- [ ] Codebase researched for patterns and constraints
- [ ] All ambiguities resolved through clarifying questions
- [ ] Multiple approach options presented with tradeoffs
- [ ] Clear recommendation with justification
- [ ] Spec depth determined based on complexity
- [ ] Work folder created with approach.md
- [ ] Status set to `pending_approval`

## Human Gate

**HUMAN APPROVAL REQUIRED** before proceeding to Phase 2 (Specification).

The user must explicitly approve the approach before spec writing begins.

## Skip Condition

For bugs with clear reproduction steps, this phase may be shortened or skipped. Go directly to simplified spec (Phase 2).

## Example Usage

```
User: "I want users to be able to save their favorite items"

Shaper:
1. Classifies as: feature, medium complexity
2. Researches: finds existing "bookmarks" feature for posts
3. Asks: "Should favorites sync across devices? Any limit on favorites?"
4. Identifies: depends on user auth, item service
5. Proposes: 
   - Option A: Simple favorites list (fast, limited)
   - Option B: Collections with folders (flexible, complex)
6. Recommends: Option A for MVP, Option B as future enhancement
7. Depth: L3 (needs API contracts, data schema)
8. Creates: .work/features/FEAT-042-user-favorites/approach.md
```

## Next Steps

After human approval, proceed to Phase 2: Specification using `/skill wf-write-spec`.
