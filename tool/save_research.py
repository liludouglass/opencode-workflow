#!/usr/bin/env python3
"""
Save research findings to markdown files.
Outputs to research/{topic}/output.md with versioning.
"""

import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path


def sanitize_topic(topic: str) -> str:
    """Convert topic to a valid folder name using snake_case."""
    # Remove special characters, replace spaces with underscores
    sanitized = re.sub(r"[^\w\s-]", "", topic.lower())
    sanitized = re.sub(r"[-\s]+", "_", sanitized)
    return sanitized.strip("_")


def get_next_version(output_dir: Path) -> int:
    """Get the next available version number."""
    if not output_dir.exists():
        return 1

    existing = [f for f in output_dir.iterdir() if f.name.startswith("output_v")]
    versions = []
    for f in existing:
        match = re.search(r"output_v(\d+)\.md", f.name)
        if match:
            versions.append(int(match.group(1)))

    return max(versions, default=0) + 1


def save_research(
    topic: str,
    content: str,
    sources: list = None,
    key_findings: list = None,
    metadata: dict = None,
) -> dict:
    """
    Save research to markdown file.

    Args:
        topic: Research topic (used for folder name)
        content: Main research content/synthesis
        sources: List of source URLs
        key_findings: List of key findings/bullet points
        metadata: Additional metadata dict

    Returns:
        dict with file path and status
    """
    sources = sources or []
    key_findings = key_findings or []
    metadata = metadata or {}

    # Create topic folder
    topic_folder = sanitize_topic(topic)
    research_dir = Path.cwd() / "research" / topic_folder
    research_dir.mkdir(parents=True, exist_ok=True)

    # Get version number
    version = get_next_version(research_dir)
    output_file = research_dir / f"output_v{version}.md"

    # Build markdown content
    md_lines = []

    # YAML frontmatter
    md_lines.append("---")
    md_lines.append(f'topic: "{topic}"')
    md_lines.append(f"version: {version}")
    md_lines.append(f'created: "{datetime.now().isoformat()}"')
    if metadata:
        for key, value in metadata.items():
            if isinstance(value, str):
                md_lines.append(f'{key}: "{value}"')
            else:
                md_lines.append(f"{key}: {json.dumps(value)}")
    md_lines.append("---")
    md_lines.append("")

    # Title
    md_lines.append(f"# {topic}")
    md_lines.append("")

    # Key findings section
    if key_findings:
        md_lines.append("## Key Findings")
        md_lines.append("")
        for finding in key_findings:
            md_lines.append(f"- {finding}")
        md_lines.append("")

    # Main content
    md_lines.append("## Research")
    md_lines.append("")
    md_lines.append(content)
    md_lines.append("")

    # Sources section
    if sources:
        md_lines.append("## Sources")
        md_lines.append("")
        for i, source in enumerate(sources, 1):
            md_lines.append(f"{i}. {source}")
        md_lines.append("")

    # Write file
    output_file.write_text("\n".join(md_lines), encoding="utf-8")

    return {
        "success": True,
        "file_path": str(output_file),
        "topic_folder": topic_folder,
        "version": version,
        "message": f"Research saved to {output_file}",
    }


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(
            json.dumps(
                {
                    "error": "Usage: save_research.py <topic> <content> [sources_json] [key_findings_json] [metadata_json]"
                }
            )
        )
        sys.exit(1)

    topic = sys.argv[1]
    content = sys.argv[2]
    sources = json.loads(sys.argv[3]) if len(sys.argv) > 3 and sys.argv[3] else []
    key_findings = json.loads(sys.argv[4]) if len(sys.argv) > 4 and sys.argv[4] else []
    metadata = json.loads(sys.argv[5]) if len(sys.argv) > 5 and sys.argv[5] else {}

    result = save_research(topic, content, sources, key_findings, metadata)
    print(json.dumps(result, indent=2))
