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
                categories: {
                    terms: {
                        field: "style.category.name.keyword",
                        exclude: "", // exclude empty strings.
                        size: 5 // limit to top 5 categories (out of 17).
                    },
                    aggs: {
                        styles: {
                            terms: {
                                field: "style.name.keyword",
                                size: 5 // limit to top 5 styles per cateogry. 
                            },
                            aggs: {
                                beer: {
                                    terms: {
                                        field: "nameDisplay.keyword",
                                        size: 5
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }).then(function(resp) {
        console.log(resp);
        // D3 code goes here.
        var root = createChildNodes(resp);
        var margin = { top: 350, right: 480, bottom: 350, left: 400 },
            radius = Math.min(margin.top, margin.right, margin.bottom, margin.left) - 10;

        var width = margin.left + margin.right,
            height = margin.top + margin.bottom;

        var formatNumber = d3.format(",d");

        var x = d3.scale.linear()
            .range([0, 2 * Math.PI]);

        var y = d3.scale.sqrt()
            .range([0, radius]);

        var color = d3.scale.category20c();

       	var partition = d3.layout.partition()
    		.value(function(d) { return d.doc_count; });

        partition
            .nodes(root)
            .forEach(function(d) {
                d.name = d.key;
            });

        var arc = d3.svg.arc()
            .startAngle(function(d) {
                return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
            .endAngle(function(d) {
                return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
            .innerRadius(function(d) {
                return Math.max(0, y(d.y)); })
            .outerRadius(function(d) {
                return Math.max(0, y(d.y + d.dy)); });

        var svg = d3.select("#donut").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform",  "translate(" + margin.left + "," + margin.top + ")");

        svg.selectAll("path")
            .data(partition.nodes(root))
            .enter().append("path")
            .attr("d", arc)
            .style("fill", function(d) {
                return color((d.children ? d : d.parent).name); })
            .on("click", click)
            .append("title")
            .text(function(d) {
                return d.name + "\n" + formatNumber(d.value); });

        function click(d) {
            svg.transition()
                .duration(750)
                .tween("scale", function() {
                    var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                        yd = d3.interpolate(y.domain(), [d.y, 1]),
                        yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
                    return function(t) { x.domain(xd(t));
                        y.domain(yd(t)).range(yr(t)); };
                })
                .selectAll("path")
                .attrTween("d", function(d) {
                    return function() {
                        return arc(d); }; });
        }

        function createChildNodes(dataObj) {
            var root = {};
            root.key = "";
            root.children = dataObj.aggregations.categories.buckets;
            root.children.forEach(function(d) { d.children = d.styles.buckets; });
            root.children.forEach(function(d) {
                d.children.forEach(function(d) {
                    d.children = d.beer.buckets;
                });
            });
            return root;
        }

        d3.select(self.frameElement).style("height", margin.top + margin.bottom + "px");
    });
});
