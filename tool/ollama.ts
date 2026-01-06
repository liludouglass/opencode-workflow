import { tool } from "@opencode-ai/plugin"

const TOOL_DIR = `${process.env.HOME}/.config/opencode/tool`

/**
 * Warm up Ollama model to reduce cold start latency
 */
export const warmup = tool({
  description: "Warm up an Ollama model to reduce response latency. Call this before using a local model.",
  args: {
    model: tool.schema.string().optional().describe("Model name to warm up (default: qwen3:30b)"),
    keepalive: tool.schema.string().optional().describe("How long to keep model loaded (default: 60m)")
  },
  async execute(args) {
    const model = args.model || "qwen3:30b"
    const keepalive = args.keepalive || "60m"
    const result = await Bun.$`python3 ${TOOL_DIR}/warmup_ollama.py ${model} ${keepalive}`.text()
    return result.trim()
  }
})
