---
version: "1.0"
model_hints:
  temperature: 0.7
  max_tokens: 4096
tags: ["twitter", "subagent", "content-creation", "social-media", "viral"]
---

# Specification: Twitter Viral Posting Subagent

## Overview

The Twitter Viral Posting Subagent generates viral-ready tweets based on proven engagement strategies and Twitter-specific copywriting principles. The subagent transforms user-provided topics into compelling, high-engagement Twitter content that follows established viral patterns while respecting platform guidelines and user brand voice requirements.

This subagent addresses the challenge of creating consistently engaging Twitter content that cuts through the noise and drives meaningful audience interaction. By leveraging three core viral strategies—Controversial Takes, Invite Sharing, and Deep Resonance—the subagent produces content designed to maximize bookmarks, replies, retweets, and viral reach.

## Spec Depth

**L2 (Standard Depth)** - This specification provides clear acceptance criteria with measurable pass/fail conditions, documented design decisions with rationale, defined component boundaries, high-level data flow documentation, and identified error categories. The L2 depth is appropriate because the scope is well-defined with proven strategies, the subagent has no external API dependencies, success criteria are measurable through engagement predictions, and design decisions are documented through approach options.

## Acceptance Criteria

- **AC-1**: Agent accepts topic, goal, and brand voice as required inputs with proper validation
- **AC-2**: Agent applies at least one of three viral strategies (controversial, invite sharing, deep resonance) to each output
- **AC-3**: Output follows Twitter-specific copywriting principles including readability, hooks, and CTAs
- **AC-4**: Content is formatted with proper white space and structure for skimmers
- **AC-5**: Agent can produce single tweets (280 char limit), threads (2-10 tweets), or multiple options
- **AC-6**: Each output includes brief explanation of strategy applied and engagement prediction
- **AC-7**: Output matches user's described brand voice within acceptable variance
- **AC-8**: Content is immediately actionable or valuable with no fluff or weak disclaimers
- **AC-9**: Agent detects and rejects topics violating Twitter platform guidelines
- **AC-10**: Agent handles vague or incomplete inputs by prompting for clarification

## Technical Design

### Agent Definition

**File Location**: `~/.config/opencode/agent/twitter-posting.md`

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

The agent operates in subagent mode, meaning it can be invoked by other agents via @mention but is not available as a standalone primary agent. The temperature of 0.7 enables creative variation while maintaining quality consistency. The agent has read and write tool access to work with user-provided context and generate output content.

### Input Specification

The subagent accepts structured input with the following parameters:

#### Required Inputs

| Parameter | Type | Description | Validation |
|-----------|------|-------------|------------|
| topic | string | 1-3 sentences describing the tweet subject or message to convey | Must contain meaningful content, minimum 10 characters |
| goal | enum | Desired engagement outcome: "engagement", "awareness", "conversions", "authority", "viral_reach" | Must be one of enum values |
| brand_voice | string | 2-3 adjectives describing desired tone (e.g., "confident but approachable", "sharp and provocative", "helpful and casual") | Must contain meaningful adjectives, minimum 5 characters |

#### Optional Inputs

| Parameter | Type | Description | Default | Validation |
|-----------|------|-------------|---------|------------|
| audience | string | Target reader description including demographics, interests, or pain points | Auto-detect from topic | Optional but recommended for quality |
| strategy_preference | enum | Which viral strategy to prioritize: "controversial", "invite_sharing", "deep_resonance", "auto_detect" | "auto_detect" | Must be one of enum values |
| format | enum | Output format: "single", "thread", "multiple_options" | "multiple_options" | Must be one of enum values |
| key_points | array[string] | 2-4 specific points or facts to include in content | [] | Maximum 4 items |
| examples | array[string] | 1-2 example tweets the user admires for style matching | [] | Maximum 2 items, must be valid tweet URLs or text |
| cta | string | Specific call-to-action if desired | Auto-generate | Optional, maximum 100 characters if provided |
| hashtags | boolean | Whether to include suggested hashtags | true | Must be boolean |
| max_length | enum | Preferred tweet length: "short" (under 140 chars), "medium" (140-200), "long" (200-280), "full" (280 max) | "medium" | Must be one of enum values |

### Output Specification

The subagent produces output in one of three formats based on the format parameter:

#### Single Tweet Output Format

```
[Tweet text optimized for viral potential, respecting character limits and formatting requirements]
---
Strategy: [Strategy name that was applied]
Why This Works: [2-3 sentence explanation of the engagement mechanics]
Predicted Engagement: [Primary engagement type and secondary possibilities]
Suggested Hashtags: [#hashtag1 #hashtag2 #hashtag3] (if applicable)
```

#### Thread Output Format

