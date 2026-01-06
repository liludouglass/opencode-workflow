# Bug Report: [Brief Description]

<!-- Bug report template for systematic issue documentation -->
<!-- Used by @bug-analyzer to understand and reproduce issues -->
<!-- Fill out all sections for effective bug analysis -->

---

## Bug Summary

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-XXX |
| **Title** | [Concise description of the issue] |
| **Severity** | [Critical \| High \| Medium \| Low] |
| **Priority** | [P0 \| P1 \| P2 \| P3] |
| **Status** | [New \| Investigating \| In Progress \| Fixed \| Closed] |
| **Reporter** | [Name/Agent] |
| **Assignee** | [Name/Agent] |
| **Date Reported** | [YYYY-MM-DD] |
| **Date Updated** | [YYYY-MM-DD] |

---

## Description

### What Happened
[Clear, detailed description of the bug behavior]

### Expected Behavior
[What should have happened instead]

### Actual Behavior
[What actually happened - be specific]

### Impact
[How this affects users, system, or development]

---

## Steps to Reproduce

### Prerequisites
- [Any setup or conditions needed]
- [Specific data or configuration required]
- [User permissions or roles needed]

### Reproduction Steps
1. [First step - be specific]
2. [Second step - include exact inputs]
3. [Third step - note any timing]
4. [Continue until bug manifests]

### Reproduction Rate
- [ ] Always (100%)
- [ ] Frequently (75-99%)
- [ ] Sometimes (25-74%)
- [ ] Rarely (1-24%)
- [ ] Unable to reproduce (0%)

---

## Environment Information

### System Environment
| Component | Version/Details |
|-----------|-----------------|
| **Operating System** | [OS and version] |
| **Browser** | [Browser and version, if applicable] |
| **Node.js** | [Version] |
| **Package Manager** | [npm/yarn/pnpm version] |
| **Database** | [Type and version] |

### Application Environment
| Component | Version/Details |
|-----------|-----------------|
| **Application Version** | [Version/commit hash] |
| **Environment** | [Development \| Staging \| Production] |
| **Configuration** | [Relevant config settings] |
| **Feature Flags** | [Any relevant flags enabled/disabled] |

### Dependencies
```json
{
  "relevant-package-1": "^1.2.3",
  "relevant-package-2": "^4.5.6"
}
```

---

## Evidence

### Screenshots
- [ ] Screenshot 1: [Description of what it shows]
- [ ] Screenshot 2: [Description of what it shows]
- [ ] Video recording: [If applicable]

### Error Messages
```
[Exact error message from console/logs]
Stack trace if available:
  at function1 (file1.js:123:45)
  at function2 (file2.js:67:89)
  ...
```

### Console Logs
```
[Relevant console output]
[Include timestamps if helpful]
[Both error and info logs if relevant]
```

### Network Requests
```
Request:
POST /api/v1/endpoint
Headers: { "Content-Type": "application/json" }
Body: { "field": "value" }

Response:
Status: 500 Internal Server Error
Body: { "error": "Database connection failed" }
```

### Database State
```sql
-- Relevant database queries and results
SELECT * FROM users WHERE id = 123;
-- Result: [Show actual vs expected data]
```

---

## Code Context

### Affected Files
- `src/path/to/file1.ts` - [Brief description of relevance]
- `src/path/to/file2.ts` - [Brief description of relevance]
- `config/settings.json` - [Brief description of relevance]

### Relevant Code Sections
```typescript
// File: src/path/to/problematic-function.ts
// Lines: 45-60
export function problematicFunction(input: string): Result {
  // This is where the bug likely occurs
  const processed = processInput(input); // Line 47 - potential issue
  return { success: true, data: processed };
}
```

### Recent Changes
- **Commit**: abc1234 - "feat: add new validation logic" (2026-01-03)
- **Commit**: def5678 - "fix: update error handling" (2026-01-02)
- **Files Modified**: [List files changed in recent commits that might be related]

---

## Workarounds

### Temporary Solutions
1. **Workaround 1**: [Description of temporary fix]
   - Steps: [How to apply the workaround]
   - Limitations: [What this doesn't solve]
   - Risk: [Any risks with this approach]

2. **Workaround 2**: [Alternative temporary solution]
   - Steps: [How to apply]
   - Limitations: [Constraints]
   - Risk: [Potential issues]

### User Impact Mitigation
- [How users can avoid the issue]
- [Alternative workflows available]
- [Communication plan for affected users]

---

## Investigation Notes

### Initial Analysis
[First thoughts on potential causes]

### Hypotheses
1. **Hypothesis 1**: [Potential root cause]
   - Evidence: [What supports this theory]
   - Test: [How to verify this hypothesis]

2. **Hypothesis 2**: [Alternative potential cause]
   - Evidence: [Supporting information]
   - Test: [Verification approach]

### Investigation Steps Taken
- [ ] Reviewed recent code changes
- [ ] Checked error logs
- [ ] Attempted reproduction in different environments
- [ ] Analyzed database state
- [ ] Reviewed related bug reports

---

## Related Issues

### Similar Bugs
- BUG-YYY: [Brief description and relationship]
- BUG-ZZZ: [Brief description and relationship]

### Related Features
- FEATURE-AAA: [How this feature might be related]
- TASK-BBB: [Recent work that might have introduced this]

### Dependencies
- [External services that might be involved]
- [Third-party libraries that could be causing issues]
- [Infrastructure components that might be failing]

---

## Attachments

### Files
- [ ] `error-log-2026-01-04.txt` - [Description]
- [ ] `database-dump.sql` - [Description]
- [ ] `network-trace.har` - [Description]

### External Links
- [Link to monitoring dashboard]
- [Link to error tracking service]
- [Link to relevant documentation]

---

## Resolution Tracking

### Fix Attempts
1. **Attempt 1**: [What was tried]
   - Result: [Success/Failure]
   - Notes: [Lessons learned]

2. **Attempt 2**: [Another approach]
   - Result: [Outcome]
   - Notes: [Additional insights]

### Verification Plan
When a fix is implemented:
- [ ] Verify fix resolves the reported issue
- [ ] Test all reproduction steps pass
- [ ] Confirm no regression in related functionality
- [ ] Validate fix works across all supported environments
- [ ] Update documentation if needed

---

## Communication Log

### Stakeholder Updates
- **2026-01-04 10:00**: Reported to development team
- **2026-01-04 11:30**: Initial investigation started
- **2026-01-04 14:00**: Workaround identified and communicated

### External Communication
- [ ] Users notified of issue
- [ ] Status page updated
- [ ] Support team briefed
- [ ] Management informed (if high severity)

---

<!-- Bug report complete -->
<!-- Next step: Hand off to @bug-analyzer for investigation -->