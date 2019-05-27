// pages/mine/mine.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: '',
    headerUrl: '',
    phone: '',
    userInfo:null,
  },

  //我的信息点击事件
  onMyInformation: function() {
    wx.navigateTo({ //页面跳转myInformation
      url: '/pages/myInfo/myInfo',
    })
  },

  //我的地址点击事件
  onMyAddress: function() {
    wx.navigateTo({ //页面跳转myPosition
      url: '/pages/myAddress/myAddress',
    })
  },

  //我的订单点击事件
  onMyOrder: function() {
    wx.navigateTo({ //页面跳转myMenu
      url: '/pages/myOrder/myOrder',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      nickName: wx.getStorageSync('nickName'),
      headerUrl: wx.getStorageSync('imageUrl'),
      phone: wx.getStorageSync('phone'),
      userInfo: app.globalData.userInfo
    });
  },

  onShow: function () {
    if (!this.data.userInfo) {
      this.getUIFO()
    }
  },

  getUIFO: function () {
    var that = this
    if (app.globalData.userInfo) {
      // console.log('use app userInfo')
      that.save_user_info(app.globalData.userInfo)
    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        // console.log('res', res)
        console.log('use app callback userInfo')
        that.save_user_info(res.userInfo)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log('use getUserInfo')
          that.save_user_info(res.userInfo)
        }
      })
    }
  },

  getUserInfo: function (e) {
    var userInfo = e.detail.userInfo
    if (userInfo) {
      // 用户按了允许授权按钮
      console.log('btn getUserInfo')
      this.save_user_info(userInfo)
    } else {
      //用户按了拒绝按钮
      wx.showToast({
        title: '未登录',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    }
  },

  save_user_info: function (userInfo) {
    //保存用户数据，同时更新用户数据
    if (!app.globalData.userInfo) {
      console.log('save app userInfo')
      app.save_user_info(userInfo)
    }
    console.log('save this userInfo')
    this.setData({
      userInfo: userInfo,
      nickName: wx.getStorageSync('nickName'),
      headerUrl: wx.getStorageSync('imageUrl'),
      phone: wx.getStorageSync('phone'),
    })
    //this.updateSomeData()
  },
})