import { z } from "zod"

const TOOL_DIR = `${process.env.HOME}/.config/opencode/tool`

/**
 * Warm up Ollama model to reduce cold start latency
 */
export const warmup = {
  description: "Warm up an Ollama model to reduce response latency. Call this before using a local model.",
  args: {
    model: z.string().optional().describe("Model name to warm up (default: qwen3:30b)"),
    keepalive: z.string().optional().describe("How long to keep model loaded (default: 60m)")
  },
  async execute(args: { model?: string; keepalive?: string }) {
    const model = args.model || "qwen3:30b"
    const keepalive = args.keepalive || "60m"
    const result = await Bun.$`python3 ${TOOL_DIR}/warmup_ollama.py ${model} ${keepalive}`.text()
    return result.trim()
  }
}