```
TWEET 1: [Hook/Opener designed to stop the scroll]
---
TWEET 2: [Value delivery or setup building on the hook]
---
TWEET 3: [Core insight, actionable content, or narrative continuation]
---
TWEET [N]: [CTA or conclusion with engagement prompt, designed to drive replies or retweets]
---
Thread Strategy: [Brief explanation of how the thread flows and engages readers]
Total Tweets: [Number]
Estimated Read Time: [X minutes]
Predicted Engagement: [Overall thread engagement potential and breakdown]
```

#### Multiple Options Output Format

```
OPTION A - [Strategy Name]:
[Tweet text]

Why It Works: [Strategy explanation]

Predicted Engagement: [Engagement type]

---

OPTION B - [Strategy Name]:
[Tweet text]

Why It Works: [Strategy explanation]

Predicted Engagement: [Engagement type]

---

OPTION C - [Strategy Name]:
[Tweet text]

Why It Works: [Strategy explanation]

Predicted Engagement: [Engagement type]

---

Recommendation: [Which option best fits the stated goal and why]
```

### Functional Requirements

#### FR-1: Topic Analysis and Angle Selection

The agent must parse user input to extract the core message, identify the target audience implied by the topic, and determine the most appropriate engagement angle. This analysis considers the topic's natural controversy level, its resonance potential with broad audiences, and opportunities for audience participation.

**Input Parsing Requirements**:
- Extract the primary claim or insight from the topic description
- Identify any stated or implied audience segment
- Detect the urgency or timeliness of the topic if mentioned
- Recognize any specific data points, examples, or evidence the user wants included

**Angle Selection Criteria**:
- Controversial angle if topic involves common wisdom, popular opinions, or established practices that can be challenged
- Invite sharing angle if topic relates to personal experiences, preferences, or relatable situations
- Deep resonance angle if topic involves unspoken thoughts, common struggles, or shared realizations
- Hybrid approach if topic naturally supports multiple angles (output as multiple options)

#### FR-2: Strategy Matching Based on Goal and Audience

The agent must map user goals to appropriate viral strategies and adapt execution based on audience characteristics.

**Goal-to-Strategy Mapping**:

| Goal | Primary Strategy | Secondary Strategy | Notes |
|------|------------------|---------------------|-------|
| engagement | Depends on audience | Mix of approaches | Replies via controversy/invitations, bookmarks via how-to |
| awareness | Deep resonance | Controversial | Shareable content that gets retweets |
| conversions | Value-first with CTA | Trust-building via resonance | Direct but not salesy |
| authority | Deep resonance | How-to content | Thought leadership positioning |
| viral_reach | Controversial | Invite sharing | Maximize shareability and replies |

**Audience Adaptation**:
- Professional audiences: More reserved controversial takes, deeper value focus
- General audiences: Relatable resonance, accessible invitations
- Niche audiences: Inside jokes, shared frustrations, specific terminology
- B2B audiences: Data-backed claims, professional tone, case study angles

#### FR-3: Hook Generation Using Proven Patterns

The agent must create compelling openings that stop the scroll using Twitter-specific hook patterns.

**Hook Pattern Categories**:

1. **Direct Address Hooks**: Target reader directly with benefit or pain point
   - Example: "You can make $2k per client" vs. "Web designers are making $2k per client"
   - Application: Lead with what's in it for them

2. **Contrarian Hooks**: Challenge conventional wisdom or popular opinions
   - Example: "Your favorite productivity advice is actually making you less productive"
   - Application: Force binary responses and debate

3. **Specific Number Hooks**: Lead with concrete, surprising data
   - Example: "$31K made in 90 days" vs. "Good money"
   - Application: Use specific over vague metrics

4. **Question Hooks**: Open with provocative questions that demand answers
   - Example: "What if everything you know about X is wrong?"
   - Application: Create curiosity gaps

5. **Story Promise Hooks**: Hint at a narrative journey
   - Example: "I analyzed 20 viral posts and found something unexpected..."
   - Application: Promise resolution to an interesting problem

**Hook Quality Criteria**:
- Must target reader directly ("you" language)
- Must lead with benefit, claim, or curiosity
- Must avoid overused patterns ("Most creators...", "Everyone is doing...")
- Must be consumable in under 2 seconds of skimming

#### FR-4: Body Writing Following Twitter Principles

The agent must apply Twitter copywriting principles throughout the tweet body.

**Body Writing Requirements**:
- One clear idea per tweet (one idea per tweet in threads)
- Short paragraphs of 1-2 sentences maximum
- Conversational tone with contractions and direct address
- Active voice throughout (subject → verb → object)
- Concrete and specific over abstract and general
- Concrete examples that paint clear pictures
- Action verbs leading to outcomes

