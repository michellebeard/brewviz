# Script Guide

### Generate Beer Data
1. Run getBeerData.py

    ```sh
    $ python getBeerData.py
    ```
    
    This will take about 30 minutes to run, but you don't need to run
    this if the data has already been ingested by Elasticsearch.
    
### Docker Instructions

1. Install Docker at https://www.docker.com/

2. Install Docker Compose:
    ```sh
    $ pip install docker-compose
    ```
    
3. Build and run Docker containers
    ```sh
    $ docker-compose up -d elasticsearch 
    $ docker-compose up -d kibana
    ```
    
4. Verify the deployment by navigating to your server address in your preferred browser.
    ```sh
    http://localhost:5601
    ```
    
5. (Optional) If you want to reingest all the data:
    ```sh
    $ curl -XDELETE http://localhost:9200/brew?pretty
    $ docker-compose up -d logstash
    ```

### Todos

License
----

MIT

