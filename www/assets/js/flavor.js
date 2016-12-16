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
                    must: { query_string: { query: "*", analyze_wildcard: true } },
                }
            },
            aggs: {
                styles: {
                    terms: {
                        field: "style.name.raw",
                        size: 5
                    },
                    aggs: {
                        bitterness: {
                            avg: {
                                field: "ibu"
                            }
                        },
                        og: {
                            avg: {
                                field: "originalGravity"
                            }
                        },
                        fgMax: {
                            avg: {
                                field: "style.fgMax"
                            }
                        },
                        fgMin: {
                            avg: {
                                field: "style.fgMin"
                            }
                        }
                    }
                }
            }
        }
    }).then(function(resp) {
        var data = createChildNodes(resp);
        console.log(data);
        var num_beers = data.beer.length;
        var font_size = 16;

        // desired icon size and spacing 
        var icon_size = 100;
        var icon_spacing = 10;
        var food_size = icon_size / 2;

        // Put your d3 code here
        var rect = document.getElementById("flavor").getBoundingClientRect();
        var width = rect.width;

        var dimensions = [width, (icon_size * num_beers) + (icon_spacing * (num_beers - 1))];
        var icon_dims = [dimensions[0] * 2, icon_size];
        var icon_xpos = -(parseInt(icon_dims[0]) / 2) + (parseInt(icon_dims[1]) / 2);
        var icon_ypos = [0,
            1 * (icon_size + icon_spacing),
            2 * (icon_size + icon_spacing),
            3 * (icon_size + icon_spacing),
            4 * (icon_size + icon_spacing)
        ];

        var grad_color = ["#ffcc00", "#ffb700", "#ffa100", "#ff8c00", "#ff7700"];

        var canvas = d3.select("#beers")
            .attr("width", dimensions[0])
            .attr("height", dimensions[1]);

        var beers = [num_beers];

        for (var i = 0; i < num_beers; i++) {
            beers[i] = d3.select("#beer" + i)
                .attr("x", icon_xpos)
                .attr("y", icon_ypos[i])
                .attr("width", icon_dims[0])
                .attr("height", icon_dims[1])
                .attr("fill", grad_color[i]);
        }

        var food_icons = d3.selectAll(".food")
            .attr("width", food_size)
            .attr("height", food_size)
            .attr("fill", "black");

        var beerlabels = [num_beers];

        for (var i = 0; i < num_beers; i++) {
            beerlabels[i] = beers[i].append("text")
                .text(data.beer[i].key)
                .attr("x", dimensions[0] + icon_dims[1] / 2)
                .attr("y", (icon_dims[1] / 2) + font_size)
                .attr("fill", grad_color[i]);
        }

        var reorderIcons = function() {
            for (var j = 0; j < num_beers; j++) {
                for (var i = 0; i < num_beers; i++) {
                    if (beerlabels[j].text() == data.beer[i].key) {
                        beers[j].transition()
                            .duration(1000)
                            .attr("y", icon_ypos[i]);
                    }
                }
            }
        };

        d3.selectAll(".food")
            .on("click", function() {
                var term = this.id;
                makeFoodRequest(term);
            });

        d3.select("#bitter")
            .on("click", function() {
                data.beer.sort(
                    function(x, y) {
                        return d3.ascending(x.bitterness.value,
                            y.bitterness.value);
                    }
                );
                reorderIcons();
            });

        d3.select("#sweet")
            .on("click", function() {
                data.beer.sort(
                    function(x, y) {
                        // Compute sweetness = 0.82 X FG + 0.18 x OG
                        // Ref: https://klugscheisserbrauerei.wordpress.com/beer-balance/
                        var xAvgFG = (x.fgMax.value + x.fgMin.value) / 2;
                        var yAvgFG = (y.fgMax.value + y.fgMin.value) / 2;

                        var xRte = 0.82 * xAvgFG + 0.18 * x.og.value;
                        var yRte = 0.82 * yAvgFG + 0.18 * y.og.value;

                        return d3.ascending(xRte, yRte);
                    }
                );
                reorderIcons();
            });

        var showBeerPairings = function(term, keywords) {
            // for each beer label icon and label
            for (var j = 0; j < num_beers; j++) {
                // for each beer from the num_beers chunk of data 
                for (var i = 0; i < num_beers; i++) {
                    // if a certain piece of data corresponds to this label
                    if (beerlabels[j].text() == keywords[i].key) {
                        if (keywords[i].food.buckets[term].doc_count > 0) {
                            beers[j].transition()
                                .duration(500)
                                .attr("fill", grad_color[j]);

                            beerlabels[j].transition()
                                .duration(500)
                                .attr("fill", grad_color[j]);
                            break;
                        } else if (keywords[i].food.buckets[term].doc_count <= 0) {
                            beers[j].transition()
                                .duration(500)
                                .attr("fill", "grey");

                            beerlabels[j].transition()
                                .duration(500)
                                .attr("fill", "grey");
                        }
                    }
                }
            }
        }

        function createChildNodes(dataObj) {
            var root = {};
            root.beer = dataObj.aggregations.styles.buckets;
            return root;
        }

        function makeFoodRequest(term) {
            var pairing = "foodPairings:" + term;

            var query = {
                "size": 0,
                "query": {
                    "bool": {
                        "must": [{
                            "query_string": {
                                "query": "*",
                                "analyze_wildcard": true
                            }
                        }],
                        "must_not": []
                    }
                },
                "aggs": {
                    "styles": {
                        "terms": {
                            "field": "style.name.raw",
                            "size": 5
                        },
                        "aggs": {
                            "food": {
                                "filters": {
                                    "filters": {
                                        [term]: {
                                            "query_string": {
                                                "query": pairing
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };

            $.ajax({
                    method: "POST",
                    url: "http://localhost:9200/brew/_search?pretty=true",
                    crossDomain: true,
                    data: JSON.stringify(query),
                    dataType: 'json',
                    contentType: 'application/json',
                })
                .done(function(data) {
                    showBeerPairings(term, data.aggregations.styles.buckets);
                })
                .fail(function(data) {});
        }
    });
});
