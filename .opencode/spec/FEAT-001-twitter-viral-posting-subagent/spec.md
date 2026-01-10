# Specification: Twitter Viral Posting Subagent (FEAT-001)

## Overview

The Twitter Viral Posting Subagent is a specialized content creation agent that transforms user-provided topics into viral-ready Twitter posts. It leverages proven viral strategies, Twitter-specific copywriting principles, and tactical writing techniques to generate engaging content designed to maximize active engagement (replies, bookmarks, shares) rather than passive metrics (likes).

The subagent operates with a modular architecture, delegating to three comprehensive skill files: viral strategies, copywriting principles, and writing techniques. This separation enables independent updates to strategies, principles, or techniques without modifying core agent logic. The agent accepts a simplified input model where only `topic` is required, with all other parameters having intelligent defaults that are automatically applied based on topic analysis.

The target users are content creators, marketers, founders, and professionals who need to create engaging Twitter content but may lack the time or expertise to optimize for viral potential. The agent solves the problem of creating high-quality, engagement-optimized tweets that follow established patterns for Twitter success.

## Spec Depth

**Level**: L3 (Detailed Depth)

**Justification**: Medium complexity due to modular skill architecture requires explicit data schemas, API contracts between agent and skills, strategy selection logic with decision trees, output format definitions, and measurable success criteria. L3 provides sufficient detail for implementers to build the orchestration logic while skills contain the comprehensive reference content.

## Acceptance Criteria

### Functional Requirements

- [ ] **AC-1**: Agent accepts `topic` as the only required input parameter (minimum 1 word, maximum 200 characters)
- [ ] **AC-2**: Agent applies smart defaults for all optional parameters: `goal` (engagement), `strategy_preferred` (auto), `format` (single), `tone` (casual), `include_cta` (false)
- [ ] **AC-3**: Agent generates 2-3 tweet options meeting minimum quality threshold (60+ engagement score)
- [ ] **AC-4**: Each generated tweet includes: `tweet_text`, `strategy_used`, `engagement_prediction`, `why_it_works`, `suggested_hashtags`, `variation_notes`
- [ ] **AC-5**: Agent applies all 3 viral strategies from twitter-viral-strategies skill (controversial, inviting, resonant)
- [ ] **AC-6**: Agent applies all 12 Twitter copywriting categories from twitter-copywriting-principles skill
- [ ] **AC-7**: Agent applies all 20 writing principles from twitter-copywriting-principles skill
- [ ] **AC-8**: Agent handles vague topics gracefully with clarifying questions
- [ ] **AC-9**: Agent rejects platform violations with appropriate error messages
- [ ] **AC-10**: All generated tweets achieve minimum 60-point engagement score

### Quality Thresholds

- [ ] **AC-11**: Maximum 280 characters per single tweet
- [ ] **AC-12**: Maximum 10 tweets per thread
- [ ] **AC-13**: Readability grade level 8 or below (measured by Flesch-Kincaid or equivalent)
- [ ] **AC-14**: One sentence per line formatting applied to all output
- [ ] **AC-15**: White space optimization for scannability
- [ ] **AC-16**: CTA remains non-desperate when included (no begging language, clear value proposition)

### Edge Cases

- [ ] **AC-17**: Vague topics (fewer than 3 words or overly abstract) generate clarifying questions
- [ ] **AC-18**: Restricted topics (hate speech, violence, illegal content) generate platform violation errors
- [ ] **AC-19**: Over-length content is automatically truncated or split into threads
- [ ] **AC-20**: Conflicting parameters resolve to viral best practices with explanatory notes
- [ ] **AC-21**: Empty or null topic generates helpful error message

### Error Handling

- [ ] **AC-22**: Error type 1 (vague topic) handled with specific response
- [ ] **AC-23**: Error type 2 (platform violations) handled with specific response
- [ ] **AC-24**: Error type 3 (generation failure) handled with specific response
- [ ] **AC-25**: Error type 4 (character limit issues) handled with automatic recovery
- [ ] **AC-26**: Error type 5 (voice conflict) handled with compromise suggestion
- [ ] **AC-27**: No generation failures without helpful feedback to user

## Technical Design

### Data Models

#### Topic Analysis Schema

