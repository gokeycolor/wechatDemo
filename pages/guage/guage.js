const {
  isEmpty
} = require('../../utils/comm');
const app = getApp();

/* 以下参数必须修改为实际值
variableName:   仪表盘显示值变量名数组,来自logo数据传输设置变量表
*/
const variableName = ['meter', 'meter1', 'meter2', 'meter3', 'meter4', 'meter5']


Page({
  data: {
    canvasId: [],
    chartId: [],
    // 仪表盘样式
    options: [
      {
        backgroundColor: "#ffffff",
        series: [{
          name: '业务指标',
          zlevel: -1,
          // 当前进度条
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
          // echart类型
          type: 'gauge',
          // 仪表盘详情   
          detail: {
            formatter: '{value}'
          },
          // 轴线配置
          axisLine: {
            // 轴线样式
            lineStyle: {
              width: 10,
              color: [
                [1.0, 'red']
              ],
              opacity: 0.5
            },
            show: true
          },
          // 刻度样式
          axisTick: {
            show: false,
            distance: -10,
            splitNumber: 10
          },
          // 分隔线样式
          splitLine: {
            show: true,
            distance: -10,
            length: '10%',
            lineStyle: {
              width: 1
            }
          },
          //  刻度标签
          axisLabel: {
            show: false,
            distance: -5,
            textStyle: {
              fontSize: 8
            }
          },
          // 仪表盘半径
          radius: '100%',
          // 仪表盘起始角度
          startAngle: -150,
          endAngle: 90,
          //  指针
          pointer: {
            showAbove: false,
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
          // 系列中的数据内容数组
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
      },
      {
        backgroundColor: "#ffffff",
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
          detail: {
            formatter: '{value}'
          },
          axisLine: {
            lineStyle: {
              width: 25,
              color: [
                [0.1, '#E8E8E8'],
                [0.2, '#CFCFCF'],
                [0.3, '#B5B5B5'],
                [0.4, '#9C9C9C'],
                [0.5, '#828282'],
                [0.6, '#696969'],
                [0.7, '#4F4F4F'],
                [0.8, '#363636'],
                [0.9, '#1C1C1C'],
                [1.0, '#1C1C1C']
              ],
              opacity: 0.7
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
          startAngle: 0,
          endAngle: 180,
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
      },
      {
        backgroundColor: "#ffffff",
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
          detail: {
            formatter: '{value}'
          },
          axisLine: {
            lineStyle: {
              width: 25,
              color: [
                [0.2, 'red'],
                [1.0, 'green']
              ],
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
          startAngle: 0,
          endAngle: 90,
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
      },
      {
        backgroundColor: "#ffffff",
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
          detail: {
            formatter: '{value}'
          },
          axisLine: {
            lineStyle: {
              width: 25,
              color: [
                [0.1, 'yellow'],
                [0.9, 'green'],
                [1.0, 'red']
              ],
              opacity: 0.5
            },
            show: true
          },
          axisTick: {
            show: true,
            distance: -10
          },
          splitLine: {
            show: true,
            distance: -6,
            length: '10%',
            lineStyle: {
              width: 1
            }
          },
          axisLabel: {
            distance: 2,
            textStyle: {
              fontSize: 8
            }
          },
          radius: '100%',
          startAngle: -135,
          endAngle: -45,
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
              fontSize: 15
            },
            value: '30',
            name: 'meter',
            detail: {
              show: true,
              fontSize: 20,
              width: 25,
              height: 15,
              backgroundColor: 'transparent'
            }
          }]
        }]
      },
      {
        backgroundColor: "#ffffff",
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
          detail: {
            formatter: '{value}'
          },
          axisLine: {
            lineStyle: {
              width: 25,
              color: [
                [0.1, 'yellow'],
                [0.9, 'green'],
                [1.0, 'red']
              ],
              opacity: 0.5
            },
            show: true
          },
          axisTick: {
            show: true,
            distance: -10
          },
          splitLine: {
            show: true,
            distance: -6,
            length: '10%',
            lineStyle: {
              width: 1
            }
          },
          axisLabel: {
            distance: 3,
            textStyle: {
              fontSize: 8
            }
          },
          radius: '100%',
          startAngle: 0,
          endAngle: 360,
          clockwise: false,
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
              fontSize: 15
            },
            value: '30',
            name: 'meter',
            detail: {
              show: true,
              fontSize: 20,
              width: 25,
              height: 15,
              backgroundColor: 'transparent'
            }
          }]
        }]
      },
      {
        backgroundColor: "#ffffff",
        series: [{
          name: '业务指标',
          zlevel: -1,
          progress: {
            show: true,
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
          center: ['50%', '20%'],
          detail: {
            formatter: '{value}'
          },
          axisLine: {
            lineStyle: {
              width: 25,
              color: [
                [0.1, 'yellow'],
                [0.3, '#66CD00'],
                [0.6, '#C0FF3E'],
                [0.8, 'green'],
                [1.0, 'red']
              ],
              opacity: 0.5
            },
            show: true
          },
          axisTick: {
            show: true
          },
          splitLine: {
            show: true,
            distance: 6,
            length: '10%',
            lineStyle: {
              width: 1
            }
          },
          axisLabel: {
            distance: -10,
            textStyle: {
              fontSize: 10
            }
          },
          radius: '100%',
          startAngle: 180,
          endAngle: 0,
          clockwise: false,
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
              fontSize: 15
            },
            value: '30',
            name: 'meter',
            detail: {
              show: true,
              fontSize: 20,
              width: 25,
              height: 15,
              backgroundColor: 'transparent'
            }
          }]
        }]
      }
    ],
    deviceName: '', // 修改为实际访问的设备名称
    onlineDevicesName: []
  },
  onLoad: function () {
    console.log('onload')
    this.init()
  },
  onReady: function () {
    console.log('onReady')

  },
  onShow: function () {
    console.log('onShow')
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
  onHide: function () {
    this.destroy(this.timer)
  },
  onUnload: function () {
    this.destroy(this.timer)
  },
  refresh() {
    wx.showLoading({
      title: 'loading...',
    })
    if (this.data.chartId.length === 0) {
      this.init()
    }
    this.data.deviceName = app.currentDevice.name
    // 查询指定设备的影子信息   
    this.getData(this.data.deviceName)
    this.timer = setInterval(() => {
      this.getData(this.data.deviceName)
    }, 5000)
  },
  // 关闭定时器
  destroy(timer) {
    if (timer)
      clearInterval(timer)
  },
  getData(deviceName) {
    app.client.getDeviceShadow(deviceName)
      .then(res => {
        // console.log('getDeviceShadow', res)
        for (let i = 0; i < variableName.length; i++) {
          let path = `options[${i}].series[0].data[0].value`;
          this.setData({
            [path]: res[variableName[i]].value
          });
        }
        this.data.onlineDevicesName = app.onlineDevices.map(item => item.name);
        this.data.deviceName = app.currentDevice.name
        this.setData({
          onlineDevicesName: this.data.onlineDevicesName,
          deviceName: this.data.deviceName
        })
        wx.hideLoading()
      }).catch(err => {
        console.error(err)
      })
  },
  bindPickerChange: function (e) {
    console.log(e)
    if (this.data.onlineDevicesName) {
      app.currentDevice = app.onlineDevices[e.detail.value]
      this.data.deviceName = app.currentDevice.name
      this.setData({
        deviceName: this.data.deviceName,
      });
      this.destroy(this.timer)
      this.onShow()
    }
  },
  
  init() {
    for (let i = 0; i < variableName.length; i++) {
      this.data.canvasId.push("canvansId" + i)
      this.data.chartId.push('chartId' + i)
      this.data.options[i].series[0].data[0].name = variableName[i]
    }
    this.setData({
      canvasId: this.data.canvasId,
      chartId: this.data.chartId,
      options: this.data.options
    })
    wx.setNavigationBarTitle({
      title: "Guage ",
    })
  }
})