function generateLabels(x) {
  if ( !(x % 5) ) {
    return x + '%'; 
  } else {
    return '';
  }
}

// interactive chart
function makeDetailChart(data) {
  chart = new Chartist.Bar('#detail-table', {
    labels: [
      'Youth Population',
      'Arrests'
    ],
    series: data
  }, {
    high: 100,
    fullWidth: true,
    width: '100%',
    height: '25vh',
    seriesBarDistance: 40,
    axisX: {
      showGrid: false
    },
    axisY: {
      showLabel: false
    }
  });

  chart.on('draw', function(data) {
    if ( data.type === 'bar' ) {
      data.group.elem('text', {
        x: data.x1 - 10,
        y: data.y2 - 5,
      }, 'ct-bar-label').text(data.value.y.toFixed(0) + '%');
    }
  });
}

// static charts
var allArrestsChart = new Chartist.Bar('#all_arrests', {
  labels: [
    'Population',
    'Arrests'
  ],
  series: [
    [41.93, 79],
    [43.18, 17],
    [14.88, 3],
  ]
}, {
  high: 100,
  width: '100%',
  height: '50vh',
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

var educationChart = new Chartist.Bar('#education_disparity', {
  labels: [
    'Attend College', 
    'Graduate High School' 
  ],
  series: [
    [27, 49],
    [18, 34]
  ]
}, {
  high: 75,
  width: '100%',
  height: '40vh',
  horizontalBars: true,
  seriesBarDistance: 30,
  axisY: {
    showGrid: false,
  },
  axisX: {
    labelInterpolationFnc: generateLabels
  }
});

// label bars

function makeRaceLabels(chart) {
  chart.on('draw', function(data) {
    if ( data.type === 'bar' ) {
      labels = ['white', 'Hispanic', 'black'];
      baseClass = 'ct-bar-label';
      if ( data.seriesIndex <= data.series.length - 1 ) {
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
}

var raceCharts = [allArrestsChart, systemDisparityChart];

raceCharts.forEach(function(chart) {
  makeRaceLabels(chart);
})

function makeChanceLabels(chart) {
  chart.on('draw', function(data) {
    if ( data.type === 'bar' ) {
      baseClass = 'ct-bar-label';
      data.group.elem('text', {
        x: data.x2 + 10,
        y: data.y1 + 5,
      }, baseClass).text(
        data.value.x + '% chance'
      );
    }
  });  
}

makeChanceLabels(educationChart);