```
interface TopicAnalysis {
  // Core analysis
  primary_concept: string;           // Main topic extracted from input
  secondary_concepts: string[];      // Supporting concepts identified
  target_audience: string;           // Inferred audience (e.g., "developers", "founders")
  audience_expertise: "beginner" | "intermediate" | "advanced";
  
  // Sensitivity checks
  sensitivity_flags: string[];       // Categories requiring care
  is_restricted: boolean;            // Platform violation check
  restricted_category?: string;      // Specific violation if applicable
  
  // Strategy indicators
  strategy_indicators: {
    controversial_keywords: string[];    // Words suggesting controversial angle
    inviting_keywords: string[];         // Words suggesting experiential angle
    resonant_keywords: string[];         // Words suggesting universal theme
  };
  
  // Content characteristics
  content_type: "opinion" | "howto" | "story" | "observation" | "announcement";
  emotional_tone: "positive" | "negative" | "neutral" | "provocative";
  complexity_level: "simple" | "moderate" | "complex";
  
  // Engagement potential
  viral_potential_score: number;     // 0-100 initial assessment
  recommended_strategies: string[];  // Priority-ordered list of strategies
}
```

#### Strategy Selection Schema

```
interface StrategySelection {
  selected_strategy: "controversial" | "inviting" | "resonant";
  strategy_confidence: number;       // 0-1 confidence score
  selection_reason: string;          // Explanation of why strategy was chosen
  alternative_strategies: string[];  // Backup strategies if primary fails
  auto_detected: boolean;            // True if auto-selected, false if user-specified
}
```

#### Hook Generation Schema

```
interface HookOption {
  hook_text: string;                 // The hook content
  hook_type: "claim" | "question" | "statement" | "provocation";
  engagement_trigger: "curiosity" | "controversy" | "relatability" | "value";
  target_emotion: string;            // Primary emotion to evoke
  character_count: number;
  score_breakdown: {
    directness: number;              // 0-25 points
    benefit_clarity: number;         // 0-25 points
    attention_grab: number;          // 0-25 points
    originality: number;             // 0-25 points
  };
  total_score: number;               // Sum of breakdown, max 100
}
```

#### Tweet Content Schema

```
interface TweetContent {
  // Core content
  tweet_text: string;                // The full tweet (max 280 chars)
  
  // Structural elements
  hook: string;                      // Opening line/segment
  body: string;                      // Main content
  cta?: string;                      // Call-to-action (if include_cta=true)
  hashtags: string[];                // Auto-suggested hashtags
  
  // Strategy attribution
  strategy_used: "controversial" | "inviting" | "resonant";
  copywriting_principles_applied: string[];  // References to applied principles
  
  // Quality metrics
  engagement_prediction: number;     // 1-100 predicted engagement score
  readability_score: number;         // Grade level
  character_count: number;
  
  // Explanation
  why_it_works: string;              // Brief rationale for viral potential
  variation_notes: string;           // Key differences from other options
}
```

#### Output Response Schema

```
interface TweetResponse {
  // Primary output
  tweet_options: TweetContent[];     // Array of 2-3 generated options
  
  // Metadata
  total_options: number;
  primary_recommendation: string;    // Index of best option (e.g., "0" or "1")
  
  // Analysis results
  topic_analysis: string;            // Human-readable topic interpretation
  strategy_rationale: string;        // Why selected strategies were chosen
  
  // Processing metadata
  processing_time_ms: number;
  generation_attempts: number;       // How many attempts to generate quality output
  quality_filter_applied: boolean;   // Whether low-quality options were filtered
}
```

#### Input Parameters Schema

```
interface TweetInput {
  // Required
  topic: string;                     // What the tweet should be about
  
  // Optional with defaults
  goal?: "engagement" | "awareness" | "conversions";
  strategy_preferred?: "controversial" | "inviting" | "resonant" | "auto";
  format?: "single" | "thread" | "multiple";
  tone?: "professional" | "casual" | "bold" | "storytelling";
  include_cta?: boolean;
  
  // Advanced optional
  audience_hint?: string;
  style_examples?: string;
  max_length?: number;               // Default 280, can be higher for threads
}
```

### API Contracts

#### Agent-to-Skill Interface

**Skill 1: twitter-viral-strategies.md**

```
interface StrategySkillInput {
  topic_analysis: TopicAnalysis;
  user_strategy_preference: "controversial" | "inviting" | "resonant" | "auto";
  goal: "engagement" | "awareness" | "conversions";
}

interface StrategySkillOutput {
  selected_strategy: "controversial" | "inviting" | "resonant";
  strategy_confidence: number;
  selection_reason: string;
  implementation_guidance: {
    primary_angle: string;
    hooks_to_try: string[];
    body_approaches: string[];
    cta_recommendations: string;
    hashtags_suggested: string[];
  };
  examples: {
    similar_topics: string[];
    example_tweets: string[];
  };
}
```

**Skill 2: twitter-copywriting-principles.md**

