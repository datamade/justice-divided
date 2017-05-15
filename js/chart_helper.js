Highcharts.theme = {
    colors: ['#E74C3C', '#A0A0A0', '#D3D3D3'],
    chart: {
        backgroundColor: '#333',
        fontFamily: '"Lato", sans-serif'
    },
    title: {
        enabled: false,
        text: null,
        floating: true,
        verticalAlign: 'top',
        align: 'left',
        style: {
            'font-family': 'Lato',
            'color': '#f3f1e5',
            'font-size': '22px'
        },
        y: -20
    },
    xAxis: {
        gridLineColor: '#525252',
        tickWidth: 0,
        lineWidth: 1,
        lineColor: '#525252',
        labels: {
            style: {
                'font-family': 'Lato'
            }
        }
    },
    yAxis: {
        min: 0,
        labels: {
            overflow: 'justify',
            align: 'center',
            style: {
                'font-family': 'Lato'
            }
        },
        gridLineColor: '#525252',
        gridLineDashStyle: 'Dash',
    },
    credits: {
        enabled: false,
        href: null,
        style: {
            'color': '#79797a',
            'font-size': '14px',
            'font-family': 'Lato',
            'cursor': 'unset'
        },
        position: {
            x: 0
        }
    },
    legend: {
        enabled: false,
        symbolRadius: 0,
        floating: true,
        verticalAlign: 'top',
        align: 'left',
        itemStyle: {
          'color': '#f3f1e5',
          'fontWeight': 'normal'
        }
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
            'color': '#f3f1e5',
            'whiteSpace': 'nowrap'
          },
          align: 'left',
          x: 5,
          y: 25,
          useHTML: true
    },

    make_bar_chart: function(el, series_data, categories, plot_options, label_options, 
                             title_options, credits_options, annotations) {

        var parent = $('#' + el).parent();
        parentWidth = parent.innerWidth() - 30;

        if ( el == 'arrests_by_race_chart' ) {
            chartHeight = '350',
              spacingTop = 40,
              legend_options = {
                  enabled: true,
                  y: -40,
                  x: 40,
                  reversed: false
              };
        } else {
            chartHeight = (categories.length + 1) * 100 + 100,
              spacingTop = 0,
              legend_options = {enabled: false};
        }

        spacingBottom = 30;

        two_line_credit = ['expected_arrests_chart',
                           'actual_arrests_chart', 
                           'arrest_v_population_chart'];

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
                reversedStacks: false,
            },
            credits: credits_options,
            legend: legend_options,
            plotOptions: plot_options,
            series: series_data,
            annotations: annotations
        };

    },

    make_column_chart: function(el, series_data, categories, plot_options, label_options, 
                                title_options, credits_options, annotations) {

        var parent = $('#' + el).parent();
        parentWidth = $(parent).innerWidth() - 30;
    
        return {
            chart: {
                type: 'column',
                height: parentWidth,
                width: parentWidth,
                spacingTop: 70,
                paddingTop: 20,
                spacingBottom: 30,
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
                reversedStacks: false,
            },
            credits: credits_options,
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
                height: '300',
                renderTo: 'detail-chart',
                spacingTop: 80,
                spacingBottom: 40
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
            title: {
                enabled: true,
                text: 'District Demographics',
                x: 30,
                y: -50
            },
            legend: {
                enabled: true,
                x: 20,
                y: -45
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

        var parent = $('#' + el).parent();
        parentWidth = parent.innerWidth() - 30;

        return {
            chart: {
                type: 'area',
                height: '350',
                width: parentWidth,
                renderTo: el,
                spacingRight: 50,
                paddingTop: 100,
                spacingBottom: 30
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
                    color: '#009051',
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
            credits: {
                enabled: true,
                text: 'Source: Chicago Police Department',
                position: {
                    x: -50
                }
            },
            annotations: annotations
        };

    }

}
