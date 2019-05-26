//app.js
const app = getApp();
const APP_ID = "";//输入小程序appid
const APP_SECRET = "";//输入小程序app_secret
let OPEN_ID = ""//储存获取到openid
let SESSION_KEY = ""//储存获取到session_key

App({
  data: {
    //openId
    openId: OPEN_ID,
    session_key: SESSION_KEY,
    //我的订单
    myMenu: [],
    histyMenu:[],
  },
  onLaunch: function () {
    //获取用户openID
    var that=this;
    wx.login({
      success: function (res) {
        wx.request({
          //获取openid接口
          url: "http://120.77.32.233/print/wechat/get/" + res.code,
          data: {},
          method: "POST",
          success: function (res) {
            console.log(res.data)
            OPEN_ID = res.data.openid;//获取到的openid
            SESSION_KEY = res.data.session_key;//获取到session_key
            wx.setStorageSync("openId", OPEN_ID);
            wx.setStorageSync("session_key", SESSION_KEY);
            //登录接口
            wx.request({
              url: "http://120.77.32.233/print/user/login",
              data: {
                openId: res.data.openid,
                phone: "123456789",
                nickName: "11",
                avatarUrl: "11",
                gender: "11",
                city: "1",
                province: "1",
                country: "111"
              },
              method: "POST",
              success: function (res) {
                //服务器返回数据sessionid
                wx.setStorageSync("sessionid", res.header["Set-Cookie"]);
                that.get_user_info();
              },
              fail: function (res) {
                wx.showModal({
                  title: "提示",
                  showCancel: false,
                  content: "登录失败",
                  success: function (res) { }
                })
              }
            })
          }
        })
      }
    })
  },

  get_user_info: function () {
    var app = this
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          console.log("已经授权-获取信息")
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              app.save_user_info(res.userInfo)

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          console.log("未授权-获取信息")
        }
      }
    })
  },

  //在每次登陆的时候都保存一下userInfo，防止用户更换头像、昵称
  save_user_info: function (userInfo) {
    if (userInfo) {
      this.globalData.userInfo = userInfo
      console.log(userInfo)
      var sex = '';
      if (userInfo.gender == 2) {
        sex = "女";
      }
      else {
        sex = "男";
      }
      wx.setStorageSync('nickName', userInfo.nickName);
      wx.setStorageSync('imageUrl', userInfo.avatarUrl);
      wx.setStorageSync('gender', userInfo.gender);
      wx.setStorageSync('country', userInfo.country);
      wx.setStorageSync('province', userInfo.province);
      wx.setStorageSync('city', userInfo.city);
      wx.request({
        url: 'http://120.77.32.233/print/user/update',
        data: {
          phone: "00000000000",
          nickName: wx.getStorageSync('nickName'),
          avatarUrl: wx.getStorageSync('imageUrl'),
          gender: wx.getStorageSync('gender'),
          city: wx.getStorageSync('city'),
          province: wx.getStorageSync('province'),
          country: wx.getStorageSync('country'),
        },
        header: {
          'Content-Type': 'application/json',
          'cookie': wx.getStorageSync('sessionid') //读取cookie
        },
        method: 'POST',
        success: function (res) {
          //服务器返回数据null
          console.log(res.data);
        }
      });
    }
  },
  globalData: {
    myMenuNum: 1,
    historyMenu:1,
    //文件信息
    fileId: " ",
    fileName: " ",
    fileSize: " ",
    userId: " ",
    filePage: 0,
    filemask: true,
  }
})