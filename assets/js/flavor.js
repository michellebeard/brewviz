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
                        field: "style.name",
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
        // Put your d3 code here
        var rect = document.getElementById("flavor").getBoundingClientRect();
        var width = rect.width;
        var dimensions = [width, "400"];

        var icon_size = ["100", "140"];
        var icon_ypos = "120";
        var icon_xpos = ["0", "100", "200", "300", "400"];
        var grad_color = ["#ffcc00", "#ffb700", "#ffa100", "#ff8c00", "#ff7700"];

        var beer = d3.select("#beers")
            .attr("width", dimensions[0])
            .attr("height", dimensions[1]);

        var beer0 = d3.select("#beer0")
            .attr("x", icon_xpos[0])
            .attr("y", icon_ypos)
            .attr("width", icon_size[0])
            .attr("height", icon_size[1])
            .attr("fill", grad_color[0]);

        var beer1 = d3.select("#beer1")
            .attr("x", icon_xpos[1])
            .attr("y", icon_ypos)
            .attr("width", icon_size[0])
            .attr("height", icon_size[1])
            .attr("fill", grad_color[1]);

        var beer2 = d3.select("#beer2")
            .attr("x", icon_xpos[2])
            .attr("y", icon_ypos)
            .attr("width", icon_size[0])
            .attr("height", icon_size[1])
            .attr("fill", grad_color[2]);

        var beer3 = d3.select("#beer3")
            .attr("x", icon_xpos[3])
            .attr("y", icon_ypos)
            .attr("width", icon_size[0])
            .attr("height", icon_size[1])
            .attr("fill", grad_color[3]);

        var beer4 = d3.select("#beer4")
            .attr("x", icon_xpos[4])
            .attr("y", icon_ypos)
            .attr("width", icon_size[0])
            .attr("height", icon_size[1])
            .attr("fill", grad_color[4]);

        var beerlabel0 = beer0.append("text")
            .text(data.beer[0].key)
            .attr("x", icon_size[0] / 2)
            .attr("y", icon_size[1] - 5)
            .attr("text-anchor", "middle")
            .attr("fill", grad_color[0]);

        var beerlabel1 = beer1.append("text")
            .text(data.beer[1].key)
            .attr("x", icon_size[0] / 2)
            .attr("y", icon_size[1] - 5)
            .attr("text-anchor", "middle")
            .attr("fill", grad_color[1]);

        var beerlabel2 = beer2.append("text")
            .text(data.beer[2].key)
            .attr("x", icon_size[0] / 2)
            .attr("y", icon_size[1] - 5)
            .attr("text-anchor", "middle")
            .attr("fill", grad_color[2]);

        var beerlabel3 = beer3.append("text")
            .text(data.beer[3].key)
            .attr("x", icon_size[0] / 2)
            .attr("y", icon_size[1] - 5)
            .attr("text-anchor", "middle")
            .attr("fill", grad_color[3]);

        var beerlabel4 = beer4.append("text")
            .text(data.beer[4].key)
            .attr("x", icon_size[0] / 2)
            .attr("y", icon_size[1] - 5)
            .attr("text-anchor", "middle")
            .attr("fill", grad_color[4]);

        var reorderIcons = function() {
            for (var i = 0; i < 5; i++) {
                if (beerlabel0.text() == data.beer[i].key) {
                    beer0.transition()
                        .duration(1000)
                        .attr("x", icon_xpos[i]);
                }
            }

            for (var i = 0; i < 5; i++) {
                if (beerlabel1.text() == data.beer[i].key) {
                    beer1.transition()
                        .duration(1000)
                        .attr("x", icon_xpos[i]);
                }
            }

            for (var i = 0; i < 5; i++) {
                if (beerlabel2.text() == data.beer[i].key) {
                    beer2.transition()
                        .duration(1000)
                        .attr("x", icon_xpos[i]);
                }
            }

            for (var i = 0; i < 5; i++) {
                if (beerlabel3.text() == data.beer[i].key) {
                    beer3.transition()
                        .duration(1000)
                        .attr("x", icon_xpos[i]);
                }
            }

            for (var i = 0; i < 5; i++) {
                if (beerlabel4.text() == data.beer[i].key) {
                    beer4.transition()
                        .duration(1000)
                        .attr("x", icon_xpos[i]);
                }
            }
        };

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
                        var xAvgFG = (x.fgMax.value + x.fgMin.value)/2;
                        var yAvgFG = (y.fgMax.value + y.fgMin.value)/2;

                        var xRte = 0.82 * xAvgFG + 0.18 * x.og.value;
                        var yRte = 0.82 * yAvgFG + 0.18 * y.og.value;

                        return d3.ascending(xRte, yRte);
                    }
                );
                reorderIcons();
            });


        function createChildNodes(dataObj) {
            var root = {};
            root.beer = dataObj.aggregations.styles.buckets;
            return root;
        }

    });
});
