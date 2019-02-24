#!/bin/sh

SOURCE="$1"
DESTINATION="$2"

ffmpeg -y -hwaccel cuvid -c:v mpeg2_cuvid -deint adaptive -drop_second_field 1 -i "$SOURCE" \
-c:a copy \
-c:v hevc_nvenc -preset:v llhq -b:v 4M -profile:v main -level:v 4.1 \
-f matroska "$DESTINATION"