**Sentence Structure**:
- Vary sentence length for rhythm (longer sentences build momentum, short sentences hit hard)
- Use transitions to guide reader logic ("However", "For example", "Meanwhile")
- Avoid fluff words and weak disclaimers ("This might help", "In my opinion")
- Confidence without arrogance

#### FR-5: CTA Integration

The agent must integrate appropriate calls-to-action that drive desired engagement.

**CTA Formula** (4-step process):

1. **Clear Action**: Comment, Follow, Like, Retweet, Bookmark
2. **Specific Trigger**: Comment "X", Follow for more, Like if you agree
3. **Benefit Reminder**: and I'll DM the full guide, for more insights
4. **Requirements**: (must be following), if you're serious about X

**CTA Placement**:
- End of single tweets with clear action
- End of threads with engagement prompt
- Integrated into content when naturally valuable
- Absent from purely informational content where CTA would feel forced

**CTA Quality Criteria**:
- Low friction (no email signup required unless core value proposition)
- Specific (not "let me know what you think" but "comment your industry")
- Valuable (the action should lead to something worth engaging with)

#### FR-6: Readability Optimization for Skimmers

The agent must structure content for maximum scanability and readability.

**Formatting Requirements**:
- One sentence per line for maximum readability in thread tweets
- Lists using "-" or ">" markers for bullet points
- Consistent white space between distinct ideas
- Visual breaks including emojis for emphasis (sparse, meaningful use)
- Bold text sparingly for key emphasis (limited markdown support on Twitter)

**Skimmer Optimization**:
- Key points stand out visually
- White space prevents wall-of-text appearance
- Numbered lists for sequential steps or rankings
- Paragraph breaks every 2-3 sentences maximum

**Character Limit Compliance**:
- Single tweets must not exceed 280 characters
- Each thread tweet must not exceed 280 characters
- Thread numbering must fit within character count
- Hashtags and mentions must be counted in total

#### FR-7: Voice Matching to Brand Guidelines

The agent must adapt tone and style to match user's brand voice description.

**Voice Parameters to Implement**:

| Voice Type | Characteristics | Application |
|------------|----------------|-------------|
| confident but approachable | Assured claims, warm language, expertise without elitism | Authority content, educational tweets |
| sharp and provocative | Direct challenges, bold claims, no hedging | Controversial takes, contrarian positions |
| helpful and casual | Friendly tone, easy language, supportive framing | How-to content, engagement invitations |
| witty and clever | Humor, wordplay, pop culture references | Relatable content, share-inviting tweets |
| professional but human | Polished language, occasional personality, industry terminology | B2B content, thought leadership |

**Voice Consistency Requirements**:
- Voice must remain consistent within each tweet
- Voice can shift across multiple options (showcasing range)
- Voice should feel natural, not forced or performative
- Contractions should match voice type (more for casual, fewer for professional)

### Processing Logic

