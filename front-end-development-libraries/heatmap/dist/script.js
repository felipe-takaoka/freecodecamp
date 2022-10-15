const width = 1000;
const height = 420;
const vPadding = 20;
const leftPadding = 80;
const rightPadding = 25;

const legendWidth = 50;
const legendTotalWidth = legendWidth + 2 * rightPadding;

const svg = d3.
select(".visHolder").
append("svg").
attr("width", width).
attr("height", height);

const tooltip = d3.
select(".visHolder").
append("div").
attr("id", "tooltip").
style("opacity", 0);

const legend = svg.
append("g").
attr("class", "legend").
attr("id", "legend").
style("background", "white").
attr("transform",
`translate(${width - legendTotalWidth + rightPadding}, 0)`);

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
d3.json(url).
then(res => {
  const data = res.monthlyVariance;
  data.forEach(d => {
    d.month -= 1;
  });

  d3.select("#title").
  append("div").
  attr('id', 'description').
  style("font-size", ".6em").
  style("color", "gray").
  html(
  data[0].year +
  ' - ' +
  data[data.length - 1].year +
  ': base temperature ' +
  res.baseTemperature +
  '&#8451;');


  const xScale = d3.scaleBand().
  domain(data.map(d => d.year)).
  range([leftPadding, width - legendTotalWidth]);

  const yScale = d3.
  scaleBand().
  domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).
  range([height - vPadding, vPadding]).
  padding(0);

  const xAxis = d3.axisBottom(xScale).
  tickValues(xScale.domain().filter(year => year % 20 === 0)).
  tickFormat(d3.format("d"));

  const yAxis = d3.
  axisLeft().
  scale(yScale).
  tickValues(yScale.domain()).
  tickFormat(month => {
    var date = new Date(0);
    date.setUTCMonth((month + 1) % 12);
    var format = d3.timeFormat('%B');
    return format(date);
  }).
  tickSize(4, 1);

  svg.append("g").
  attr("id", "x-axis").
  attr("class", "axis").
  attr("transform", `translate(0, ${height - vPadding})`).
  call(xAxis);

  svg.append("g").
  attr("id", "y-axis").
  attr("class", "axis").
  attr("transform", `translate(${leftPadding}, 0)`).
  call(yAxis);

  const extent = d3.extent(data, d => d.variance);
  const delta = Math.max(-extent[0], extent[1]);
  const tempMin = Math.floor(res.baseTemperature - delta);
  const tempMax = Math.ceil(res.baseTemperature + delta);

  const temperatureColor = d3.
  scaleSequential([tempMin, tempMax], d3.interpolateRgb("#7179f0", "#ab0215"));

  const legendScale = d3.
  scaleLinear().
  domain([tempMin, tempMax]).
  range([height - vPadding, vPadding]);

  const colorAxis = d3.
  axisRight(legendScale).
  tickValues([tempMin, (tempMin + tempMax) / 2, tempMax]).
  tickFormat(d3.format('.1f'));

  svg.append("g").
  attr("id", "color-axis").
  attr("class", "axis").
  attr("transform", `translate(${width - legendTotalWidth + rightPadding + 10}, 0)`).
  call(colorAxis);

  const nColors = 30;
  const tempStep = (tempMax - tempMin) / nColors;
  const legendTemperatures = d3.range(tempMin, tempMax, tempStep);

  legend.
  selectAll("rect").
  data(legendTemperatures).
  enter().
  append("rect").
  attr("x", 0).
  attr("y", t => legendScale(t)).
  attr("width", t => 10).
  attr("height", (height - vPadding) / legendTemperatures.length).
  attr("fill", t => temperatureColor(t));


  const onMouseMove = (e, d) => {
    const temp = e.toElement.attributes["data-temp"].value;
    const formatTemp = temp => Math.round(temp * 10) / 10 + "&#8451;";

    tooltip.
    attr("data-year", d.year).
    html(`
        <div class="tooltip-date">
          ${d.year}-${String(d.month + 1).padStart(2, "0")}
        </div>
        ${formatTemp(temp)}
        <div class="tooltip-variance">
        ${formatTemp(d.variance)} from base temperature
        <div>
        `).
    style("opacity", 0.7).
    style("left", `${e.clientX + 10}px`).
    style("top", `${e.clientY + 10}px`);
  };

  const onMouseOut = () => {
    tooltip.
    style("opacity", 0);
  };

  svg.selectAll("rect").
  data(data).
  enter().
  append("rect").
  attr("class", "cell").
  attr("data-month", d => d.month).
  attr("data-year", d => d.year).
  attr("data-variance", d => d.variance).
  attr("data-temp", d => res.baseTemperature + d.variance).
  attr("x", d => xScale(d.year)).
  attr("y", d => yScale(d.month)).
  attr("width", d => xScale.bandwidth(d.year)).
  attr("height", d => yScale.bandwidth(d.month)).
  attr("fill", d => temperatureColor(res.baseTemperature + d.variance)).
  on("mousemove", onMouseMove).
  on("mouseout", onMouseOut);
});