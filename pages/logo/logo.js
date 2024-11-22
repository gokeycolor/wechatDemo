// pages/logo/logo.js
// const fifoBUffer = require('../../utils/fifo');
const { initeChartObjects } = require('../../utils/options');
const { isEmpty } = require('../../utils/comm');
const app = getApp()

const MAX_SIZE = 30 //趋势图显示的最大点数
const MIN_SAMPLE = 3 //最小采用时间，单位s
const MAX_SAMPLE = 60 //MAX_SAMPLE: 最大采用时间，单位s
/*
device 定义了页面需要监控的所有变量
device 字典类型，每个键值对应wxml页面绑定数据名

*/

const device = {
  switcher: { property: [{ id: 'switch' },], name:'',value:'', type: 'value' },
  motorSwitch: { property: [{ id: 'motorSwitch' },], name:'',value:'',type: 'value' },
  motorStatus: { property: [{ id: 'motorStatus' },], name:'',value:'',type: 'value' },
  meter: { property: [{ id: 'meter' },], name:'',value:'',type: 'value' },
  meter1: { property: [{ id: 'meter1' },],name:'',value:'', type: 'value' },
  meter2: { property: [{ id: 'meter', params: {} },],name:'',value:'', type: 'gauge' },
  count: { property: [{ id: 'count', params: {} },],name:'',value:'', type: 'gauge' },
  meter5: { property: [{ id: 'meter5', params: {} },],name:'',value:'', type: 'gauge' },
  trend_meter: {
    property: [{ id: 'meter', params: { name: '%', color: '#6076FF', yAxisShow: 0, 
                 yAxisIndex: 'left', splitLineShow: 0, min: 0, max: 100 } },],
    global: { titleShow: 0, xAxisShow: 0, legendShow: 0, gridBottom: '5rpx',gridTop:'0rpx' }, 
    type: 'line'
  },
  trend_count: {
    property: [{ id: 'count', params: { name: '%', color: '#FFC560', yAxisShow: 0, yAxisIndex: 'left', splitLineShow: 0, min: 0, max: 55 } },],
    global: { titleShow: 0, xAxisShow: 0, legendShow: 0, gridBottom: '5rpx',gridTop:'0rpx' }, type: 'line'
  },
  trend1: {
    property: [
      { id: 'meter', params: { name: '%', color: '#6076FF', yAxisShow: 1, yAxisIndex: 'left', splitLineShow: 1, min: 0, max: 100 } },
      { id: 'count', params: { name: 'pic', color: '#FFC560', yAxisShow: 1, yAxisIndex: 'right', splitLineShow: 0, min: 0, max: 55 } },
      { id: 'meter2', params: { name: '%', color: '#d7420b', yAxisShow: 0, yAxisIndex: 'left', splitLineShow: 0, min: 0, max: 100 } },
      { id: 'meter5', params: { name: '%', color: '#1dda0b', yAxisShow: 0, yAxisIndex: 'left', splitLineShow: 0, min: 0, max: 100 } },
    ],
    global: { title: '趋势图', titleShow: 1, xAxisShow: 1, legendShow: 1, gridBottom: '80rpx',gridTop:'50rpx' },
    type: 'line'
  },
}


var lastValue
var hasClick = false
// app.currentDevice={name: "pumpB", status: "ONLINE", timestamp: "2024-03-15T02:12:47.000Z"}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    deviceName: '',
    intervalTime: 5,
    onlineDevicesName: [],
    device: null,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log('onload', app.currentDevice)
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
      wx.showLoading({
        title: 'loading...',
        mask: true
      })
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


  // 更换设备名称
  bindPickerChange: function (e) {
    if (this.data.onlineDevicesName && app.currentDevice.name !== app.onlineDevices[e.detail.value].name) {
      app.currentDevice = app.onlineDevices[e.detail.value]
      app.needUpdate = true
      this.onShow()
    }
  },
  // 切换开关事件处理
  outputChange(e) {
    let switcher = !e.detail.value
    let name = e.currentTarget.id
    console.log(e)
    if (hasClick) {
      return
    }
    hasClick = true
    var that = this
    wx.showModal({
      title: '提示',
      content: switcher ? `确定停止 ${name} ?` : `确定启动 ${name} ?`,
      success(res) {
        if (res.confirm) {
          that.data.switcher = switcher ? 0 : 1
          let msg = {}
          msg[name] = that.data.switcher ? 1 : 0
          that.updateData(that.data.deviceName, msg)
        }
        hasClick = false
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
      this.data.intervalTime = sampleTime
      this.setData({
        intervalTime: sampleTime
      })
      this.getData(this.data.deviceName)
      console.log('sampletime',sampleTime)
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
  getData(deviceName, charts) {
    app.client.getDeviceShadow(deviceName)
      .then(res => {
        // console.log('getDeviceShadow', res) 
        for (const key in charts) {
          const chart = charts[key];
          switch (chart.type) {
            case 'value':
              if (chart.property[0].id in res) {
                chart.value = res[chart.property[0].id].value
              }
              break
            case 'gauge':
              if (chart.property[0].id in res) {
                chart.options.series[0].data[0].value = res[chart.property[0].id].value
                chart.value = res[chart.property[0].id].value
              }
              break
            case 'line':
              for (let i = 0; i < chart.options.series.length; i++) {
                if (chart.options.series[i].name in res) {
                  chart.data[i].append([res[chart.options.series[i].name].timestamp * 1000, res[chart.options.series[i].name].value])
                  chart.options.series[i].data = chart.data[i].getData()
                }
              }
              break
          }
        }
        // console.log('update Page', device)
        this.data.onlineDevicesName = app.onlineDevices.map(item => item.name);
        this.data.deviceName = app.currentDevice.name
        this.setData({
          device: this.data.device,
          onlineDevicesName: this.data.onlineDevicesName,
          deviceName: this.data.deviceName,
          intervalTime: this.data.intervalTime
        })
        wx.hideLoading()
      }).catch(err => {
        console.error(err)
      })
  },
  // 清空缓存
  clearBuffer() {
    for (const key in device) {
      const chart = device[key];
      if (chart.type === 'line') {
        for (let i = 0; i < chart.data.length; i++) {
          chart.data[i].clear()
          chart.options.series[i].data.length = 0
          chart.options.series[i].data = []
        }
      }
    }
  },
  // 销毁定时器，清空缓存
  destroy(timer) {
    this.clearBuffer()
    if (timer)
      clearInterval(timer)
  },

  initializtion() {
    this.data.device = initeChartObjects(device, MAX_SIZE)
    this.setData({
      device: this.data.device
    })
    console.log('initializtion', this.data.device)
  },


  refresh() {
    if (this.data.device === null) {
      this.initializtion()
    }
    if (app.needUpdate) {
      this.destroy(this.timer)
      app.needUpdate = false
    }
    this.data.deviceName = app.currentDevice.name
    this.getData(this.data.deviceName, this.data.device)
    this.timer = setInterval(() => {
      this.getData(this.data.deviceName, this.data.device)
    }, this.data.intervalTime * 1000)
  },

})

