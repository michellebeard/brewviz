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
                        size: 3 // limit to top 5 categories (out of 17).
                    },
                    aggs: {
                        styles: {
                            terms: {
                                field: "style.name.keyword",
                                size: 3 // limit to top 5 styles per cateogry. 
                            },
                            aggs: {
                                beer: {
                                    terms: {
                                        field: "nameDisplay.keyword",
                                        size: 3,
                                        // order: {
                                        //     _term: "desc"
                                        // }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }).then(function(resp) {
        var root = createChildNodes(resp);
        draw(root);
    });
});

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

var categoryTitle = { 'default': 'Beer Categories and Styles', 'style': 'Beer Styles', 'name': 'Beer' };
var categoryId = ['default', 'style.category.name', 'style.name', 'nameDisplay'];
var mappings = { 'style.category.name': 'style.category', 'style.name': 'style', 'nameDisplay': 'name' };
var categoryData = { 'style.category': ['name'], 'style': ['name', 'description', "abvMin", "abvMax"], 'name': ['name', 'description', 'isOrganic'] };

function draw(root) {
    var margin = { top: 400, right: 480, bottom: 500, left: 400 };

    var width = margin.left + margin.right,
        height = margin.top + margin.bottom;

    diameter = width;

    var svg = d3.select("#circlePacking").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    var color = d3.scaleLinear()
        .domain([-1, 3])
        .range(["hsl(24, 33%, 18%)", "hsl(37, 72%, 89%)"])
        .interpolate(d3.interpolateHcl);

    margin = 20;

    var pack = d3.pack()
        .size([diameter - margin, diameter - margin])
        .padding(2);

    root = d3.hierarchy(root)
        .sum(function(d) {
            return d.doc_count;
        })
        .sort(function(a, b) {
            return b.value - a.value;
        });

    var focus = root,
        nodes = pack(root).descendants(),
        view;

    var circle = d3.select("g").selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("id", function(d) {
            return d.data.key;
        })
        .attr("class", function(d) {
            return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
        })
        .style("fill", function(d) {
            return d.children ? color(d.depth) : null;
        })
        .on("click", function(d) {
            if (focus !== d & d.depth !== 3) {
                zoom(d);
                d3.event.stopPropagation();
            }
        })
        .on("mouseover", function(d) {
            var key = d3.select(this).attr('id');
            var id = categoryId[d.depth];
            lookup(id, key);
        });

    var text = d3.select("g").selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("class", "label")
        .style("fill-opacity", function(d) {
            return d.parent === root ? 1 : 0;
        })
        .style("display", function(d) {
            return d.parent === root ? "inline" : "none";
        })
        .text(function(d) {
            return d.data.key;
        });

    var node = d3.select("g").selectAll("circle,text");

    svg.style("background", color(-1))
        .on("click", function() { zoom(root); });

    zoomTo([root.x, root.y, root.r * 2 + margin]);

    function zoom(d) {
        var focus0 = focus;
        focus = d;

        var transition = d3.transition()
            .duration(d3.event.altKey ? 7500 : 750)
            .tween("zoom", function(d) {
                var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                return function(t) { zoomTo(i(t)); };
            });

        transition.selectAll("text")
            .filter(function(d) {
                return d.parent === focus || this.style.display === "inline";
            })
            .style("fill-opacity", function(d) {
                return d.parent === focus ? 1 : 0;
            })
            .on("start", function(d) {
                if (d.parent === focus) this.style.display = "inline";
            })
            .on("end", function(d) {
                if (d.parent !== focus) this.style.display = "none";
            });
    }

    function zoomTo(v) {
        var k = diameter / v[2];
        view = v;
        node.attr("transform", function(d) {
            return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
        });
        circle.attr("r", function(d) {
            return d.r * k;
        });
    }
}

function lookup(id, key) {
    var query = {
        "size": 1,
        "query": {
            "bool": {
                "must": [{
                    "query_string": {
                        "query": id + ':' + key,
                        "analyze_wildcard": true
                    }
                }],
                "must_not": []
            }
        }
    };
    clearAll();

    if (key !== '') {
        var prefix = mappings[id];

        $.ajax({
                method: "POST",
                url: "http://localhost:9200/brew/_search?pretty=true",
                crossDomain: true,
                data: JSON.stringify(query),
                dataType: 'json',
                contentType: 'application/json',
            })
            .done(function(data) {
                var res = data.hits;
                if (prefix == 'style.category') {
                  buildCategory(res);
                } else if (prefix == 'style') {
                  buildStyle(res);
                } else if (prefix == 'name') {
                  buildBeer(res);
                } else {
                  buildDefault();
                }
            })
            .fail(function(data) {
                console.log('fail');
                console.log(data);
            });
    } else {
      buildDefault();
    }
}

function clearAll() {
  $("#title").html("");
  $("#description").html("");
  $("table").hide();
  $(".default").hide();
  $("#content").hide();
}

function buildCategory (res) {
  $("#content").show();
  $("#title").html(res.hits[0]._source.style.category.name);
  $("#description").html("");
}

function buildStyle(res) {
  $("#content").show();
  $("table").hide();
  $("#title").html(res.hits[0]._source.style.name);
  $("#description").html(res.hits[0]._source.description);

  var abv = res.hits[0]._source.style.abvMin + "% - " + res.hits[0]._source.style.abvMax + "%";
  var ibu = res.hits[0]._source.style.ibuMin + " - " + res.hits[0]._source.style.ibuMax;
  $("#style .rangeabv").html(abv);
  $("#style .rangeibu").html(ibu);
  $("#style").show();
}

function buildBeer(res) {
  $("#content").show();
  $("table").hide();
  $("#title").html(res.hits[0]._source.nameDisplay);
  $("#description").html(res.hits[0]._source.description);
  $("#beer .organic").html(res.hits[0]._source.isOrganic);
  $("#beer .abv").html(res.hits[0]._source.abv);
  $("#beer").show();
}

function buildDefault() {
  $(".default").show();
}