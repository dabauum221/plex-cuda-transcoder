# Plex CUDA Transcoder

Applications like Plex will record live TV content as MPEG2 files with a .TS extension.  Watch the folder where .TS (MPEG2) videos are recorded and then transcode to H264 using a CUDA enabled video card.  There is an optional H265 script provided in the container at /usr/src/app/scripts.  Just set the environmental variable SCRIPT to '/usr/src/app/scripts/ffmpeg-h265.sh'

## Requirements

* [NVIDIA driver](https://docs.nvidia.com/datacenter/tesla/tesla-installation-notes/index.html)
* [nvidia-docker2](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html#docker)

### Test Docker with Nvidia Card

docker run --rm --gpus all nvidia/cuda:11.0-base nvidia-smi

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
