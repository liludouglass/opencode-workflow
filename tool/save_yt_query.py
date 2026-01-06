#!/usr/bin/env python3
"""
Save YouTube query results to markdown files.
Outputs to ~/yt-query/{query_subject}_v{n}.md with versioning.
"""

import json
import re
import sys
from datetime import datetime
from pathlib import Path


def sanitize_filename(text: str, max_length: int = 50) -> str:
    """Convert text to a valid filename using snake_case."""
    # Remove special characters, replace spaces with underscores
    sanitized = re.sub(r"[^\w\s-]", "", text.lower())
    sanitized = re.sub(r"[-\s]+", "_", sanitized)
    sanitized = sanitized.strip("_")
    # Truncate to max length
    if len(sanitized) > max_length:
        sanitized = sanitized[:max_length].rstrip("_")
    return sanitized


def extract_query_subject(query: str) -> str:
    """Extract a short subject from the query for the filename."""
    # Remove common question words
    query_clean = query.lower()
    remove_words = [
        "what",
        "which",
        "who",
        "where",
        "when",
        "why",
        "how",
        "are",
        "is",
        "the",
        "a",
        "an",
        "in",
        "this",
        "video",
        "about",
        "does",
        "do",
        "can",
        "could",
        "would",
        "should",
        "most",
        "important",
        "main",
        "key",
        "top",
        "best",
    ]

    words = query_clean.split()
    filtered = [w for w in words if w not in remove_words]

    # Take first 5-6 meaningful words
    subject = "_".join(filtered[:6])
    return sanitize_filename(subject) or "query"


def get_next_version(output_dir: Path, base_name: str) -> int:
    """Get the next available version number for a file."""
    if not output_dir.exists():
        return 1

    existing = [f for f in output_dir.iterdir() if f.name.startswith(base_name)]
    versions = []
    for f in existing:
        match = re.search(r"_v(\d+)\.md$", f.name)
        if match:
            versions.append(int(match.group(1)))

    return max(versions, default=0) + 1


def save_yt_query(
    video_url: str,
    query: str,
    answer: str,
    video_id: str = None,
) -> dict:
    """
    Save YouTube query result to markdown file.

    Args:
        video_url: YouTube video URL
        query: User's question about the video
        answer: The answer/analysis from the agent
        video_id: Optional video ID for reference

    Returns:
        dict with file path and status
    """
    # Create output directory
    output_dir = Path.home() / "yt-query"
    output_dir.mkdir(parents=True, exist_ok=True)

    # Generate filename from query subject
    query_subject = extract_query_subject(query)
    version = get_next_version(output_dir, query_subject)
    output_file = output_dir / f"{query_subject}_v{version}.md"

    # Build markdown content
    md_lines = []

    # YAML frontmatter
    md_lines.append("---")
    md_lines.append(f'video_url: "{video_url}"')
    if video_id:
        md_lines.append(f'video_id: "{video_id}"')
    md_lines.append(f'query: "{query}"')
    md_lines.append(f'date: "{datetime.now().strftime("%Y-%m-%d")}"')
    md_lines.append(f'created: "{datetime.now().isoformat()}"')
    md_lines.append("---")
    md_lines.append("")

    # Title
    md_lines.append(f"# YouTube Query: {query_subject.replace('_', ' ').title()}")
    md_lines.append("")

    # Query section
    md_lines.append("## Query")
    md_lines.append("")
    md_lines.append(query)
    md_lines.append("")

    # Source video
    md_lines.append("## Source")
    md_lines.append("")
    md_lines.append(f"[Watch Video]({video_url})")
    md_lines.append("")

    # Answer section
    md_lines.append("## Answer")
    md_lines.append("")
    md_lines.append(answer)
    md_lines.append("")

    # Write file
    output_file.write_text("\n".join(md_lines), encoding="utf-8")

    return {
        "success": True,
        "file_path": str(output_file),
        "filename": output_file.name,
        "version": version,
        "message": f"Saved to {output_file}",
    }


if __name__ == "__main__":
    if len(sys.argv) < 4:
        print(
            json.dumps(
                {
                    "error": "Usage: save_yt_query.py <video_url> <query> <answer> [video_id]"
                }
            )
        )
        sys.exit(1)

    video_url = sys.argv[1]
    query = sys.argv[2]
    # Handle escaped newlines from shell
    answer = sys.argv[3].replace("\\n", "\n")
    video_id = sys.argv[4] if len(sys.argv) > 4 else None

    result = save_yt_query(video_url, query, answer, video_id)
    print(json.dumps(result, indent=2))
