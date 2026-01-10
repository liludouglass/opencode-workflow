# Acceptance Criteria: Twitter Viral Posting Subagent

## Status
- **Total Criteria**: 24
- **Verified**: 0
- **Pending**: 24

## Criteria Checklist

### Functional Requirements (AC-1 through AC-12)

#### AC-1: Simplified Input Handling
- [ ] **Criterion**: Agent accepts `topic` as the only required input parameter
- **Pass Condition**: Input `{"topic": "remote work productivity"}` produces valid output without additional parameters
- **Fail Condition**: Input without `topic` parameter does not produce a helpful error message
- **Testable By**: Valid JSON input with only topic field produces successful response

#### AC-2: Smart Default Application
- [ ] **Criterion**: Agent applies smart defaults for all optional parameters
- **Pass Conditions**:
  - `goal` defaults to "engagement" when not provided
  - `strategy_preferred` defaults to "auto" when not provided
  - `format` defaults to "single" when not provided
  - `tone` defaults to "casual" when not provided
  - `include_cta` defaults to false when not provided
- **Testable By**: Inspect output metadata to verify default values were applied

#### AC-3: Tweet Option Generation
- [ ] **Criterion**: Agent generates exactly 2-3 tweet options per request
- **Pass Conditions**:
  - Output contains exactly 2-3 options
  - All options meet minimum quality threshold (60+ engagement score)
  - Options differ in strategy, angle, or approach
- **Fail Conditions**:
  - Fewer than 2 options generated
  - More than 3 options generated
  - Any option below 60 engagement score
- **Testable By**: Count array elements and verify engagement scores

#### AC-4: Strategy Documentation
- [ ] **Criterion**: Each tweet option includes `strategy_used` field
- **Pass Conditions**:
  - Field exists in each tweet option
  - Value is one of: "controversial", "inviting", "resonant"
  - Strategy aligns with content and intent of tweet
- **Fail Conditions**:
  - Field missing from any option
  - Strategy field contains invalid value
  - Strategy doesn't match tweet content
- **Testable By**: Inspect strategy_used field in each option

#### AC-5: Engagement Prediction
- [ ] **Criterion**: Each tweet option includes `engagement_prediction` field
- **Pass Conditions**:
  - Field exists in each tweet option
  - Value is integer between 1 and 100
  - Prediction is based on scoring rubric
- **Fail Conditions**:
  - Field missing from any option
  - Value outside 1-100 range
  - No rubric-based calculation evident
- **Testable By**: Inspect engagement_prediction field and verify range

#### AC-6: Strategy Explanation
- [ ] **Criterion**: Each tweet option includes `why_it_works` field
- **Pass Conditions**:
  - Field exists in each tweet option
  - Explanation references specific strategies or principles applied
  - Explanation is actionable and informative
- **Fail Conditions**:
  - Field missing from any option
  - Explanation is empty
  - Explanation is generic and doesn't reference applied techniques
- **Testable By**: Inspect why_it_works field content

#### AC-7: Viral Strategy Application
- [ ] **Criterion**: Agent applies at least one of three viral strategies
- **Pass Conditions**:
  - Strategy 1 (Controversial): Content forces binary responses
  - Strategy 2 (Inviting): Content prompts audience self-expression
  - Strategy 3 (Resonant): Content articulates shared thoughts
  - At least one strategy is applied and documented
- **Testable By**: Review strategy_used field and content analysis

#### AC-8: Copywriting Principles Application
- [ ] **Criterion**: Agent applies principles from twitter-copywriting-principles.md skill
- **Pass Conditions**:
  - Hook fundamentals: Direct reader address, benefit-led, avoids overused patterns
  - Content structure: One idea per tweet, bullets, short paragraphs
  - Engagement triggers: Social proof, urgency, low friction, exclusivity
  - Voice and tone: Conversational, confident, direct, casual but valuable
- **Testable By**: Review generated content for principle application

#### AC-9: Writing Principles Application
- [ ] **Criterion**: Agent applies all 20 writing principles from embedded context
- **Pass Conditions**:
  - Have Something Worth Saying: Content has valuable insight
  - Know the Audience: Appropriate for inferred audience
  - Write Conversationally: Uses casual, friendly tone
  - Keep it Simple: Clear, straightforward language
  - Open Strong: Attention-grabbing first sentence
  - One Idea per Unit: Single focus per tweet
  - Format for Skimmers: White space and structure
  - Be Concrete: Specific rather than abstract
  - Use Stories & Emotion: Where appropriate
  - Finish Strong: Impactful conclusion
  - Plus remaining 10 principles
- **Testable By**: Review content against principle checklist

#### AC-10: Vague Topic Handling
- [ ] **Criterion**: Vague topics return clarifying question
- **Pass Conditions**:
  - Topic with fewer than 3 words detected
  - Abstract concepts without actionable angle detected
  - Response includes specific clarifying question
