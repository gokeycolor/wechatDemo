// pages/logo/logo.js
const fifoBUffer = require('../../utils/fifo');
const {
  isEmpty,
  findNames,
  hexToRGBA,
  countTypes
} = require('../../utils/comm');
/* 以下参数必须修改为实际值
MAX_SIZE: 趋势图显示的最大点数
MIN_SAMPLE: 最小采用时间，单位s
MAX_SAMPLE: 最大采用时间，单位s
varChart:   数组类型，数组元素为字典；字典结构为{name:'变量名', type：'chart类型'}
            type目前仅支持'line'折线图和'gauge'仪表盘            
            name 来自logo数据传输设置变量表
            type为'line'时，要显示多条折线，name为变量名列表，例如name：['var1','var2]
lineParam:  数组类型，数组元素为字典，数组中元素必须与varChart 参数type为'line' name数组中元素一一对应
                 字典结构 {name:'%', color:'#6076FF', yAxisShow: 1, yAxisIndex:'left', splitLineShow: 1, min: 0, max:100}
                 name ：y轴单位
                 color：折线颜色
                 yAxisShow：1表示显示，0表示不显示
                 yAxisIndex：left表示按左侧y轴显示，right表示按右侧y轴显示
                 splitLineShow: 是否显示分隔线
                 min: y轴最小值
                 max: y轴最大值

*/
const MAX_SIZE = 30
const MIN_SAMPLE = 3
const MAX_SAMPLE = 60
const varChart = [
                  {name: ['meter', 'count', 
                  // 'meter1','meter3'
                ], type: 'line'},
                  {name: 'meter', type: 'gauge'},
                  {name: 'count', type: 'gauge'},
                  // {name: 'meter1', type: 'gauge'},
                  // {name: 'meter3', type: 'gauge'},
                ]
const lineParam = [
                    {name: '%', color: '#6076FF', yAxisShow: 1, yAxisIndex: 'left', splitLineShow: 1, min: 0, max: 100},
                    {name: '件', color: '#FFC560', yAxisShow: 1, yAxisIndex: 'right', splitLineShow: 0, min: 0, max: 55},
                    // {name: '%', color: '#d7420b', yAxisShow: 0, yAxisIndex: 'left', splitLineShow: 0, min: 0, max: 100},
                    // {name: '%', color: '#1dda0b', yAxisShow: 0, yAxisIndex: 'left', splitLineShow: 0, min: 0, max: 100},
                  ]


const app = getApp()
var lastValue, seriersCount, gaugeCount, seriersName

