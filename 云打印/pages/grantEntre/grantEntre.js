// pages/grant/grant.js

const app = getApp();
const APP_ID = ''; //输入小程序appid
const APP_SECRET = ''; //输入小程序app_secret
let OPEN_ID = '' //储存获取到openid
let SESSION_KEY = '' //储存获取到session_key
let imageUrl = ''
let nickName = ''
let avatarUrl = ''
let gender = ''
let city = ''
let province = ''
let country = ''
let authorize = true;

/*let schoolArr = [];
let schoolnum = [];

let myPos = ['409', '407', '404'];
let myPosId = [];
let defaultMyPos = '福大6#409';
let defaultMyPosId = '1'*/

Page({
  data: {
    isAgreement: false, // 是否显示用户协议
    submitBtn: false, // 是否允许投稿
    userInfo: null,
    notice_me: false,
    notice_title: "请您登录",
    notice_detail: "为了您能获得更好的程序体验，请您先授权登录",
  },

  onLoad:function(options){
    var that = this
    wx.getSetting({ // 获取用户信息
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          // 如果还未授权获取用户信息，则弹窗询问
          that.noticeMe()
        } else {
          console.log("已授权获取用户信息")
        }
      }
    })
  },

  noticeMe: function () {
    this.setData({
      notice_me: true
    })
  },

  Iknowit: function () {
    this.setData({
      notice_me: false
    })
  },

  getUserInfo: function (e) {
    var userInfo = e.detail.userInfo
    if (userInfo) {
      // 用户按了允许授权按钮
      // console.log('btn getUserInfo')
      app.save_user_info(userInfo)
    } else {
      //用户按了拒绝按钮
      wx.showToast({
        title: '未登录',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    }
    this.Iknowit()
  },


  getPhoneNumber: function (e) {
    if (e.errMsg == 'getPhoneNumber:fail user deny') {
      //用户按了拒绝按钮
      wx.showToast({
        title: '未授权手机号',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    } else {
      wx.request({
        url: 'http://120.77.32.233/print/wechat/get/user/phone',
        data: {
          encryptedData: e.detail.encryptedData,
          session_key: wx.getStorageSync('session_key'),
          iv: e.detail.iv
        },
        header: {
          'Content-Type': 'application/json',
          'cookie': wx.getStorageSync('sessionid') //读取cookie
        },
        method: 'GET',
        success: function (res) {
          //服务器返回数据null
          console.log(res.data);
          wx.setStorageSync('phone', res.data.phoneNumber);
          wx.request({
            url: 'http://120.77.32.233/print/user/update',
            data: {
              phone: wx.getStorageSync('phone'),
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
      });
      wx.switchTab({
        url: '../home/home'
      });
    }
  },

  onShowAgreement: function() {
    let that = this;
    if (that.data.isAgreement) {
      that.setData({
        isAgreement: false
      });

    } else {
      that.setData({
        isAgreement: true
      });
    }
  },

  // 同意用户协议

  onAgreeMent: function(params) {
    let that = this;
    if (params.detail.value == 'true') {
      that.setData({
        submitBtn: false
      });
    } else {
      that.setData({
        submitBtn: true
      });
    }
  },
})