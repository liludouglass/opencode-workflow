---
id: ow-d6a4
status: open
deps: []
links: []
created: 2026-01-09T22:06:12Z
type: task
priority: 1
assignee: Lilu Douglas
parent: F0tvps-30b3
---
# Create twitter-posting.md agent file

Create agent file at ~/.config/opencode/agent/twitter-posting.md with YAML frontmatter and comprehensive prompt for Twitter Viral Posting Subagent.\n\nAgent file requirements:\n- YAML frontmatter with description, mode=subagent, model, temperature=0.7, tools (read/write)\n- Full prompt including:\n  - Input specification (topic, goal, brand_voice as required; optional parameters: audience, strategy_preference, format, key_points, examples, cta, hashtags, max_length)\n  - Three viral strategies: Controversial Takes, Invite Sharing, Deep Resonance\n  - Processing logic flow\n  - Output formats (single tweet, thread, multiple options)\n  - Quality criteria (engagement score threshold 60+)\n  - Error handling for vague inputs, platform violations, character limits\n- Referenced skill files: twitter-viral-strategies.md, twitter-copywriting-principles.md, twitter-writing-techniques.md

## Acceptance Criteria

Agent file exists at ~/.config/opencode/agent/twitter-posting.md\nYAML frontmatter validates correctly\nMode is subagent\nTemperature is 0.7\nPrompt references all 3 skill files\nInput parameters match spec.md requirements\nOutput formats defined per spec.md\nError handling instructions included

