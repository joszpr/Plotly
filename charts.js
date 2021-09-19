function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {selector.append("option").text(sample).property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");
    var holder = Object.entries(result);

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Append Demographic info to the panel with better control over text
    PANEL.append("h6").text("ID: " + holder[0][1]);
    PANEL.append("h6").text("Ethnicity: " + holder[1][1]);
    PANEL.append("h6").text("Gender: " + holder[2][1]);
    PANEL.append("h6").text("Age: " + holder[3][1]);
    PANEL.append("h6").text("Location: " + holder[4][1]);
    PANEL.append("h6").text("Bbtype: " + holder[5][1]);
    PANEL.append("h6").text("Wfreq: " + holder[6][1]);

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(x => x.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var firstSample = samplesArray[0];
    console.log(firstSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var samplesValues = firstSample.sample_values;
    console.log(samplesValues);


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order
    //  so the otu_ids with the most bacteria are last.
    var top10otu = otuIds.slice(0, 10).reverse();
    var top10bacteria = samplesValues.slice(0, 10).reverse();

// BAR CHART
    // 8. Create the trace for the bar chart.
    var barTrace = {
        x: top10bacteria,
        y: top10otu,
        type: "bar",
        orientation: "h",
        text: otuLabels.slice(0, 10).reverse(),
    };
    // 9. Create the layout for the bar chart.
    var barLayout = {
        paper_bgcolor:"#FFF3",
        plot_bgcolor:"#FFF3",
        title: "Top 10 Bacteria Cultures Found",
        yaxis: {
        title: "OTU ID",
        },
    };

    // 10. Use Plotly to plot the data with the layout.
    var barData = [barTrace];
    Plotly.newPlot("bar", barData, barLayout)

// BUBBLE CHART
    // 1. Create the trace for the bubble chart.
    var trace2 = {
        type: "scatter",
        mode: "markers",
        x: otuIds,
        y: samplesValues,
        text: otuLabels,
        marker: {size: samplesValues, sizeref: .05, sizemode: "area", color: otuIds, colorscale: "Earth"}
    };
    var bubbleData = [trace2];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
        paper_bgcolor:"#FFF3",
        title: "Bacteria Cultures Per Sample",
        xaxis: {
        title: "OTU ID",
        },
    };
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


// GAUGE CHART
        // 4. Create the trace for the gauge chart.
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var holder = Object.entries(result);

    var trace3 = {
        domain: { x: [0, 1], y: [0, 1]},
        value: holder[6][1],
        title: { text: "Scrubs per Week"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            axis: { range: [null, 10] },
            bar: { color: "lightsteelblue" },
            steps: [
                { range: [0, 2], color: "crimson" },
                { range: [2, 4], color: "darkorange" },
                { range: [4, 6], color: "gold" },
                { range: [6, 8], color: "yellowgreen" },
                { range: [8, 10], color: "seagreen" }
            ]
        }
    };
    var gaugeData = [trace3];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
        paper_bgcolor:"#FFF3",
        width: 550,
        height: 400,
        title: "Belly Button Washing Frequency"
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