```
interface PrinciplesSkillInput {
  strategy: "controversial" | "inviting" | "resonant";
  topic_analysis: TopicAnalysis;
  current_draft?: string;            // Optional: improve existing draft
  goal: "engagement" | "awareness" | "conversions";
  include_cta: boolean;
  tone: "professional" | "casual" | "bold" | "storytelling";
}

interface PrinciplesSkillOutput {
  enhanced_draft: string;
  principles_applied: string[];
  improvements_made: {
    hook_improvements: string[];
    structure_improvements: string[];
    tone_adjustments: string[];
    cta_optimizations: string[];
  };
  readability_score: number;
  character_count: number;
  alternative_versions: string[];
}
```

**Skill 3: twitter-writing-techniques.md**

```
interface TechniquesSkillInput {
  draft_content: string;
  target_platform: "twitter";        // Currently only Twitter supported
  optimization_goal: "readability" | "engagement" | "clarity";
  audience_expertise: "beginner" | "intermediate" | "advanced";
}

interface TechniquesSkillOutput {
  optimized_content: string;
  formatting_applied: {
    one_sentence_per_line: boolean;
    white_space_added: boolean;
    list_formatting: "dash" | "bullet" | "number" | "none";
    readability_improvement: number;
  };
  style_notes: string;
  simplification_suggestions: string[];
  alternatives: string[];
}
```

### Behavior Specifications

#### Stage 1: Topic Analysis

**Trigger**: Agent receives TweetInput with valid topic

**Preconditions**:
- topic is non-empty string
- topic length between 1 and 200 characters
- No platform violation keywords detected in initial scan

**Behavior**:
1. Parse topic for primary concept using keyword extraction
   - Remove stop words (the, a, an, is, are, etc.)
   - Identify noun phrases and key concepts
   - Detect compound topics (e.g., "AI automation" → ["AI", "automation"])

2. Infer target audience from topic keywords
   - Build audience dictionary from skill file
   - Match topic against audience indicators
   - Default to "general professional" if no match

3. Check for sensitivity and restricted content
   - Compare against platform violation database
   - Flag topics requiring careful handling
   - Reject outright violations with error

4. Identify strategy indicators
   - Scan for controversial keywords (wrong, overrated, dead, lie, etc.)
   - Scan for inviting keywords (ever, when you, experience, etc.)
   - Scan for resonant keywords (truth, moment, realization, etc.)

5. Assess content characteristics
   - Classify content type (opinion/howto/story/observation/announcement)
   - Detect emotional tone from keyword analysis
   - Evaluate complexity based on vocabulary and structure

6. Score viral potential
   - Calculate initial 0-100 score based on:
     - Controversy potential (0-30)
     - Relatability factors (0-30)
     - Actionability indicators (0-20)
     - Timeliness/Relevance (0-20)

**Postconditions**:
- TopicAnalysis object created with all fields populated
- If sensitivity flags present, set is_restricted appropriately
- If is_restricted=true, skip to error handling

**Error Cases**:
- Empty topic: Trigger Error Type 1 (vague topic)
- Topic < 3 characters: Trigger Error Type 1 (vague topic)
- Topic contains restricted content: Trigger Error Type 2 (platform violations)
- Topic analysis fails: Trigger Error Type 3 (generation failure)

#### Stage 2: Strategy Selection

**Trigger**: Valid TopicAnalysis object from Stage 1

**Preconditions**:
- TopicAnalysis.complete = true
- is_restricted = false

**Behavior**:
1. Check user strategy preference
   - If user specified "controversial" | "inviting" | "resonant": use that
   - If user specified "auto": proceed to auto-detection

2. Auto-detection logic (if strategy_preferred="auto"):
   - Calculate scores for each strategy based on topic analysis:
     ```
     controversial_score = controversial_keyword_matches * 10 + 
                          controversy_potential * 0.5 +
                          audience_opinion_likelihood * 0.3
     
     inviting_score = inviting_keyword_matches * 10 + 
                     experiential_content_type_boost +
                     audience_story_potential * 0.5
     
     resonant_score = resonant_keyword_matches * 10 + 
                     universal_theme_indicators * 0.5 +
                     emotional_connection_potential * 0.4
     ```
   - Select strategy with highest score
   - If scores are within 5 points, prioritize: resonant → inviting → controversial

3. Calculate confidence score
   - High confidence (>0.8): Strong indicators for selected strategy
   - Medium confidence (0.5-0.8): Moderate indicators
   - Low confidence (<0.5): Unclear signals, may need fallback

4. Select alternative strategies
   - If primary confidence < 0.6, include 1-2 alternatives
   - Generate these as backup options during drafting

5. Generate selection reason
   - Create human-readable explanation of why strategy was chosen
   - Reference specific topic characteristics that influenced decision

