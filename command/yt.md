---
description: Query a YouTube video transcript and save the answer
agent: youtube
---

Analyze the following YouTube video and answer the question.

## Input

$ARGUMENTS

## Instructions

1. **Parse the input**: The first argument is the YouTube URL, everything after is the question
2. **Fetch transcript**: Use `youtube_get_transcript` with the URL
3. **If transcript fetch fails**: Report the error clearly and stop
4. **If transcript succeeds**: Analyze it and answer the question thoroughly
5. **Save the result**: Use `youtube_save_query` to save the answer to `~/yt-query/`

## Expected Usage

```
/yt https://youtube.com/watch?v=VIDEO_ID What are the main topics discussed?
/yt https://youtu.be/VIDEO_ID Summarize the key points
```

## Output

After answering, save the result with:
- video_url: the YouTube URL
- query: the user's question
- answer: your full markdown response

Report the saved file path to the user when done.
