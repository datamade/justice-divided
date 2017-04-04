function generateLabels(x) {
  if ( !(x % 5) ) {
    return x + '%'; 
  } else {
    return '';
  }
}

// define charts
var marijuanaArrestsChart = new Chartist.Bar('.ct-chart#marijuana_arrests', {
  labels: [
    'Juvenile Population',
    'Marijuana Arrests'
  ],
  series: [
    [39, 71],
    [36, 23],
  ]
}, {
  high: 100,
  width: '100%',
  height: '40vh',
  seriesBarDistance: 30,
  horizontalBars: true,
  reverseData: true,
  axisY: {
    showGrid: false,
  },
  axisX: {
    labelInterpolationFnc: generateLabels
  }
});

var allArrestsChart = new Chartist.Bar('#all_arrests', {
  labels: [
    'Juvenile Population',
    'All Arrests'
  ],
  series: [
    [39, 79],
    [36, 3],
  ]
}, {
  high: 100,
  width: '100%',
  height: '40vh',
  seriesBarDistance: 30,
  horizontalBars: true,
  reverseData: true,
  axisY: {
    showGrid: false,
  },
  axisX: {
    labelInterpolationFnc: generateLabels
  }
});

var systemDisparityChart = new Chartist.Bar('#system_disparity', {
  labels: [
    'Detention', 
    'Probation', 
    'Incarceration'
  ],
  series: [
    [80.6, 85.6, 82.5],
    [15.6, 7.6, 3.5],
    [3.5, 5.6, 2.1]
  ]
}, {
  high: 100,
  width: '100%',
  height: '65vh',
  seriesBarDistance: 30,
  horizontalBars: true,
  reverseData: true,
  axisY: {
    showGrid: false,
  },
  axisX: {
    labelInterpolationFnc: generateLabels
  }
});

var charts = [marijuanaArrestsChart, allArrestsChart, systemDisparityChart];

// add labels
charts.forEach(function(chart) {
  chart.on('draw', function(data) {
    if ( data.type === 'bar' ) {
      labels = ['white', 'Hispanic', 'black'];
      if ( data.series.length == 2 ) {
        labels.splice(1, 1); // remove Hispanic (to-do: get this population)
      }
      baseClass = 'ct-bar-label';
      if ( data.seriesIndex < data.series.length - 1 ) {
        baseClass += ' mute'; // mute non-black labels
      } 
      data.group.elem('text', {
        x: data.x2 + 10,
        y: data.y1 + 5,
      }, baseClass).text(
        data.value.x + '% ' + labels[data.seriesIndex]
      );
    }
  });
})