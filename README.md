# Plex CUDA Transcoder

Watch the folder where Plex stores your recorded content and then transcode new additions to H264 using a CUDA enabled video card (optional H265 script provided in the container at /usr/src/app/scripts).

## Requirements

* [NVIDIA driver](https://github.com/NVIDIA/nvidia-docker/wiki/Frequently-Asked-Questions#how-do-i-install-the-nvidia-driver)
* [nvidia-docker](https://github.com/NVIDIA/nvidia-docker)

## Usage

### Docker

```
docker run \
  --name plex-cuda-transcoder \
  --runtime=nvidia \
  -e PLEX_HOST=192.168.1.100 \
  -e PLEX_LIBRARY_ID=1 \
  -e PLEX_TOKEN=? \
  -v </path/to/tv-shows>:/watch \
  dabauum221/plex-cuda-transcoder
```

### Docker Compose

```
version: '2.3'

services:

  plex-cuda-transcoder:
    image: dabauum221/plex-cuda-transcoder:latest
    runtime: nvidia
    container_name: plex-cuda-transcoder
    volumes:
      - </path/to/tv-shows>:/watch
    environment:
      - PLEX_HOST=192.168.1.100
      - PLEX_PORT=32400
      - PLEX_LIBRARY_ID=1
      - PLEX_TOKEN=?
    restart: unless-stopped
```

## Paramaters

| Parameter | Function |
| :----: | --- |
| `-e PLEX_HOST=192.168.1.100` | Plex IP address |
| `-e PLEX_PORT=32400` | Plex port (32400 is the default) |
| `-e PLEX_LIBRARY_ID=1` | The ID of the library where the recordings go (The one that points to the volume configured) |
| `-e PLEX_TOKEN` | The token used to authenticate to the Plex server, [How to find it](https://support.plex.tv/articles/204059436-finding-an-authentication-token-x-plex-token/) |
| `-v /watch` | Location of the Plex recording directory to watch |
