// pages/mine/mine.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: wx.getStorageSync('nickName'),
    headerUrl: wx.getStorageSync('imageUrl'),
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
    app.globalData.myMenuNum = 1;
    wx.request({
      //获取openid接口
      url: 'http://120.77.32.233/print/order/list/' + getApp().globalData.myMenuNum,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'cookie': wx.getStorageSync("sessionid") //读取cookie
      },
      success: function(res) {
        app.globalData.myMenu = res.data.data;
        console.log(res.data.data);
        app.globalData.myMenuNum = getApp().globalData.myMenuNum + 1;
        wx.navigateTo({ //页面跳转myMenu
          url: '/pages/myOrder/myOrder',
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      nickName: wx.getStorageSync('nickName'),
      headerUrl: wx.getStorageSync('imageUrl'),
    });
  }
})