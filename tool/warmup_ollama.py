#!/usr/bin/env python3
"""
Warm up Ollama model to reduce cold start latency.
Sends a minimal request to load the model into memory.
"""

import json
import sys
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError


def warmup_model(model: str = "qwen3:30b", keepalive: str = "60m") -> dict:
    """
    Send a minimal request to Ollama to load the model into memory.

    Args:
        model: Model name to warm up
        keepalive: How long to keep model in memory (e.g., "60m", "2h")

    Returns:
        dict with status
    """
    url = "http://localhost:11434/api/generate"

    payload = json.dumps(
        {
            "model": model,
            "prompt": "hi",
            "stream": False,
            "keep_alive": keepalive,
            "options": {
                "num_predict": 1  # Generate minimal tokens
            },
        }
    ).encode("utf-8")

    try:
        req = Request(
            url,
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST",
        )

        with urlopen(req, timeout=120) as response:
            data = json.loads(response.read().decode())
            return {
                "success": True,
                "model": model,
                "keepalive": keepalive,
                "message": f"Model {model} is now warm and will stay loaded for {keepalive}",
            }

    except HTTPError as e:
        return {"success": False, "error": f"HTTP Error {e.code}: {e.reason}"}
    except URLError as e:
        return {
            "success": False,
            "error": f"URL Error: {e.reason} - Is Ollama running?",
        }
    except Exception as e:
        return {"success": False, "error": f"Unexpected error: {str(e)}"}


if __name__ == "__main__":
    model = sys.argv[1] if len(sys.argv) > 1 else "qwen3:30b"
    keepalive = sys.argv[2] if len(sys.argv) > 2 else "60m"

    result = warmup_model(model, keepalive)
    print(json.dumps(result, indent=2))
