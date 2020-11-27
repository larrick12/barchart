let project = "D3 Bar Chart"; //coded by Larrick

const w = 800;
const h = 400;
const padding = 60;
let barwidth = w / 275;

let svgCont = d3.
select(".svgcont").
append("svg").
attr("height", h + 60).
attr("width", w + 100);

let tooltip = d3.
select(".svgcont").
append("div").
attr("id", "tooltip").
style("opacity", 0);

let overlay = d3.
select(".svgcont").
append("div").
attr("class", "overlay").
style("opacity", 0);

d3.json(
"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
function (err, dataset) {
  svgCont.
  append("text").
  attr("transform", "rotate(-90)").
  attr("x", -200).
  attr("y", 80).
  text("Gross Domestic Product");

  svgCont.
  append("text").
  attr("x", w / 2 + 120).
  attr("y", h + 50).
  text("Get more");

  let years = dataset.data.map(item => {
    let quater;
    let temp = item[0].substring(5, 7);
    if (temp === "01") {
      quater = "Q1";
    } else if (temp === "04") {
      quater = "Q2";
    } else if (temp === "07") {
      quater = "Q3";
    } else if (temp === "10") {
      quater = "Q4";
    }
    return item[0].substring(0, 4) + " " + quater;
  });

  let yearDate = dataset.data.map(item => new Date(item[0]));

  let xmax = new Date(d3.max(yearDate));
  xmax.setMonth(xmax.getMonth() + 3);

  const xScale = d3.
  scaleTime().
  domain([d3.min(yearDate), xmax]).
  range([0, w]);

  var xAxis = d3.axisBottom().scale(xScale);

  svgCont.
  append("g").
  attr("id", "x-axis").
  attr("transform", `translate(${padding},` + h + ")").
  call(xAxis);

  let gdp = dataset.data.map(item => item[1]);

  let gpdMin = d3.min(gdp);
  let gpdMax = d3.max(gdp);

  let linearScale = d3.scaleLinear().domain([0, gpdMax]).range([0, h]);

  let dataScale = [];
  dataScale = gdp.map(item => linearScale(item));

  const yScale = d3.scaleLinear().domain([0, gpdMax]).range([h, 0]);

  const yAxis = d3.axisLeft(yScale);

  svgCont.
  append("g").
  attr("id", "y-axis").
  attr("transform", `translate(${padding},` + 0 + ")").
  call(yAxis);

  d3.select("svg").
  selectAll("rect").
  data(dataScale).
  enter().
  append("rect").
  attr("data-date", (d, i) => dataset.data[i][0]).
  attr("data-gdp", (d, i) => dataset.data[i][1]).
  attr("class", "bar").
  attr("x", (d, i) => xScale(yearDate[i])).
  attr("y", (d, i) => h - d).
  attr("width", barwidth).
  attr("height", d => d).
  style("fill", "#394693").
  attr("transform", `translate(${padding},` + 0 + ")").
  on("mouseover", (d, i) => {
    overlay.
    transition().
    duration(0).
    style("height", d + "px").
    style("width", barwidth + "px").
    style("opacity", 0.9).
    style("left", i * barwidth + 0 + "px").
    style("top", h - d + "px").
    style("transform", "translateX(60px)");
    tooltip.transition().duration(200).style("opacity", 0.9);
    tooltip.
    html(
    years[i] +
    "<br>" +
    "$" +
    gdp[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") +
    " Billion").

    attr("data-date", dataset.data[i][0]).
    style("left", i * barwidth + 30 + "px").
    style("top", h - 100 + "px").
    style("transform", "translateX(60px)");
  }).

  on("mouseout", function (d) {
    tooltip.transition().duration(200).style("opacity", 0);
    overlay.transition().duration(200).style("opacity", 0);
  });
});