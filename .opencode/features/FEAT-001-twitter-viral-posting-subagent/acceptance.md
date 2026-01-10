# Acceptance Criteria: Twitter Viral Posting Subagent

## Status
- **Total Criteria**: 24
- **Verified**: 0
- **Pending**: 24

## Criteria Categories
- **Functional Requirements**: 10 criteria
- **Quality Thresholds**: 6 criteria
- **Edge Cases**: 5 criteria
- **Error Handling**: 3 criteria

---

## Functional Requirements

### FR-1: Input Handling
- [ ] **AC-FR-1.1**: Agent accepts topic as required string input
  - **Testable by**: Attempt to invoke agent with topic parameter only
  - **Pass Condition**: Agent proceeds to clarification if other required fields missing, does not error
- [ ] **AC-FR-1.2**: Agent accepts goal as required enum input (engagement, awareness, conversions, authority, viral_reach)
  - **Testable by**: Invoke with each valid goal value
  - **Pass Condition**: All valid enum values accepted without error
- [ ] **AC-FR-1.3**: Agent accepts brand_voice as required string input
  - **Testable by**: Invoke with various brand voice descriptions
  - **Pass Condition**: Brand voice is incorporated into output

### FR-2: Strategy Application
- [ ] **AC-FR-2.1**: Agent generates content using Controversial Takes strategy when selected
  - **Testable by**: Request controversial content, analyze output for polarizing elements
  - **Pass Condition**: Output contains binary-position claims, challenges conventional wisdom
- [ ] **AC-FR-2.2**: Agent generates content using Invite Sharing strategy when selected
  - **Testable by**: Request invite sharing content, analyze output for participation prompts
  - **Pass Condition**: Output contains audience invitation elements (questions, emoji prompts, sharing hooks)
- [ ] **AC-FR-2.3**: Agent generates content using Deep Resonance strategy when selected
  - **Testable by**: Request resonant content, analyze output for articulation of shared feelings
  - **Pass Condition**: Output articulates unspoken thoughts or relatable experiences
- [ ] **AC-FR-2.4**: Agent auto-detects optimal strategy when strategy_preference is "auto_detect"
  - **Testable by**: Provide topic with clear controversy potential, verify controversial strategy selected
  - **Pass Condition**: Auto-detected strategy matches topic characteristics

### FR-3: Copywriting Quality
- [ ] **AC-FR-3.1**: Output follows Twitter-specific principles (brevity, readability, hooks, CTAs)
  - **Testable by**: Analyze output for hook patterns, CTA integration, formatting
  - **Pass Condition**: Output contains at least one hook pattern and one CTA element (when appropriate)
- [ ] **AC-FR-3.2**: Content respects Twitter character limits (280 characters per tweet)
  - **Testable by**: Character count of single tweet outputs
  - **Pass Condition**: No tweet exceeds 280 characters

### FR-4: Readability
- [ ] **AC-FR-4.1**: Content is formatted with proper white space and structure
  - **Testable by**: Visual inspection of output formatting
  - **Pass Condition**: Output uses short paragraphs, line breaks, and visual spacing
- [ ] **AC-FR-4.2**: Thread format uses one sentence per line structure
  - **Testable by**: Analyze thread tweet formatting
  - **Pass Condition**: Each thread tweet uses one sentence per line format

### FR-5: Output Variety
- [ ] **AC-FR-5.1**: Agent can produce single tweet format
  - **Testable by**: Request format="single"
  - **Pass Condition**: Output contains exactly one tweet with explanation
- [ ] **AC-FR-5.2**: Agent can produce thread format (2-10 tweets)
  - **Testable by**: Request format="thread"
  - **Pass Condition**: Output contains multiple numbered tweets forming a coherent thread
- [ ] **AC-FR-5.3**: Agent can produce multiple options format
  - **Testable by**: Request format="multiple_options"
  - **Pass Condition**: Output contains at least 3 distinct options with strategy explanations

### FR-6: Output Quality
- [ ] **AC-FR-6.1**: Each output includes brief explanation of why it works
  - **Testable by**: Check output for "Why This Works" section
  - **Pass Condition**: Strategy explanation present for each generated option
- [ ] **AC-FR-6.2**: Each output includes engagement prediction
  - **Testable by**: Check output for engagement prediction content
  - **Pass Condition**: Predicted engagement type specified for each option

---

## Quality Thresholds for Viral Potential

### QT-1: Engagement Score
- [ ] **AC-QT-1.1**: Single tweets meet minimum 60-point engagement score threshold
  - **Testable by**: Scoring rubric evaluation (Hook Strength + Content Value + Shareability + CTA Effectiveness)
  - **Pass Condition**: Score >= 60/100
- [ ] **AC-QT-1.2**: Thread tweets meet minimum 50-point engagement score threshold
  - **Testable by**: Scoring rubric evaluation for individual thread tweets
  - **Pass Condition**: Score >= 50/100
- [ ] **AC-QT-1.3**: Multiple options output has at least one option >= 70 points
  - **Testable by**: Score all options, verify highest >= 70
  - **Pass Condition**: Best option score >= 70

### QT-2: Readability Metrics
- [ ] **AC-QT-2.1**: Tweet grade level target is 6-8
  - **Testable by**: Automated readability analysis (Flesch-Kincaid or equivalent)
  - **Pass Condition**: Grade level within target range
- [ ] **AC-QT-2.2**: Average sentence length does not exceed 25 words
  - **Testable by**: Word count per sentence analysis
  - **Pass Condition**: Average <= 25 words per sentence
