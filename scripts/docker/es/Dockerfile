# Ubuntu Xenial 16.04 [LTS]
FROM ubuntu:16.04
MAINTAINER Michelle Beard <michelle.s.beard@gmail.com>

# Install system wide dependencies
RUN apt-get -yqq update && apt-get -yqq install \
	openjdk-8-jre

RUN apt-key adv --keyserver ha.pool.sks-keyservers.net --recv-keys 46095ACC8548582C1A2699A9D27D666CD88E42B4

ENV ELASTICSEARCH_VERSION 2.3.5
ENV ELASTICSEARCH_REPO_BASE http://packages.elasticsearch.org/elasticsearch/2.x/debian

RUN echo "deb $ELASTICSEARCH_REPO_BASE stable main" > /etc/apt/sources.list.d/elasticsearch.list

# Install elasticsearch
RUN set -x \
	&& apt-get -yqq update \
	&& apt-get -yqq install --no-install-recommends elasticsearch=$ELASTICSEARCH_VERSION \
	&& rm -rf /var/lib/apt/lists/*

ENV PATH /usr/share/elasticsearch/bin:$PATH
WORKDIR /usr/share/elasticsearch

RUN set -ex \
	&& for path in \
		./data \
		./logs \
		./config \
		./config/scripts \
	; do \
		mkdir -p "$path"; \
		chown -R elasticsearch:elasticsearch "$path"; \
	done

# Setup Elasticsearch
COPY elasticsearch.yml /usr/share/elasticsearch/config
COPY logging.yml /usr/share/elasticsearch/config

USER elasticsearch

# Install Elastic-HQ
RUN plugin install royrusso/elasticsearch-HQ/2.0.3

CMD ["elasticsearch"]