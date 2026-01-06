---
name: std-risk-classification
description: Risk classification for human-in-loop approval of operations by risk level
---

# Risk Classification for Human-in-Loop Approval

This document defines which operations require human approval and which can be auto-executed.

## Risk Levels

### Low Risk (Auto-Execute)

Operations that only read data or analyze without modification.

| Operation | Examples |
|-----------|----------|
| `read` | Read any file |
| `glob` | Search for files by pattern |
| `grep` | Search file contents |
| `list` | List directory contents |
| `analyze` | Code analysis, pattern detection |
| `webfetch` | Fetch documentation, references |

**Action**: Execute immediately without asking.

---

### Medium Risk (Auto-Execute + Log)

Operations that modify existing files in expected ways.

| Operation | Examples |
|-----------|----------|
| `edit` | Modify existing code files |
| `write` | Create new code files |
| `bash` (read-only) | `git status`, `npm test`, `ls` |
| `run tests` | Execute test suites |

**Action**: Execute and log to todowrite. No approval needed.

**Log format**:
```
[MEDIUM-RISK] edit src/auth.py:45-67 - added validation
```

---

### High Risk (Require Approval)

Operations with significant impact that should be reviewed.

| Operation | Examples |
|-----------|----------|
| `delete` | Remove files or directories |
| `bash` (write) | Commands that modify system state |
| `config changes` | Modify `.env`, `config.json`, etc. |
| `dependency changes` | Add/remove packages |
| `migrations` | Database schema changes |
| `git operations` | commit, push, merge |

**Action**: STOP and ask for approval before executing.

**Approval prompt format**:
```markdown
## Approval Required (High Risk)

**Operation**: [what you want to do]
**Impact**: [what will change]
**Reversible**: Yes/No

Proceed? (yes/no)
```

---

### Critical Risk (Always Require Approval)

Operations that could cause data loss or security issues.

| Operation | Examples |
|-----------|----------|
| `database writes` | INSERT, UPDATE, DELETE on production |
| `deploy` | Push to production environment |
| `credentials` | Modify API keys, secrets |
| `permissions` | Change file/user permissions |
| `destructive bash` | `rm -rf`, `DROP TABLE` |
| `production access` | Any production environment operation |

**Action**: ALWAYS ask for explicit approval. Explain consequences.

**Approval prompt format**:
```markdown
## CRITICAL: Approval Required

**Operation**: [what you want to do]
**Risk**: [what could go wrong]
**Impact**: [scope of change]
**Recovery**: [how to undo if needed]

⚠️ This is a critical operation. Please confirm: (yes/no)
```

---

## Implementation Guide

### For Orchestrators

When delegating tasks, classify the risk level:

```markdown
## Task Delegation

Risk Level: [LOW/MEDIUM/HIGH/CRITICAL]
Operations involved: [list]
Approval needed: [Yes/No]
```

### For Implementers

Before executing any operation:

1. **Classify the risk level** using the tables above
2. **Low/Medium**: Execute and log
3. **High/Critical**: Stop and request approval

### Error Recovery

If a high/critical operation fails:

1. Log the failure with full context
2. Do NOT retry automatically
3. Report to human with:
   - What was attempted
   - What failed
   - Current state
   - Suggested recovery steps

---

## Quick Reference

| Risk | Examples | Action |
|------|----------|--------|
| **Low** | read, glob, grep, list | Auto |
| **Medium** | edit, write, test | Auto + log |
| **High** | delete, bash-write, configs, git | **Ask first** |
| **Critical** | database, deploy, credentials | **Always ask** |
