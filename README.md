# Plex CUDA Transcoder

Watch the folder where your TV Show recordings from Plex go and then transcode to H264 using a CUDA enabled video card (optional H265 script provided in the container at /usr/src/app/config).

## Requirements

* [NVIDIA driver](https://github.com/NVIDIA/nvidia-docker/wiki/Frequently-Asked-Questions#how-do-i-install-the-nvidia-driver)
* [nvidia-docker](https://github.com/NVIDIA/nvidia-docker)

## Docker Compose

```
version: '2.3'

services:

  plex-cuda-transcoder:
    image: dabauum221/plex-cuda-transcoder:latest
    runtime: nvidia
    container_name: plex-cuda-transcoder
    volumes:
      - /path/to/tv-shows:/watch
    environment:
      - PLEX_HOST=192.168.1.100
      - PLEX_LIBRARY_ID=1
      - PLEX_TOKEN=?
    restart: unless-stopped
```
