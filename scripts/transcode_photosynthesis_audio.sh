#!/usr/bin/env bash
set -euo pipefail

source_dir="${1:-public/sounds/photosyntesis}"
output_dir="${2:-public/sounds/photosynthesis}"

mkdir -p "$output_dir"

clips=(
  intro
  step1_boil
  step2_alcohol
  step3_wash
  step4_iodine
  tinashe_intro
  experiment_complete
)

for clip_name in "${clips[@]}"; do
  source_file="$source_dir/$clip_name.wav"
  output_file="$output_dir/$clip_name.mp3"

  if [[ ! -f "$source_file" ]]; then
    echo "Missing narration source: $source_file" >&2
    exit 1
  fi

  ffmpeg \
    -hide_banner \
    -loglevel error \
    -y \
    -i "$source_file" \
    -codec:a libmp3lame \
    -b:a 128k \
    -ar 24000 \
    -ac 1 \
    "$output_file"
done

echo "Created ${#clips[@]} narration clips in $output_dir"
