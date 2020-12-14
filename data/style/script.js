// Other important pens.
// Map: https://codepen.io/themustafaomar/pen/ZEGJeZq
// Navbar: https://codepen.io/themustafaomar/pen/VKbQyZ

$(function () {

  'use strict';

  var aside = $('.side-nav'),
      showAsideBtn = $('.show-side-btn'),
      contents = $('#contents'),
      _window = $(window)

  showAsideBtn.on("click", function () {
    $("#" + $(this).data('show')).toggleClass('show-side-nav');
    contents.toggleClass('margin');
  });

  if (_window.width() <= 767) {
    aside.addClass('show-side-nav');
  }

  _window.on('resize', function () {
    if ($(window).width() > 767) {
      aside.removeClass('show-side-nav');
    }
  });

  // dropdown menu in the side nav
  var slideNavDropdown = $('.side-nav-dropdown');

  $('.side-nav .categories li').on('click', function () {

    var $this = $(this)

    $this.toggleClass('opend').siblings().removeClass('opend');

    if ($this.hasClass('opend')) {
      $this.find('.side-nav-dropdown').slideToggle('fast');
      $this.siblings().find('.side-nav-dropdown').slideUp('fast');
    } else {
      $this.find('.side-nav-dropdown').slideUp('fast');
    }
  });

  $('.side-nav .close-aside').on('click', function () {
    $('#' + $(this).data('close')).addClass('show-side-nav');
    contents.removeClass('margin');
  });


  // Start chart
  var chart = document.getElementById('myChart');
  Chart.defaults.global.animation.duration = 2000; // Animation duration
  Chart.defaults.global.title.display = false; // Remove title
  Chart.defaults.global.title.text = "Chart"; // Title
  Chart.defaults.global.title.position = 'bottom'; // Title position
  Chart.defaults.global.defaultFontColor = '#999'; // Font color
  Chart.defaults.global.defaultFontSize = 14; // Font size for every label

  // Chart.defaults.global.tooltips.backgroundColor = '#FFF'; // Tooltips background color
  Chart.defaults.global.tooltips.borderColor = 'white'; // Tooltips border color
  Chart.defaults.global.legend.labels.padding = 0;
  Chart.defaults.scale.ticks.beginAtZero = true;
  Chart.defaults.scale.gridLines.zeroLineColor = 'rgba(255, 255, 255, 0.1)';
  Chart.defaults.scale.gridLines.color = 'rgba(255, 255, 255, 0.02)';
  Chart.defaults.global.legend.display = false;

   Chart.pluginService.register({
      beforeDraw: function(chart) {
        if (chart.config.options.elements.center) {
          // Get ctx from string
          var ctx = chart.chart.ctx;

          // Get options from the center object in options
          var centerConfig = chart.config.options.elements.center;
          var fontStyle = centerConfig.fontStyle || 'Arial';
          var txt = centerConfig.text;
          var color = centerConfig.color || '#000';
          var maxFontSize = centerConfig.maxFontSize || 75;
          var sidePadding = centerConfig.sidePadding || 20;
          var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
          // Start with a base font of 30px
          ctx.font = "30px " + fontStyle;

          // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
          var stringWidth = ctx.measureText(txt).width;
          var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

          // Find out how much the font can grow in width.
          var widthRatio = elementWidth / stringWidth;
          var newFontSize = Math.floor(30 * widthRatio);
          var elementHeight = (chart.innerRadius * 2);

          // Pick a new font size so it will not be larger than the height of label.
          var fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
          var minFontSize = centerConfig.minFontSize;
          var lineHeight = centerConfig.lineHeight || 25;
          var wrapText = false;

          if (minFontSize === undefined) {
            minFontSize = 20;
          }

          if (minFontSize && fontSizeToUse < minFontSize) {
            fontSizeToUse = minFontSize;
            wrapText = true;
          }

          // Set font settings to draw it correctly.
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
          var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
          ctx.font = fontSizeToUse + "px " + fontStyle;
          ctx.fillStyle = color;

          if (!wrapText) {
            ctx.fillText(txt, centerX, centerY);
            return;
          }

          var words = txt.split(' ');
          var line = '';
          var lines = [];

          // Break words up into multiple lines if necessary
          for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = ctx.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > elementWidth && n > 0) {
              lines.push(line);
              line = words[n] + ' ';
            } else {
              line = testLine;
            }
          }

          // Move the center up depending on line height and number of lines
          centerY -= (lines.length / 2) * lineHeight;

          for (var n = 0; n < lines.length; n++) {
            ctx.fillText(lines[n], centerX, centerY);
            centerY += lineHeight;
          }
          //Draw text in center
          ctx.fillText(line, centerX, centerY);
        }
      }
    });




var data1 = [36.3, 63.7]
  var myChart = new Chart(chart, {
    type: 'doughnut',
    data: {
      labels: ["Completed", "Remaining"],
      datasets: [{
        label: "Lost",
        fill: true,
        lineTension: 0,
        data: data1,
        backgroundColor: ["#FF6384", "#313448"],
        pointBorderColor: "#4bc0c0",
        borderColor: '#4bc0c0',
        borderWidth: 2,
        showLine: true,
      }]
    },
    options: {
      elements: {
        center: {
          text: Math.round(data1[0])+"%",
          color: '#5cb85c',
          sidePadding: 60
        }
      }
    }

  });



  // Chart2Here
