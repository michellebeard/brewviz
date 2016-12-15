# BrewViz
Comp177 Final Project: BrewViz

Developers: Michelle Beard, Alena Borisenko, and Maja Milosavljevic

This project will create an exploratory tool that would help users discover beer facts and breakdowns on their favorite beers.

## Full Deployment Instructions

### Generate Beer Data

1. Create virtual environment
    ```sh
    $ mkdir env
    $ python3 -m venv env 
    $ source env/bin/activate
    ```

2. Install dependencies
    
    ```sh
    $ pip install -r scripts/requirements.txt
    ```

3. (Optional) Execute getBeerData.py

    ```sh
    $ python3 scripts/getBeerData.py
    ```
    
    This will take about 30 minutes to run, but you don't need to run
    this if the data has already been ingested by Elasticsearch. I've
    also included the raw data in the scripts/data directory.
    
### Docker Instructions

1. Install Docker at https://www.docker.com/

2. Autobuild and run Docker containers
    ```sh
    $ docker-compose up -d elasticsearch 
    $ docker-compose up -d logstash
    $ docker-comopse up -d kibana
    ```
    
3. Verify the deployment by navigating to Kibana in your preferred browser.
    ```sh
    http://localhost:5601
    ```

4. When prompted to create a new index in Kibana, enter "brew". You will be able to see all the logs in Elasticsearch.
    
5. (Optional) If you want to reingest all the data, you will need to delete all indices and reingest the data:
    ```sh
    $ ./scripts/cleanup.sh
    $ docker-compose up -d logstash
    ```

### To View BrewViz Tutorial page
1. Launch web server quietly.

    ```sh
    $ ./scripts/runServer.sh
    ```

2. Open web browser to localhost:8000

3. Once done with viewing, shutdown the webserver and docker containers.
    ```sh
    $ kill -9 pid; where pid is the id to the python script runServer.sh
    $ docker-compose stop
    $ ./scripts/clean_docker.sh

### Todos

License
----

MIT
