import React, { Component } from 'react';
import * as d3 from 'd3';
import "./style/chart.css";


class BarChart extends Component {
    componentDidMount() {
        this.drawChart();
    }

    drawChart() {
        var win = window.innerWidth > 700 ? 0.5 : 0.8
        var width = window.innerWidth * win ;
        var height = width*0.5;
        var margin = 50;
        var duration = 250;

        var lineOpacity = "0.25";
        var lineOpacityHover = "0.85";
        var otherLinesOpacityHover = "0.1";
        var lineStroke = "3.5px";
        var lineStrokeHover = "5px";

        var circleOpacity = '0.85';
        var circleOpacityOnLineHover = "0.25"
        var circleRadius = 6;
        var circleRadiusHover = 9;

        const data = this.props.data;

        var xScale = d3.scaleTime()
            .domain(d3.extent(data[0].record, d => d.time))
            .range([0, width - margin]);

        var yScale = d3.scaleLinear()
            .domain([d3.min(data[0].record, d => d.data-10),
                d3.max(data[1].record, d => d.data+10)])
            .range([height - margin, 0]);

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        /* Add SVG */
        var svg = d3.select("#lineChart").append("svg")
            .attr("width", (width + margin) + "px")
            .attr("height", (height + margin) + "px")
            .append('g')
            .attr("transform", `translate(${margin}, ${margin})`);

        
        /* Add line into SVG */
        var line = d3.line()
            .x(d => xScale(d.time))
            .y(d => yScale(d.data));

        let lines = svg.append('g')
            .attr('class', 'lines');

        lines.selectAll('.line-group')
            .data(data).enter()
            .append('g')
            .attr('class', 'line-group')
            .on("mouseover", function (d, i) {
                svg.append("text")
                    .attr("class", "title-text")
                    .style("fill", color(i))
                    .text(d.class)
                    .attr("text-anchor", "middle")
                    .attr("x", (width - margin) / 2)
                    .attr("y", 5)
                    .style("font-size", "30px")
                    .style("opacity", 0)
                    .transition()
                    .duration(duration)
                    .delay(100)
                    .style("opacity", 1);
            })
            .on("mouseout", function (d) {
                svg.select(".title-text")
                    .style("opacity", 1)
                    .transition()
                    .duration(duration)
                    .delay(100)
                    .style("opacity", 0)
                    .remove();
            })
            .append('path')
            .attr('class', 'line')
            .attr('d', d => line(d.record))
            .style('stroke', (d, i) => color(i))
            .style('opacity', lineOpacity)
            .style("stroke-width", lineStroke)
            .on("mouseover", function (d) {
                d3.selectAll('.line')
                    .style('opacity', otherLinesOpacityHover);
                d3.selectAll('.circle')
                    .style('opacity', circleOpacityOnLineHover);
                d3.select(this)
                    .style('opacity', lineOpacityHover)
                    .style("stroke-width", lineStrokeHover)
                    .style("cursor", "pointer");
            })
            .on("mouseout", function (d) {
                d3.selectAll(".line")
                    .style('opacity', lineOpacity);
                d3.selectAll('.circle')
                    .style('opacity', circleOpacity);
                d3.select(this)
                    .style("stroke-width", lineStroke)
                    .style("cursor", "none");
            });


        /* Add circles in the line */
         lines.selectAll("circle-group")
            .data(data).enter()
            .append("g")
            .style("fill", (d, i) => color(i))
            .selectAll("circle")
            .data(d => d.record).enter()
            .append("g")
            .attr("class", "circle")
            .on("mouseover", function (d) {
                d3.select(this)
                    .style("cursor", "pointer")
                    .append("text")
                    .attr("class", "text")
                    .text(`${d.data}`)
                    .attr("x", d => xScale(d.time)-10)
                    .attr("y", d => yScale(d.data) - 20)
                    .style("font-size", "20px")
                    .style("opacity", 0)
                    .transition()
                    .duration(duration)
                    .delay(100)
                    .style("opacity", 1);
            })
            .on("mouseout", function (d) {
                d3.select(this)
                    .style("cursor", "none")
                    .selectAll(".text")
                    .style("opacity", 1)
                    .transition()
                    .duration(duration)
                    .delay(100)
                    .style("opacity", 0)
                    .remove();
            })
                .append("circle")
                .attr("cx", d => xScale(d.time))
                .attr("cy", d => yScale(d.data))//�ݸѨM
                .attr("r", circleRadius)
                .style('opacity', circleOpacity)
                .on("mouseover", function (d) {
                    d3.select(this)
                        .transition()
                        .duration(duration)
                        .attr("r", circleRadiusHover);
                })
                .on("mouseout", function (d) {
                    d3.select(this)
                        .transition()
                        .duration(duration)
                        .attr("r", circleRadius);
                });
                
        /* Add Axis into SVG */
        var xAxis = d3.axisBottom(xScale).ticks(6);
        var yAxis = d3.axisLeft(yScale).ticks(5);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${height - margin})`)
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append('text')
            .attr("y", 15)
            .attr("transform", "rotate(-90)")
            .attr("fill", "#000")
            .text("Total record");  
    }
    render() {
        return <div id="root">
            <div id="lineChart"></div>
        </div>
    }
}

export default BarChart;
