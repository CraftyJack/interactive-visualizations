function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    
    // Use d3 to select the panel with id of `#sample-metadata`
    var demoPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    demoPanel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    var subjectMetadata = metadata.filter(subject => subject.id == sample)[0]; 
    Object.entries(subjectMetadata).forEach(function([key,value]){
			demoPanel.append("h5").text(`${key} : ${value}`);
		});
  });
}

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    
    // Build a Bubble Chart
    var selectedSample = samples.filter(subject => subject.id == sample)[0];
    var sample_values = selectedSample.sample_values; 
    var otu_ids = selectedSample.otu_ids; 
    var otu_labels = selectedSample.otu_labels; 
    var bubbleData = [{
      x: otu_ids, 
      y: sample_values,
      text: otu_labels,
      mode: "markers", 
      marker: {
        size: sample_values, 
        color: otu_ids,
      } 	
    }];
    var bubbleLayout = {
      title: "OTU Frequency in Selected Subject",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Value" }
    }; 
    // Plot the bubble chart at "bubble"
    Plotly.newPlot("bubble",bubbleData, bubbleLayout);

    // Build a Bar Chart
    // Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
    // Requirements:
    // * Use `sample_values` as the values for the bar chart.
    // * Use `otu_ids` as the labels for the bar chart.
    // * Use `otu_labels` as the hovertext for the chart.
    var selectedSample = samples.filter(subject => subject.id == sample)[0];
    var bar_sample_values = selectedSample.sample_values.slice(0, 10); 
    var top_otu_ids = selectedSample.otu_ids.slice(0, 10); 
    var bar_otu_ids = top_otu_ids.map(otuId => `OTU ${otuId}`);
    var bar_otu_labels = selectedSample.otu_labels.slice(0, 10); 
    var barData = [{
      x: bar_sample_values, 
      y: bar_otu_ids,
      text: bar_otu_labels,
      type: "bar",
      orientation: "h"
    }];
    var barLayout = {
      title: "OTU Frequency in Selected Subject",
      xaxis: { title: "Sample Value" },
      yaxis: { title: "OTU ID" }
    };

    // Plot the Bar Chart at "bar"
    Plotly.newPlot("bar",barData, barLayout);

    // Build a Gauge Chart
    // Requirements:
    // * Adapt the Gauge Chart from <https://plot.ly/javascript/gauge-charts/> to plot the weekly washing frequency of the individual.
    // * You will need to modify the example gauge code to account for values ranging from 0 through 9.
    // * Update the chart whenever a new sample is selected.
    var sampleMetaData = data.metadata;
    var selectedMetaData = sampleMetaData.filter(subject => subject.id == sample)[0];
    var washingFrequency = selectedMetaData.wfreq;
    var colorList = [
      "#588060",
      "#6E9F6E",
      "#91BE85",
      "#B8DD9C",
      "#E1FBB4",
      "#F8FDC2",
      "#FFF6D0",
      "#FFF0DF",
      "#FFF3EF"
    ];
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washingFrequency,
        title: { text: "Weekly Washing Frequency" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range: [0,9], tickwidth: 1},
          steps: [
            { range: [0,1], color: colorList[8]}, 
            { range: [1,2], color: colorList[7]},
            { range: [2,3], color: colorList[6]},
            { range: [3,4], color: colorList[5]},
            { range: [4,5], color: colorList[4]},
            { range: [5,6], color: colorList[3]},
            { range: [6,7], color: colorList[2]},
            { range: [7,8], color: colorList[1]},
            { range: [8,9], color: colorList[0]}
          ]
        }
      }
    ];
    
    var gaugeLayout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    // code to populate select options
    data.names.forEach(function(name){
      selector.append("option").text(name).property("value");
      })

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected 
  // The function call is in the HTML file as <select id="selDataset" onchange="optionChanged(this.value)"></select>
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();