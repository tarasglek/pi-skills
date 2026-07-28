---
name: remove-audio-or-video-ads
description: Use when the user asks to remove ads, sponsor reads, promos, or ad breaks from audio, video, podcast episodes, YouTube URLs, or other spoken-word media.
---

# Remove Audio or Video Ads

## Core rule

Use `erm --adblock` to remove ad/sponsor/promo ranges. Render directly; do not dry-run. Add `--video` only when preserving picture. Always work in `/tmp`, then copy final files into `$ATTACHMENT_DIR` for Signal delivery.

## Inputs

- Local video/audio: use the provided path.
- Podcast episode/app/share link: first use `podcast-episode-download-url` to resolve the real RSS enclosure MP3/M4A URL, then download that URL.
- YouTube/link: download with `uvx yt-dlp`, not global `yt-dlp`.

```sh
TMP=/tmp/erm-media-adblock-$(date +%s)
mkdir -p "$TMP"
uvx yt-dlp --remote-components ejs:github --no-playlist \
  -f 'bv*[ext=mp4][height<=720]+ba[ext=m4a]/b[ext=mp4][height<=720]/best[height<=720]' \
  --merge-output-format mp4 -o "$TMP/source.%(ext)s" URL
```

## Launcher

Use the stock committed checkout:

```sh
cd /home/taras/Documents/podcast-adblock/erm
ERM='uv run erm'
```

## Long-running jobs

Use tmux for all `--adblock` invocations that may take long, including render and downloads/transcodes around long episodes. Do not rely on a single foreground shell command; transcription/rendering can exceed tool timeouts. Always log output to `$TMP/*.log`.

```sh
tmux new -d -s erm-adblock-render "cd /home/taras/Documents/podcast-adblock/erm && uv run erm '$TMP/source.mp3' --model small --compute-type int8 --adblock --adblock-transcript '$TMP/adblock.vtt' --json '$TMP/cuts.json' -o '$TMP/adfree.wav' 2>&1 | tee '$TMP/render.log'"
tmux capture-pane -pt erm-adblock-render
```

## Render

For 20–60+ minute media, use `small`/`int8`; `large-v3` is slow on CPU.

Audio podcast:
```sh
$ERM "$TMP/source.mp3" --model small --compute-type int8 \
  --adblock \
  --adblock-transcript "$TMP/adblock.vtt" \
  --json "$TMP/cuts.json" \
  -o "$TMP/adfree.wav"
```

Video:
```sh
$ERM "$TMP/source.mp4" --model small --compute-type int8 \
  --adblock --video \
  --adblock-transcript "$TMP/adblock.vtt" \
  --json "$TMP/cuts.json" \
  -o "$TMP/adfree-full.mp4"
```

Use the default `pi` command unless the user explicitly asks for a different detector. The committed `erm` code runs `pi -p` non-interactively and parses the returned ad-block JSON.

## Signal-friendly output

For audio, make an iOS-friendly AAC/M4A:

```sh
ffmpeg -y -i "$TMP/adfree.wav" -c:a aac -b:a 96k -movflags +faststart "$TMP/adfree.m4a"
cp "$TMP/adfree.m4a" "$ATTACHMENT_DIR/adfree.m4a"
cp "$TMP/cuts.json" "$ATTACHMENT_DIR/adfree-cuts.json"
```

For video, make an iOS-friendly MP4:

```sh
ffmpeg -y -i "$TMP/adfree-full.mp4" \
  -vf 'scale=-2:540' -c:v libx264 -preset veryfast -crf 29 \
  -c:a aac -b:a 96k -movflags +faststart \
  "$TMP/adfree-signal.mp4"
cp "$TMP/adfree-signal.mp4" "$ATTACHMENT_DIR/adfree.mp4"
cp "$TMP/cuts.json" "$ATTACHMENT_DIR/adfree-cuts.json"
```

Report duration, size, total removed, and the attachment paths.

## Podcasts page

When output is an audio podcast, also publish it to the static reverse-bin page:

- App dir: `~/smallweb/podcasts`
- Page: `https://podcasts.coolness.fyi/`
- Copy final `.m4a` into app dir with a safe unique filename.
- Put newest episode link at top of `index.html`.
- Link text should be only the episode title. No metadata text, no “download/listen”.
- Add cache-busting query params to both page URL and audio link: `?v=$(date +%s)`.
- No audio player. No cuts link unless user asks.

```sh
APP=~/smallweb/podcasts
V=$(date +%s)
mkdir -p "$APP"
cp "$TMP/adfree.m4a" "$APP/$SLUG.m4a"
python3 - <<PY
from pathlib import Path
app = Path.home() / 'smallweb/podcasts'
p = app / 'index.html'
entry = '''  <p><a href="$SLUG.m4a?v=$V">$TITLE</a></p>\n'''
if p.exists():
    s = p.read_text()
    s = s.replace('  <h1>Podcasts</h1>\n', '  <h1>Podcasts</h1>\n' + entry, 1)
else:
    s = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Podcasts</title></head><body>\n  <h1>Podcasts</h1>\n' + entry + '</body></html>\n'
p.write_text(s)
PY
curl -sS "https://podcasts.coolness.fyi/?v=$V" | head
```

## Common mistakes

- Do not run bare `yt-dlp`; use `uvx yt-dlp`.
- Do not write final files directly into `$ATTACHMENT_DIR`; copy from `/tmp`.
- Do not dry-run; render directly.
- Do not use default `large-v3` for quick iteration on CPU.
- Do not omit `--video` if the user wants picture preserved.
