#!/usr/bin/env python3
"""
YouTube Transcript Tool for OpenCode.
Fetches video transcripts from YouTube URLs.
"""

import json
import re
import sys
from pathlib import Path

# Add the venv site-packages to path
venv_site_packages = Path.home() / ".config" / "opencode" / ".venv" / "lib"
for p in venv_site_packages.glob("python*/site-packages"):
    sys.path.insert(0, str(p))

from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    NoTranscriptFound,
    TranscriptsDisabled,
    VideoUnavailable,
)


def extract_video_id(url: str) -> str | None:
    """
    Extract video ID from various YouTube URL formats.

    Supports:
    - https://www.youtube.com/watch?v=VIDEO_ID
    - https://youtu.be/VIDEO_ID
    - https://www.youtube.com/embed/VIDEO_ID
    - https://www.youtube.com/v/VIDEO_ID
    - Just the VIDEO_ID itself
    """
    patterns = [
        r"(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/|youtube\.com/v/)([a-zA-Z0-9_-]{11})",
        r"^([a-zA-Z0-9_-]{11})$",
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)

    return None


def get_transcript(url: str) -> dict:
    """
    Fetch transcript from a YouTube video.

    Args:
        url: YouTube URL or video ID

    Returns:
        dict with video_id, transcript text, and metadata
    """
    video_id = extract_video_id(url)

    if not video_id:
        return {"error": f"Could not extract video ID from URL: {url}"}

    try:
        # Create API instance
        ytt_api = YouTubeTranscriptApi()

        # Get list of available transcripts
        transcript_list = ytt_api.list(video_id)

        # Try to get the original transcript first (manually created)
        transcript = None
        language = None
        is_generated = None

        # First, try manually created transcripts
        try:
            for t in transcript_list:
                if not t.is_generated:
                    transcript = t.fetch()
                    language = t.language_code
                    is_generated = False
                    break
        except Exception:
            pass

        # If no manual transcript, get auto-generated
        if transcript is None:
            try:
                for t in transcript_list:
                    if t.is_generated:
                        transcript = t.fetch()
                        language = t.language_code
                        is_generated = True
                        break
            except Exception:
                pass

        if transcript is None:
            return {"error": "No transcript available for this video"}

        # Combine transcript segments into full text
        full_text = " ".join([segment.text for segment in transcript])

        # Convert to list of dicts for JSON serialization
        segments = [
            {
                "text": segment.text,
                "start": segment.start,
                "duration": segment.duration,
            }
            for segment in transcript
        ]

        # Calculate total duration from last segment
        duration_seconds = 0
        if segments:
            last_segment = segments[-1]
            duration_seconds = int(last_segment["start"] + last_segment["duration"])

        return {
            "video_id": video_id,
            "url": f"https://www.youtube.com/watch?v={video_id}",
            "language": language,
            "is_auto_generated": is_generated,
            "duration_seconds": duration_seconds,
            "transcript": full_text,
            # segments omitted to reduce output size
        }

    except TranscriptsDisabled:
        return {"error": f"Transcripts are disabled for video: {video_id}"}
    except NoTranscriptFound:
        return {"error": f"No transcript found for video: {video_id}"}
    except VideoUnavailable:
        return {
            "error": f"Video is unavailable (private, deleted, or age-restricted): {video_id}"
        }
    except Exception as e:
        return {"error": f"Error fetching transcript: {str(e)}"}


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: yt_transcript.py <youtube_url>"}))
        sys.exit(1)

    url = sys.argv[1]
    result = get_transcript(url)
    print(json.dumps(result, indent=2))
