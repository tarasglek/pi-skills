---
name: speech-output-piper
description: Use when the user wants spoken audio output instead of text responses, using local CPU TTS with Piper and ffmpeg mastering.
---

# Speech Output with Piper (CPU, local)

Generate high-quality local TTS audio with Piper, then master to final compressed audio (for example `.m4a`) using ffmpeg.

## When to Use

- User asks for voice/audio output instead of text
- You need offline/local CPU TTS with better quality than ffmpeg flite

## Requirements

- Local `piper` binary (preferred)
- `ffmpeg`
- A Piper voice model `.onnx` file
- `docker` (optional fallback)

## Configuration

Set these variables per environment:

```bash
PIPER_MODEL="/path/to/voice.onnx"
TMP_AUDIO="/tmp/tts-intermediate-audio"
OUT_AUDIO="/tmp/tts-output.m4a"
TEXT="<sentence to speak>"
```

## Local binary (preferred)

```bash
echo "$TEXT" | piper --model "$PIPER_MODEL" --output_file "$TMP_AUDIO"
ffmpeg -y -i "$TMP_AUDIO" -c:a aac -b:a 192k "$OUT_AUDIO"
```

## Docker fallback

```bash
printf "%s" "$TEXT" | docker run --rm -i \
  -v "$(dirname "$PIPER_MODEL"):/models" \
  -v /tmp:/tmp \
  --entrypoint /usr/share/piper/piper \
  rhasspy/wyoming-piper \
  --model "/models/$(basename "$PIPER_MODEL")" \
  --output_file "$TMP_AUDIO"

ffmpeg -y -i "$TMP_AUDIO" \
  -af "highpass=f=70,acompressor=threshold=-18dB:ratio=2.2:attack=20:release=250,alimiter=limit=0.95,loudnorm=I=-16:TP=-1.5:LRA=11" \
  -c:a aac -b:a 192k "$OUT_AUDIO"
```

## Output contract

When done, respond with:

- A short confirmation line
- The generated final audio file path(s)

## Notes

- Keep spoken output concise unless user asks for longer narration.
- If a dependency/model is missing, report exactly what is missing.
- Prefer this skill over ffmpeg `flite` when quality matters.
