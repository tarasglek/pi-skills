---
name: transcription
description: TL;DR transcription helper for audio attachments. Use when user sends audio/voice notes and wants quick text summary.
---

# Transcription (TL;DR)

Use local `ffmpeg` + `whisper` CLI to transcribe audio and return a short summary.

## Model file

This skill expects a local Whisper model file at:

`/home/taras/Downloads/whisper.cpp/models/ggml-base.en.bin`

If missing, use the local whisper source dir downloader tool:

```bash
cd /home/taras/Downloads/whisper.cpp/models
./download-ggml-model.sh base.en
```

## Input

A local audio file path (for example from an `@/tmp/...` attachment reference).

## Steps

1. Convert to WAV (16k mono) if needed:

```bash
ffmpeg -y -i "<audio-file>" -ar 16000 -ac 1 "/tmp/transcription.wav"
```

2. Transcribe with local whisper.cpp CLI:

```bash
whisper -m "/home/taras/Downloads/whisper.cpp/models/ggml-base.en.bin" -f "/tmp/transcription.wav" -l en -otxt -of "/tmp/transcription"
```

3. Read transcript from:

`/tmp/transcription.txt`

## Output format

Return:

- `Transcript:` full text
- `TL;DR:` 1-3 concise bullet points

If language is unknown, try `-l auto`.
