// pages/orderSure/orderSure.js
// 在需要使用的js文件中，导入js
//获取应用实例
const app = getApp()
let util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    phone: '',
    date: '',
    time: '',
    schoolName: '',
    positionName: '',
    pageSize: '',
    pageType: '',
    pageColor: '',
    pageNum: '',
    myPosition: '',
    remarks: '',
    copyNum: '',
    fee: 0.0,
    price:0.0,
    sendSelect: '',
    fileId: 0,
    isDelivery:false,
  },

  //确定按钮的监听事件
  onMessageSure: function() {
    console.log(this.data.date + ' ' + this.data.time + ':00');
    //提交订单各个信息
    console.log(wx.getStorageSync('nickName'));
    console.log(wx.getStorageSync('phone'));
    console.log(this.data.date + ' ' + this.data.time + ':00');
    console.log(this.data.schoolName);
    console.log(this.data.positionName);
    console.log(wx.getStorageSync('propertyId'));
    console.log(this.data.myPosition);
    //console.log(parseInt(this.data.pageNum));
    console.log(parseInt(this.data.copyNum));
    console.log(isDelivery);

    wx.request({
      url: 'http://120.77.32.233/print/order/add',
      header: {
        'Content-Type': 'application/json',
        'cookie': wx.getStorageSync('sessionid') //读取cookie
      },
      data: {
        "name": this.data.name,
        "phone": this.data.phone,
        "fileId": app.globalData.fileId,
        "takeTime": this.data.date + ' ' + this.data.time + ':00',
        "college": this.data.schoolName,
        "shopAddress": this.data.positionName,
        "propertyId": wx.getStorageSync('propertyId'),
        "myAddress": this.data.myPosition,
        "pageNum": this.data.pageNum,
        "num": parseInt(this.data.copyNum),
        "hasDelivery": isDelivery,
        "note": this.data.remarks,
        "price": this.data.fee,
      },
      method: 'POST',
      success: function(res) {
        console.log(res);
        //跳转支付界面
        wx.request({
          url: 'http://120.77.32.233/print/pay/order/' + res.data.data,

          header: {
            'Content-Type': 'application/json',
            'cookie': wx.getStorageSync('sessionid') //读取cookie
          },
          method: 'POST',
          success: function(res) {
            console.log(res);
            wx.requestPayment({
              'timeStamp': res.data.data.timeStamp,
              'nonceStr': res.data.data.nonceStr,
              'package': res.data.data.package,
              'signType': res.data.data.signType,
              'paySign': res.data.data.paySign,
              'success': function(succ) {
                console.log(succ);
                wx.navigateTo({
                  url: '../index/index'
                })

              },
              'fail': function(err) {
                console.log(err);
              },
            })
          }
        })

      }
    })

  },

  //修改按钮的监听事件
  onMssageUpdate: function() {
    wx.switchTab({ //页面跳转index
      url: '/pages/printIndex/printIndex',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      name: wx.getStorageSync('humanName'),
      phone: wx.getStorageSync('humanPhone'),
      date: wx.getStorageSync('takeDate'),
      time: wx.getStorageSync('takeTime'),
      schoolName: wx.getStorageSync('schoolName'),
      positionName: wx.getStorageSync('positionName'),
      pageSize: wx.getStorageSync('pageSize'),
      pageType: wx.getStorageSync('pageType'),
      pageColor: wx.getStorageSync('pageColor'),
      pageNum: wx.getStorageSync('pageNum'),
      myPosition: wx.getStorageSync('myPosition'),
      remarks: wx.getStorageSync('remarks'),
      copyNum: wx.getStorageSync('copyNum'),
      price: wx.getStorageSync('price'),
      fileId: wx.getStorageSync('fileId'),
      sendSelect: wx.getStorageSync('sendSelect'),
      //fee: wx.getStorageSync('fee'),
    });
    let temp;
    if (this.data.sendSelect === '配送') {
      temp = true;
    } else if (this.data.sendSelect === '不配送') {
      temp = false;
    }
    this.setData({
      isDelivery: temp,
    })
    let total=this.data.pageNum*this.data.copyNum*this.data.price;
    this.setData({
      fee:total,
    })
    console.log(this.data.fee);
    console.log(this.data.fileId);
  }
})