Page({
  /**
   * 页面的初始数据
   */
  data: {
    canvasId: [],
    chartId: [],
    options: [],
    deviceName: '', //修改为实际设备名称
    switcher: '--',
    gauge: [],
    gaugeName: [],
    openedDevice: false,
    buttonDisabled: false,
    intervalTime: 5,
    onlineDevicesName: [],
    dataBuff: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log('onload', app.currentDevice)
    this.init()
    wx.setNavigationBarTitle({
      title: '设备监控',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onshow')
    if (isEmpty(app.currentDevice)) {
      wx.showModal({
        title: '提示',
        content: '没有在线设备',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            // 用户点击了确定按钮
            console.log('用户点击了确定');
            wx.switchTab({
              url: "/pages/deviceList/deviceList",
            });
          } else if (res.cancel) {
            // 用户点击了取消按钮
            console.log('用户点击了取消');
          }
        }
      });
    } else {

      this.refresh()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.destroy(this.timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.destroy(this.timer)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  // 更换设备名称
  bindPickerChange: function (e) {
    if (this.data.onlineDevicesName && app.currentDevice.name !== app.onlineDevices[e.detail.value].name) {
      app.currentDevice = app.onlineDevices[e.detail.value]
      app.needUpdate = true
      this.onShow()
    }
  },
  // 切换开关事件处理
  switchChange(e) {
    let switcher = this.data.switcher
    var that = this
    wx.showModal({
      title: '提示',
      content: switcher?'确定关闭计数开关?':'确定启动计数开关?',
      success(res) {
        if (res.confirm) {              
          that.data.switcher = switcher?0:1
          console.log('confirm change switch', switcher,that.data.switcher)
          let msg = {
            switch: that.data.switcher ? 1 : 0
          }
          that.updateData(that.data.deviceName, msg)       
        }
        else if ( res.cancel) {
          that.data.switcher = switcher
        } 
        that.setData({
          switcher: that.data.switcher,
        });
      }
    }) 
  },
  // 更新采样时间
  interval(e) {
    let sampleTime = e.detail.value
    if (sampleTime > MAX_SAMPLE || sampleTime < MIN_SAMPLE) {
      wx.showToast({
        title: '请输入3~60之间的整数',
        icon: 'none',
        duration: 2000 // 显示时长为2秒
      });
      this.setData({
        intervalTime: lastValue
      });
    } else {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.data.intervalTime = sampleTime
      this.setData({
        intervalTime: sampleTime
      })
      this.getData(this.data.deviceName)
      this.timer = setInterval(() => {
        this.getData(this.data.deviceName)
      }, sampleTime * 1000)
    }
  },
  handleFocus(e) {
    lastValue = this.data.intervalTime
    this.setData({
      intervalTime: ""
    });
  },

  // 验证输入格式为整数
  handleInput(e) {
    let value = e.detail.value;
    let integerPattern = /^-?\d*$/;
    if (integerPattern.test(value)) {
      this.setData({
        intervalTime: value
      });
    } else {
      wx.showToast({
        title: '请输入整数',
        icon: 'none',
        duration: 2000
      });
      let lastValidValue = this.data.intervalTime;
      value = lastValidValue;
      this.setData({
        intervalTime: value
      });
    }
  },
  // guage option模板
  guageOptionTemplate() {
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
  },
  // trend option模板
  trendOptionTemplate() {
    return {
      darkMode: true,
      title: {
        text: '趋势图',
        left: 'center'
      },
      legend: {
        data: [],
        x: 'left',
        top: 35,
        left: 30,
        selectedMode: true,
        // bottom: 50,
        // left: 'center',
        // backgroundColor: 'white',
        // z: 100
      },
      grid: {
        bottom: 80,
        show: true,
        // containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        axisLabel: {
          // formatter: function (e) {
          //     return app.$iotAPI.timestampToTime(e);
          // },
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
      }, ],
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
  },
  // 下行数据，从云端到设备
  updateData(deviceName, msg) {
    app.client.updateDeviceShadow(
      msg, deviceName
    ).then(res => {
      console.log('logo page updateDeviceShadow', res.Success)
    }).catch(err => {
      console.error(err)
    })
  },
  //上行数据，从设备到云端
  getData(deviceName) {
    app.client.getDeviceShadow(deviceName)
      .then(res => {
        // console.log('getDeviceShadow', res)
        this.setData({
          switcher: res.switch.value
        })
        for (let i = 0; i < this.data.options.length; i++) {
          switch (this.data.options[i].series[0].type) {
            case "gauge": {
              let keyName = this.data.options[i].series[0].data[0].name
              if (keyName in res) {
                let chartPath = `options[${i}].series[0].data[0].value`;
                let pagePath = `gauge[${i}]`
                this.setData({
                  [pagePath]: res[keyName].value,
                  [chartPath]: res[keyName].value
                })
              }
              break
            }
            case "line": {
              for (let j = 0; j < this.data.options[i].series.length; j++) {
                let keyName = this.data.options[i].series[j].name
                if (keyName in res) {
                  this.data.dataBuff[j].append([res[keyName].timestamp * 1000, res[keyName].value])
                  // 更新趋势图   
                  let chartPath = `options[${i}].series[${j}].data`
                  this.setData({
                    [chartPath]: this.data.dataBuff[j].getData()
                  })
                }
              }
              break
            }
          }
        }
        wx.hideLoading()
      }).catch(err => {
        console.error(err)
      })
  },
  // 清空缓存
  clearBuffer(buff) {
    buff.forEach(buffer => {
      buffer.clear()
    })
  },
  // 销毁定时器，清空缓存
  destroy(timer) {
    this.clearBuffer(this.data.dataBuff)
    if (timer)
      clearInterval(timer)
  },

  init() {
    this.data.options.length = 0
    this.data.options = []
    seriersCount = countTypes(varChart, 'line')
    gaugeCount = countTypes(varChart, 'gauge')
    seriersName = findNames(varChart, 'line')
    this.data.gaugeName = findNames(varChart, 'gauge')

    for (let i = 0; i < seriersName.length; i++) {
      this.data.dataBuff.push(new fifoBUffer(MAX_SIZE))
    }
    for (let i = 0; i < varChart.length; i++) {
      this.data.canvasId.push("canvansId" + i)
      this.data.chartId.push('chartId' + i)
    }

    if (seriersCount > 0) {
      this.data.gaugeName.unshift('--')
      let options = this.trendOptionTemplate()
      let series = options.series[0]
      let yAxis = options.yAxis[0]
      options.series.length = 0
      options.series = []
      options.yAxis.length = 0
      options.yAxis = []
      options.legend.x = 'left'
      options.legend.left = 'center'
      options.title.text = `LOGO! 设备${app.currentDevice.name}趋势图`
      for (let i = 0; i < seriersName.length; i++) {
        options.legend.data.push(seriersName[i])
        options.yAxis.push({
          ...yAxis
        })
        options.series.push({
          ...series
        })
        options.series[i].name = seriersName[i]
        this.seriersParams(options, i, lineParam[i])
      }
      this.data.options.push(options)
    }

    for (let i = seriersCount; i < gaugeCount + seriersCount; i++) {
      this.data.gauge.push('--')
      this.data.options.push(this.guageOptionTemplate())
      this.data.options[i].series[0].data[0].name = this.data.gaugeName[i]
    }
    console.log(this.data.gaugeName)
    this.setData({
      canvasId: this.data.canvasId,
      chartId: this.data.chartId,
      options: this.data.options,
      gaugeName: this.data.gaugeName
    })
    console.log('onload', this.data.canvasId, this.data.chartId, this.data.options)
  },

  refresh() {
    wx.showLoading({
      title: 'loading...',
    })
    if (this.data.chartId.length === 0) {
      this.init()
    }
    if (app.needUpdate) {
      this.destroy(this.timer)
      this.data.onlineDevicesName = app.onlineDevices.map(item => item.name);
      this.data.deviceName = app.currentDevice.name
      this.data.options[0].title.text = `LOGO! 设备${this.data.deviceName}趋势图`
      app.needUpdate = false
    }
    this.setData({
      options: this.data.options,
      onlineDevicesName: this.data.onlineDevicesName,
      deviceName: this.data.deviceName,
      intervalTime: this.data.intervalTime
    })
    // console.log(this.data.onlineDevicesName,this.data.deviceName)
    this.getData(this.data.deviceName)
    this.timer = setInterval(() => {
      this.getData(this.data.deviceName)
    }, this.data.intervalTime * 1000)
  },
  /* 设置趋势图显示效果
  样例参考https://echarts.apache.org/examples/zh/index.html
  option设置参考 https://echarts.apache.org/zh/option.html#title
  */
  seriersParams(options, index, param) {
    options.yAxis[index].splitLine.show = param.splitLineShow
    options.yAxis[index].show = param.yAxisShow
    options.yAxis[index].name = param.name
    options.yAxis[index].min = param.min
    options.yAxis[index].max = param.max
    // options.yAxis[index].nameTextStyle.color = param.color
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
})