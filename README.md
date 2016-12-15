# BrewViz 

Comp177 Final Project: BrewViz

Developers: Michelle Beard, Alena Borisenko, and Maja Milosavljevic

This project will create an exploratory tool that would help users discover beer facts and breakdowns on their favorite beers.

## Web Visualization Screenshots

### Splash
![Spash Screen]
(https://github.com/mooshu1x2/brewviz/blob/master/docs/splash.png)

### CirclePack Visualization 
![CirclePack]
(https://github.com/mooshu1x2/brewviz/blob/master/docs/circlepack.png)

### Zoomed View
![Zoomed]
(https://github.com/mooshu1x2/brewviz/blob/master/docs/beer2.png)

### Search/Filter on Pizza
![Search]
(https://github.com/mooshu1x2/brewviz/blob/master/docs/pizza.png)

### Pizza Results
![Pizza]
(https://github.com/mooshu1x2/brewviz/blob/master/docs/beer.png)

## Full Deployment Instructions
We use Docker to containerize our entire development stack. 

### Clone

1. Checkout our repo
    ```sh
    $ git clone https://github.com/mooshu1x2/brewviz.git BrewViz
    
    ```
    
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
    $ docker-compose up -d startup
    $ docker-compose up -d logstash
    $ docker-compose up -d kibana
    ```
    
3. (Optional) Verify the deployment by navigating to Kibana in your preferred browser.
    ```sh
    http://localhost:5601
    ```

4. (Optional) When prompted to create a new index in Kibana, enter "brew". You will be able to see all the logs in Elasticsearch.
    
5. (Optional) If you want to reingest all the data, you will need to restart the docker containers.
    ```sh
    $ docker-compose stop 
    $ docker-compose up -d 
    ```

### To View BrewViz Tutorial page

1. Open web browser to http://localhost:8000

2. Once done with viewing, shutdown the docker containers.
    ```sh
    $ docker-compose stop
    $ ./scripts/clean_docker.sh
    ```

## Todos
1. Add additional filter capabilities, such as filtering on IBU and sweetness values.
2. Add beer imagery data on leaf nodes if available.
3. Color nodes based on beer SRM (beer color system).
4. On hover to explain abbreviations instead of creating a legend.

License
----

MIT