var data2 = [7, 43]
  var Chart2 = document.getElementById('myChart2').getContext('2d');
  var myChart = new Chart(Chart2, {
    type: 'doughnut',
    data: {
      labels: ["Completed", "Remaining"],
      datasets: [{
        label: "Lost",
        fill: true,
        lineTension: 0,
        data: data2,
        backgroundColor: ["#FF6384", "#313448"],
        pointBorderColor: "#4bc0c0",
        borderColor: '#4bc0c0',
        borderWidth: 2,
        showLine: true,
      }]
    },
    options: {
      elements: {
        center: {
          text: 100*(data2[0]/(data2[1]+data2[0]))+"%",
          sidePadding: 60,
          color: '#5cb85c'
        }
      }
    }



  });

var data3 = [{'backgroundColor': 'rgb(255, 99, 132)', 'data': [{'r': 1.0, 'y': 141.0, 'x': 0.5}], 'label': ['Way of the Mono Trail 2019-08-10']}, {'backgroundColor': 'rgb(255, 99, 132)', 'data': [{'r': 7.5, 'y': 948.0, 'x': 2.1}], 'label': ['Columbia Rock Trail 2019-12-28']}, {'backgroundColor': 'rgb(255, 99, 132)', 'data': [{'r': 9.0, 'y': 1541.0, 'x': 6.1}], 'label': ['Sanborn Trail 2020-06-20']}, {'backgroundColor': 'rgb(75, 192, 192)', 'data': [{'r': 17.75, 'y': 1260.0, 'x': 14.1}], 'label': ['Bridge Creek Trail to Maple Falls 2020-06-27']}, {'backgroundColor': 'rgb(255, 99, 132)', 'data': [{'r': 2.8, 'y': 256.0, 'x': 1.8}], 'label': ['Coal Creek Double Loop 2020-07-11']}, {'backgroundColor': 'rgb(255, 99, 132)', 'data': [{'r': 6.4, 'y': 771.0, 'x': 3.6}], 'label': ['Saratoga Gap Trail and Ridge Trail Loop 2020-08-01']}, {'backgroundColor': 'rgb(75, 192, 192)', 'data': [{'r': 17.35, 'y': 3547.0, 'x': 8.1}], 'label': ['Upper Yosemite Falls 2020-12-12']}]
  var labels3 = ['Way of the Mono Trail', 'Upper Yosemite Falls (half)', 'Sanborn Trail', 'Bridge Creek Trail to Maple Falls', 'Coal Creek Double Loop', 'Bishop Peak ', 'Zinfandel Trail', 'Saratoga Gap Trail and Ridge Trail Loop', 'San Andreas Trail to Peterson Memorial Trail', 'Lookout, Redwood, Orchard, Creek Trails', 'Angel Falls via Willow Creek Trail', 'Way of the Mono Trail', 'Creekside Trail', 'East Avenue and Ward Creek Trail Loop'];
  var Chart3 = document.getElementById('myChart3').getContext('2d');
  var chart = new Chart(Chart3, {
    axisY: {
      text: "Miles"
    },
    type: 'bubble',
    data: {
      datasets: data3
    },
    options: {
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Elevation Gain"
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Miles"
        }
      }]
    }
    }

  });

var labels5 = ['Aug-2019', 'Dec-2019', 'Jun-2020', 'Jul-2020', 'Aug-2020', 'Dec-2020']
var data5 = [0.5, 2.1, 20.2, 1.8, 3.6, 8.1]

  var Chart5 = document.getElementById('myChart5').getContext('2d');
  var chart = new Chart(Chart5, {
    axisY: {
      text: "Miles"
    },
    type: 'line',
    data: {
      labels: labels5 ,
      datasets: [{
        backgroundColor: '#4bc0c0',
        borderColor: 'rgb(255, 79, 116)',
        borderWidth: 2,
        pointBorderColor: false,
        data: data5,
        fill: false,
        lineTension: .4,
      }]
    },

   options: {
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Miles"
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Month"
        }
      }]
    }
    }
  });
var labels6 = ['Aug-2019', 'Dec-2019', 'Jun-2020', 'Jul-2020', 'Aug-2020', 'Dec-2020']
var data6 = [0.83, 0.81, 0.78, 0.74, 0.8, 0.91]

  var Chart6 = document.getElementById('myChart6').getContext('2d');
  var chart = new Chart(Chart6, {
    axisY: {
      text: "Output (Miles*Elevation Gain)"
    },
    type: 'bar',
    data: {
      labels: labels6 ,
      datasets: [{
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: '#4bc0c0',
        borderWidth: 2,
        pointBorderColor: false,
        data: data6,
        fill: false,
        lineTension: .4,
      }]
    },

   options: {
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Efficiency"
        },
        ticks: {
                suggestedMin: 0.5
            }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Month"
        }
      }]
    }
    }
  });



});