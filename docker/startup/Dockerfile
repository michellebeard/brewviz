FROM ubuntu:latest
MAINTAINER Michelle Beard <michelle.s.beard@gmail.com>

RUN apt-get update && apt-get install -y wget curl python && apt-get clean

RUN wget https://github.com/jwilder/dockerize/releases/download/v0.1.0/dockerize-linux-amd64-v0.1.0.tar.gz

RUN tar -C /usr/local/bin -xzvf dockerize-linux-amd64-v0.1.0.tar.gz

# Copy Files Over
COPY ./scripts/create_brew_index.sh /opt/create_brew_index.sh
COPY ./scripts/cleanup.sh /opt/cleanup.sh
COPY ./scripts/entrypoint.sh /opt/entrypoint.sh

# Make executable
RUN chmod +x /opt/*.sh
