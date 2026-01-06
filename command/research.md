---
description: Start a research task on a given topic
agent: research
---

Research the following topic thoroughly:

**Topic:** $ARGUMENTS

## Instructions

1. **Plan** your research approach - what aspects need to be covered?
2. **Search** the web using `research_google_search` with multiple queries
3. **Analyze** the findings using `@analysis` subagent
4. **Synthesize** into a coherent report using `@synthesis` subagent
5. **Save** the final research to `research/{topic}/output.md` using `research_save_research`

Be thorough and cite all sources. Focus on factual, well-supported information.
