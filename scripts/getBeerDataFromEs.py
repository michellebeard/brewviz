from elasticsearch import Elasticsearch

es = Elasticsearch(
    ['localhost'],
    http_auth=('elastic', 'changeme'),
)

# Capture the hierachy of data, ordered from 
# Beer Category -> Beer Style -> Beer
query = {
  "query": {
    "bool": {
      "must": [
        {
          "query_string": {
            "query": "*",
            "analyze_wildcard": True
          }
        },
        {
          "query_string": {
            "analyze_wildcard": True,
            "query": "*"
          }
        }
      ],
      "must_not": []
    }
  },
  "size": 0,
  "aggs": {
    "categoryName": {
      "terms": {
        "field": "style.category.name",
        "size": 15,
        "order": {
          "_count": "desc"
        }
      },
      "aggs": {
        "styeName": {
          "terms": {
            "field": "style.name",
            "size": 20,
            "order": {
              "_count": "desc"
            }
          },
          "aggs": {
            "beer": {
              "terms": {
                "field": "nameDisplay",
                "size": 50,
                "order": {
                  "_count": "desc"
                }
              }
            }
          }
        }
      }
    }
  }
}

res = es.search(index="brew", body=query)
print("Got %d Hits:" % res['hits']['total'])
for hit in res['aggregations']['categoryName']['buckets']:
    # print("%(timestamp)s %(author)s: %(text)s" % hit["_source"])
    print(hit)
    sleep(30)
