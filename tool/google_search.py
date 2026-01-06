#!/usr/bin/env python3
"""
Google Custom Search API tool for OpenCode research agent.
Searches the web and returns formatted results.
"""

import json
import os
import sys
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError


# Load GOOGLE_API_KEY from .config/ai-workflows/.env
def load_env():
    # Try multiple possible locations
    env_paths = [
        Path.home() / ".config" / "ai-workflows" / ".env",
        Path.home() / "ai-workflow" / ".env",
        Path.cwd() / ".env",
    ]

    for env_path in env_paths:
        if env_path.exists():
            with open(env_path) as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        key, value = line.split("=", 1)
                        os.environ[key.strip()] = value.strip().strip('"').strip("'")
            break


def google_search(query: str, num_results: int = 10) -> dict:
    """
    Perform a Google Custom Search.

    Args:
        query: Search query string
        num_results: Number of results to return (max 10 per request)

    Returns:
        dict with search results or error
    """
    load_env()

    api_key = os.environ.get("GOOGLE_API_KEY")
    # Google Custom Search Engine ID - you'll need to create one at:
    # https://programmablesearchengine.google.com/
    search_engine_id = os.environ.get("GOOGLE_CSE_ID", "")

    if not api_key:
        return {"error": "GOOGLE_API_KEY not found in ai-workflow/.env"}

    if not search_engine_id:
        # If no CSE ID, provide helpful error
        return {
            "error": "GOOGLE_CSE_ID not found. Create a Custom Search Engine at https://programmablesearchengine.google.com/ and add GOOGLE_CSE_ID to ai-workflow/.env"
        }

    # Build the API URL
    params = {
        "key": api_key,
        "cx": search_engine_id,
        "q": query,
        "num": min(num_results, 10),
    }

    url = f"https://www.googleapis.com/customsearch/v1?{urlencode(params)}"

    try:
        req = Request(url, headers={"User-Agent": "OpenCode-Research-Agent/1.0"})
        with urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode())

            results = []
            for item in data.get("items", []):
                results.append(
                    {
                        "title": item.get("title", ""),
                        "link": item.get("link", ""),
                        "snippet": item.get("snippet", ""),
                        "displayLink": item.get("displayLink", ""),
                    }
                )

            return {
                "query": query,
                "totalResults": data.get("searchInformation", {}).get(
                    "totalResults", "0"
                ),
                "results": results,
            }

    except HTTPError as e:
        return {"error": f"HTTP Error {e.code}: {e.reason}"}
    except URLError as e:
        return {"error": f"URL Error: {e.reason}"}
    except json.JSONDecodeError as e:
        return {"error": f"JSON decode error: {str(e)}"}
    except Exception as e:
        return {"error": f"Unexpected error: {str(e)}"}


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: google_search.py <query> [num_results]"}))
        sys.exit(1)

    query = sys.argv[1]
    num_results = int(sys.argv[2]) if len(sys.argv) > 2 else 10

    result = google_search(query, num_results)
    print(json.dumps(result, indent=2))
