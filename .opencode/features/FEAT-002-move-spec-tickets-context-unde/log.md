# Execution Log: [Feature Name]

<!-- Comprehensive execution logging template -->
<!-- Used to track all agent activities, tool calls, and system events -->
<!-- Append-only log - never modify existing entries -->

---

## Entry Format

Each entry follows this format:

```
## [YYYY-MM-DD HH:MM:SS] - [Agent] - [Event Type]
Timestamp: [ISO 8601 timestamp]
Agent: [@agent-name]
Event: [invocation | tool_call | error | retry | completion]
Context: [Brief description]
Details: [Detailed information]
Performance: [Duration, tokens, etc.]
```

---

## Log Entries

<!-- Entries are appended below, newest at bottom -->

### Example Entries (for reference, delete when first real entry added)

## 2026-01-04 10:00:15 - @orchestrator - invocation
Timestamp: 2026-01-04T10:00:15.123Z
Agent: @orchestrator
Event: invocation
Context: Feature implementation started
Details: 
  - Feature: User Authentication System
  - Phase: Implementation (Phase 4)
  - Tasks: TASK-001, TASK-002, TASK-003
Performance: N/A

---

## 2026-01-04 10:00:16 - @implementer - tool_call
Timestamp: 2026-01-04T10:00:16.456Z
Agent: @implementer
Event: tool_call
Context: Reading existing code structure
Details:
  - Tool: read
  - File: src/models/user.ts
  - Result: success
  - Lines: 45
Performance: 250ms, 1.2K tokens

---

## 2026-01-04 10:02:30 - @implementer - error
Timestamp: 2026-01-04T10:02:30.789Z
Agent: @implementer
Event: error
Context: Type checking failed
Details:
  - Tool: bash
  - Command: npm run type-check
  - Error: Property 'email' does not exist on type 'User'
  - Exit Code: 1
Performance: 1.2s

---

## 2026-01-04 10:02:31 - @implementer - retry
Timestamp: 2026-01-04T10:02:31.012Z
Agent: @implementer
Event: retry
Context: Fixing type error and retrying
Details:
  - Retry Attempt: 1/3
  - Previous Error: Type checking failed
  - Fix Applied: Added email property to User interface
Performance: N/A

---

## 2026-01-04 10:03:45 - @implementer - tool_call
Timestamp: 2026-01-04T10:03:45.345Z
Agent: @implementer
Event: tool_call
Context: Committing successful changes
Details:
  - Tool: bash
  - Command: git commit -m "feat: add email property to User model"
  - Result: success
  - Commit Hash: abc1234
Performance: 800ms

---

## 2026-01-04 10:04:00 - @implementer - completion
Timestamp: 2026-01-04T10:04:00.678Z
Agent: @implementer
Event: completion
Context: Task completed successfully
Details:
  - Task: TASK-001
  - Status: complete
  - Acceptance Criteria: AC-1, AC-2 (passed)
  - Tests: 5 passing, 0 failing
Performance: Total duration: 3m 45s, 15.7K tokens

---

## Performance Metrics Summary

<!-- Updated periodically to track overall performance -->

| Metric | Value |
|--------|-------|
| Total Execution Time | [X minutes] |
| Total Token Usage | [X tokens] |
| Tool Calls | [X calls] |
| Errors | [X errors] |
| Retries | [X retries] |
| Success Rate | [X%] |

### Agent Performance

| Agent | Invocations | Avg Duration | Token Usage | Success Rate |
|-------|-------------|--------------|-------------|--------------|
| @orchestrator | X | Xms | X tokens | X% |
| @implementer | X | Xms | X tokens | X% |
| @context-manager | X | Xms | X tokens | X% |

### Tool Usage Statistics

| Tool | Calls | Avg Duration | Success Rate | Most Common Use |
|------|-------|--------------|--------------|-----------------|
| read | X | Xms | X% | Code inspection |
| write | X | Xms | X% | File creation |
| edit | X | Xms | X% | Code modification |
| bash | X | Xms | X% | Testing/Git operations |

---

<!-- Log continues below -->