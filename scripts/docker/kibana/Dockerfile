FROM kibana:5
MAINTAINER Michelle Beard <michelle.s.beard@gmail.com>

RUN apt-get update && apt-get install -y netcat bzip2

COPY entrypoint.sh /tmp/entrypoint.sh
RUN chmod +x /tmp/entrypoint.sh

# Install XPack
RUN kibana-plugin install x-pack

CMD ["/tmp/entrypoint.sh"]
