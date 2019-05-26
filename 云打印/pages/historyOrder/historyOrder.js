// pages/historyOrder/historyOrder.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myMenu: [],
    hiddenmodalOrder: true,
    catchTabItem: [],
    catchTabValue: '',
  },

  onLinkShop: function (e) {
    var that = this;
    var order = e.currentTarget.dataset.name;
    var index = e.currentTarget.dataset.value;
    wx.request({
      url: "http://120.77.32.233/print/order/get/shop/phone/" + order.id,
      header: {
        "Content-Type": "application/json",
        "cookie": wx.getStorageSync("sessionid") //读取cookie
      },
      method: "POST",
      success: function (res) {
        if (res.data.code == 200) {
          var shop_phone = res.data.data;
          wx.makePhoneCall({
            phoneNumber: shop_phone,
            fail: e => console.log(e)
          })
        }
      }
    })
  },

  onLook: function (e) {
    if (e.currentTarget.dataset.name.hasDelivery === false) {
      this.setData({
        hasDelivery: '不配送',
      })
    } else if (e.currentTarget.dataset.name.hasDelivery === true) {
      this.setData({
        hasDelivery: '配送',
      })
    }
    this.setData({
      catchTabItem: e.currentTarget.dataset.name,
      catchTabValue: e.currentTarget.dataset.value,
      hiddenmodalOrder: false,
    })
  },

  /*订单项的点击事件*/
  onMyMenuTop: function (e) {
    if (e.currentTarget.dataset.name.hasDelivery === false) {
      this.setData({
        hasDelivery: '不配送',
      })
    } else if (e.currentTarget.dataset.name.hasDelivery === true) {
      this.setData({
        hasDelivery: '配送',
      })
    }
    this.setData({
      catchTabItem: e.currentTarget.dataset.name,
      catchTabValue: e.currentTarget.dataset.value,
      hiddenmodalOrder: false,
    })

  },

  onDelete: function (e) {
    var that = this;
    var order = e.currentTarget.dataset.name;
    var index = e.currentTarget.dataset.value;
    wx.request({
      url: "http://120.77.32.233/print/order/del/" + order.id,
      header: {
        "Content-Type": "application/json",
        "cookie": wx.getStorageSync("sessionid") //读取cookie
      },
      method: "POST",
      success: function (res) {
        console.log(res);
        if (res.data.code == 200) {
          //删除数组中对应的订单，更新界面显示
          that.data.myMenu.splice(index, 1);
          that.setData({
            myMenu: that.data.myMenu,
          })
        }
      }
    })
  },

  onPay: function (e) {
    var order = e.currentTarget.dataset.name;
    wx.request({
      url: "http://120.77.32.233/print/pay/order/" + order.id,
      header: {
        "Content-Type": "application/json",
        "cookie": wx.getStorageSync("sessionid") //读取cookie
      },
      method: "POST",
      success: function (res) {
        console.log(res);
        wx.requestPayment({
          "timeStamp": res.data.data.timeStamp,
          "nonceStr": res.data.data.nonceStr,
          "package": res.data.data.package,
          "signType": res.data.data.signType,
          "paySign": res.data.data.paySign,
          "success": function (succ) {
            console.log(succ);
            wx.switchTab({
              url: "../home/home"
            });
          },
          "fail": function (err) {
            console.log(err);
          },
        })
      }
    })
  },

  onCancel: function () {
    this.setData({
      hiddenmodalOrder: true,
    })
  },

  onConfirm: function () {
    if (!this.data.catchTabItem.haspay) {
      //调用支付接口
      /*let id = this.data.catchTabItem.id;
      //跳转支付界面
      wx.request({
        url: 'http://120.77.32.233/print/pay/order/' + id,

        header: {
          'Content-Type': 'application/json',
          'cookie': wx.getStorageSync("sessionid")//读取cookie
        },
        method: 'POST',
        success: function (res) {
          console.log(res);
          wx.requestPayment(
            {
              'timeStamp': res.data.data.timeStamp,
              'nonceStr': res.data.data.nonceStr,
              'package': res.data.data.package,
              'signType': res.data.data.signType,
              'paySign': res.data.data.paySign,
              'success': function (succ) {
                console.log(succ);
              },
              'fail': function (err) {
                console.log(err);
              },
            }
          )
        }
      })*/
    }
    this.setData({
      hiddenmodalOrder: true,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.globalData.historyMenu = 1;
    wx.request({
      //获取openid接口
      url: 'http://120.77.32.233/print/order/list/accomplish/1/' + getApp().globalData.historyMenu,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'cookie': wx.getStorageSync("sessionid") //读取cookie
      },
      success: function (res) {
        app.globalData.histyMenu = res.data.data;
        console.log(res.data.data);
        app.globalData.historyMenu = getApp().globalData.historyMenu + 1;
        that.data.myMenu = getApp().globalData.histyMenu;
        that.setData({
          myMenu: that.data.myMenu
        });
      }
    })
  },

  onUpdateMyMenu: function () {
    this.setData({
      myMenu: app.globalData.histyMenu,
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    let that = this;
    wx.request({
      url: 'http://120.77.32.233/print/order/list/accomplish/1/' + getApp().globalData.historyMenu,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'cookie': wx.getStorageSync("sessionid") //读取cookie
      },
      success: function (res) {
        app.globalData.histyMenu = app.globalData.histyMenu.concat(res.data.data);
        app.globalData.historyMenu = getApp().globalData.historyMenu + 1;
        that.onUpdateMyMenu();

        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    wx.request({
      url: 'http://120.77.32.233/print/order/list/accomplish/1/' + getApp().globalData.historyMenu,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'cookie': wx.getStorageSync("sessionid") //读取cookie
      },
      success: function (res) {
        app.globalData.histyMenu = app.globalData.histyMenu.concat(res.data.data);
        app.globalData.historyMenu = getApp().globalData.historyMenu + 1;
        that.onUpdateMyMenu();
      }
    })
  },
})