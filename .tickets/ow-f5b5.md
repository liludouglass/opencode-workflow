---
id: ow-f5b5
status: open
deps: []
links: []
created: 2026-01-09T22:03:27Z
type: task
priority: 2
assignee: Lilu Douglas
parent: ow-090c
---
# Verify twitter-viral-strategies Skill

Verify and complete ~/.config/opencode/skill/twitter-viral-strategies.md with all 3 viral strategies, strategy selection decision tree, implementation examples, and engagement patterns.

## Content Requirements (from spec.md approach.md)

### Strategy 1: Controversial Takes
- **Definition**: Post something that intentionally shaves away nuance to become controversial, forcing binary responses
- **When to Use**: Topics with established beliefs, industry hot takes, challenging conventional wisdom
- **Implementation**: Identify nuanced truth, remove nuance, present confidently
- **Examples**: Productivity advice critique, expert validation, confidence vs competence
- **Engagement Pattern**: High replies, quote tweets with counter-arguments, high first-hour engagement

### Strategy 2: Invite Sharing
- **Definition**: Post that invites others to share experiences, setting them up to express themselves
- **When to Use**: Personal experiences, relatable situations, community building, audience stories
- **Implementation**: Identify shared experience, create space for sharing, set people up to express
- **Examples**: Project abandoned emoji prompt, moment of realization question, stage of project dropdown
- **Engagement Pattern**: High reply count, high share rate, high bookmark rate

### Strategy 3: Deep Resonance
- **Definition**: Share something that resonates so deeply people want to share it with friends, articulating unspoken truths
- **When to Use**: Unspoken truths, common observations, shared frustrations, universal emotions
- **Implementation**: Identify unspoken truths, articulate on behalf of others, connect to shared experience
- **Examples**: Expert insight on experience, post-completion feeling, working for yourself reality
- **Engagement Pattern**: High bookmark rate, high DM/sharing, "I thought I was the only one" comments

### Strategy Selection Decision Tree
```
IF strategy_preferred != "auto":
    USE strategy_preferred
ELSE:
    controversial_score = controversial_keywords * 10 + controversy_potential * 0.5
    inviting_score = inviting_keywords * 10 + experiential_boost * 0.5
    resonant_score = resonant_keywords * 10 + universal_theme_boost * 0.5
    
    IF max_score - min_score < 5:
        SELECT "resonant" (safest default)
    ELSE:
        SELECT strategy with highest score
```

### Keyword Detection
- **Controversial**: "wrong", "dead", "overrated", "actually", "truth", "stop doing", "most", "everyone"
- **Inviting**: "ever", "when you", "have you", "we all", "anyone else", experiential language
- **Resonant**: "the thing about", "no one says", "what if I told you", "that feeling when"

### Common Mistakes to Avoid
- Being controversial for controversy's sake
- Inviting without genuine space for sharing
- Being too vague with resonant content
- Forgetting the hook even for resonant content

## File Path
`~/.config/opencode/skill/twitter-viral-strategies.md`

## Acceptance Criteria
- AC-FR-2.1: Controversial strategy produces polarizing content
- AC-FR-2.2: Invite sharing strategy produces participation prompts
- AC-FR-2.3: Deep resonance strategy produces relatable content
- AC-FR-2.4: Auto-detect matches topic characteristics