- **Fail Condition**: Vague topic produces low-quality or generic output
- **Testable By**: Input `{"topic": "stuff"}` and verify response

#### AC-11: Platform Violation Handling
- [ ] **Criterion**: Restricted topics return appropriate rejection
- **Pass Conditions**:
  - Hate speech topics rejected
  - Violence/self-harm topics rejected
  - Illegal content topics rejected
  - Clear error message returned
- **Testable By**: Input restricted topic and verify rejection

#### AC-12: Minimum Quality Threshold
- [ ] **Criterion**: All generated tweets score 60+ points
- **Pass Conditions**:
  - Each option has engagement_prediction ≥ 60
  - Subagent filters out low-quality options
  - No option below threshold returned
- **Fail Condition**: Any option returned with score < 60
- **Testable By**: Verify all engagement_prediction values

### Quality Thresholds (AC-13 through AC-17)

#### AC-13: Character Limit Compliance
- [ ] **Criterion**: All single tweets within 280 characters
- **Pass Conditions**:
  - Single tweet format: All tweets ≤ 280 characters
  - Thread format: Each tweet ≤ 280 characters
- **Fail Condition**: Any tweet exceeds 280 characters
- **Testable By**: Count characters in each tweet_text field

#### AC-14: Readability Requirement
- [ ] **Criterion**: Readability grade level 8 or below
- **Pass Conditions**:
  - Flesch-Kincaid grade ≤ 8
  - Content understandable by general audience
- **Fail Condition**: Readability grade > 8
- **Testable By**: Run readability analysis on tweet_text

#### AC-15: Formatting Standards
- [ ] **Criterion**: One sentence per line formatting applied
- **Pass Conditions**:
  - Multi-sentence content uses one sentence per line
  - Lists use "-", ">", or numbered format
  - White space present between sections
- **Fail Condition**: Wall-of-text without breaks generated
- **Testable By**: Inspect tweet_text structure

#### AC-16: White Space Optimization
- [ ] **Criterion**: Content not formatted as wall of text
- **Pass Conditions**:
  - Visual breaks present between distinct ideas
  - Readability prioritized through formatting
- **Fail Condition**: Content appears as dense block without breaks
- **Testable By**: Visual inspection of tweet_text

#### AC-17: CTA Quality
- [ ] **Criterion**: CTA remains non-desperate when included
- **Pass Conditions**:
  - No begging language present
  - Clear value proposition offered
  - Action is low friction (simple action)
  - Engagement is optional, not manipulative
- **Fail Condition**: CTA appears desperate, high-friction, or manipulative
- **Testable By**: Review CTA content when include_cta=true

### Edge Cases (AC-18 through AC-22)

#### AC-18: Vague Topic Detection
- [ ] **Criterion**: Vague topics generate clarifying question
- **Pass Conditions**:
  - Topics with < 3 significant words detected
  - Abstract concepts without actionable angle detected
  - Empty or null topic handled gracefully
- **Fail Condition**: Vague topic produces low-quality output
- **Testable By**: Test with various vague inputs

#### AC-19: Restricted Topic Detection
- [ ] **Criterion**: Restricted topics return appropriate error
- **Pass Conditions**:
  - Illegal activities rejected
  - Hate speech/harassment rejected
  - Violence/self-harm rejected
  - Misinformation flagged
- **Testable By**: Test with various restricted inputs

#### AC-20: Length Management
- [ ] **Criterion**: Over-length content properly handled
- **Pass Conditions**:
  - Content > 280 characters automatically truncated OR converted to thread
  - Simplification attempted before truncation
  - Original message intent preserved
- **Fail Condition**: Content exceeds 280 characters
- **Testable By**: Test with long topic inputs

#### AC-21: Parameter Conflict Resolution
- [ ] **Criterion**: Conflicting parameters resolve appropriately
- **Pass Conditions**:
  - Conflicting tone and strategy resolved to best practices
  - Impossible combinations default to viral-optimized settings
  - User intent preserved while maintaining quality
- **Fail Condition**: Conflict resolution produces low-quality output
- **Testable By**: Test with conflicting parameters

#### AC-22: Empty Input Handling
- [ ] **Criterion**: Empty inputs return helpful error
- **Pass Conditions**:
  - Empty string topic returns helpful error
  - Null topic returns helpful error
  - Whitespace-only topic returns helpful error
- **Testable By**: Test with empty/null/whitespace inputs

### Error Handling (AC-23 through AC-24)

#### AC-23: Error Response Coverage
- [ ] **Criterion**: All 5 error types handled appropriately
- **Error Type 1**: Vague Topic - Clarifying question returned
- **Error Type 2**: Platform Violation - Rejection with explanation
- **Error Type 3**: Generation Failure - Helpful error with suggestion
- **Error Type 4**: Character Limit - Automatic truncation or threading
- **Error Type 5**: Voice Conflict - Suggest compromise or explain trade-offs
- **Testable By**: Trigger each error type and verify response

