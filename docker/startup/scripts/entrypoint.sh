#!/bin/bash

# Wait for the Elasticsearch container to be ready before starting Kibana.
echo "Stalling for Elasticsearch"
# while true; do
#     nc -q 1 elasticsearch 9200 2>/dev/null && break
# done
dockerize -wait http://elasticsearch:9200 

echo "Starting scripts"

sh ./opt/cleanup.sh
sh ./opt/create_brew_index.sh

echo "Starting server"
cd /var
python -m SimpleHTTPServer 80