- [ ] **AC-QT-2.3**: Paragraphs contain maximum 2 sentences
  - **Testable by**: Paragraph sentence count analysis
  - **Pass Condition**: No paragraph exceeds 2 sentences

### QT-3: CTA Effectiveness
- [ ] **AC-QT-3.1**: CTAs have clear action specification
  - **Testable by**: Check CTA for explicit action verb (Comment, Follow, Like, etc.)
  - **Pass Condition**: CTA contains clear action
- [ ] **AC-QT-3.2**: CTAs have low friction requirements
  - **Testable by**: Analyze CTA requirements (email, following, etc.)
  - **Pass Condition**: No high-friction barriers without clear value proposition

---

## Edge Cases

### EC-1: Vague Topics
- [ ] **AC-EC-1.1**: Agent detects vague topics (under 10 characters, generic terms)
  - **Testable by**: Input: "productivity" or "something cool"
  - **Pass Condition**: Agent returns clarification request, not low-quality output
- [ ] **AC-EC-1.2**: Agent detects topics without actionable content
  - **Testable by**: Input: "discuss" or "your thoughts on X"
  - **Pass Condition**: Agent requests specific angle or key points

### EC-2: Character Limit Edge Cases
- [ ] **AC-EC-2.1**: Agent handles content that exceeds 280 characters
  - **Testable by**: Input requiring long explanation
  - **Pass Condition**: Agent provides shortening options or thread suggestion
- [ ] **AC-EC-2.2**: Agent handles non-ASCII characters (emojis, international text)
  - **Testable by**: Input with emojis and international characters
  - **Pass Condition**: Output stays within functional character limit

### EC-3: Topic Type Edge Cases
- [ ] **AC-EC-3.1**: Agent handles extremely narrow/niche topics
  - **Testable by**: Input: very specific technical topic
  - **Pass Condition**: Agent produces audience-appropriate content, may suggest alternatives
- [ ] **AC-EC-3.2**: Agent handles topics with no natural controversy
  - **Testable by**: Input: objectively positive news
  - **Pass Condition**: Agent suggests alternative strategies or multiple options

### EC-4: Voice Edge Cases
- [ ] **AC-EC-4.1**: Agent handles contradictory voice descriptions
  - **Testable by**: Input: "confident but hesitant" or "professional but casual"
  - **Pass Condition**: Agent clarifies or produces compromise version with explanation

---

## Error Handling

### EH-1: Vague Input Error Handling
- [ ] **AC-EH-1.1**: Agent returns helpful clarification request
  - **Testable by**: Input vague topic
  - **Pass Condition**: Response includes specific questions and examples
- [ ] **AC-EH-1.2**: Agent does not generate low-quality content from insufficient input
  - **Testable by**: Input vague topic, attempt multiple times
  - **Pass Condition**: Agent maintains quality standards, does not degrade

### EH-2: Platform Violation Error Handling
- [ ] **AC-EH-2.1**: Agent detects and rejects content violating platform guidelines
  - **Testable by**: Input topic requiring harmful or prohibited content
  - **Pass Condition**: Agent rejects request with explanation and alternative suggestions

### EH-3: Technical Error Handling
- [ ] **AC-EH-3.1**: Agent handles generation failures gracefully
  - **Testable by**: Repeated failed generation attempts (via mock or edge case inputs)
  - **Pass Condition**: Agent returns helpful error with suggestions for retry

---

## Verification Instructions

### Manual Verification Checklist

1. **Input Testing**: Test each required and optional input parameter
2. **Strategy Testing**: Verify each strategy produces appropriate content
3. **Format Testing**: Test each output format
4. **Quality Testing**: Score outputs against engagement rubric
5. **Error Testing**: Trigger each error condition
6. **Edge Case Testing**: Test each edge case scenario

### Automated Testing Approach

```python
# Pseudocode for automated testing

def test_twitter_posting_agent():
    # Input validation tests
    assert agent.accepts_valid_inputs()
    assert agent.rejects_invalid_inputs()
    
    # Strategy tests
    assert controversial_strategy.produces_polarizing_content()
    assert invite_sharing_strategy.produces_participation_prompts()
    assert resonance_strategy.produces_relatable_content()
    
    # Quality tests
    assert output.meets_engagement_threshold()
    assert output.meets_readability_standards()
    assert output.respects_character_limits()
    
    # Error handling tests
    assert agent.handles_vague_input_gracefully()
    assert agent.rejects_platform_violations()
    assert agent.handles_generation_failures()
    
    return all_tests_passed
```

---

## Test Data Examples

### Valid Inputs
- Topic: "Most productivity advice is counterproductive for creative work"
- Goal: "engagement"
- Brand Voice: "sharp and provocative"

### Vague Inputs
- Topic: "productivity" (too short, generic)
- Topic: "something cool" (not specific)
- Topic: "discuss" (no actionable content)

### Platform Violation Inputs
- Topic: "[attack specific group]" (hate speech)
- Topic: "[instructions for illegal activity]" (prohibited content)

### Edge Case Inputs
- Topic: "[extremely technical niche topic]"
- Topic: "[objectively positive news with no controversy]"
- Brand Voice: "confident but hesitant" (contradictory)

---

<complete/>

**Acceptance criteria created**: 24 total criteria
**Categories**: Functional (10), Quality (6), Edge Cases (5), Error Handling (3)
**Status**: Ready for implementation verification