#### Agent Processing Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Twitter Viral Posting Subagent                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐    ┌──────────────────────────────────────┐   │
│  │ User Input   │───▶│ 1. Input Validation & Clarification  │   │
│  │ (Topic, Goal,│    │    - Validate required parameters    │   │
│  │  Voice)      │    │    - Detect vague inputs             │   │
│  └──────────────┘    │    - Request clarification if needed │   │
│                      └──────────────────────────────────────┘   │
│                               │                                  │
│                               ▼                                  │
│                      ┌─────────────────┐                         │
│                      │ 2. Topic        │                         │
│                      │    Analysis     │                         │
│                      │                 │                         │
│                      │ - Core message  │                         │
│                      │ - Audience      │                         │
│                      │ - Key points    │                         │
│                      │ - Constraints   │                         │
│                      └─────────────────┘                         │
│                               │                                  │
│                               ▼                                  │
│              ┌────────────────────────────────┐                  │
│              │ 3. Strategy Selection          │                  │
│              │                                │                  │
│              │ If strategy_preference =       │                  │
│              │ "auto_detect":                 │                  │
│              │   - Analyze topic controversy  │                  │
│              │   - Assess resonance potential │                  │
│              │   - Evaluate shareability      │                  │
│              │   - Select optimal strategy    │                  │
│              │                                │                  │
│              │ Else:                          │                  │
│              │   - Use specified strategy     │                  │
│              │   - Adapt execution to topic   │                  │
│              └────────────────────────────────┘                  │
│                               │                                  │
│                               ▼                                  │
│              ┌────────────────────────────────┐                  │
│              │ 4. Content Generation          │                  │
│              │                                │                  │
│              │ A. Hook Generation             │                  │
│              │    - Apply hook patterns       │                  │
│              │    - Target reader directly    │                  │
│              │    - Lead with benefit/claim   │                  │
│              │                                │                  │
│              │ B. Body Writing                │                  │
│              │    - Apply writing principles  │                  │
│              │    - One idea per tweet        │                  │
│              │    - Conversational tone       │                  │
│              │    - Concrete and specific     │                  │
│              │                                │                  │
│              │ C. CTA Integration             │                  │
│              │    - Apply CTA formula         │                  │
│              │    - Match to goal type        │                  │
│              │    - Keep friction low         │                  │
│              │                                │                  │
│              │ D. Voice Adaptation            │                  │
│              │    - Match brand voice         │                  │
│              │    - Maintain consistency      │                  │
│              └────────────────────────────────┘                  │
│                               │                                  │
│                               ▼                                  │
│              ┌────────────────────────────────┐                  │
│              │ 5. Formatting & Optimization   │                  │
│              │                                │                  │
│              │ - Character count validation   │                  │
│              │ - Readability optimization     │                  │
│              │ - White space application      │                  │
│              │ - Hashtag suggestion           │                  │
│              │ - Engagement prediction        │                  │
│              └────────────────────────────────┘                  │
│                               │                                  │
│                               ▼                                  │
│              ┌────────────────────────────────┐                  │
│              │ 6. Quality Validation          │                  │
│              │                                │                  │
│              │ - Minimum engagement score     │                  │
│              │ - Readability check            │                  │
│              │ - Voice match verification     │                  │
│              │ - Platform compliance          │                  │
│              │ - Originality check            │                  │
│              │                                │                  │
│              │ If quality check fails:        │                  │
│              │   - Regenerate with adjusted   │                  │
│              │     parameters                 │                  │
│              │   - Maximum 3 regeneration     │                  │
│              │     attempts                   │                  │
│              └────────────────────────────────┘                  │
│                               │                                  │
│                               ▼                                  │
│              ┌────────────────────────────────┐                  │
│              │ 7. Output Generation           │                  │
│              │                                │                  │
│              │ Format based on user request:  │                  │
│              │ - Single tweet output          │                  │
│              │ - Thread output (2-10 tweets)  │                  │
│              │ - Multiple options output      │                  │
│              │                                │                  │
│              │ Include:                       │                  │
│              │ - Tweet text(s)                │                  │
│              │ - Strategy explanation         │                  │
│              │ - Engagement prediction        │                  │
│              │ - Suggested hashtags           │                  │
│              └────────────────────────────────┘                  │
│                               │                                  │
│                               ▼                                  │
│                      ┌─────────────────┐                         │
│                      │ User Output     │                         │
│                      └─────────────────┘                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

#### Strategy Selection Decision Tree

```
                           User Input Received
                                   │
                                   ▼
                    Is strategy_preference specified?
                                   │
                      ┌────────────┴────────────┐
                      │                         │
                     YES                        NO
                      │                         │
                      ▼                         ▼
            Use specified strategy    Analyze topic for auto-detection
                      │                         │
                      ▼                         ▼
              Adapt execution    Is topic challenging common wisdom?
              to topic                │                         │
                      │         ┌───────┴───────┐
                      ▼         │               │
            ┌───────────────┐   YES             NO
            │ Strategy      │   │               │
            │ Execution     │   ▼               ▼
            │ Module        │ Is topic shareable    Is topic relatable
            └───────────────┊ personal experience?  universal feeling?
                      │         │               │
                      │    ┌────┴────┐         │
                      │    │         │         │
                      │   YES       NO        ▼
                      │    │         │   Is topic articulating
                      │    ▼         │   unspoken thoughts?
                      │ Invite       │         │
                      │ Sharing      │    ┌────┴────┐
                      │ Strategy     │    │         │
                      │              │   YES       NO
                      │              │    │         │
                      │              │    ▼         ▼
                      │              │ Deep     Evaluate for
                      │              │ Resonance controversial elements
                      │              │ Strategy     │
                      │              │              ▼
                      │              │    Check for polarization potential
                      │              │              │
                      │              │    ┌────┴────┐
                      │              │    │         │
                      │              │   YES       NO
                      │              │    │         │
                      │              │    ▼         ▼
                      │              │ Controv-   Default to
                      │              │ ersial     Deep Resonance
                      │              │ Strategy   (highest
                      │              │            engagement
                      │              │            baseline)
                      │              │
                      └──────────────┴──────────────┘
                                         │
                                         ▼
                              Select optimal strategy
                              based on analysis
                                         │
                                         ▼
                              Pass to Content Generation
```

#### Handling Conflicting Requirements

| Conflict Scenario | Resolution Strategy |
|-------------------|---------------------|
| Brand voice conflicts with strategy style | Prioritize brand voice, adapt strategy execution to match voice |
| User requests controversial but topic has no controversy | Suggest alternative strategy, explain reasoning |
| CTA requested but format is informational | Include optional CTA field user can choose to use |
| Multiple examples provided with conflicting styles | Blend styles, explain trade-offs, provide options |
| Key points exceed character limit | Suggest thread format, prioritize most impactful points |
| Strategy preference conflicts with goal | Default to goal-aligned strategy, note the conflict in output |

