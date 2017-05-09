Highcharts.theme = {
    colors: ['#E74C3C', '#A0A0A0', '#D3D3D3'],
    chart: {
        backgroundColor: '#333',
        fontFamily: '"Lato", sans-serif'
    },
    title: {
        enabled: false,
        align: 'left'
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
    credits: {
        enabled: false,
        href: '/data',
        style: {
            'color': '#525252',
            'font-size': '12px',
            'font-family': 'Lato'
        },
        position: {
            x: 0
        }
    },
    legend: {
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

    make_bar_chart: function(el, series_data, categories, plot_options, label_options, 
                             title_options, credits_options, annotations) {

        parent = $('#' + el).parent(),
          parentWidth = parent.innerWidth() - 30;

        small_multiples = ['population_chart', 'arrest_chart', 'incarceration_chart']

        if ( el == 'arrests_by_race_chart' ) {
            chartHeight = '340',
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
        } else if ( small_multiples.indexOf(el) + 1 ) {
            chartHeight = parentWidth,
              spacingTop = 0,
              legend_options = {enabled: false};
        } else {
            chartHeight = (categories.length + 1) * 100 + 100,
              spacingTop = 0,
              legend_options = {enabled: false};
        }

        spacingBottom = 30;

        two_line_credit = ['expectation_v_reality_chart', 'arrest_v_population_chart'];

        if ( two_line_credit.indexOf(el) + 1 ) {
            spacingBottom += 20;
        }

        return {
            chart: {
                type: 'bar',
                height: chartHeight,
                width: parentWidth,
                spacingTop: spacingTop,
                spacingBottom: spacingBottom,
                renderTo: el
            },
            title: title_options,
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
            credits: credits_options,
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
                spacingTop: 10,
                spacingBottom: 50
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
                endOnTick: false
            },
            legend: {
                enabled: true,
                symbolRadius: 0,
                verticalAlign: 'top',
                floating: true,
                y: -15,
                itemStyle: {
                    'color': '#f3f1e5',
                    'fontWeight': 'normal'
                },
                align: 'left'
            },
            plotOptions: {
                column: {
                    groupPadding: 0.25,
                    animation: false
                }
            },
            credits: {
                enabled: true,
                text: 'Source: American Community Survey<br />& Chicago Police Department',
                position: {
                    y: -20
                }
            },
            series: series_data
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
