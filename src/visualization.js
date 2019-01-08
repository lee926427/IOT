let width = 960,
    height = 500,
    twoPi = 2 * Math.PI,
    progress = 0,
    total = 1308573,
    formatPercent = d3.format(".0%"),
    margin = {top:30,right:10,bottom:30,left:10};

let arc = d3.arc().startAngle(0)
    .innerRadius(180)
    .outerRadius(240);
let svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`);

let meter = svg.append('g')
    .attr('class', 'progress-meter');
meter.append('path').attr('d', arc.endAngle(twoPi));

let foreground = meter.append('path')
    .attr('class', 'foreground');
let text = meter.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '.35em');