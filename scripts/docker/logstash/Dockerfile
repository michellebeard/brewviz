FROM logstash:5
MAINTAINER Michelle Beard <michelle.s.beard@gmail.com>

# Setup Logstash
COPY logstash.conf /etc/logstash/conf.d/logstash.conf
COPY brew.json /etc/logstash/conf.d/brew.json

# Run Logstash
CMD ["logstash", "-f", "/etc/logstash/conf.d/logstash.conf"]