import { i18n } from "/@src/plugins/i18n";

export function generateHighChartPieOpt(title: string, seriesData: { name: string, y: number, z: number }[]) {
  return {
    chart: {
      type: 'variablepie',
      custom: {},
      width:300,
      height: 500,
      events: {
        render() {
          const chart = this as any;
          let series = chart.series[0];
          let customLabel = chart.options.chart.custom.label;

          if (!customLabel) {
            customLabel = chart.options.chart.custom.label =
              chart.renderer.label(
                `${i18n.global.t('stat.total')}<br/>` +
                `<strong>${seriesData.map((el: any) => el.y).reduce((a: any, b: any) => a + b, 0)}</strong>`
              )
                .css({
                  color: '#000',
                  fontSize: '14px',
                  textAnchor: 'middle'
                })
                .add();
          }

          const x = series.center[0] + chart.plotLeft,
            y = series.center[1] + chart.plotTop -
              (customLabel.attr('height') / 2);

          customLabel.attr({
            x,
            y
          });
          // Set font size based on chart diameter
          customLabel.css({
            fontSize: `${series.center[2] / 12}px`
          });
        }
      },
      labels : {
        enabled:false
      }
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    title: {
      text: title,
      align: 'left'
    },
    plotOptions: {
      variablepie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false
        },
        showInLegend: true
      }
    },
    legend: {
      enabled: true,
      align: 'center',
      layout: 'vertical',
      margin: 10,
      padding: 20,
      style: {
        fontSize: '10px'
      }
    },
    series: [{
      minPointSize: 10,
      innerSize: '40%',
      zMin: 0,
      name: '',
      borderRadius: 5,
      data: seriesData,
      colors: [
        '#0DD3FF',
        '#A3F57A',
        '#E047FF',
        '#FF5D0C'
      ]
    }],
    xAxis: {
      labels: {
        enabled: false
      }
    },
    yAxis: {
      labels: {
        enabled: false
      }
    },
    zAxis: {
      labels: {
        enabled: false
      }
    }

  }
}

export function generateHighChartDonutOpt(title: string, seriesData: any) {
  return {
    chart: {
      type: 'pie',
      custom: {},
      height: 300,
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    title: {
      text: title,
      align: "left"
    },

    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
    },
    legend: {
      align: 'right',
      verticalAlign: 'middle',
      layout: 'vertical',
      x: 0,
      y: 20,
      width: 300,
      margin: 0,
      padding: 0,
      style: {
        fontSize: '10px'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false
        },
        showInLegend: true
      }
    },
    colors: ['#A3F57A', '#0DD3FF'],
    series: [{
      name: '',
      colorByPoint: true,
      innerSize: '50%',
      data: seriesData
    }]
  }
}
export function generateHighChartColumnOpt(title: string, labels: string[], seriesData: number[]) {
  return {
    chart: {
      type: 'column',
      height: 600,
      // options3d: {
      //   enabled: false,
      //   alpha: 3,
      //   beta: 25,
      //   depth: 150,
      // },
    },
    title: {
      text: title,
      align: 'left',
      margin: 50,
    },
    colors: ['#0DD3FF'],
    plotOptions: {
      column: {
        pointPadding: 0.3,
        borderWidth: 0,
        borderRadius: '50%',
        margin: 50
      }
    },
    xAxis: {
      categories: labels,
      labels: {
        skew3d: false,
        padding: 20,
        style: {
          fontSize: '14px',
        },
      },
    },
    yAxis: {
      title: {
        text: '',
        margin: 0,
      },
    },
    tooltip: {
      valueSuffix: '',
    },

    series: [
      {
        name: '',
        data: seriesData,
      },
    ],
  }
}
