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
    submitBtn: false // 是否允许投稿
  },

  /* getPhoneNumber:function(params){
     console.log(params.detail.errMsg)
     console.log(params.detail.iv)
     console.log(params.detail.encryptedData)
     if (params.detail.errMsg == 'getPhoneNumber:fail user deny') {
       wx.showModal({
         title: '提示',
         showCancel: false,
         content: '未授权',
         success: function (res) { }
       })
     } else {
       wx.showModal({
         title: '提示',
         showCancel: false,
         content: '同意授权',
         success: function (res) { }
       })
     }

   },*/

  onGetUserInfo: function(params) {
    let that = this;
    if (params.detail.userInfo != null) { //用户点击允许授权
      imageUrl = params.detail.userInfo.avatarUrl,
        nickName = params.detail.userInfo.nickName,
        avatarUrl = params.detail.userInfo.avatarUrl,
        gender = params.detail.userInfo.gender,
        city = params.detail.userInfo.city,
        province = params.detail.userInfo.province,
        country = params.detail.userInfo.country,
        authorize = true;
      /*console.log(nickName),
      console.log(imageUrl),
      console.log(avatarUrl),
      console.log(gender),
      console.log(city),
      console.log(province),
      console.log(country),*/

      wx.setStorageSync('nickName', nickName);
      wx.setStorageSync('imageUrl', imageUrl);
      wx.setStorageSync('gender', gender);
      wx.setStorageSync('country', country);
      wx.setStorageSync('province', province);
      wx.setStorageSync('city', city);
      wx.setStorageSync('phone', '12345678900');

      wx.request({
        url: 'http://120.77.32.233/print/user/update',
        data: {
          phone: '123456789',
          nickName: nickName,
          avatarUrl: avatarUrl,
          gender: gender,
          city: city,
          province: province,
          country: country,
        },
        header: {
          'Content-Type': 'application/json',
          'cookie': wx.getStorageSync('sessionid') //读取cookie
        },
        method: 'POST',
        success: function(res) {
          //服务器返回数据null
          console.log(res.data);
        }
      })

      wx.switchTab({
        url: '../home/home'
      });

    } else {
      wx.switchTab({
        url: '../grantEntre/grantEntre'
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