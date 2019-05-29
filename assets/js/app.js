// @TODO: YOUR CODE HERE!

//chart set up
const svgWidth = 1000;
const svgHeight = 800;
const margin = {
    top: 20, 
    right: 40, 
    bottom: 100, 
    left: 80
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

//canvas creation & predefined heigth and width
const svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  const chartGroup = svg.append("g");
  .attr("tranform", `translate(${margin.left}, ${margin.top})`);


// Initial Params
const chosenXAxis = "poverty";

// function used for updating x-scale const upon click on axis label
function xScale(Data, chosenXAxis) {
    // create scales
    const xLinearScale = d3.scaleLinear()
      .domain([d3.min(Data, d => d[chosenXAxis]) * 0.8,
        d3.max(Data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }

// function used for updating xAxis const upon click on axis label
function renderAxes(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
  
// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }

  function renderText(textGroup, newXScale, chosenXAxis){
    textGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis])))

    return textGroup;
  }

//d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

//import data
(async function (){
    const Data = await d3.csv("assets/data/data.csv");

    Data.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    console.log(Data)

// xLinearScale function above csv import
let xLinearScale = xScale(Data, chosenXAxis);

// Create y scale function
let yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(Data, d => d.num_hits)])
    .range([height, 0]);

// Create initial axis functions
let bottomAxis = d3.axisBottom(xLinearScale);
let leftAxis = d3.axisLeft(yLinearScale);

// append x axis
const xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

// append y axis
chartGroup.append("g")
    .call(leftAxis);

// append initial circles
var circlesGroup = chartGroup.selectAll("circle")
        .data(Data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.num_hits))
        .attr("r", 20)
        .attr("fill", "gray")
        .attr("opacity", ".5");

//append state abbreviations to the circles
var textGroup = chartGroup.selectAll(".stateText")
   .data(Data)
   .enter()
   .append("text")
   .attr("x", d => xLinearScale(d[chosenXAxis]))
   .attr("y", d => yLinearScale(d.healthcare))
   .text(d => d.abbr)
   .attr("class", "stateText")
   .style("font-size", "12px")
   .style("text-anchor", "middle")
   .style('fill', 'white');

// Create axis labels
  let labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

  let PovertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 15)
        .attr("value", "poverty") /
        .classed("active", true)
        .text("Percent in Poverty: ");
    // append y axis
  chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("% of People without Healthcare");
        
    // x axis labels event listener
  labelsGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        const value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

            // replaces chosenXAxis with value
            chosenXAxis = value;

            // console.log(chosenXAxis)

            // functions here found above csv import
            // updates x scale for new data
            xLinearScale = xScale(Data, chosenXAxis);

            // updates x axis with transition
            xAxis = renderAxes(xLinearScale, xAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

          }
    });
})()