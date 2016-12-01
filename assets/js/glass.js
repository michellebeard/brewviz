define(['assets/third_party/elasticsearch-js/elasticsearch'], function(elasticsearch) {
    "use strict";

    var client = new elasticsearch.Client({
        host: 'http://localhost:9200'
    })

    client.search({
        index: 'brew',
        size: 5,
        body: {
            query: {
                bool: {
                    must: {
                        query_string: {
                            query: "glass.name.keyword=\"Pint\" OR glass.name.keyword=\"Snifter\" OR glass.name.keyword=\"Tulip\" OR glass.name.keyword=\"Mug\" OR glass.name.keyword=\"Thistle\"",
                            analyze_wildcard: true
                        }
                    },
                }
            },
            aggs: {
                glassType: {
                    terms: {
                        field: "glass.name.keyword",
                        exclude: "", // exclude empty strings.
                        size: 5 // limit to top 5 categories (out of 17).
                    },
                    aggs: {
                        beer: {
                            terms: {
                                field: "nameDisplay.keyword",
                                size: 5 // limit to top 5 styles per cateogry. 
                            }
                        }
                    }
                }
            }
        }
    }).then(function(resp) {
        // Put your d3 code here
        function createChildNodes(dataObj) {
            var root = {};
            root.key = "";
            root.children = dataObj.aggregations.glassType.buckets;
            root.children.forEach(function(d) { d.children = d.beer.buckets; });
            return root;
        }
    });
});
