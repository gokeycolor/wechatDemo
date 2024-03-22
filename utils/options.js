const { hexToRGBA } = require('comm');
const FIFOBuffer = require('fifo');

// gauge option模板
function gaugeTemplate() {
  return {
    backgroundColor: 'transparent',
    series: [{
      name: '业务指标',
      zlevel: -1,
      progress: {
        show: false,
        width: 5,
        itemStyle: {
          shadowColor: 'rgba(0,0,0,0.5)',
          shadowBlur: 5,
          shadowOffsetX: 1,
          shadowOffsetY: -1,
          opacity: 0.5
        },
      },
      type: 'gauge',
      center:['50%','90%'],
      animation: true,
      detail: {
        formatter: '{value}',
      },
      axisLine: {
        lineStyle: {
          width: 25,
          color: [
            [1.0, 'green']
          ],
          // color: [[0.2, 'red'], [1.0, 'blue']],
          opacity: 0.5
        },
        show: true
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false,
        distance: 6,
        length: '10%',
        lineStyle: {
          width: 1
        }
      },
      axisLabel: {
        show: false,
        distance: -10,
        textStyle: {
          fontSize: 10
        }
      },
      radius: '100%',
      startAngle: 180,
      endAngle: 0,
      pointer: {
        showAbove: true,
        length: '80%',
        width: 3,
        itemStyle: {
          shadowColor: 'rgba(0,0,0,0.5)',
          shadowBlur: 100,
          shadowOffsetX: 1,
          shadowOffsetY: -1,
          opacity: 1
        }
      },
      data: [{
        title: {
          show: true,
          offsetCenter: [0, '-20%'],
          fontSize: 10
        },
        value: '30',
        name: 'meter',
        detail: {
          show: true,
          fontSize: 15,
          width: 25,
          height: 15,
          backgroundColor: 'transparent'
        }
      }]
    }]
  }
}
// trend option模板
function trendTemplate() {
  return {
    darkMode: true,
    title: {
      text: '趋势图',
      left: 'center',
      top: '10rpx',
      show: true
    },
    legend: {
      show: true,
      data: [],
      x: 'left',
      top: '35rpx',
      left: 30,
      selectedMode: true,
      // bottom: 50,
      // left: 'center',
      // backgroundColor: 'white',
      // z: 100
    },
    grid: {
      top: '50rpx',
      bottom: '1%',
      show: true,
      borderWidth:'0'
      // containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      show: false,
      type: 'time',
      boundaryGap: false,
      axisLabel: {
        rotate: 90,
        interval: 'auto',
        margin: 10,
        width: 10,
        overflow: 'none'
      },
      data: [],
      splitLine: {
        show: true,
        //  改变轴线颜色
        lineStyle: {
          // 使用深浅的间隔色
          color: ['#DDDDDD']
        }
      },
      axisTick: {
        show: false
      },
      //去掉x轴线
      axisLine: {
        show: false
      },
      // show: false
    },
    yAxis: [{
      name: '%',
      type: 'value',
      min: 0,
      max: 100,
      //y标轴名称的文字样式
      nameTextStyle: {
        color: '#FFC560'
      },
      //网格线
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#DDDDDD']
        }
      },
      //去掉刻度
      axisTick: {
        show: false
      },
      //去掉y轴线
      axisLine: {
        show: false
      },
      show: true,
    }],
    series: [{
      name: 'line1',
      type: 'line',
      smooth: true,
      symbole: 'none',
      showSymbol: false,
      //折线区域
      areaStyle: {
        //渐变颜色
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: '#6076FF' // 0% 处的颜色
          }, {
            offset: 1,
            color: 'rgba(96,118,255,0.1)' // 100% 处的颜色
          }],
          global: false, // 缺省为 false
        },
      },
      //折线宽度
      lineStyle: {
        width: 1
      },
      color: '#6076FF',
      connectNulls: true,
      yAxisIndex: 0,
      animation: false,
      animationThreshlod: 60,
      sampling: 'lttb',
      data: []
    },],
    dataZoom: {
      type: 'slider',
      show: false,
      realtime: true,
      // start: 95,
      // end: 100,
      miniValueSpan: 60 * 1000,
      maxValueSpan: 3600 * 1000
    },
    animation: false,
    animationThreshold: 1,
  }
}


/* 设置趋势图显示效果
 样例参考https://echarts.apache.org/examples/zh/index.html
 option设置参考 https://echarts.apache.org/zh/option.html#title
 */
function trendSeriesParams(options, index, param) {
  setIfDefined(options.yAxis[index].splitLine, 'show', param.splitLineShow);
  setIfDefined(options.yAxis[index], 'show', param.yAxisShow);
  setIfDefined(options.yAxis[index], 'name', param.name);
  setIfDefined(options.yAxis[index], 'min', param.min);
  setIfDefined(options.yAxis[index], 'max', param.max);
  options.series[index].areaStyle = {
    color: {
      colorStops: [{
        offset: 0,
        color: hexToRGBA(param.color, 1)
      },
      {
        offset: 1,
        color: hexToRGBA(param.color, 0.1)
      }
      ]
    }
  };
  options.series[index].color = param.color
  switch (param.yAxisIndex) {
    case "left":
      options.series[index].yAxisIndex = 0 //左侧Y轴
      break
    case "right":
      options.series[index].yAxisIndex = 1
      break
  }
}
function setIfDefined(target, path, value) {
  if (value !== undefined && (path in target)) {
    target[path] = value;
  }
}
function trendParams(options,  param) {
  setIfDefined(options.title, 'text', param.title);
  setIfDefined(options.title, 'show', param.titleShow);
  setIfDefined(options.xAxis, 'show', param.xAxisShow);
  setIfDefined(options.legend, 'show', param.legendShow);
}
function initeChartObjects(charts, buffsize) {
  // 遍历字典对象
  for (const key in charts) {
    const chart = charts[key];
    // 检查当前元素的type是否不等于'value'
    if (chart.type !== 'value') {
      chart.canvasId = 'canvasId'; 
      chart.chartId = 'chartId'; 
      if (chart.type === 'line') {
        let options = trendTemplate()
        let series = options.series[0]
        let yAxis = options.yAxis[0]
        options.series.length = 0
        options.series = []
        options.yAxis.length = 0
        options.yAxis = []
        options.legend.x = 'left'
        options.legend.left = 'center'
        chart.data = []
        for (let i = 0; i < chart.property.length; i++) {
          chart.data[i] = (new FIFOBuffer(buffsize))
          options.legend.data.push(chart.property[i].id)
          options.yAxis.push({
            ...yAxis
          })
          options.series.push({
            ...series
          })
          // options.series[i].data = []
          options.series[i].name = chart.property[i].id
          trendSeriesParams(options, i, chart.property[i].params)
        }
        trendParams(options, chart.global)
        chart.options = options
      }
      if (chart.type === 'gauge') {
        chart.name = chart.property[0].id
        chart.options = { ...gaugeTemplate() }; // 初始化option对象，你可以根据需要填充具体的配置
        chart.options.series[0].data[0].name = chart.property[0].id
      }
    }
    chart.name = chart.property[0].id
    // 返回更新后的字典对象  
  }
  console.log('init',charts)
  return charts;
}

module.exports = { trendTemplate, gaugeTemplate, trendSeriesParams, initeChartObjects };