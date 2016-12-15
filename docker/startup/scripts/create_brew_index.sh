curl -XPUT "http://elasticsearch:9200/_template/brew" -d '
{
  "template" : "brew",
  "order" : 1,
  "settings" : {
    "number_of_shards" : 1,
    "number_of_replicas" : 0,
    "index.refresh_interval" : "5s"
  },
  "mappings" : {
    "_default_" : {
      "_all" : {
        "enabled" : false
      }
    },
    "beer" : {
      "properties" : {
        "available" : {
          "type" : "object",
          "properties" : {
            "name" : {
              "type" : "keyword"
            },
            "description" : {
              "type" : "text"
            }
          }
        },
        "abv" : {
          "type" : "float"
        },
        "createDate" : {
          "type" : "date",
          "format" : "yyyy-MM-dd HH:mm:ss"
        },
        "updateDate" : {
          "type" : "date",
          "format" : "yyyy-MM-dd HH:mm:ss"
        },
        "description" : {
          "type" : "text"
        },  
        "foodPairings" : {
          "type" : "text"
        },  
        "glass" : {
          "type" : "object",
          "properties": {
            "name" : {
              "type" : "keyword"
            }
          }
        },  
        "ibu" : {
          "type" : "float"
        },  
        "ingredients" : {
          "type" : "object",
          "properties" : {
            "hops" : {
              "type" : "object"
            },
            "malt" : {
              "type" : "object"
            },
            "yeast" : {
              "type" : "object"
            }
          }
        },
        "isOrganic" : {
          "type" : "keyword"
        },  
        "name" : {
          "type" : "text",
          "fields" : {
            "raw" : {
              "type": "keyword"
            }
          }
        },
        "nameDisplay" : {
          "type" : "text",
          "fields" : {
            "raw" : {
              "type" : "keyword"
            }
          }
        },
        "originalGravity" : {
          "type" : "float"
        },  
        "servingTemperature" : {
          "type" : "keyword"
        },  
        "servingTemperatureDisplay" : {
          "type" : "keyword"
        },  
        "style" : {
          "type" : "object",
          "properties" : {
            "abvMax" : {
              "type" : "float"
            },
            "abvMin" : {
              "type" : "float"
            },
            "ogMax" : {
              "type" : "float"
            },
            "ogMin" : {
              "type" : "float"  
            },
            "fgMax" : {
              "type" : "float"
            },
            "fgMin" : {
              "type" : "float"
            },
            "ibuMax" : {
              "type" : "integer"
            },
            "ibuMin" : {
              "type" : "integer"
            },
            "srmMax" : {
              "type" : "integer"
            },
            "srmMin" : {
              "type" : "integer"
            },
            "name" : {
              "type" : "text",
              "fields" : {
                "raw" : {
                  "type" : "keyword"
                }
              }
            },
            "shortName" : {
              "type" : "keyword"
            },
            "description" : {
              "type" : "text"
            },  
            "category" : {
              "type" : "object",
              "properties" : {
                "name" : {
                  "type" : "text",
                  "fields" : {
                    "raw" : {
                      "type" : "keyword"
                    }
                  }
                }
              }
            }          
          }
        }
      }
    }
  }
}'