**Postconditions**:
- StrategySelection object created
- primary_recommendation set to selected strategy
- alternative_strategies array populated if needed

**Error Cases**:
- All strategy scores below threshold: Default to "resonant" with note
- Topic analysis incomplete: Trigger Error Type 3 (generation failure)

#### Stage 3: Hook Generation

**Trigger**: Valid StrategySelection from Stage 2

**Preconditions**:
- StrategySelection.selected_strategy is defined
- TopicAnalysis is valid

**Behavior**:
1. Load hook templates from twitter-viral-strategies skill for selected strategy
   - Controversial: Templates that force binary responses
   - Inviting: Templates that prompt sharing and stories
   - Resonant: Templates that articulate shared experiences

2. Generate 5-7 hook candidates based on:
   - Strategy-specific templates
   - Topic content from analysis
   - Goal alignment (engagement/awareness/conversions)

3. Score each hook candidate:
   - Directness (0-25): Does it address reader directly?
   - Benefit clarity (0-25): Is value immediately clear?
   - Attention grab (0-25): Does it stop the scroll?
   - Originality (0-25): Is it fresh, not overused?

4. Filter candidates below 60 points

5. Select top 3-5 hooks for body development

**Postconditions**:
- Array of HookOption objects created
- Minimum 3 hooks available for next stage
- Hooks sorted by total_score descending

**Error Cases**:
- All hooks below 60 points: Retry with modified approach
- Hook generation fails: Trigger Error Type 3 (generation failure)

#### Stage 4: Body Development

**Trigger**: Valid hook options from Stage 3

**Preconditions**:
- Minimum 3 hook options available
- StrategySelection is valid

**Behavior**:
1. For each hook option:
   a. Load twitter-copywriting-principles skill
   b. Apply strategy-specific body approaches
   c. Generate body content following writing principles:
      - One idea per sentence
      - Use active voice
      - Be concrete with specific examples
      - Vary sentence length for rhythm
      - Apply psychological triggers appropriate to strategy

2. For controversial strategy:
   - Present binary framing of nuanced topic
   - Include provocative claim that invites agreement/disagreement
   - Add evidence or reasoning to support claim
   - End with question that forces response

3. For inviting strategy:
   - Create prompt for audience experiences
   - Use inclusive language ("you", "we", "anyone who")
   - Leave space for personal stories
   - End with clear invitation to share

4. For resonant strategy:
   - Articulate unspoken truth or shared feeling
   - Use "that moment when" or similar universal framing
   - Connect to common experience
   - End with recognition of shared sentiment

5. Apply copywriting principles:
   - Format for skimmers (white space, bullets)
   - Use power words and action verbs
   - Maintain consistent voice and tone
   - Apply psychological triggers

**Postconditions**:
- Array of body draft objects created
- Each draft includes hook + body content
- Drafts meet basic quality threshold (60+ points)

**Error Cases**:
- Body development fails for all hooks: Trigger Error Type 3 (generation failure)
- Character limit exceeded: Mark for truncation in Stage 6

#### Stage 5: Readability Optimization

**Trigger**: Valid body drafts from Stage 4

**Preconditions**:
- Minimum 1 body draft available
- All drafts have character_count > 0

**Behavior**:
1. Load twitter-writing-techniques skill

2. For each body draft:
   a. Apply one sentence per line formatting
      - Split sentences at natural breaks
      - Ensure each line contains one complete thought
      - Use line breaks for emphasis and pacing
   
   b. Add white space optimization
      - Insert blank lines between sections
      - Create visual breathing room
      - Use paragraph breaks for new concepts
   
   c. Apply list formatting
      - Use "-" or ">" for bullet points
      - Use "1." for sequential items
      - Keep lists to 4 items maximum for Twitter
   
   d. Simplify language
      - Apply 14-year-old cousin test
      - Replace complex vocabulary with simpler alternatives
      - Remove unnecessary jargon
      - Aim for grade 8 reading level or below
   
   e. Verify conversational tone
      - Replace formal constructions with casual equivalents
      - Add contractions where natural
      - Ensure direct address ("you") throughout

3. Calculate readability improvement
   - Compare original vs. optimized readability scores
   - Flag drafts with insufficient improvement

**Postconditions**:
- Array of optimized drafts created
- All drafts meet readability threshold
- Formatting applied consistently

**Error Cases**:
- Readability cannot be improved to grade 8: Note limitation, proceed with best effort
- Formatting errors introduced: Revert to previous version

#### Stage 6: CTA Integration

**Trigger**: Optimized drafts from Stage 5, include_cta flag true

**Preconditions**:
- include_cta = true in original input
- Optimized drafts available
- StrategySelection is valid

