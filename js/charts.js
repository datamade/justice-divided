// sources:
// Juvenile Temporary Detention Center Admissions, 2015
// Probation Sentences for Misdemeanor Drug Offenses, 2016
// Department of Juvenile Justice Exits, 2015
var disparityChart = new Chartist.Bar('#system_disparity', {
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
  width: '100%',
  height: '65vh',
  horizontalBars: true,
  reverseData: true,
  seriesBarDistance: 30,
  scaleMinSpace: 50,
  axisY: {
    showGrid: false,
  },
  axisX: {
    labelInterpolationFnc: function(x) { 
      if ( !(x % 15) ) {
        return x + '%'; 
      } else {
        return '';
      }
    }
  }
});

disparityChart.on('draw', function(data) {
  labels = ['white', 'Hispanic', 'black'];
  baseClass = 'ct-bar-label';
  if(data.type === 'bar') {
    if ( data.seriesIndex < 2 ) {
      baseClass += ' mute';
    }
    data.group.elem('text', {
      x: data.x2 + 10,
      y: data.y1 + 5,
    }, baseClass).text(data.value.x + '% ' + labels[data.seriesIndex]);
  }
});