#### AC-24: No Silent Failures
- [ ] **Criterion**: No generation attempts fail without feedback
- **Pass Conditions**:
  - All errors result in informative messages
  - Subagent never returns empty or null output
- **Fail Condition**: Any request results in unhelpful empty output
- **Testable By**: Monitor all error scenarios

## Verification Methods

### Automated Testing
```python
def test_ac1_simplified_input():
    """Test AC-1: Simplified Input Handling"""
    result = agent.post({"topic": "remote work productivity"})
    assert result.status == "success"
    assert "tweet_options" in result
    assert len(result.tweet_options) >= 2

def test_ac3_tweet_options():
    """Test AC-3: Tweet Option Generation"""
    result = agent.post({"topic": "AI automation"})
    assert len(result.tweet_options) == 2 or len(result.tweet_options) == 3
    for option in result.tweet_options:
        assert option.engagement_prediction >= 60

def test_ac4_strategy_documentation():
    """Test AC-4: Strategy Documentation"""
    result = agent.post({"topic": "startup lessons"})
    for option in result.tweet_options:
        assert option.strategy_used in ["controversial", "inviting", "resonant"]

def test_ac5_engagement_prediction():
    """Test AC-5: Engagement Prediction"""
    result = agent.post({"topic": "productivity tips"})
    for option in result.tweet_options:
        assert 1 <= option.engagement_prediction <= 100

def test_ac10_vague_topic():
    """Test AC-10: Vague Topic Handling"""
    result = agent.post({"topic": "stuff"})
    assert result.status == "error"
    assert "clarifying" in result.message.lower() or "more specific" in result.message.lower()

def test_ac11_platform_violation():
    """Test AC-11: Platform Violation Handling"""
    result = agent.post({"topic": "how to harm others"})
    assert result.status == "error"
    assert "violat" in result.message.lower()

def test_ac13_character_limit():
    """Test AC-13: Character Limit Compliance"""
    result = agent.post({"topic": "comprehensive guide to everything about technology and business and life"})
    for option in result.tweet_options:
        assert len(option.tweet_text) <= 280
```

### Manual Testing Checklist
- [ ] Test all 3 viral strategies produce different outputs
- [ ] Verify CTA formula applied correctly when include_cta=true
- [ ] Confirm one sentence per line formatting in output
- [ ] Test audience inference for various topic types
- [ ] Verify strategy auto-detection works correctly
- [ ] Test thread format generates multiple tweets
- [ ] Confirm suggested hashtags are relevant and not excessive

## Test Data Examples

### Valid Inputs
```json
{"topic": "remote work productivity"}
{"topic": "AI will replace most developers", "strategy_preferred": "controversial"}
{"topic": "my SaaS grew to $10k MRR", "include_cta": true, "format": "thread"}
{"topic": "startup lessons", "goal": "conversions", "tone": "bold"}
```

### Edge Case Inputs
```json
{"topic": "x"}  // Too short
{"topic": ""}   // Empty
{"topic": "stuff"}  // Vague
{"topic": "life"}  // Abstract
```

### Invalid Inputs
```json
{}  // Missing topic
{"goal": "engagement"}  // Missing topic
{"topic": null}  // Null topic
```

## Pass/Fail Summary

| Criterion | Pass | Fail | Notes |
|-----------|------|------|-------|
| AC-1 | ⬜ | ⬜ | |
| AC-2 | ⬜ | ⬜ | |
| AC-3 | ⬜ | ⬜ | |
| AC-4 | ⬜ | ⬜ | |
| AC-5 | ⬜ | ⬜ | |
| AC-6 | ⬜ | ⬜ | |
| AC-7 | ⬜ | ⬜ | |
| AC-8 | ⬜ | ⬜ | |
| AC-9 | ⬜ | ⬜ | |
| AC-10 | ⬜ | ⬜ | |
| AC-11 | ⬜ | ⬜ | |
| AC-12 | ⬜ | ⬜ | |
| AC-13 | ⬜ | ⬜ | |
| AC-14 | ⬜ | ⬜ | |
| AC-15 | ⬜ | ⬜ | |
| AC-16 | ⬜ | ⬜ | |
| AC-17 | ⬜ | ⬜ | |
| AC-18 | ⬜ | ⬜ | |
| AC-19 | ⬜ | ⬜ | |
| AC-20 | ⬜ | ⬜ | |
| AC-21 | ⬜ | ⬜ | |
| AC-22 | ⬜ | ⬜ | |
| AC-23 | ⬜ | ⬜ | |
| AC-24 | ⬜ | ⬜ | |

**Final Status**: ⬜ All Criteria Passing

---

**Document Version**: 1.0
**Created**: Phase 2 - Specification
**Status**: Ready for Verification
