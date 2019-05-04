//app.js
const app = getApp();

const APP_ID = '';//输入小程序appid
const APP_SECRET = '';//输入小程序app_secret
let OPEN_ID = ''//储存获取到openid
let SESSION_KEY = ''//储存获取到session_key

let schoolArr = [];
let schoolnum = [];

let myPos = [];
let myPosId = [];
let defaultMyPos = '';
let defaultMyPosId = '';

App({
  data: {
    //openId
    openId: OPEN_ID,
    session_key: SESSION_KEY,

    //学校信息
    schoolArray: schoolArr,
    schoolId: schoolnum,

    //学校打印店位置信息
    positionArray: [],
    positionId: [],
    sendServce: [],
    printPosition: '',
    printShopId: '',
    isSend: '',
    isPrintPos: 'false',

    //我的地址信息
    myPosition: myPos,
    myPositionId: myPosId,
    defaultMyPosition: defaultMyPos,
    defaultMyPositionId: defaultMyPosId,

    //我的订单
    myMenu: [],
  },
  onLaunch: function () {
    //获取用户openID
    wx.login({
      success: function (res) {
        wx.getUserInfo({
          success: function (res) {}
        });
        wx.request({
          //获取openid接口
          url: 'http://120.77.32.233/print/wechat/get/' + res.code,
          data: {},
          method: 'POST',
          success: function (res) {
            console.log(res.data)
            OPEN_ID = res.data.openid;//获取到的openid
            SESSION_KEY = res.data.session_key;//获取到session_key
            wx.setStorageSync('openId', OPEN_ID);
            wx.setStorageSync('session_key', SESSION_KEY);

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
              success: function (res) {
                //服务器返回数据sessionid
                wx.setStorageSync('sessionid', res.header['Set-Cookie']);

                

                //请求我的默认地址
                wx.request({
                  url: 'http://120.77.32.233/print/address/get/default',
                  method: 'POST',
                  header: {
                    'Content-Type': 'application/json',
                    'cookie': wx.getStorageSync('sessionid')//读取cookie
                  },
                  success: function (res) {
                    //服务器返回学校数据信息
                    console.log('defaultPosition')
                    console.log(res.data);
                    defaultMyPos = res.data.data.address;
                    defaultMyPosId = res.data.data.id;
                  }
                })
              },
              fail: function (res) {
                wx.showModal({
                  title: '提示',
                  showCancel: false,
                  content: '登录失败',
                  success: function (res) { }
                })
              }
            })

          }
        })
      }
    })

    // 展示本地存储能力
    let logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
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
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow: function () {
  },
  globalData: {
    myMenuNum: 1,
    //文件信息
    fileId: ' ',
    fileName: ' ',
    fileSize: ' ',
    userId: ' ',
    filePage: 0,
    filemask: true,
  }
})