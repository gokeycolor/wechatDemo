// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    deviceName: '', // 修改为实际访问的设备名称
    onlineDevicesName: [],
    log: ''
  },

  onLoad() {
    this.data.onlineDevicesName = app.onlineDevices.map(item => item.name);
    this.data.deviceName = app.currentDevice.name

  },
  onShow() {
    this.getData(this.data.deviceName)
    this.setData({
      onlineDevicesName: this.data.onlineDevicesName,
      deviceName: this.data.deviceName
    })
    this.timer = setInterval(() => {
      this.getData(this.data.deviceName)
    }, 5000)
  },
  //上行数据，从设备到云端
  getData(deviceName) {
    console.log('getData', deviceName)
    app.client.getDeviceShadow(deviceName)
      .then(res => {
        // console.log('getDeviceShadow', res)
        this.data.log = formatDict(res)
        this.setData({
          log: this.data.log
        })

      }).catch(err => {
        console.error(err)
      })
  },
  // 关闭定时器
  destroy(timer) {
    if (timer)
      clearInterval(timer)
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
})

function formatDictItem(key, value, timestamp) {
  return `  ${key}: { value: ${value}, timestamp: ${timestamp} }\n`;
}

function formatDict(dict) {
  let result = '';
  const timestamp = new Date().toISOString(); // 获取当前的时间戳
  result = `${timestamp}\n`;
  // 遍历字典的每个键值对
  for (let [key, item] of Object.entries(dict)) {
    // 检查值是否为对象，并且包含 'value' 和 'timestamp' 属性
    if (typeof item === 'object' && 'value' in item && 'timestamp' in item) {
      // 格式化字典项并添加到结果字符串
      result += formatDictItem(key, item.value, item.timestamp);
    }
  }
  return result.trim(); // 去除末尾的空行
}