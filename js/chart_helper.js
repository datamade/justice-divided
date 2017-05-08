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
        tickWidth: 0,
        lineWidth: 1,
        lineColor: '#525252'
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
    },
    plotOptions: {
        bar: {
            maxPointWidth: 20,
            borderWidth: 0,
            events: {
                legendItemClick: function(e) {
                    e.preventDefault()
                }
            }
        }, 
        column: {
            maxPointWidth: 20,
            borderWidth: 0
        }
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
          x: 5,
          y: 25
    },

    make_bar_chart: function(el, series_data, categories, plot_options, label_options, annotations = {}) {

        parent = $('#' + el).parent(),
          parentWidth = parent.innerWidth() - 30;

        if ( el == 'arrests_by_race_chart' ) {
            chartHeight = '370',
              spacingTop = 40,
              legend_options = {
                  enabled: true,
                  symbolRadius: 0,
                  verticalAlign: 'top',
                  floating: true,
                  y: -40,
                  itemStyle: {
                      'color': '#f3f1e5',
                      'fontWeight': 'normal'
                  },
                  reversed: false
              };
        } else {
            chartHeight = (categories.length + 1) * 100 + 100,
              legend_options = {
                  enabled: false
              },
              spacingTop = 0;
        }

        return {
            chart: {
                type: 'bar',
                height: chartHeight,
                width: parentWidth,
                spacingTop: spacingTop,
                renderTo: el
            },
            xAxis: {
                categories: categories,
                title: {
                    enabled: false
                },
                labels: label_options
            },
            yAxis: {
                title: {
                    enabled: false
                },
                min: 0,
                max: 100,
                tickInterval: 25,
                tickAmount: 5,
                reversedStacks: false
            },
            legend: legend_options,
            plotOptions: plot_options,
            series: series_data,
            annotations: annotations
        };

    },

    make_detail_chart: function(data) {

        categories = ['Population (%)', 'Arrests (%)'];
        
        series_data = [{
            name: 'black',
            data: data[0]
        }, {
            name: 'Hispanic',
            data: data[1]
        }, {
            name: 'white',
            data: data[2]
        }];

        new Highcharts.Chart({
            chart: {
                type: 'column',
                height: '250',
                renderTo: 'detail-chart',
                spacingTop: 40
            },
            xAxis: {
                categories: categories,
                title: {
                    enabled: false
                },
                labels: {
                    style: {
                        'color': '#f3f1e5',
                        'fontSize': '12px',
                    }
                }
            },
            yAxis: {
                title: {
                    enabled: false
                },
                min: 0,
                max: 100,
                tickInterval: 25,
                tickAmount: 5,
                startOnTick: false,
                endOnTick: false/*,
                plotBands: [{ // visually indicate majority
                    color: '#434343',
                    from: 50,
                    to: 100
                }],*/
            },
            legend: {
                enabled: true,
                symbolRadius: 0,
                verticalAlign: 'top',
                floating: true,
                y: -40,
                itemStyle: {
                    'color': '#f3f1e5',
                    'fontWeight': 'normal'
                }
            },
            plotOptions: {
                column: {
                    groupPadding: 0.25,
                    animation: false
                }
            },
            series: series_data/*,
            annotations: [{
                title: {
                    text: '“Most”',
                    style: {
                        'color': '#f3f1e5',
                        'font-family': '"Gloria Hallelujah", monospace'
                    }
                },
                anchorX: 'left',
                anchorY: 'top',
                x: 490,
                y: 105
            }]*/
        });
    },

    make_area_chart: function(el, series_data, annotations) {

        parent = $('#' + el).parent(),
          parentWidth = parent.innerWidth() - 30;

        return {
            chart: {
                type: 'area',
                height: '350',
                width: parentWidth,
                renderTo: el,
                spacingRight: 50,
                paddingTop: 100
            },
            xAxis: {
                labels: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    enabled: false
                },
                labels: {
                    x: -20
                },
                min: 0,
                max: 3500,
                tickInterval: 500,
                tickAmount: 8,
                startOnTick: false,
                endOnTick: false
            },
            plotOptions: {
                area: {
                    color: '#674baa',
                    marker: {
                        symbol: 'square'
                    },
                    dataLabels: {
                        enabled: true,
                        style: {
                            'textOutline': 0,
                            'fontWeight': 'normal',
                            'fontSize': '14px',
                            'color': '#f3f1e5'
                        },
                        formatter: function() {
                            return this.x
                        }
                    }
                }
            },
            series: series_data,
            annotations: annotations
        };

    }

}