### Quality Criteria

#### QC-1: Minimum Engagement Score Threshold

Each generated tweet must meet minimum engagement potential criteria.

**Engagement Score Calculation**:
- Hook Strength (0-25 points): Direct address, benefit-led, curiosity gap
- Content Value (0-25 points): Actionable insights, specific details, unique perspective
- Shareability (0-25 points): Relatability, quotability, controversy level
- CTA Effectiveness (0-25 points): Clarity, low friction, value proposition

**Minimum Thresholds**:
- Single tweet: Minimum 60 points (out of 100)
- Thread tweets: Minimum 50 points each (threads can have lower individual scores if thread-level value compensates)
- Multiple options: At least one option must meet 70+ points, all options must meet 55+ points

#### QC-2: Readability Check

Tweets must meet minimum readability standards.

**Readability Metrics**:
- Grade level: Target grade 6-8 (accessible to most audiences)
- Sentence length: Maximum 25 words per sentence average
- Paragraph length: Maximum 2 sentences per paragraph (1 sentence preferred)
- Word complexity: Avoid jargon unless audience-appropriate, define terms when used

**Readability Validation**:
- Automated check for sentence length violations
- Vocabulary complexity assessment
- Formatting compliance verification
- Visual scanability score

#### QC-3: CTA Effectiveness Criteria

When CTAs are included (either user-specified or agent-generated), they must meet:

**CTA Quality Requirements**:
- Action clarity: User knows exactly what to do (Comment, Follow, Like, etc.)
- Specificity: Not "let me know" but "comment your [specific thing]"
- Low friction: No unnecessary barriers (email signup, following requirements without value)
- Value alignment: CTA leads to something the user would want
- Placement: End of content or naturally integrated at high-value moment

**CTA Effectiveness Scoring**:
- High effectiveness: Clear action + specific trigger + low friction
- Medium effectiveness: Clear action + reasonable friction
- Low effectiveness: Vague action or high friction without clear value

#### QC-4: Originality Check

Generated content must avoid overused patterns and feel fresh.

**Originality Requirements**:
- No opening phrases from market-fatigued patterns ("Most creators...", "Everyone is doing...", "If you're not X, you're falling behind")
- No generic claims that lack specificity ("Good money" vs. "$2k per client")
- No weak hedging language ("This might help", "In my opinion", "This is just my take")
- No cliché structures unless intentionally subverted for effect

**Originality Validation**:
- Check against known overused patterns
- Verify specific claims and data points
- Confirm confidence in statements
- Flag potential cliché structures for revision

### Error Handling

#### EH-1: Vague or Insufficient Topic

**Scenario**: User provides topic that is too abstract, generic, or lacks sufficient detail for content generation.

**Detection Criteria**:
- Topic length under 10 characters
- Topic contains only generic terms without specific context
- Topic is a question without any framing or angle
- Topic contains no actionable or substantive content

**Handling Strategy**:
1. Return clarification request with specific questions
2. Ask for: specific angle, target audience, key points to cover, examples of similar content user admires
3. Provide examples of well-formed topics for reference
4. Do not generate low-quality content from insufficient input

**Response Format**:
```
I need a bit more context to create the best tweet for you. Could you clarify:

1. **What's your specific angle?** (e.g., "Why most X are wrong about Y", "How to achieve Z", "The hidden cost of X")
2. **Who is this for?** (e.g., "startups in Y industry", "people struggling with Z")
3. **What key point must be included?** (e.g., "specific number", "particular insight", "actionable step")

Here's an example of a well-formed topic:
"Show me how to create viral tweets about SaaS pricing that challenge conventional wisdom and get developers to engage."
```

#### EH-2: Platform Guideline Violations

**Scenario**: User requests content that violates Twitter platform rules or content policies.

**Detection Criteria**:
- Content involves hate speech, harassment, or targeted abuse
- Content promotes illegal activities
- Content includes disallowed content (weapon instructions, dangerous content)
- Content manipulates engagement through spam or coordinated behavior
- Content violates election integrity or political advertising rules

**Handling Strategy**:
1. Detect potential violations during content generation
2. Reject request with clear explanation
3. Suggest alternative approaches if applicable
4. Document violation attempt for audit purposes (without logging sensitive content)

**Response Format**:
```
I can't help with this request because it would violate Twitter's platform guidelines. Twitter prohibits content that includes:

[Relevant violation category]

If you have a legitimate version of this topic, I'd be happy to help you craft engaging content that follows platform rules.

For example, instead of "[forbidden approach]", you could try: "[alternative approach that achieves similar goal within guidelines]"
```