**Behavior**:
1. Load CTA formula from twitter-copywriting-principles skill

2. Apply CTA formula (4 steps):
   ```
   Step 1: Clear action → "Comment", "Follow", "Retweet", "Save"
   Step 2: Specific trigger → "Comment 'X'", "Follow for more", "Save for later"
   Step 3: Benefit reminder → "and I'll DM you...", "for exclusive content"
   Step 4: Requirements → "(must be following)", "(limited to first 100)"
   ```

3. Strategy-specific CTA recommendations:
   - Controversial: CTAs that drive replies and debate
   - Inviting: CTAs that encourage story sharing
   - Resonant: CTAs that prompt agreement and quote tweets

4. Ensure CTA is non-desperate:
   - No begging language ("please", "pretty please")
   - No guilt-tripping ("if you care about...")
   - Clear value proposition for action
   - Low friction (simple action)

5. Integrate CTA into tweet:
   - Add as final line/segment
   - Ensure total character count ≤ 280
   - Preserve readability and flow

6. If CTA makes tweet exceed character limit:
   - Attempt to shorten body content
   - If still too long, offer thread option
   - Document truncation in variation_notes

**Postconditions**:
- All drafts have CTA integrated (if include_cta=true)
- CTAs are non-desperate and value-aligned
- Character limits maintained

**Error Cases**:
- Cannot fit CTA within character limit: Suggest thread format
- CTA feels forced/unnatural: Remove CTA, note in output

#### Stage 7: Quality Scoring and Selection

**Trigger**: Final drafts from Stage 6 (or Stage 5 if include_cta=false)

**Preconditions**:
- Minimum 1 final draft available
- All drafts have engagement_prediction calculated

**Behavior**:
1. Score each draft on engagement rubric (100 points total):
   ```
   Hook Strength (25 pts):
   - Direct address to reader: 0-10
   - Benefit-led opening: 0-10
   - Attention-grabbing claim: 0-5
   
   Content Value (25 pts):
   - Fresh insight: 0-10
   - Immediately actionable: 0-10
   - Unique perspective: 0-5
   
   Readability (25 pts):
   - One sentence per line: 0-10
   - White space and scannability: 0-10
   - Simple language (grade 8 or below): 0-5
   
   Viral Potential (25 pts):
   - Active engagement triggers: 0-10
   - Emotional resonance: 0-8
   - Shareability factor: 0-7
   ```

2. Filter drafts below 60 points
   - If all drafts fail: Retry generation with modified approach
   - If still failing: Trigger Error Type 3 (generation failure)

3. Select top 2-3 drafts for output
   - Prioritize diversity of strategies when possible
   - Ensure options are meaningfully different
   - Avoid near-duplicate content

4. Calculate engagement_prediction for each
   - Map rubric score to 1-100 prediction
   - Add strategic adjustments based on historical patterns

5. Generate why_it_works explanation
   - Summarize key viral factors
   - Reference applied strategies and principles
   - Highlight unique value proposition

6. Generate variation_notes
   - Explain key differences between options
   - Recommend best use case for each

**Postconditions**:
- Final TweetContent array created (2-3 options)
- primary_recommendation set to best option
- All quality thresholds met

**Error Cases**:
- No drafts meet 60-point threshold: Maximum 3 retry attempts, then Error Type 3

### State Transitions

#### Main Processing Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Idle                                      │
└─────────────────────────┬───────────────────────────────────────┘
                          │ Receive valid TweetInput
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Topic Analysis                                │
│  State: ANALYZING_TOPIC                                          │
│  Validates input, extracts concepts, checks sensitivity          │
└─────────────────────────┬───────────────────────────────────────┘
                          │
              ┌───────────┴───────────┐
              │                       │
              ▼                       ▼
    ┌─────────────────┐     ┌─────────────────┐
    │ Valid Analysis  │     │ Error: Vague    │
    │ Continue        │     │ Go to Error 1   │
    └────────┬────────┘     └─────────────────┘
             │
             │ (is_restricted check)
             ▼
    ┌─────────────────┐     ┌─────────────────┐
    │ Clean Content   │     │ Error: Platform │
    │ Continue        │     │ Go to Error 2   │
    └────────┬────────┘     └─────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Strategy Selection                             │
│  State: SELECTING_STRATEGY                                       │
│  Applies auto-detect or user preference                          │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Hook Generation                                │
│  State: GENERATING_HOOKS                                         │
│  Creates 5-7 candidates, filters below 60 points                │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Body Development                               │
│  State: DEVELOPING_BODY                                          │
│  Applies copywriting principles, strategy-specific approaches    │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                Readability Optimization                          │
│  State: OPTIMIZING_READABILITY                                   │
│  Applies formatting, simplifies language                         │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
    ┌─────────────────────┴─────────────────────┐
    │                                       │
    │ include_cta=true                 include_cta=false
    ▼                                       ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│    CTA Integration      │     │    Skip to Quality      │
