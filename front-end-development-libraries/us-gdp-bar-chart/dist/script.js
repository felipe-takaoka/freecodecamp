const width = 800;
const height = 400;
const padding = 40;

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

const svg = d3.select(".visHolder").
append("svg").
attr("width", width).
attr("height", height);

const tooltip = d3.
select(".visHolder").
append("div").
attr("id", "tooltip").
style("opacity", 0);

const hoverLine = svg.
append("line").
attr("stroke", "white").
style("opacity", 0);

const defaultBarFillColor = "#1A65D1";

d3.json(url).
then(res => {
  const data = res.data;

  const xScale = d3.scaleTime().
  domain(d3.extent(data, ([dt]) => new Date(dt))).
  range([padding, width - padding]);
  const yScale = d3.scaleLinear().
  domain([0, d3.max(data, d => d[1])]).
  range([height - padding, padding]);

  const yAxis = d3.axisLeft(yScale);
  const xAxis = d3.
  axisBottom(xScale).
  ticks(d3.timeYear.every(5));

  svg.append("g").
  attr("id", "x-axis").
  attr("class", "axis").
  attr("transform", `translate(0, ${height - padding})`).
  call(xAxis);

  svg.append("g").
  attr("id", "y-axis").
  attr("class", "axis").
  attr("transform", `translate(${padding}, 0)`).
  call(yAxis);

  function onMouseOver(e) {
    d3.select(this).
    style("fill", "blue");

    const [date, gdp] = this["__data__"];
    const y = yScale(gdp);
    const x = xScale(new Date(date));
    hoverLine.
    attr("x1", padding).
    attr("y1", y).
    attr("x2", x).
    attr("y2", y).
    style("opacity", 1);
  }

  function onMouseMove(e) {
    const [date, gdp] = this["__data__"];

    tooltip.
    attr("data-date", date).
    style("opacity", 0.9).
    html(`${date}<br>$ ${gdp} bi`).
    style("left", `${e.clientX + 10}px`).
    style("top", `${e.clientY}px`);
  }

  function onMouseOut() {
    d3.select(this).style("fill", defaultBarFillColor);
    hoverLine.style("opacity", 0);
    tooltip.style("opacity", 0);
  }

  svg.
  selectAll("rect").
  data(data).
  enter().
  append("rect").
  attr("class", "bar").
  attr("x", d => xScale(new Date(d[0]))).
  attr("y", d => yScale(d[1])).
  attr("width", 3).
  attr("height", d => height - padding - yScale(d[1])).
  style("fill", defaultBarFillColor).
  attr("data-date", d => d[0]).
  attr("data-gdp", d => d[1]).
  on("mouseover", onMouseOver).
  on("mousemove", onMouseMove).
  on("mouseout", onMouseOut);
});