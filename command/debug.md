# /debug Command

Debug implementation against specifications or analyze runtime errors.

## Usage

```
/debug                    # Debug against most recent spec (primary mode)
/debug --spec <name>      # Debug against specific spec folder
/debug --error            # Debug most recent runtime error
/debug --error "message"  # Debug specific error message
```

## Behavior

### Default: `/debug` (no arguments)

1. Find the most recent spec folder in `.opencode/specs/`
2. Run spec compliance check
3. Generate debug report with compliance score
4. Save report to `.opencode/specs/NNN-YYYY-MM-DD-name/debug-report.md`

### With `--spec <name>`: `/debug --spec user-auth`

1. Find spec folder matching the name (partial match OK)
2. Run spec compliance check against that specific spec
3. Generate and save debug report

### With `--error`: `/debug --error`

1. First check if error relates to any spec'd feature
2. If yes: Run spec compliance on that feature
3. If no: Run general error analysis (stack trace, git history, hypotheses)
4. Generate debug report

### With `--error "message"`: `/debug --error "Cannot read property 'map' of undefined"`

1. Parse the provided error message
2. Search codebase for likely location
3. Check spec relation
4. Generate targeted debug report

## What Gets Checked

### Spec Compliance Mode

| Check | Description |
|-------|-------------|
| Missing requirements | Spec'd features with no implementation |
| Incomplete implementation | Partial coverage of requirements |
| Wrong behavior | Implementation differs from spec |
| Missing edge cases | Happy path works, edge cases fail |
| API mismatches | Wrong endpoints, status codes, signatures |
| Scope creep | Code not in spec (optional flag) |

### Error Analysis Mode

| Check | Description |
|-------|-------------|
| Stack trace analysis | Parse error location and call chain |
| Git history | Recent changes to failing file |
| Git blame | Who changed the failing line and when |
| Dependency issues | Missing packages, version mismatches |
| Environment issues | Missing env vars, wrong runtime version |
| Common local issues | Stale builds, port conflicts |

## Output

### Compliance Score

```
Score = (Passing / Total Requirements) × 100%
```

### Debug Report Location

```
.opencode/specs/NNN-YYYY-MM-DD-name/debug-report.md
```

### Example Output

```
## Debug Complete

**Compliance Score:** 78%

**Violations Found:** 3
- MISSING: Password reset flow
- WRONG_BEHAVIOR: Returns 403 instead of 401  
- MISSING_EDGE_CASE: Token expiration unhandled

**Report saved:** .opencode/specs/001-2024-12-29-user-auth/debug-report.md

**To fix:** Run `@implementer fix violations from debug report`
```

## Delegation

This command delegates to the `debugger` subagent:

```
task({
  description: "Debug against spec",
  prompt: "Run spec compliance check on most recent spec. Save debug report.",
  subagent_type: "debugger"
})
```

## Prerequisites

- `.opencode/specs/` folder must exist (run `/setup` first)
- At least one spec folder for spec compliance mode
- For error mode: error message or recent terminal output

## Next Steps After Debug

1. Review the debug report
2. Run `@implementer fix violations from debug report` to fix issues
3. Run `/debug` again to verify fixes
4. Repeat until 100% compliance
