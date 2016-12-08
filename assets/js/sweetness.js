$(document).ready(function() {

    var width, height
    var chartWidth, chartHeight
    var margin
    var svg = d3.select("#graph").append("svg")
    var axisLayer = svg.append("g").classed("axisLayer", true)
    var chartLayer = svg.append("g").classed("chartLayer", true)


    var xScale = d3.scaleBand()
    var xInScale = d3.scaleBand();
    var yScale = d3.scaleLinear()
    var color = d3.scaleOrdinal().range(["#5DDEC9", "#EF64AD", "#7b6888", "#BA67E5", "#E0E23B", "#d0743c", "#ff8c00"]);

    d3.csv("assets/data/data.csv", cast, main)

    function cast(d) {
        Object.keys(d).forEach(function(key) {
            if (!isNaN(+d[key])) d[key] = +d[key]
        })
        return d
    }

    function main(data) {
        console.log(data)


        var nested = d3.nest()
            .rollup(function(d) {
                delete d[0].contry;
                return d[0]
            })
            .key(function(d) {
                return d.contry
            })
            .entries(data)

        nested.forEach(function(d) {
            d.age = Object.keys(d.value).map(function(key) {
                return { key: key, value: d.value[key] }
            })
        })

        setSize(nested)
        drawAxis()
        drawChart(nested)
    }

    function setSize(nested) {
        width = document.querySelector("#graph").clientWidth
        height = document.querySelector("#graph").clientHeight

        margin = { top: 0, left: 100, bottom: 40, right: 0 }
        chartWidth = width - (margin.left + margin.right)
        chartHeight = height - (margin.top + margin.bottom)
        svg.attr("width", width).attr("height", height)
        axisLayer.attr("width", width).attr("height", height)
        chartLayer
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("transform", "translate(" + [margin.left, margin.top] + ")")
        xScale.domain(nested.map(function(d) {
                return d.key
            }))
            .range([0, chartWidth]).paddingInner(0.1)
        var ageNames = Object.keys(nested[0].value)
        xInScale.domain(ageNames).range([0, xScale.bandwidth()])

        var yMax = d3.max(nested.map(function(d) {
            var values = Object.keys(d.value).map(function(key) {
                return d.value[key]
            })
            return d3.max(values)
        }))

        yScale.domain([0, yMax]).range([chartHeight, 0])
    }

    function drawChart(nested) {
        var t = d3.transition()
            .duration(1000)
            .ease(d3.easeLinear)


        var contry = chartLayer.selectAll(".contry")
            .data(nested)

        var newCountry = contry.enter().append("g").attr("class", "contry")


        contry.merge(newCountry)
            .attr("transform", function(d) {
                return "translate(" + [xScale(d.key), 0] + ")";
            });


        var bar = newCountry.selectAll(".bar")
            .data(function(d) {
                return d.age
            })

        var newBar = bar.enter().append("rect").attr("class", "bar")


        bar.merge(newBar)
            .attr("width", xInScale.bandwidth())
            .attr("height", 0)
            .attr("fill", function(d) {
                return color(d.key);
            })
            .attr("transform", function(d) {
                return "translate(" + [xInScale(d.key), chartHeight] + ")"
            })

        //アニメーション
        bar.merge(newBar).transition(t)
            .attr("height", function(d) {
                return chartHeight - yScale(d.value);
            })
            .attr("transform", function(d) {
                return "translate(" + [xInScale(d.key), yScale(d.value)] + ")"
            })

    }

    function drawAxis() {
        var yAxis = d3.axisLeft(yScale)
            .tickSizeInner(-chartWidth)

        axisLayer.append("g")
            .attr("transform", "translate(" + [margin.left, margin.top] + ")")
            .attr("class", "axis y")
            .call(yAxis);

        var xAxis = d3.axisBottom(xScale)

        axisLayer.append("g")
            .attr("class", "axis x")
            .attr("transform", "translate(" + [margin.left, chartHeight] + ")")
            .call(xAxis);

    }

});
