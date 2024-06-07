const app = getApp()
var Client = require('../../utils/rpc');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iotInstanceId: '',       //输入实际的阿里云物联网平台实例id
    accessKeyId: '',          // 输入实际的accessKeyId
    accessKeySecret: '',      //输入实际的accessKeySecret
    endpoint: 'https://iot.cn-shanghai.aliyuncs.com',
    productName: 'logo'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    wx.setNavigationBarTitle({
      title: "设置连接物联网平台",
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  getid(e) {
    console.log(e)
    let id;
    switch (e.currentTarget.id) {
      case "iotinstance":
        id = 'iotInstanceId'
        break;
      case "accessKey":
        id = 'accessKeyId'
        break;
      case "secret":
        id = 'accessKeySecret'
        break;
      case "endpoint":
        id = 'endpoint'
        break;
      case "productName":
        id = 'productName'
        break;
    }

    this.setData({
      [id]: e.detail.value
    })
  },

  connect() {
    app.client = new Client({
      accessKeyId: this.data.accessKeyId,
      accessKeySecret: this.data.accessKeySecret,
      iotInstanceId: this.data.iotInstanceId,
      productName: this.data.productName,
      endpoint: this.data.endpoint,
      apiVersion: '2018-01-20'
    });
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  login() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  }

})