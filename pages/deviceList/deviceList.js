// pages/deviceList/deviecList.js
const app = getApp();
const INTERVAL = 60 // 更新间隔，单位s

Page({
  //页面的初始数据
  data: {
    devices: [],
    total: 0,
    array: ['显示所有设备', '仅显示 ONLINE 设备', '仅显示 OFFLINE 设备','仅显示 UNACTIVE 设备', '仅显示 DISABLE 设备'],
    index: 0,
    objectArray: ['ALL', 'ONLINE', 'OFFLINE', 'UNACTIVE', 'DISABLE'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    wx.setNavigationBarTitle({
      title: "设备列表",
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 查询产品下所有设备状态   
    this.get_deviceList()
    this.timer = setInterval(() => {
      this.get_deviceList()
    }, INTERVAL * 1000)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    this.destory(this.timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.destory(this.timer)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    wx.showLoading({
      title: 'loading...',
    })
    wx.hideLoading()
    this.onShow()
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  bindPickerChange: function (e) {
    if (this.data.devices) {
      this.setData({
        index: e.detail.value
      });
      this.onShow()
    }
    //  console.log('show ', this.data.objectArray[this.data.index])
  },

  onDeviceTap: function (e) {
    const device = e.currentTarget.dataset.id;
    if (device.status === 'ONLINE') {
      if (app.currentDevice !== device) {
        app.currentDevice = device
        app.needUpdate = true
      }
      wx.switchTab({
        url: "/pages/logo/logo",
      });
    }
  },
  destory(timer) {
    if (timer) {
      clearInterval(timer)
    }
  },
  get_deviceList() {
    // 阿里云 OpenAPI 接口调用示例
    // 查询指定产品下所有设备的名称、状态以及最后更新时间
    app.client.queryDevices()
      .then(res => {
        let filteredList
        if (this.data.index == 0) filteredList = res
        else
          filteredList = res.filter(item => item.status === this.data.objectArray[this.data.index]);
        this.setData({
          devices: filteredList ? filteredList : null,
          total: filteredList ? filteredList.length : '--'
        });
        app.onlineDevices = filteredList.filter(item => item.status === 'ONLINE')
        if ((typeof app.currentDevice === 'undefined' || app.currentDevice === null) && app.onlineDevices.length !== 0) {
          app.currentDevice = app.onlineDevices[0]
          app.needUpdate = true
        }

        console.log(app.currentDevice)
      }).catch(err => {
        console.error(err);
        this.setData({
          devices: null,
          total: '--',
          online: '--',
          offline: '--'
        });
      });
  },
})