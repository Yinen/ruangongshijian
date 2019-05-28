// pages/orderSure/orderSure.js
// 在需要使用的js文件中，导入js
//获取应用实例
const app = getApp()
let util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    phone: "",
    date: "",
    time: "",
    schoolName: "",
    positionName: "",
    pageSize: "",
    pageType: "",
    pageColor: "",
    pageNum: "",
    myPosition: "",
    remarks: "",
    copyNum: "",
    priority: "",
    bind: "",
    fee: 0.0,
    price: 0.0,
    sendSelect: "",
    fileId: 0,
    isDelivery: false,
  },

  //确定按钮的监听事件
  onMessageSure: function() {
    wx.request({
      url: "http://120.77.32.233/print/order/add",
      header: {
        "Content-Type": "application/json",
        "cookie": wx.getStorageSync("sessionid") //读取cookie
      },
      data: {
        "fileId": wx.getStorageSync("fileId"),
        "name": this.data.name,
        "phone": this.data.phone,
        "takeTime": this.data.date + " " + this.data.time + ":00",
        "college": this.data.schoolName,
        "shopAddress": this.data.positionName,
        "propertyId": wx.getStorageSync("propertyId"),
        "myAddress": this.data.myPosition,
        "pageNum": wx.getStorageSync("pageNum"),
        "num": parseInt(this.data.copyNum),
        "hasDelivery": this.data.isDelivery,
        "note": this.data.remarks,
        "price": this.data.fee,
        "priority": wx.getStorageSync("priority"),
        "bind": wx.getStorageSync("bind")
      },
      method: "POST",
      success: function(res) {
        console.log(res);
        //跳转支付界面
        wx.request({
          url: "http://120.77.32.233/print/pay/order/" + res.data.data,

          header: {
            "Content-Type": "application/json",
            "cookie": wx.getStorageSync("sessionid") //读取cookie
          },
          method: "POST",
          success: function(res) {
            console.log(res);
            wx.requestPayment({
              "timeStamp": res.data.data.timeStamp,
              "nonceStr": res.data.data.nonceStr,
              "package": res.data.data.package,
              "signType": res.data.data.signType,
              "paySign": res.data.data.paySign,
              "success": function(succ) {
                console.log(succ);
                wx.switchTab({
                  url: "../home/home"
                });
              },
              "fail": function(err) {
                console.log(err);
              },
            })
          }
        })
      }
    })

  },

  //修改按钮的监听事件
  onMessageUpdate: function() {
    wx.switchTab({ //页面跳转index
      url: "/pages/home/home",
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      name: wx.getStorageSync("userName"),
      phone: wx.getStorageSync("userPhone"),
      date: wx.getStorageSync("takeDate"),
      time: wx.getStorageSync("takeTime"),
      schoolName: wx.getStorageSync("schoolName"),
      positionName: wx.getStorageSync("positionName"),
      pageSize: wx.getStorageSync("pageSize"),
      pageType: wx.getStorageSync("pageType"),
      pageColor: wx.getStorageSync("pageColor"),
      pageNum: wx.getStorageSync("pageNum"),
      myPosition: wx.getStorageSync("myPosition"),
      remarks: wx.getStorageSync("remarks"),
      copyNum: wx.getStorageSync("copyNum"),
      priority: wx.getStorageSync("priority"),
      bind: wx.getStorageSync("bind"),
      price: wx.getStorageSync("price"),
      fileId: wx.getStorageSync("fileId"),
      sendSelect: wx.getStorageSync("sendSelect"),
    });
    let temp;
    if (this.data.sendSelect === "配送") {
      temp = true;
    } else if (this.data.sendSelect === "不配送") {
      temp = false;
    }
    this.setData({
      isDelivery: temp,
    });
    let total = 0;
    if (this.data.priority === 1) {
      total = this.data.pageNum * this.data.copyNum * this.data.price;
    } else {
      total = this.data.pageNum * this.data.copyNum * this.data.price + (this.data.priority - 1) * 1;
    }
    this.setData({
      fee: total.toFixed(2),
    });
    console.log(this.data.fee);
  }
})