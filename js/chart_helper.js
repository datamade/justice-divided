Highcharts.setOptions({
    lang: {
        thousandsSep: ','
    },
    chart: {
        style: {
            fontFamily: '"ColaborateThinRegular", sans-serif'
        }
    }
});   

var ChartHelper = ChartHelper || {};
var ChartHelper = {

    cleaned_data: [],
    categories: [],

    get_colors: function(idx) {
      colorBase = ['#E74C3C', '#A0A0A0', '#D3D3D3'];
      return colorBase.slice(0, idx);
    },

    make_bar_chart: function(el, seriesData, categories, plotOptions = {}) {

      $(el).highcharts({
        chart: {
                type: 'bar',
                backgroundColor: '#333'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: categories,
                title: {
                  text: null
                },
                gridLineColor: '#525252',
                tickColor: '#333',
                lineWidth: 0
            },
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    text: null
                },
                labels: {
                    overflow: 'justify'
                },
                gridLineColor: '#525252',
                gridLineDashStyle: 'Dash',
                tickAmount: 5
            },
            tooltip: {
                enabled: false
            },
            plotOptions: plotOptions,
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
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
