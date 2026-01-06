---
description: "Research only - Phase 1 analysis without implementation"
agent: orchestrator
---

# /ask

Research-only command that performs Phase 1 analysis without creating work folders or proceeding to implementation phases.

## Usage

```
/ask <research question or topic>
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| question/topic | Yes | Natural language research question or topic to investigate |

## Behavior

When invoked, this command:

1. **Routes to @orchestrator** in research-only mode
2. **Invokes @shaper** for Phase 1 analysis only
3. **Outputs structured research findings** directly to the conversation
4. **Does NOT create work folders** (no `.opencode/` or `.work/` artifacts)
5. **Explicitly prohibits implementation phases** (Phases 2-6 are skipped)

### Research-Only Mode

```
Phase 1: RESEARCH ONLY → @shaper → Direct output (no approval gate)
```

The @shaper agent will:
- Analyze the research question/topic
- Gather relevant information
- Provide structured findings
- Output results directly without creating files

### Output Format

The command returns structured research findings including:
- **Summary**: Key insights and conclusions
- **Analysis**: Detailed investigation results
- **Recommendations**: Suggested next steps (if applicable)
- **Sources**: References and citations used

## Examples

```
/ask What are the best practices for implementing OAuth2 in Node.js applications?
```

Returns research findings on OAuth2 implementation patterns, security considerations, and recommended libraries.

```
/ask How should we structure a microservices architecture for an e-commerce platform?
```

Returns analysis of microservices patterns, service boundaries, and architectural recommendations.

```
/ask What are the performance implications of using GraphQL vs REST APIs?
```

Returns comparative analysis of GraphQL and REST performance characteristics.

## Differences from /feature

| Aspect | /ask | /feature |
|--------|------|----------|
| Purpose | Research only | Full implementation |
| Phases | Phase 1 only | All 6 phases |
| Work folders | None created | Creates `.opencode/features/` |
| Output | Direct to conversation | Files in work folder |
| Approval gates | None | Human approval after Phase 1 & 2 |
| Implementation | Prohibited | Core purpose |

## When to Use

Use `/ask` when you need:
- Research on technical topics
- Analysis of architectural decisions
- Investigation of best practices
- Exploration of implementation options
- Quick answers without committing to implementation

Use `/feature` when you're ready to implement a solution.

## Limitations

- **No implementation**: This command will not write code or create features
- **No work artifacts**: No files or folders are created
- **No follow-up phases**: Research findings are final output
- **No approval workflow**: Results are provided immediately

If you need implementation after research, use the findings to inform a separate `/feature` command.

## Related Commands

- `/feature` - Full feature implementation workflow
- `/research` - Web-based research with saved reports
- `/improve` - Enhancement workflow for existing features

Research question: $ARGUMENTS