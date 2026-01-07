---
name: wf-integration
description: Phase 5 integration testing workflow - Verify all pieces work together correctly
---

# Integration Workflow (Phase 5)

Verify all implemented pieces work together correctly through comprehensive testing and parallel verification.

## When to Use

- After all implementation tasks in Phase 4 are complete
- When all tickets are closed (`tk ready` returns empty)
- Before proceeding to final completion (Phase 6)

## Agent References

**Primary Agent**: `@integrator`

**Verification Agents** (run in parallel):
- `@spec-compliance` - Verify full output matches full spec
- `@regression-detector` - Ensure existing functionality intact
- `@security-auditor` - Check for vulnerabilities (if applicable)

## Input Requirements

- Completed implementation from Phase 4
- `spec.md` - Full specification
- `acceptance.md` - Checkable criteria
- All tickets closed (via `tk query '.status == "closed"'`)
- `progress.md` - Implementation log
- Access to full test suite

## Workflow Steps

### Step 1: Run Full Test Suite

Execute the complete test suite to verify baseline:

```bash
# Run all verification commands from config
npm run type-check    # Type checking
npm run lint          # Linting
npm test              # Full test suite
npm run build         # Build verification (if applicable)
```

Document results:
- Total tests run
- Pass/fail counts
- Any new failures introduced

### Step 2: Integration Testing

Test cross-component flows that weren't covered in unit tests:

```markdown
## Integration Test Results

### Flow: [User login to dashboard]
- Steps: [Login -> Fetch user data -> Load dashboard -> Display widgets]
- Result: [PASS/FAIL]
- Notes: [Any observations]

### Flow: [Create and share item]
- Steps: [Create item -> Save -> Generate share link -> Verify access]
- Result: [PASS/FAIL]
- Notes: [Any observations]
```

Focus on:
- Data flow between components
- State management across boundaries
- API request/response cycles
- Error propagation

### Step 3: Edge Case Testing

Test edge cases documented in spec:

```markdown
## Edge Case Results

| Edge Case | Expected Behavior | Actual Result | Status |
|-----------|-------------------|---------------|--------|
| Empty input | Show validation error | Shows error | PASS |
| Network timeout | Retry with backoff | Retries 3x | PASS |
| Concurrent updates | Last write wins | Conflict shown | FAIL |
```

### Step 4: Performance Check (if applicable)

For features with performance requirements:

```markdown
## Performance Results

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Page load | < 2s | 1.8s | PASS |
| API response | < 200ms | 150ms | PASS |
| Memory usage | < 50MB | 45MB | PASS |
```

### Step 5: Parallel Verification

Spawn verification agents in parallel:

#### @spec-compliance Check
```markdown
## Spec Compliance Report

### Verified Requirements
- [x] AC-1: User can create items
- [x] AC-2: Items persist across sessions
- [ ] AC-3: Items can be shared (PARTIAL - link generation missing)

### Deviations Found
- [Deviation 1]: [Description and impact]

### Compliance Score: 95%
```

#### @regression-detector Check
```markdown
## Regression Report

### Baseline Comparison
- Previous passing tests: 342
- Current passing tests: 345
- New tests added: 8
- Regressions found: 0

### Existing Functionality Verified
- [x] User authentication still works
- [x] Existing features unaffected
- [x] Database migrations backwards compatible
```

#### @security-auditor Check (if applicable)
```markdown
## Security Audit Report

### Vulnerabilities Scanned
- SQL Injection: PASS
- XSS: PASS
- CSRF: PASS
- Auth bypass: PASS

### Recommendations
- [None / List any security improvements]
```

### Step 6: Issue Handling

If issues are found:

1. **Create bug tickets** via `tk create --type bug`:
   ```bash
   tk create --type bug --title "Share link generation not working" \
     --priority high --labels "integration,bug" \
     --body "Found in: Step 3 - Edge Case Testing\nRoot cause: [If known]"
   ```

2. **Loop back to Phase 4** for targeted fixes
3. **Re-run affected integration tests** after fixes

### Step 7: Generate Integration Report

## Output Format

Create `integration-report.md`:

```markdown
# Integration Report: [Feature Name]

## Summary
- **Date**: [YYYY-MM-DD]
- **Feature**: [Feature name]
- **Status**: [PASS | FAIL | PARTIAL]

## Test Suite Results
- Type check: PASS
- Lint: PASS
- Unit tests: 345/345 passing
- Build: PASS

## Integration Test Results
- Flows tested: 5
- Flows passing: 5
- Flows failing: 0

## Edge Case Coverage
- Cases tested: 12
- Cases passing: 11
- Cases failing: 1

## Verification Agent Results

### Spec Compliance
- Score: 95%
- Missing: [List any gaps]

### Regression Detection
- Regressions found: 0
- Baseline maintained: YES

### Security Audit
- Vulnerabilities: 0
- Recommendations: [List any]

## Issues Found
| ID | Description | Severity | Status |
|----|-------------|----------|--------|
| BUG-INT-001 | Share link issue | HIGH | OPEN |

## Conclusion
[Overall assessment and recommendation]

## Next Steps
- [ ] Fix BUG-INT-001 (loop back to Phase 4)
- [ ] Proceed to Phase 6 (if all pass)
```

## Success Criteria

- [ ] Full test suite passes (type-check, lint, tests, build)
- [ ] All integration flows verified
- [ ] Edge cases from spec tested
- [ ] Performance targets met (if applicable)
- [ ] @spec-compliance confirms full spec coverage
- [ ] @regression-detector confirms no regressions
- [ ] @security-auditor confirms no vulnerabilities
- [ ] integration-report.md generated

## Gate Logic

**AUTOMATED GATE** - Pass/fail based on results:

| Condition | Action |
|-----------|--------|
| All checks pass | Proceed to Phase 6 |
| Issues found | Loop back to Phase 4 for fixes |
| Critical failure | Escalate to human |

## Failure Handling

When integration fails:

1. **Categorize failures** by severity (critical, high, medium, low)
2. **Create fix tickets** via `tk create --type bug --priority <severity>`
3. **Set dependencies** via `tk update <id> --blocked-by <other-id>`
4. **Loop back to Phase 4** for implementation
5. **Re-run integration** after fixes complete

## Example Usage

```
Integrator:
1. Runs full test suite: 345 tests pass
2. Tests 5 integration flows: all pass
3. Tests 12 edge cases: 11 pass, 1 fail
4. Spawns parallel verification:
   - spec-compliance: 95% compliant
   - regression-detector: 0 regressions
   - security-auditor: 0 vulnerabilities
5. Creates bug entry for failing edge case
6. Generates integration-report.md with status: PARTIAL
7. Loops back to Phase 4 for fix
8. After fix: re-runs affected tests
9. All pass: proceeds to Phase 6
```

## Next Steps

After all integration checks pass, proceed to Phase 6: Completion using `/skill wf-completion`.
