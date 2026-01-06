#!/usr/bin/env python3
"""
Token Counter Tool

Counts exact tokens in text files using tiktoken (Claude/GPT-4 tokenizer).

Usage:
    uv run python tool/count_tokens.py <file_path>
    uv run python tool/count_tokens.py <file_path1> <file_path2> ...

Examples:
    uv run python tool/count_tokens.py agent/orchestrator.md
    uv run python tool/count_tokens.py agent/*.md
"""

import sys
import tiktoken
from pathlib import Path


def count_tokens(text: str, encoding_name: str = "cl100k_base") -> int:
    """
    Count tokens in text using tiktoken.

    Args:
        text: The text to count tokens for
        encoding_name: Tokenizer encoding (default: cl100k_base for Claude/GPT-4)

    Returns:
        Number of tokens
    """
    enc = tiktoken.get_encoding(encoding_name)
    tokens = enc.encode(text)
    return len(tokens)


def count_file_tokens(file_path: str) -> dict:
    """
    Count tokens in a file.

    Args:
        file_path: Path to the file

    Returns:
        Dictionary with file stats
    """
    path = Path(file_path)

    if not path.exists():
        return {"file": file_path, "error": "File not found"}

    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        tokens = count_tokens(content)
        words = len(content.split())
        chars = len(content)
        lines = content.count("\n") + 1

        return {
            "file": file_path,
            "tokens": tokens,
            "words": words,
            "chars": chars,
            "lines": lines,
            "chars_per_token": round(chars / tokens, 2) if tokens > 0 else 0,
            "tokens_per_word": round(tokens / words, 2) if words > 0 else 0,
        }
    except Exception as e:
        return {"file": file_path, "error": str(e)}


def format_number(num: int) -> str:
    """Format number with thousands separator."""
    return f"{num:,}"


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    file_paths = sys.argv[1:]
    results = []

    for file_path in file_paths:
        result = count_file_tokens(file_path)
        results.append(result)

    # Print results
    if len(results) == 1:
        # Single file - detailed output
        result = results[0]
        if "error" in result:
            print(f"❌ Error: {result['error']}")
            sys.exit(1)

        print(f"📄 File: {result['file']}")
        print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print(f"🎯 Tokens:       {format_number(result['tokens'])}")
        print(f"📝 Words:        {format_number(result['words'])}")
        print(f"🔤 Characters:   {format_number(result['chars'])}")
        print(f"📏 Lines:        {format_number(result['lines'])}")
        print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print(f"📊 Chars/token:  {result['chars_per_token']}")
        print(f"📊 Tokens/word:  {result['tokens_per_word']}")
    else:
        # Multiple files - table output
        print(f"📊 Token Count Summary")
        print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

        total_tokens = 0
        total_words = 0
        total_chars = 0

        for result in results:
            if "error" in result:
                print(f"❌ {result['file']}: {result['error']}")
            else:
                print(f"📄 {result['file']}")
                print(
                    f"   🎯 {format_number(result['tokens'])} tokens | "
                    f"📝 {format_number(result['words'])} words | "
                    f"🔤 {format_number(result['chars'])} chars"
                )
                total_tokens += result["tokens"]
                total_words += result["words"]
                total_chars += result["chars"]

        if total_tokens > 0:
            print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
            print(
                f"📊 Total: {format_number(total_tokens)} tokens | "
                f"{format_number(total_words)} words | "
                f"{format_number(total_chars)} chars"
            )


if __name__ == "__main__":
    main()
