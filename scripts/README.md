# Script Guide

### Generate Beer Data
1. Install dependencies
    
    ```sh
    $ pip install -r requirements.txt
    ```

2. Run getBeerData.py

    ```sh
    $ python getBeerData.py
    ```
    
    This will take about 30 minutes to run, but you don't need to run
    this if the data has already been ingested by Elasticsearch. I've
    also included the raw data in the data/ directory.
    
### Docker Instructions

1. Install Docker at https://www.docker.com/

2. Install Docker Compose:
    ```sh
    $ pip install docker-compose
    ```

3. Create es/data and es/logs directory in the same level as docker-compose
    ```sh
    $ mkdir -p es/data
    $ mkdir -p es/logs
    ```

4. Build and run Docker containers
    ```sh
    $ docker-compose up -d elasticsearch 
    $ docker-compose up -d kibana
    ```
    
5. Verify the deployment by navigating to your server address in your preferred browser.
    ```sh
    http://localhost:5601
    ```
    
6. (Optional) If you want to reingest all the data:
    ```sh
    $ ./cleanup.sh
    $ docker-compose up -d logstash
    ```

### Todos

License
----

MIT


