import { tool } from "@opencode-ai/plugin"

const TOOL_DIR = `${process.env.HOME}/.config/opencode/tool`

/**
 * Google Custom Search tool
 * Searches the web using Google Custom Search API
 */
export const google_search = tool({
  description: "Search the web using Google Custom Search API. Returns titles, links, and snippets from search results.",
  args: {
    query: tool.schema.string().describe("The search query string"),
    num_results: tool.schema.number().optional().describe("Number of results to return (default 10, max 10)")
  },
  async execute(args) {
    const numResults = args.num_results || 10
    const result = await Bun.$`python3 ${TOOL_DIR}/google_search.py ${args.query} ${numResults}`.text()
    return result.trim()
  }
})

/**
 * Save research to markdown file
 * Saves research findings to research/{topic}/output_v{n}.md
 */
export const save_research = tool({
  description: "Save research findings to a markdown file. Creates versioned output at research/{topic}/output_v{n}.md",
  args: {
    topic: tool.schema.string().describe("Research topic (used for folder name)"),
    content: tool.schema.string().describe("Main research content/synthesis in markdown format"),
    sources: tool.schema.array(tool.schema.string()).optional().describe("List of source URLs"),
    key_findings: tool.schema.array(tool.schema.string()).optional().describe("List of key findings as bullet points"),
    metadata: tool.schema.record(tool.schema.string(), tool.schema.any()).optional().describe("Additional metadata as key-value pairs")
  },
  async execute(args) {
    const sources = JSON.stringify(args.sources || [])
    const keyFindings = JSON.stringify(args.key_findings || [])
    const metadata = JSON.stringify(args.metadata || {})
    
    const result = await Bun.$`python3 ${TOOL_DIR}/save_research.py ${args.topic} ${args.content} ${sources} ${keyFindings} ${metadata}`.text()
    return result.trim()
  }
})
