---
name: remove-audio-or-video-ads
description: Use when the user asks to remove ads, sponsor reads, promos, or ad breaks from audio, video, podcast episodes, YouTube URLs, or other spoken-word media.
---

# Remove Audio or Video Ads

## Core rule

Use `erm --adblock --no-room-tone` to remove ad/sponsor/promo ranges. Room-tone looping is forbidden for ad-block renders because even a quiet automatic sample can become an audible repeating artifact. Render directly; do not dry-run. Add `--video` only when preserving picture. Always work in `/tmp`, then copy final files into `$ATTACHMENT_DIR` for Signal delivery.

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
tmux new -d -s erm-adblock-render "cd /home/taras/Documents/podcast-adblock/erm && uv run erm '$TMP/source.mp3' --model small --compute-type int8 --adblock --no-room-tone --adblock-transcript '$TMP/adblock.vtt' --json '$TMP/cuts.json' -o '$TMP/adfree.wav' 2>&1 | tee '$TMP/render.log'"
tmux capture-pane -pt erm-adblock-render
```

## Render

For 20–60+ minute media, use `small`/`int8`; `large-v3` is slow on CPU.

Audio podcast:
```sh
$ERM "$TMP/source.mp3" --model small --compute-type int8 \
  --adblock --no-room-tone \
  --adblock-transcript "$TMP/adblock.vtt" \
  --json "$TMP/cuts.json" \
  -o "$TMP/adfree.wav"
```

Video:
```sh
$ERM "$TMP/source.mp4" --model small --compute-type int8 \
  --adblock --video --no-room-tone \
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

## Podcasts page and RSS

When output is an audio podcast, also publish it to the static reverse-bin site:

- App dir: `~/smallweb/podcasts`
- Page: `https://podcasts.coolness.fyi/`
- Feed: `https://podcasts.coolness.fyi/feed.xml`
- Copy the final `.m4a` into the app directory with a safe unique filename.
- Run the site's Deno generator after every copy. It rebuilds `index.html` and `feed.xml` from all media files, newest mtime first; never edit either generated file manually.
- Embedded media title metadata becomes the displayed/RSS title, with filename fallback.
- Create a unique website URL using `?cachebreak=<timestamp>` for every delivery.
- In the user-facing response, link the cache-busted website URL—not `feed.xml`. Mention the feed only when the user explicitly asks for its URL.

```sh
APP=~/smallweb/podcasts
CACHEBREAK=$(date +%s%N)
WEBSITE="https://podcasts.coolness.fyi/?cachebreak=$CACHEBREAK"
mkdir -p "$APP"
cp "$TMP/adfree.m4a" "$APP/$SLUG.m4a"
(
  cd "$APP"
  deno task generate
)
curl -fsS "$WEBSITE" | head
curl -fsS https://podcasts.coolness.fyi/feed.xml | head
printf 'Website: %s\n' "$WEBSITE"
```

## Common mistakes

- Do not run bare `yt-dlp`; use `uvx yt-dlp`.
- Do not write final files directly into `$ATTACHMENT_DIR`; copy from `/tmp`.
- Do not dry-run; render directly.
- Do not omit `--no-room-tone` from ad-block renders; short automatic samples can loop audibly beneath the entire output.
- Do not use default `large-v3` for quick iteration on CPU.
- Do not omit `--video` if the user wants picture preserved.
- Do not give the RSS feed as the delivery link; give the website with a fresh `?cachebreak=` value.