│  State: INTEGRATING_CTA │     │    State: SCORING       │
│  Apply CTA formula      │     │                         │
└───────────┬─────────────┘     └───────────┬─────────────┘
            │                             │
            ▼                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Quality Scoring                                │
│  State: SCORING                                                  │
│  Scores drafts, filters below 60, selects top 2-3               │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Complete                                       │
│  State: COMPLETE                                                 │
│  Returns TweetResponse with options                              │
└─────────────────────────────────────────────────────────────────┘
```

#### Error State Flow

```
Any Processing State
        │
        │ Error detected
        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Error Handler                                 │
│  Identifies error type, generates appropriate response          │
└───────────┬─────────────┬─────────────┬─────────────┬───────────┘
            │             │             │             │
   Error 1  │   Error 2   │   Error 3   │   Error 4   │  Error 5
   Vague    │ Platform    │ Generation  │ Character   │ Voice
   Topic    │ Violations  │ Failure     │ Limit       │ Conflict
            │             │             │             │
            ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Error Response                                 │
│  Returns helpful message, suggests next steps                    │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ User provides corrected input
                          ▼
                    ┌───────────┐
                    │  Retry    │
                    │ (Loop)    │
                    └─────┬─────┘
                          │
                          └──────────────┐
                                         │
                          Valid input    │ Invalid input
                          continues      │ returns to error
                          processing     │
                                         ▼
                                   ┌───────────┐
                                   │ Fail      │
                                   │ Gracefully│
                                   └───────────┘
