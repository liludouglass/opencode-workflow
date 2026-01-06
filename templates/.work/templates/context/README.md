# Context Bundle System

<!-- Documentation for the context bundle generation and management system -->
<!-- Used by @context-manager to create focused context for task execution -->

## Overview

The context bundle system provides focused, relevant information to agents executing specific tasks. Instead of overwhelming agents with the entire codebase and specification, context bundles contain only the information needed for a particular task.

## Purpose

Context bundles solve the **context explosion problem** in large projects:

- **Full specs** can be 50K+ tokens - too large for effective agent processing
- **Full codebases** contain irrelevant files that distract from the task
- **Complete history** includes noise that doesn't help current work
- **Token limits** require careful curation of relevant information

Context bundles provide **surgical precision** - exactly what's needed, nothing more.

---

## How Context Bundles Are Generated

### 1. Task Analysis
The `@context-manager` analyzes the assigned task to understand:
- Which spec sections are relevant
- Which acceptance criteria must be satisfied
- Which files need to be modified or referenced
- What recent progress is relevant

### 2. Content Extraction
Based on the analysis, the manager extracts:
- **Spec portions**: Only sections related to the task
- **Acceptance criteria**: Only the AC items this task must satisfy
- **Code files**: Only files that will be modified or are dependencies
- **Progress history**: Only recent entries relevant to this task area

### 3. Token Budget Management
Content is curated to fit within target token budgets:
- **Target size**: 5-10K tokens per bundle
- **Priority order**: Spec > AC > Files > Progress
- **Truncation strategy**: Oldest progress entries removed first
- **Overflow handling**: Large files summarized or sectioned

### 4. Bundle Assembly
The final bundle includes:
- Task metadata (ID, description, complexity)
- Curated spec sections
- Relevant acceptance criteria
- Code files with context
- Recent progress entries
- Token usage summary

---

## Token Budget Targets

| Component | Target Tokens | Max Tokens | Priority |
|-----------|---------------|------------|----------|
| Task Metadata | 200-500 | 1K | High |
| Spec Sections | 2K-4K | 6K | High |
| Acceptance Criteria | 500-1K | 2K | High |
| Code Files | 2K-4K | 8K | Medium |
| Progress History | 500-1K | 2K | Low |
| **Total Bundle** | **5K-10K** | **15K** | - |

### Budget Management Strategies

**When under budget** (< 5K tokens):
- Include additional context files
- Add more progress history
- Include related spec sections

**When at target** (5K-10K tokens):
- Perfect size - no changes needed
- Monitor for future growth

**When over budget** (> 10K tokens):
- Summarize large code files
- Truncate oldest progress entries
- Remove tangential spec sections
- Focus on core requirements only

**When severely over budget** (> 15K tokens):
- Split into multiple focused bundles
- Create task dependencies to sequence work
- Escalate to human for task decomposition

---

## Bundle Quality Metrics

### Relevance Score
- **High** (90-100%): All content directly related to task
- **Medium** (70-89%): Most content relevant, some tangential
- **Low** (< 70%): Significant irrelevant content included

### Completeness Score
- **Complete** (100%): All necessary information included
- **Mostly Complete** (80-99%): Minor gaps that won't block progress
- **Incomplete** (< 80%): Missing critical information

### Efficiency Score
- **Efficient** (< 8K tokens): Compact, focused bundle
- **Acceptable** (8K-12K tokens): Good balance of detail and size
- **Inefficient** (> 12K tokens): Too much information for task scope

---

## Usage Guidelines

### For Context Managers
1. **Analyze first**: Understand the task scope before extracting content
2. **Prioritize ruthlessly**: Include only what's essential
3. **Monitor token usage**: Stay within budget targets
4. **Validate completeness**: Ensure agent has everything needed
5. **Document decisions**: Log what was included/excluded and why

### For Task Executors
1. **Trust the bundle**: Don't seek additional context unless blocked
2. **Stay focused**: Work only on what's in your bundle
3. **Report gaps**: If critical information is missing, escalate
4. **Update progress**: Help future bundles by logging detailed progress

### For Orchestrators
1. **Review bundle quality**: Check relevance and completeness scores
2. **Adjust task scope**: If bundles are consistently oversized, decompose further
3. **Monitor efficiency**: Track token usage trends across tasks
4. **Optimize over time**: Learn from successful bundle patterns

---

## Bundle Storage

Context bundles are stored in:
```
.work/features/[feature-name]/context/
├── task-[id]-context.md     # Individual task bundles
├── bundle-metrics.json      # Token usage and quality metrics
└── generation-log.md        # Bundle creation history
```

Bundles are **ephemeral** - created for task execution and archived after completion.

---

## Troubleshooting

### Common Issues

**Bundle too large**:
- Decompose task into smaller pieces
- Summarize large code files
- Focus on core requirements only

**Bundle incomplete**:
- Review task dependencies
- Check if spec sections were missed
- Verify acceptance criteria coverage

**Agent requests more context**:
- Analyze what's missing
- Update bundle generation logic
- Consider if task scope is too broad

**Poor task performance**:
- Review bundle relevance score
- Check for information overload
- Validate task decomposition quality

---

## Future Improvements

- **Semantic chunking**: Use AI to identify related content sections
- **Dynamic sizing**: Adjust bundle size based on task complexity
- **Learning system**: Improve bundle quality based on execution outcomes
- **Cross-task optimization**: Share context efficiently across related tasks