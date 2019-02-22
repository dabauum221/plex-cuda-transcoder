# Start with NVidia CUDA base image
FROM nvidia/cuda:10.0-devel

MAINTAINER Daniel Baum <daniel.m.baum@gmail.com>

# Install packages
RUN apt-get -y update && apt-get install -y wget curl nano git build-essential yasm pkg-config

RUN git clone --branch n8.2.15.7 https://github.com/FFmpeg/nv-codec-headers.git /root/nv-codec-headers && \
  cd /root/nv-codec-headers &&\
  make -j8 && \
  make install -j8 && \
  cd /root && rm -rf nv-codec-headers

# Compile and install ffmpeg from source
RUN git clone --branch n3.3.9 https://github.com/FFmpeg/FFmpeg /root/ffmpeg && \
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

# Setup NVIDIA graphics card capabilities
ENV NVIDIA_DRIVER_CAPABILITIES video,compute,utility

# Install Node 8
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - \
  && apt-get install -y nodejs \
  && curl -L https://www.npmjs.com/install.sh | sh

# Create app directory
WORKDIR /usr/src/app

# Volumes to work with video files
VOLUME ["/watch"]
VOLUME ["/output"]

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install --only=production

# Bundle app source
COPY . .

CMD [ "npm", "start" ]