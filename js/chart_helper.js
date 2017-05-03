Highcharts.theme = {
    colors: ['#E74C3C', '#A0A0A0', '#D3D3D3'],
    chart: {
        backgroundColor: '#333',
        fontFamily: '"Lato", sans-serif'
    },
    title: {
      text: null
    },
    xAxis: {
        gridLineColor: '#525252',
        tickColor: '#333',
        lineWidth: 0,
    },
    yAxis: {
        min: 0,
        labels: {
            overflow: 'justify',
            align: 'center'
        },
        gridLineColor: '#525252',
        gridLineDashStyle: 'Dash',
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    tooltip: {
        enabled: false
    }   
};

Highcharts.setOptions(Highcharts.theme);  

var ChartHelper = ChartHelper || {};
var ChartHelper = {

    categories: [],

    stacked_label_options: {
          style: {
            'fontSize': '20px',
            'color': '#f3f1e5'
          },
          align: 'left',
          y: -45,
          x: 5
    },

    make_bar_chart: function(el, seriesData, categories, plotOptions = {}, xAxisLabelOptions = {}) {

      $(el).highcharts({
        chart: {
                type: 'bar',
            },
            xAxis: {
                categories: categories,
                title: {
                  text: null
                },
                labels: xAxisLabelOptions
            },
            yAxis: {
                title: {
                    text: null
                },
                tickAmount: 6
            },
            plotOptions: plotOptions,
            series: seriesData
      });
    },

    make_line_chart: function(el, series_data, categories, chart_title, yaxis_title, data_type) {
      if (data_type == 'percent') {
        y_min = null
        y_labels = {
              formatter: function () {
                  return this.value + '%';
              }
            }
        data_labels = {
                    enabled: true,
                    format: "{point.y:.1f}%"
                }
        states = {
                hover: {
                  enabled: false
                }
              }
        tooltip = {
            enabled: false
        }
      } else {
        y_min = 0
        y_labels = {}
        data_labels = {
          enabled: false
        }
        states = {}
        tooltip = {
          borderColor: '#eee',
          shadow: false,
          headerFormat: '',
          pointFormat: '{point.y:,.0f}',
        }

      }

      $(el).highcharts({
        chart: {
          type: 'line',
          backgroundColor:"rgba(255, 255, 255, 0)",
          spacingTop: 40
        },
        credits: { enabled: false },
        title: {
            text: chart_title[0]
        },
        subtitle: {
            text: chart_title[1]
        },
        xAxis: {
            categories: categories,
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            }
        },
        yAxis: {
            title: {
                text: yaxis_title
            },
            labels: y_labels,
            min: y_min
        },
        tooltip: tooltip,
        plotOptions: {
            line: {
                marker: {
                    lineWidth: 1,
                    lineColor: '#ffffff',
                    symbol: 'square'
                },
                dataLabels: data_labels
            },
            series: {
              states: states
            }
        },
        series: series_data
      });

    }

}