```

### Edge Cases

#### Edge Case 1: Vague Topic

**Detection**: Topic meets any of:
- Fewer than 3 words
- Abstract concepts without specificity (e.g., "life", "success", "things")
- Topic score < 20 on specificity rubric

**Handling**:
1. Generate clarifying question based on topic analysis
2. Return error response with question
3. Do not attempt generation
4. Example response: "I'd love to help create a viral tweet about [topic]. Could you share more specifics about what aspect you'd like to focus on? For example, if you said 'productivity,' you might mean time management, tools, habits, or something else entirely."

#### Edge Case 2: Platform Violations

**Detection**: Topic contains:
- Hate speech or discriminatory content
- Violence or self-harm encouragement
- Illegal activity promotion
- Misinformation about protected categories
- Adult content references

**Handling**:
1. Immediately reject with error
2. Do not attempt generation
3. Clear error message: "I can't help with that topic as it violates Twitter's content policies."
4. Log violation attempt for safety monitoring

#### Edge Case 3: Generation Failure

**Detection**: All generation attempts fail quality threshold (60+ points)

**Handling**:
1. After maximum retry attempts (3), return error
2. Provide specific feedback on what failed
3. Suggest alternative approaches
4. Example: "I'm having trouble creating high-quality options for this topic. Could you provide more context or a different angle?"

#### Edge Case 4: Character Limit Issues

**Detection**: Draft content exceeds 280 characters

**Handling**:
1. Attempt automatic truncation:
   - Remove less essential sentences
   - Simplify language
   - Shorten words where possible
2. If still over limit:
   - Suggest thread format
   - Offer shortened version with "thread" CTA
3. Document truncation in variation_notes

#### Edge Case 5: Voice Conflict

**Detection**: Requested tone conflicts with viral best practices

**Handling**:
1. Identify conflict (e.g., "professional" tone with "controversial" strategy)
2. Propose compromise:
   - Maintain professionalism while allowing appropriate controversy
   - Suggest alternative strategy that fits tone better
3. Explain trade-offs transparently
4. Allow user to choose or proceed with recommendation

### Error Handling

#### Error Type 1: Vague Topic

**Error Code**: ERR_TOPIC_VAGUE

**Response Schema**:
```
interface VagueTopicError {
  error: {
    code: "ERR_TOPIC_VAGUE";
    message: string;
    clarification_question: string;
    examples: string[];
  };
  can_retry: true;
  suggested_topic_improvements: string[];
}
```

**Default Message**: "I'd love to help create a viral tweet about [topic]. Could you share more specifics about what aspect you'd like to focus on?"

**Behavior**: Stop processing, return error, await user clarification

#### Error Type 2: Platform Violations

**Error Code**: ERR_PLATFORM_VIOLATION

**Response Schema**:
```
interface PlatformViolationError {
  error: {
    code: "ERR_PLATFORM_VIOLATION";
    message: string;
    violation_category: string;
  };
  can_retry: false;
}
```

**Default Message**: "I can't help with that topic as it violates Twitter's content policies."

**Behavior**: Stop processing, return error, do not retry

#### Error Type 3: Generation Failure

**Error Code**: ERR_GENERATION_FAILED

**Response Schema**:
```
interface GenerationFailureError {
  error: {
    code: "ERR_GENERATION_FAILED";
    message: string;
    attempts_made: number;
    last_error?: string;
  };
  can_retry: true;
  suggestions: string[];
}
```

**Default Message**: "I'm having trouble creating high-quality options for this topic. Could you provide more context or a different angle?"

**Behavior**: Stop processing, return error, allow retry with improved input

#### Error Type 4: Character Limit Issues

**Error Code**: ERR_CHARACTER_LIMIT

**Response Schema**:
```
interface CharacterLimitError {
  error: {
    code: "ERR_CHARACTER_LIMIT";
    message: string;
    current_length: number;
    excess_characters: number;
    suggested_action: "truncation" | "thread" | "simplification";
  };
  can_retry: false;  // Auto-handled, not returned to user
}
```

**Behavior**: Automatic handling, no error returned to user. Content is truncated or split.

#### Error Type 5: Voice Conflict

**Error Code**: ERR_VOICE_CONFLICT

**Response Schema**:
```
interface VoiceConflictError {
  error: {
    code: "ERR_VOICE_CONFLICT";
    message: string;
    conflict_details: string;
  };
  can_retry: true;
  suggestions: {
    compromise: string;
    rationale: string;
  }[];
}
```

**Default Message**: "The requested tone [X] conflicts with [Y] strategy. Here's a compromise..."

**Behavior**: Return warning with suggestions, allow user to choose or accept compromise

## Performance Requirements

### Processing Time

- **Topic Analysis**: < 100ms
- **Strategy Selection**: < 50ms
- **Hook Generation**: < 200ms
- **Body Development**: < 300ms
- **Readability Optimization**: < 150ms
- **CTA Integration**: < 50ms
- **Quality Scoring**: < 100ms

**Total End-to-End**: < 1000ms (1 second) for simple topics
**Complex Topics**: < 2000ms (2 seconds) with retry logic

### Throughput

- **Concurrent Requests**: Agent supports parallel processing of multiple requests
- **Rate Limiting**: Not applicable (subagent called by orchestrator)
- **Retry Logic**: Maximum 3 generation attempts per request

### Quality Metrics

- **Minimum Output Quality**: 60 engagement score threshold
- **Readability Target**: Grade 8 or below (Flesch-Kincaid)
- **Character Limit Compliance**: 100% of outputs within 280 chars
- **Strategy Application**: 100% of outputs apply at least one viral strategy

## Security Considerations

### Input Validation

- **Topic Length**: Maximum 200 characters to prevent abuse
- **Character Whitelist**: Only allow safe characters (letters, numbers, basic punctuation)
- **Keyword Filtering**: Scan for platform violation keywords before processing
- **Injection Prevention**: Sanitize all input to prevent prompt injection attacks

### Output Safety

- **Content Moderation**: All outputs scanned for policy violations before return
- **No Sensitive Data**: Agent does not store or expose user data in outputs
- **Rate Limiting**: Prevent spam generation by limiting output options

### Privacy

- **No Persistence**: Agent does not store topic inputs or generated content
- **Session Isolation**: Each request processed independently with no cross-request memory
- **No Third-Party Calls**: Agent operates entirely within OpenCode infrastructure

## Traceability

### From Approach Document

| Approach Decision | Spec Section | Status |
|-------------------|--------------|--------|
| Option B: Agent + Comprehensive Skill Architecture | Technical Design / Architecture | ✅ Covered |
| Simplified Input: topic only required | Input Parameters Schema | ✅ Covered |
| Smart Defaults for all optional parameters | Behavior Specifications / Stage 1 | ✅ Covered |
| 3 Viral Strategies from Tutorial #1 | Behavior Specifications / Stage 2 | ✅ Covered |
| 12 Twitter Copywriting Categories | Behavior Specifications / Stage 4 | ✅ Covered |
| 20 Writing Principles | Behavior Specifications / Stage 4 | ✅ Covered |
| Tutorial #2 "How to Tweet" content | Behavior Specifications / Stage 5 | ✅ Covered |
| L3 Spec Depth for medium complexity | Spec Depth | ✅ Covered |
| Auto-detect strategy selection | Behavior Specifications / Stage 2 | ✅ Covered |
| Quality scoring with 60-point threshold | Behavior Specifications / Stage 7 | ✅ Covered |
| 7-stage processing pipeline | Behavior Specifications | ✅ Covered |
| 5 error types with specific handling | Error Handling | ✅ Covered |

### From Reference Files

| Reference Content | Spec Coverage | Status |
|-------------------|---------------|--------|
| twitter_copy_principles.md (12 categories) | Data Models / PrinciplesSkillOutput | ✅ All embedded in spec |
| writing_principles_context.txt (20 principles) | Behavior Specifications / Stage 4 | ✅ All referenced in spec |
| Viral strategies (3 types) | Behavior Specifications / Stage 2 | ✅ All covered |
| Writing techniques (Tutorial #2) | Behavior Specifications / Stage 5 | ✅ All referenced |

## Risks and Unknowns

### Risk 1: Skill File Size

**Risk**: Comprehensive skills containing all reference content may be large (~1200+ lines total), potentially impacting read performance.

**Mitigation**: Skills are loaded once per agent session and cached. For subagent pattern, skills are loaded at initialization.

**Status**: ✅ Low Risk - Caching handles this

### Risk 2: Strategy Overlap

**Risk**: The three viral strategies (controversial, inviting, resonant) may produce similar outputs for certain topics, reducing option diversity.

**Mitigation**: Quality scoring prioritizes diverse strategy selection. When generating multiple options, agent ensures different strategies are used.

**Status**: ✅ Medium Risk - Addressed in Stage 7 selection logic

### Risk 3: Readability Measurement Accuracy

**Risk**: Automated readability scoring (grade level) may not accurately reflect actual comprehension for Twitter's unique format.

**Mitigation**: 14-year-old cousin test provides human verification guideline. Readability score is advisory, not blocking.

**Status**: ✅ Low Risk - Human-aligned test supplement

### Risk 4: Cultural Context Loss

**Risk**: Viral strategies that work in one cultural context may not transfer to others (e.g., controversial takes vary by culture).

**Mitigation**: Agent analyzes audience hints when provided. Default audience inference considers general professional context.

**Status**: ⚠️ Medium Risk - Requires audience_hint parameter for cultural specificity

### Risk 5: Platform Algorithm Changes

**Risk**: Twitter's algorithm changes may affect what content goes viral, potentially invalidating some strategies.

**Mitigation**: Skills are designed to be updated independently. Strategy selection logic can be modified without changing core agent.

**Status**: ✅ Low Risk - Modular architecture supports updates

## Open Questions

1. **Question**: Should the agent maintain a history of generated tweets to improve future recommendations?

   **Impact**: Would enable personalization but adds persistence requirements.
   
   **Recommendation**: Out of scope for Phase 1. Consider for future enhancement.

2. **Question**: Should the agent support multiple languages beyond English?

   **Impact**: Would require translation skills and cultural adaptation logic.
   
   **Recommendation**: Out of scope for Phase 1. English-only initially.

3. **Question**: Should the agent validate generated tweets against current Twitter character limits including media?

   **Impact**: Would require platform API integration.
   
   **Recommendation**: Out of scope. Character limit based on text only (280 chars).

4. **Question**: Should generated tweets include image suggestions or only text?

   **Impact**: Would require image generation or selection capability.
   
   **Recommendation**: Out of scope. Text-only tweets initially.

## Implementation Notes

### Skill Loading Strategy

The agent should load skills at initialization and maintain references during processing:

```
skills = {
  "viral_strategies": load_skill("~/.config/opencode/skill/twitter-viral-strategies.md"),
  "copywriting_principles": load_skill("~/.config/opencode/skill/twitter-copywriting-principles.md"),
  "writing_techniques": load_skill("~/.config/opencode/skill/twitter-writing-techniques.md")
}
```

### Retry Strategy

For generation failures, implement exponential backoff with strategy variation:

```
Attempt 1: Standard generation with selected strategy
Attempt 2: Alternative strategy from selection
Attempt 3: Different tone and simplified approach
```

### Quality Gate

Before returning output, verify all quality gates:

1. ✅ Minimum 2 options generated
2. ✅ All options ≥ 60 engagement score
3. ✅ All options ≤ 280 characters
4. ✅ Readability grade ≤ 8
5. ✅ One sentence per line formatting applied
6. ✅ Strategy attribution complete

### Testing Strategy

Test cases should cover:
- Each error type with appropriate inputs
- All strategy × format combinations
- Edge cases (vague topics, character limits, etc.)
- Quality threshold boundary (59 vs 60 score)
- CTA integration scenarios

---

**Document Version**: 1.0
**Created**: Phase 2 - Specification
**Status**: Ready for Implementation
