# Specification: [Feature Name]

<!-- Phase 2 Specification Template -->
<!-- Created by @spec-writer agent based on approved approach -->
<!-- Verified by @spec-auditor and @feasibility-checker -->

## Overview

<!-- 1-2 paragraphs describing what this feature does and why it exists -->

[Describe the feature comprehensively here]

---

## Acceptance Criteria

<!-- Checkable, measurable, testable criteria -->
<!-- Each criterion should be independently verifiable -->

- [ ] AC-1: [First acceptance criterion]
- [ ] AC-2: [Second acceptance criterion]
- [ ] AC-3: [Third acceptance criterion]
- [ ] AC-4: [Fourth acceptance criterion]

---

## Technical Design

### Data Models

<!-- Data structures, schemas, types -->
<!-- For L3+: Include exact field names, types, and constraints -->

```typescript
// Example data model
interface ExampleModel {
  id: string;
  name: string;
  createdAt: Date;
}
```

### API Contracts

<!-- Endpoints, request/response formats -->
<!-- For L3+: Include exact paths, methods, payloads, and status codes -->

#### [Endpoint Name]

- **Method**: [GET | POST | PUT | DELETE]
- **Path**: `/api/v1/[resource]`
- **Request Body**:
```json
{
  "field": "value"
}
```
- **Response (200)**:
```json
{
  "field": "value"
}
```
- **Error Responses**: 400, 401, 404, 500

### Behavior Specifications

<!-- How the feature should behave in different scenarios -->
<!-- For L4: Include pseudocode for complex logic -->

#### [Scenario 1]

**Given**: [Initial state]
**When**: [Action taken]
**Then**: [Expected outcome]

#### [Scenario 2]

**Given**: [Initial state]
**When**: [Action taken]
**Then**: [Expected outcome]

---

## Edge Cases

<!-- All edge cases and how they should be handled -->

| Edge Case | Expected Behavior |
|-----------|-------------------|
| [Case 1] | [How to handle] |
| [Case 2] | [How to handle] |
| [Case 3] | [How to handle] |

---

## Error Handling

<!-- Error scenarios and how they should be handled -->

| Error Scenario | Error Code | User Message | System Action |
|----------------|------------|--------------|---------------|
| [Scenario 1] | [Code] | [Message] | [Action] |
| [Scenario 2] | [Code] | [Message] | [Action] |

---

## Risks and Unknowns

<!-- Potential risks and areas of uncertainty -->

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk 1] | [Low/Med/High] | [Low/Med/High] | [Strategy] |
| [Risk 2] | [Low/Med/High] | [Low/Med/High] | [Strategy] |

### Unknowns

- [Unknown 1 - and how we'll resolve it]
- [Unknown 2 - and how we'll resolve it]

---

## Depth Level Notes

<!-- Document what level of detail this spec provides -->

**Spec Depth**: [L2 | L3 | L4]

### L2 Requirements (if applicable)
- [ ] Clear acceptance criteria defined
- [ ] Design decisions documented
- [ ] High-level approach specified

### L3 Requirements (if applicable)
- [ ] API contracts fully specified
- [ ] Data schemas complete
- [ ] Explicit behaviors documented
- [ ] All edge cases covered

### L4 Requirements (if applicable)
- [ ] Pseudocode for critical sections
- [ ] Step-by-step logic flows
- [ ] State transitions documented
- [ ] All validation rules explicit

---

<!-- Human gate: This specification requires approval before proceeding to Phase 3 (Decomposition) -->
