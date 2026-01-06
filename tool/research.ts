import { z } from "zod"

const TOOL_DIR = `${process.env.HOME}/.config/opencode/tool`

/**
 * Google Custom Search tool
 * Searches the web using Google Custom Search API
 */
export const google_search = {
  description: "Search the web using Google Custom Search API. Returns titles, links, and snippets from search results.",
  args: {
    query: z.string().describe("The search query string"),
    num_results: z.number().optional().describe("Number of results to return (default 10, max 10)")
  },
  async execute(args: { query: string; num_results?: number }) {
    const numResults = args.num_results || 10
    const result = await Bun.$`python3 ${TOOL_DIR}/google_search.py ${args.query} ${numResults}`.text()
    return result.trim()
  }
}

/**
 * Save research to markdown file
 * Saves research findings to research/{topic}/output_v{n}.md
 */
export const save_research = {
  description: "Save research findings to a markdown file. Creates versioned output at research/{topic}/output_v{n}.md",
  args: {
    topic: z.string().describe("Research topic (used for folder name)"),
    content: z.string().describe("Main research content/synthesis in markdown format"),
    sources: z.array(z.string()).optional().describe("List of source URLs"),
    key_findings: z.array(z.string()).optional().describe("List of key findings as bullet points"),
    metadata: z.record(z.string(), z.any()).optional().describe("Additional metadata as key-value pairs")
  },
  async execute(args: { 
    topic: string
    content: string
    sources?: string[]
    key_findings?: string[]
    metadata?: Record<string, any>
  }) {
    const sources = JSON.stringify(args.sources || [])
    const keyFindings = JSON.stringify(args.key_findings || [])
    const metadata = JSON.stringify(args.metadata || {})
    
    const result = await Bun.$`python3 ${TOOL_DIR}/save_research.py ${args.topic} ${args.content} ${sources} ${keyFindings} ${metadata}`.text()
    return result.trim()
  }
}
