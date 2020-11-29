# Start with Nvidia CUDA base image
FROM nvidia/cuda:11.1-devel

LABEL maintainer="daniel.m.baum@gmail.com"

ARG DEBIAN_FRONTEND=noninteractive

# Install packages
RUN apt-get -y update && apt-get install -y wget curl nano git build-essential yasm pkg-config

RUN git clone --branch n11.0.10.0 https://github.com/FFmpeg/nv-codec-headers.git /root/nv-codec-headers && \
  cd /root/nv-codec-headers &&\
  make -j8 && \
  make install -j8 && \
  cd /root && rm -rf nv-codec-headers

# Compile and install ffmpeg from source
RUN git clone --branch n4.3.1 https://github.com/FFmpeg/FFmpeg /root/ffmpeg && \
  cd /root/ffmpeg && ./configure \
  --enable-nonfree --disable-shared \
  --enable-nvenc --enable-cuda \
  --enable-cuvid --enable-libnpp \
  --extra-cflags=-I/usr/local/cuda/include \
  --extra-cflags=-I/usr/local/include \
  --extra-ldflags=-L/usr/local/cuda/lib64 && \
  make -j8 && \
  make install -j8 && \
  cd /root && rm -rf ffmpeg

# Setup Nvidia graphics card capabilities
ENV NVIDIA_DRIVER_CAPABILITIES video,compute,utility

# Setup default variables for PLEX
ENV PLEX_HOST localhost
ENV PLEX_PORT 32400
ENV PLEX_LIBRARY_ID 1
ENV SCRIPT '/usr/src/app/scripts/ffmpeg.sh'
ENV POST_SCRIPT '/usr/src/app/scripts/post-transcode-plex.sh'

# Install Node 12
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - \
  && apt-get install -y nodejs \
  && curl -L https://www.npmjs.com/install.sh | sh

# Create app directory
WORKDIR /usr/src/app

# Volumes to work with video files
VOLUME ["/watch"]

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install --only=production

# Bundle app source
COPY . .

# Change the scripts to be executable
RUN chmod +x ./scripts/ffmpeg.sh
RUN chmod +x ./scripts/ffmpeg-h265.sh
RUN chmod +x ./scripts/post-transcode-plex.sh

CMD [ "npm", "start" ]