#### EH-3: Brand Voice Conflicts

**Scenario**: User requests content that fundamentally conflicts with their stated brand voice.

**Detection Criteria**:
- Request for tone that contradicts brand voice description
- Request for aggressive/controversial content when voice is "helpful and casual"
- Request for casual content when voice is "professional but human"
- Mismatch between examples provided and stated voice

**Handling Strategy**:
1. Identify the specific conflict
2. Propose compromise that respects core brand elements
3. Provide both versions: one matching voice, one closer to requested style
4. Explain the trade-offs of each approach

**Response Format**:
```
I noticed a potential conflict between your requested approach and your stated brand voice ("[brand voice]").

Here are two options:

**Option A: Sticking to your brand voice**
[Tweet content matching stated voice]
This maintains your consistent brand identity.

**Option B: Trying the requested approach**
[Tweet content with requested tone]
This may be effective for this specific post but could feel inconsistent.

My recommendation: Option A, unless this is a deliberate style experiment.
```

#### EH-4: Character Limit Exceeded

**Scenario**: Generated content exceeds Twitter's 280-character limit.

**Handling Strategy**:
1. Attempt inline shortening without losing key content
2. If shortening is insufficient, suggest thread format
3. If thread is inappropriate, identify which elements can be cut
4. Provide multiple shortening options with trade-off explanations

**Response Format**:
```
This content exceeds Twitter's 280-character limit. Here are your options:

**Option A: Shortened version**
[Tweet under 280 characters]
Trade-off: [What's lost]

**Option B: Thread version**
Tweet 1: [Opening hook under 280]
Tweet 2: [Main content under 280]
Tweet 3: [CTA under 280]
Trade-off: More engagement but requires multiple posts

**Option C: Full version (not recommended)**
[Original content with note that it won't post as-is]

Which approach works best for you?
```

#### EH-5: Generation Failures

**Scenario**: Content generation fails due to technical issues or repeated quality failures.

**Handling Strategy**:
1. Maximum 3 regeneration attempts per request
2. If all attempts fail, return with honest error and suggestions
3. Log failure for system improvement (without user data)
4. Offer alternative approaches if standard generation fails

**Response Format**```
I'm having trouble generating high-quality content for this topic. This can happen when:

- The topic is extremely niche or specialized
- The combination of constraints is unusually challenging
- The strategy doesn't naturally fit the topic

Suggestions:
1. Try a different strategy preference
2. Simplify the key points to 1-2 essentials
3. Provide example tweets that capture your desired style
4. Break this into a thread format

Would you like to try one of these approaches?
```

### Example Interactions

#### Example 1: Controversial Take Strategy

**Input**:
```
Topic: Most productivity advice is counterproductive for creative work
Goal: engagement
Brand Voice: sharp and provocative
Audience: creative professionals, designers, writers
Strategy Preference: controversial
Format: single
```

**Output**:
```
Most "productivity" advice is just sophisticated procrastination for creative people.

The more systems you build, the less you actually create.

Real work happens in messy, uncomfortable moments—not optimized workflows.

🧵👇

Strategy: Controversial Take
Why This Works: Challenges popular productivity culture directly, forces agreement/disagreement responses, creates debate in replies about what's "real work," targets pain point of creative professionals who feel something is wrong with their process.

Predicted Engagement: High replies (people will argue for/against), moderate retweets (this resonates with the target audience), high bookmarks (saves for future reference in argument)

Suggested Hashtags: #Productivity #Creativity #DesignTwitter #WritingCommunity
```

#### Example 2: Invite Sharing Strategy

**Input**:
```
Topic: That moment when a client asks for "something like Amazon but simpler"
Goal: engagement
Brand Voice: helpful and casual
Audience: freelance developers, agency owners
Format: multiple_options
```

**Output**:
```
OPTION A - Relatable Struggle:
Drop an emoji if a client has ever asked you to build "something like Amazon but simpler" 👇

What did you say back?

Why It Works: Invites personal stories from developers who've experienced this, creates community solidarity, the emoji prompt drives high reply engagement.

Predicted Engagement: High replies (people love sharing war stories), moderate retweets (devs will tag coworkers)

---

OPTION B - Solution-First:
Client: "Make it like Amazon but simpler"
You: [ Explains why this is impossible in 3 sentences ]

Here's what actually happens ⬇️

Why It Works: Sets up a joke most developers get, promises a payoff, the "here's what happens" creates curiosity.

Predicted Engagement: High bookmarks (save for next client meeting), moderate replies (corrections, additions to the list)

---

OPTION C - Data-Backed:
I've had 14 clients ask for "Amazon but simpler" in the last year.

Here's exactly what each one meant, and what I built instead:

[ Thread ]

Why It Works: Specific number builds credibility, promises the "what I built instead" value, thread format increases follow-through.

Predicted Engagement: High thread reads, moderate bookmarks, potential viral reach

---

Recommendation: Option A for maximum engagement, Option C for authority building. If you need the tweet today, go with A.
```

