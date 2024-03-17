// pages/login/login.js
const ACCOUNT = 'admin'
const PASSWORD = 'logo'
Page({
    data: {
        account: '',
        passwd: ''
    },
    //获取输入的账号
    getaccount(event) {
        this.setData({
            account: event.detail.value
        })
    },
    //获取输入的密码
    getpasswd(event) {
        this.setData({
            passwd: event.detail.value
        })
    },
    //点击登陆
    login() {
        let account = this.data.account
        let passwd = this.data.passwd
        if (account.length < 4) {
            wx.showToast({
                icon: 'none',
                title: '账号至少4位',
            })
            return
        }
        if (passwd.length < 4) {
            wx.showToast({
                icon: 'none',
                title: '账号至少4位',
            })
            return
        }

        if (account === ACCOUNT & passwd === PASSWORD) {
            console.log('登陆成功')
            wx.showToast({
                title: '登陆成功',
            })
            wx.switchTab({
                url: '/pages/deviceList/deviceList',
            })
        }
        else {
            console.log('登陆失败')
            wx.showToast({
                icon: 'none',
                title: '账号或密码不正确',
            })
        }
    }, 
    onShow() {
        wx.setNavigationBarTitle({
            title: "欢迎登录 Logo！设备监控小程序",
        })
    },
    onShareAppMessage(){
      return{
        "title": "工业设备监控小程序",
        "path": "/pages/login/login",
        "imageUrl": "/images/code.jpg"
      }
    }
})
