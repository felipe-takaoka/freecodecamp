const width = 800;
const height = 400;
const padding = 40;

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

const colors = d3.scaleOrdinal(d3.schemeCategory10);

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

d3.json(url).
then(data => {
  data.forEach(d => {
    const parsedTime = d.Time.split(":");
    d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
  });

  const xExtent = d3.extent(data, d => d.Year);
  const xScale = d3.scaleLinear().
  domain([xExtent[0] - 1, xExtent[1] + 1]).
  range([padding, width - padding]);
  const yScale = d3.scaleTime().
  domain(d3.extent(data, d => d.Time)).
  range([height - padding, padding]);

  const yAxis = d3.axisLeft(yScale).
  tickFormat(d3.timeFormat('%M:%S'));
  const xAxis = d3.axisBottom(xScale).
  tickFormat(d3.format("d"));

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

  function onMouseOver(e, d) {
    d3.select(this).
    attr("r", 5).
    style("stroke", "white");

    const timeFormat = d3.timeFormat('%M:%S');

    tooltip.
    attr("data-year", d.Year).
    html(`
          <span class="nationality">${d.Nationality} - ${d.Year}</span><br>
          <span class="name" style="color:${colors(d.Doping !== "")};">${d.Name}</span>
          <hr>
          <span class="place">#${d.Place}</span>
          <div class="body">
          Time: ${timeFormat(d.Time)}
          </div>
        `).
    style("opacity", 0.7).
    style("left", `${e.clientX + 10}px`).
    style("top", `${e.clientY + 10}px`);
  }

  function onMouseOut() {
    d3.select(this).
    attr("r", 4).
    style("stroke", null);

    tooltip.
    style("opacity", 0);
  }

  svg.selectAll("circle").
  data(data).
  enter().
  append("circle").
  attr("cx", d => xScale(d.Year)).
  attr("cy", d => yScale(d.Time)).
  attr("r", 4).
  attr("data-xvalue", d => d.Year).
  attr("data-yvalue", d => d.Time.toISOString()).
  attr("class", "dot").
  style("fill", d => colors(d.Doping !== "")).
  on("mouseover", onMouseOver).
  on("mouseout", onMouseOut);

  const legendContainer = svg.
  append("g").
  attr("id", "legend");

  const legend = legendContainer.
  selectAll("#legend").
  data(colors.domain()).
  enter().
  append("g").
  attr("class", "legend-label");

  legend.
  append("rect").
  attr("x", width - padding - (18 + 2 + 120)).
  attr("y", (d, i) => height / 2 - i * 20).
  attr("width", 18).
  attr("height", 18).
  style("fill", colors);

  legend.
  append("text").
  attr("x", width - padding - 118).
  attr("y", (d, i) => height / 2 - i * 20 + 12).
  text(d => d ? "Riders with doping allegations" : "No doping allegations").
  style("font-size", ".6em").
  style("fill", "white");
});