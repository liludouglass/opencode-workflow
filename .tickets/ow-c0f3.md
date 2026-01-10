---
id: ow-c0f3
status: open
deps: [ow-f5b5, ow-236e, ow-4d20]
links: []
created: 2026-01-09T22:03:26Z
type: task
priority: 1
assignee: Lilu Douglas
parent: ow-090c
---
# Create Twitter Posting Agent File

Create comprehensive Twitter Viral Posting Subagent at ~/.config/opencode/agent/twitter-posting.md with full YAML frontmatter and agent prompt based on spec.md requirements.

## Content Requirements

### YAML Frontmatter (from spec.md)
```yaml
---
description: "Twitter Viral Posting Subagent - Creates viral-ready tweets based on proven strategies (Controversial Takes, Invite Sharing, Deep Resonance) using Twitter copywriting principles"
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.7
tools:
  read: true
  write: true
---
```

### Agent Prompt Requirements (from spec.md)

**Input Specification**:
- Required: topic (1-3 sentences), goal (engagement/awareness/conversions/authority/viral_reach), brand_voice (2-3 adjectives)
- Optional: audience, strategy_preference (controversial/invite_sharing/deep_resonance/auto_detect), format (single/thread/multiple_options), key_points, examples, cta, hashtags, max_length

**Processing Logic**:
1. Input validation & clarification for vague inputs
2. Topic analysis (core message, audience, key points)
3. Strategy selection (auto-detect or specified)
4. Content generation (hooks, body, CTA, voice adaptation)
5. Formatting & optimization (character count, readability)
6. Quality validation (engagement score, readability check)
7. Output generation (single/thread/multiple options)

**Error Handling** (from spec.md):
- Vague/insufficient topics: Return clarification request
- Platform guideline violations: Reject with explanation
- Brand voice conflicts: Propose compromise versions
- Character limit exceeded: Provide shortening options or thread suggestion
- Generation failures: Maximum 3 attempts, return helpful error

**Output Formats** (from spec.md):
- Single tweet with strategy explanation and engagement prediction
- Thread format with numbered tweets, strategy explanation, and metadata
- Multiple options with recommendations

### Acceptance Criteria References
- AC-1 through AC-10 from acceptance.md for input handling and output requirements
- FR-1 through FR-7 for functional requirements
- QT-1 through QT-3 for quality thresholds
- EH-1 through EH-5 for error handling

## File Path
`~/.config/opencode/agent/twitter-posting.md`