#### Example 3: Deep Resonance Strategy

**Input**:
```
Topic: You know that feeling when you finish a great book and can't find anything else that hits the same way
Goal: awareness
Brand Voice: witty and clever
Audience: avid readers, book enthusiasts
Format: single
```

**Output**```
That post-book depression is real, and no one talks about it enough.

You've just lived a thousand lives, felt everything, and now you're supposed to just... go back to regular life?

No book hits the same after a banger. We need a name for this.

Why It Works: Articulates a feeling every reader has experienced but rarely sees articulated, creates "yes, exactly!" recognition, prompts replies with agreement and similar experiences.

Predicted Engagement: High replies (people sharing book recommendations that hit hard), high retweets (book lovers will tag friends), high bookmarks (save for after next great book)

Suggested Hashtags: #BookTwitter #ReadingCommunity #BookWorm #PostBookDepression
```

#### Example 4: Thread with CTA Integration

**Input**:
```
Topic: How I went from 0 to 10K Twitter followers in 90 days without posting every day
Goal: authority
Brand Voice: confident but approachable
Audience: content creators, solopreneurs
Format: thread
Key points: ["Quality over quantity", "One controversial tweet per week", "Engagement > followers", "Strategic posting times"]
```

**Output**```
TWEET 1:
I went from 0 to 10K followers in 90 days without posting every single day.

Here's exactly what I did ⬇️

(Bookmark this if you're building on Twitter)

Why It Works: Strong claim with specific number, "without posting every day" hooks people tired of consistency advice, promises actionable framework, "bookmark" creates save behavior.

---

TWEET 2:
Rule 1: Quality over quantity.

I posted 3 times per week. That's it.

But those 3 posts? Every single one had:
- A clear, controversial hook
- Specific, actionable value
- An invitation to engage

Why It Works: Refutes the "post daily" myth, provides concrete numbers to latch onto, outlines the formula for quality.

---

TWEET 3:
Rule 2: One controversial tweet per week.

Not mean. Not inflammatory.

Just a take that makes people stop scrolling and think "wait, is that true?"

This is how you break through the algorithm.

Why It Works: Teaches a specific tactic, defines "controversial" to avoid harmful content, positions it as algorithm hack.

---

TWEET 4:
Rule 3: Engagement > Followers.

For every 1 post I made, I commented on 10 others.

Quality comments. Not "great post!" but actual insights that made people check my profile.

This is how I got my first 1K followers. Not from my content. From my comments.

Why It Works: Counter-intuitive advice (don't focus on your content?), provides specific ratio (1:10), explains the mechanism (profile visits), establishes credibility through results.

---

TWEET 5:
Rule 4: Strategic posting times.

I posted when my audience was active, not when I felt like it.

Data over intuition.

If you're serious about growing, stop guessing. Start testing.

Why It Works: Concrete tactical advice, acknowledges importance of data, transitions to CTA.

---

TWEET 6:
That's the 4 rules.

No fluff. No "be consistent." No "just provide value."

Real tactics that worked for me.

Follow for more building in public.
And comment your biggest Twitter struggle—I'll DM you what's worked for me.

Why It Works: Recaps all rules concisely, dismisses common advice ("no fluff"), clear CTA with specific trigger, adds requirements to filter for engaged audience.

---

Thread Strategy: Build momentum from hook → education → community building → engagement CTA. Each tweet has standalone value but the thread creates a complete framework.

Total Tweets: 6
Estimated Read Time: 2 minutes
Predicted Engagement: High thread saves/bookmarks, high reply CTA engagement, moderate retweets as people share the framework, potential for viral reach if one tweet in thread breaks out.
```

## Traceability

### From Approach

| Approach Decision | Spec Section | Status |
|-------------------|--------------|--------|
| Selected approach: Option B (Agent + Skill Architecture) | Agent Definition | ✅ Covered |
| Spec depth: L2 (Simple complexity) | Spec Depth | ✅ Covered |
| Core strategies: Controversial Takes, Invite Sharing, Deep Resonance | Functional Requirements | ✅ Covered |
| Viral strategy framework with engagement triggers | Processing Logic | ✅ Covered |
| Input format with required/optional parameters | Input Specification | ✅ Covered |
| Output format with single/thread/multiple options | Output Specification | ✅ Covered |
| Agent file location: ~/.config/opencode/agent/twitter-posting.md | Agent Definition | ✅ Covered |
| Mode: subagent, Temperature: 0.7 | Agent Definition | ✅ Covered |
| Processing logic with flow diagram | Processing Logic | ✅ Covered |
| Error handling for vague inputs and violations | Error Handling | ✅ Covered |

