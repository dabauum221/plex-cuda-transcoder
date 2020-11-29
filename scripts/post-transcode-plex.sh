#!/bin/sh

SOURCE="$1"

rm -f "$SOURCE"
wget -qO- "http://$PLEX_HOST:$PLEX_PORT/library/sections/$PLEX_LIBRARY_ID/refresh?X-Plex-Token=$PLEX_TOKEN" > /dev/null