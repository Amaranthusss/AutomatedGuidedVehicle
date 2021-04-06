const client = require('../server/clientWebSocket')

const chart1_2_options = {
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  tooltips: {
    backgroundColor: "#f5f5f5",
    titleFontColor: "#333",
    bodyFontColor: "#666",
    bodySpacing: 4,
    xPadding: 12,
    mode: "nearest",
    intersect: 0,
    position: "nearest",
  },
  responsive: true,
  scales: {
    yAxes: [
      {
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: "rgba(29,140,248,0.0)",
          zeroLineColor: "transparent",
        },
        ticks: {
          suggestedMin: 0,
          suggestedMax: 300,
          padding: 20,
          fontColor: "#9a9a9a",
        },
      },
    ],
    xAxes: [
      {
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: "rgba(29,140,248,0.1)",
          zeroLineColor: "transparent",
        },
        ticks: {
          padding: 20,
          fontColor: "#9a9a9a",
        },
      },
    ],
  },
};

const velocityChart = {
  data: (canvas) => {
    const ini = {
      x: [],
      y: []
    }
    let i = ini.x[ini.x.length - 1]
    var ctx = canvas.getContext("2d")
    let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50)
    gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)")
    gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)")
    gradientStroke.addColorStop(0, "rgba(29,140,248,0)")
    var config = {
      type: 'line',
      data: {
        labels: ini.x,
        datasets: [{
          label: "Maximum frequency, Hz",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: "#1f8ef1",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#1f8ef1",
          pointBorderColor: "rgba(255,255,255,0)",
          pointHoverBackgroundColor: "#1f8ef1",
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: ini.y,
        }]
      }
    };

    var myChart = new Chart(ctx, config)

    setInterval(function () {
      fetch('/getFreq').then(e => e.json()).then(obj => {
        i++
        config.data.labels.push(i)
        config.data.datasets[0].data.push(obj.highestFreq)
        myChart.update();
      })
    }, 3000)
    return config.data
  },
  options: chart1_2_options,
}

const chartExample2 = {
  data: (canvas) => {
    var ctx = canvas.getContext("2d");
    let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50)
    gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)")
    gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)")
    gradientStroke.addColorStop(0, "rgba(29,140,248,0)")
    var config = {
      type: 'line',
      data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
          label: "My First dataset",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: "#1f8ef1",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#1f8ef1",
          pointBorderColor: "rgba(255,255,255,0)",
          pointHoverBackgroundColor: "#1f8ef1",
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: [65, 0, 80, 81, 56, 85, 40],
        }]
      }
    };

    var myChart = new Chart(ctx, config);

    setInterval(function () {
      config.data.labels.push('Test');
      config.data.datasets[0].data.push(Math.random() * 255);
      myChart.update();
    }, 3000)
    return config.data
  },
  options: chart1_2_options,
}

const rearScannerChart = {
  data: (canvas) => {
    const ini = {
      x: [],
      y: []
    }
    let i = ini.x[ini.x.length - 1]
    var ctx = canvas.getContext("2d");
    let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50)
    gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)")
    gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)")
    gradientStroke.addColorStop(0, "rgba(29,140,248,0)")
    var config = {
      type: 'line',
      data: {
        labels: ini.x,
        datasets: [{
          label: "My First dataset",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: "#1f8ef1",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#1f8ef1",
          pointBorderColor: "rgba(255,255,255,0)",
          pointHoverBackgroundColor: "#1f8ef1",
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: ini.y,
        }]
      }
    };

    var myChart = new Chart(ctx, config);

    dataWS = null
    client.onmessage = (message) => {
      i++
      console.log(message.data)
      dataWS = JSON.parse(message.data)
      config.data.labels.push(i)
      config.data.datasets[0].data.push(dataWS.output.dist)
      myChart.update()
    };
    return config.data
  },
  options: chart1_2_options,
};


const chartExample4 = {
  data: (canvas) => {
    let ctx = canvas.getContext("2d");

    let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(66,134,121,0.15)");
    gradientStroke.addColorStop(0.4, "rgba(66,134,121,0.0)"); //green colors
    gradientStroke.addColorStop(0, "rgba(66,134,121,0)"); //green colors

    return {
      labels: ["JUL", "AUG", "SEP", "OCT", "NOV"],
      datasets: [
        {
          label: "My First dataset",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: "#00d6b4",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#00d6b4",
          pointBorderColor: "rgba(255,255,255,0)",
          pointHoverBackgroundColor: "#00d6b4",
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: [90, 27, 60, 12, 80],
        },
      ],
    };
  },
  options: {
    maintainAspectRatio: false,
    legend: {
      display: false,
    },

    tooltips: {
      backgroundColor: "#f5f5f5",
      titleFontColor: "#333",
      bodyFontColor: "#666",
      bodySpacing: 4,
      xPadding: 12,
      mode: "nearest",
      intersect: 0,
      position: "nearest",
    },
    responsive: true,
    scales: {
      yAxes: [
        {
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: "rgba(29,140,248,0.0)",
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 50,
            suggestedMax: 125,
            padding: 20,
            fontColor: "#9e9e9e",
          },
        },
      ],

      xAxes: [
        {
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: "rgba(0,242,195,0.1)",
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9e9e9e",
          },
        },
      ],
    },
  },
};

module.exports = {
  velocityChart,
  chartExample2,
  rearScannerChart,
  chartExample4
};
