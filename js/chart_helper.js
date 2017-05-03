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
    },
    plotOptions: {
        bar: {
            maxPointWidth: 20,
            borderWidth: 0,
            animation: false
        }, 
        column: {
            maxPointWidth: 20,
            borderWidth: 0,
            animation: false
        }
    }   
};

var options = Highcharts.setOptions(Highcharts.theme);  

var ChartHelper = ChartHelper || {};
var ChartHelper = {

    categories: [],

    stacked_label_options: {
          style: {
            'fontSize': '20px',
            'color': '#f3f1e5'
          },
          align: 'left',
          x: 5
    },

    make_bar_chart: function(el, series_data, categories, plot_options, label_options) {

        chartHeight = categories.length * 100 + 100

        $(el).highcharts({
        chart: {
                type: 'bar',
                height: chartHeight
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
                tickAmount: 6
            },
            plotOptions: plot_options,
            series: series_data
        });
    },

    make_detail_chart: function(data) {

        categories = ['Population', 'Arrests'];
        
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
                        'fontSize': '12px'
                    }
                }
            },
            yAxis: {
                title: {
                    enabled: false
                },
                max: 100,
                tickAmount: 6
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
                    groupPadding: 0.25
                }
            },
            series: series_data
        });
    },

    make_area_chart: function(el, series_data, yaxis_title) {

        $(el).highcharts({
            chart: {
                type: 'area',
                height: '300'
            },
            xAxis: {
                labels: {
                    enabled: true,
                    style: {
                        'textOutline': 0,
                        'fontWeight': 'normal',
                        'fontSize': '14px',
                        'color': '#f3f1e5'
                    }
                }
            },
            yAxis: {
                title: {
                    enabled: false
                },
                labels: {
                    x: -20
                },
                showFirstLabel: false
            },
            plotOptions: {
                area: {
                    color: '#674baa',
                    marker: {
                        symbol: 'square'
                    },
                    animation: false,
                }
            },
            series: series_data
        });

    }

}
