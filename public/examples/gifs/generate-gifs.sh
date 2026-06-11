#!/bin/bash
# generate-gifs.sh — 将草图与生成结果合成为渐变过渡 GIF
# 用法: ./generate-gifs.sh sketch.png result.png output.gif
#   sketch.png  — 草图（黑线白底）
#   result.png  — AI 生成结果
#   output.gif  — 输出 GIF 路径
#
# 依赖: ImageMagick 6.x (convert)
#   apt-get install -y imagemagick

set -euo pipefail

if ! command -v convert &>/dev/null; then
  echo "Error: ImageMagick 'convert' not found. Install with:"
  echo "  apt-get install -y imagemagick"
  exit 1
fi

if [ $# -lt 3 ]; then
  echo "Usage: $0 <sketch.png> <result.png> <output.gif>"
  exit 1
fi

SKETCH="$1"
RESULT="$2"
OUTPUT="$3"
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

SIZE=512x512
FRAMES=15  # morph 中间帧数

echo "→ Resizing sketch to ${SIZE} ..."
convert "$SKETCH" -resize "$SIZE" -background white -alpha remove "$TMPDIR/sketch_resized.png"

echo "→ Resizing result to ${SIZE} ..."
convert "$RESULT" -resize "$SIZE" "$TMPDIR/result_resized.png"

echo "→ Generating morph GIF (${FRAMES} intermediate frames) ..."
convert "$TMPDIR/sketch_resized.png" "$TMPDIR/result_resized.png" \
  -morph "$FRAMES" \
  -loop 0 \
  -delay 8 \
  "$OUTPUT"

echo "✓ Done → $OUTPUT"
ls -lh "$OUTPUT"
