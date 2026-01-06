import { tool } from "@opencode-ai/plugin"

const TOOL_DIR = `${process.env.HOME}/.config/opencode/tool`
const VENV_PYTHON = `${process.env.HOME}/.config/opencode/.venv/bin/python`

/**
 * YouTube Transcript Tool
 * Fetches video transcripts from YouTube URLs
 */
export const get_transcript = tool({
  description: "Fetch the transcript from a YouTube video. Returns the full transcript text, video metadata, and timestamped segments.",
  args: {
    url: tool.schema.string().describe("YouTube URL or video ID (e.g., https://www.youtube.com/watch?v=VIDEO_ID or just VIDEO_ID)")
  },
  async execute(args) {
    const result = await Bun.$`${VENV_PYTHON} ${TOOL_DIR}/yt_transcript.py ${args.url}`.text()
    return result.trim()
  }
})

/**
 * Save YouTube Query Result
 * Saves the query and answer to ~/yt-query/{query_subject}_v{n}.md
 */
export const save_query = tool({
  description: "Save a YouTube video query and its answer to a markdown file. Saves to ~/yt-query/{query_subject}_v{n}.md with auto-versioning.",
  args: {
    video_url: tool.schema.string().describe("YouTube video URL"),
    query: tool.schema.string().describe("The user's question about the video"),
    answer: tool.schema.string().describe("The answer/analysis content in markdown format"),
    video_id: tool.schema.string().optional().describe("Optional video ID for reference")
  },
  async execute(args) {
    const videoId = args.video_id || ""
    const result = await Bun.$`${VENV_PYTHON} ${TOOL_DIR}/save_yt_query.py ${args.video_url} ${args.query} ${args.answer} ${videoId}`.text()
    return result.trim()
  }
})
