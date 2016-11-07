# Ubuntu Xenial 16.04 [LTS]
FROM ubuntu:16.04
MAINTAINER Michelle Beard <michelle.s.beard@gmail.com>

# Install system wide dependencies
RUN apt-get -yqq update && apt-get -yqq install \
	openjdk-8-jre \
	wget 

RUN apt-key adv --keyserver ha.pool.sks-keyservers.net --recv-keys 46095ACC8548582C1A2699A9D27D666CD88E42B4

ENV LOGSTASH_VERSION 1:2.3.4-1
ENV LOGSTASH_REPO_BASE http://packages.elasticsearch.org/logstash/2.3/debian

RUN echo "deb $LOGSTASH_REPO_BASE stable main" > /etc/apt/sources.list.d/logstash.list

# Install Logstash
RUN set -x \
	&& apt-get -yqq update \
	&& apt-get -yqq install --no-install-recommends logstash=$LOGSTASH_VERSION \
	&& rm -rf /var/lib/apt/lists/*

ENV PATH /opt/logstash/bin:$PATH

# Setup Logstash
COPY logstash.conf /etc/logstash/conf.d/logstash.conf
COPY brew.json /etc/logstash/conf.d/brew.json

# Run Logstash
CMD ["logstash", "-f", "/etc/logstash/conf.d/logstash.conf"]