//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          //获取openid接口
          url: 'http://120.77.32.233/print/wechat/get/' + res.code,
          data: {
          },
          method: 'POST',
          success:  res=> {
            this.globalData.open_id = res.data.openid,
            this.globalData.session_key = res.data.session_key,
            //登录接口
            wx.request({
              url: 'http://120.77.32.233/print/user/login',
              data: {
                openId: res.data.openid,
                phone: "123456789",
                nickName: '11',
                avatarUrl: '11',
                gender: '11',
                city: '1',
                province: '1',
                country: '111'
              },
              method: 'POST',
              success: res=> {
                //服务器返回数据session_id 
                wx.setStorageSync("session_id", res.header["Set-Cookie"]);
              }
            })
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
                //更新个人信息
                wx.request({
                  url: 'http://120.77.32.233/print/user/update',
                  data: {
                    phone: "123456789",
                    nickName: this.globalData.userInfo.nickName,
                    avatarUrl: this.globalData.userInfo.avatarUrl,
                    gender: this.globalData.userInfo.gender,
                    city: this.globalData.userInfo.city,
                    province: this.globalData.userInfo.province,
                    country: this.globalData.userInfo.country,
                  },
                  header: {
                    'Content-Type': 'application/json',
                    'cookie': wx.getStorageSync("session_id")//读取cookie
                  },
                  method: 'POST',
                  success: function (res) {}
                })
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    open_id: null,
    session_key: null,
  }
})