### From Twitter Copy Principles

| Principle Category | Spec Coverage | Status |
|--------------------|---------------|--------|
| Hook fundamentals (direct address, benefit-first) | FR-3: Hook Generation | ✅ Covered |
| Content structure (one idea, bullets, short paragraphs) | FR-4: Body Writing | ✅ Covered |
| Engagement triggers (social proof, urgency, low friction) | FR-5: CTA Integration | ✅ Covered |
| Voice and tone (conversational, confident, direct) | FR-7: Voice Matching | ✅ Covered |
| Psychological triggers (pain points, specific numbers) | FR-2: Strategy Matching | ✅ Covered |
| Format for skimmers (visual breaks, white space) | FR-6: Readability Optimization | ✅ Covered |
| CTA formula (action, trigger, benefit, requirements) | FR-5: CTA Integration | ✅ Covered |
| Content angles (behind-the-scenes, case studies, reverse engineering) | FR-2: Strategy Matching | ✅ Covered |
| Editing principles (read aloud, cut ruthlessly, vary length) | QC-2: Readability Check | ✅ Covered |
| Advanced techniques (pattern interrupts, curiosity gaps, contrarian takes) | FR-3: Hook Generation | ✅ Covered |

### From Writing Principles Context

| Writing Principle | Spec Coverage | Status |
|-------------------|---------------|--------|
| Have something worth saying | FR-1: Topic Analysis | ✅ Covered |
| Know the audience | FR-2: Strategy Matching | ✅ Covered |
| Define the purpose | Input Specification (goal) | ✅ Covered |
| Write conversationally | FR-4: Body Writing | ✅ Covered |
| Keep it simple | QC-2: Readability Check | ✅ Covered |
| Open strong (hooks) | FR-3: Hook Generation | ✅ Covered |
| Use active voice | FR-4: Body Writing | ✅ Covered |
| One idea per unit | FR-4: Body Writing | ✅ Covered |
| Format for skimmers | FR-6: Readability Optimization | ✅ Covered |
| Be concrete | FR-4: Body Writing | ✅ Covered |
| Use stories & emotion | FR-2: Strategy Matching | ✅ Covered |
| Vary sentence length | FR-4: Body Writing | ✅ Covered |
| Cut ruthlessly | QC-4: Originality Check | ✅ Covered |
| Finish strong | FR-5: CTA Integration | ✅ Covered |
| Write with confidence | FR-7: Voice Matching | ✅ Covered |

## Risks and Unknowns

- **Risk 1**: Brand voice interpretation may vary between human expectations and agent execution
  - **Mitigation**: Provide multiple options showing range of interpretation, include explicit strategy explanations
  - **Status**: Medium risk, manageable through output variety

- **Risk 2**: Controversial strategy may accidentally violate platform guidelines if edge cases aren't caught
  - **Mitigation**: Implement conservative detection for potential violations, err on side of caution
  - **Status**: High risk, requires robust validation

- **Risk 3**: Auto-detect strategy may not match user's intent when topic supports multiple angles
  - **Mitigation**: When ambiguous, default to multiple options output so user can choose
  - **Status**: Low risk, addressed by multiple options format

- **Risk 4**: Character counting for non-ASCII characters (emojis, international text) may be inconsistent
  - **Mitigation**: Use conservative character limits (250 instead of 280) to account for encoding variations
  - **Status**: Medium risk, requires technical validation

- **Unknown 1**: Long-term engagement performance across different topic domains
  - **Investigation**: Track engagement metrics over first 1000 generated tweets to validate quality criteria thresholds
  - **Timeline**: After launch, review quarterly

- **Unknown 2**: Optimal number of multiple options to present (currently set to 3)
  - **Investigation**: A/B test 2 vs. 3 vs. 4 options to determine completion rates
  - **Timeline**: After launch, review monthly for first quarter

## Open Questions

1. Should the agent track engagement metrics for its own outputs to improve future generation?
   - Would require additional user permission and data infrastructure
   - Recommend: Add as future enhancement, not initial release

2. Should the agent support thread images/visual content recommendations?
   - Currently focused on text-only output
   - Recommend: Add visual suggestions as optional enhancement in future

3. Should the agent support thread scheduling or direct posting integration?
   - Currently focused on content generation only
   - Recommend: Keep scope limited, consider future integration with posting tools

## Master Spec Coverage

Not applicable - this is a standalone feature not covered by a master specification.

---

<complete/>

**Specification created for**: Twitter Viral Posting Subagent (FEAT-001)
**Spec depth**: L2
**Complexity**: Simple
**Created**: 2026-01-09
**Status**: Ready for review and implementation