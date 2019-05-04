// pages/selectPosition/selectPosition.js

//获取应用实例
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    posArr: getApp().globalData.positionArray,
    posId: getApp().globalData.positionId,
    posSend: getApp().globalData.sendServce,
    index:0,
  },


  //取件地点改变事件
  onPickerChange: function (params) {
    console.log('picker发送选择改变，携带值为', params.detail.value)
    this.setData({
      index: params.detail.value,
    })
    //console.log('picker发送选择改变，携带值为', this.data.printPosition)
    //console.log(this.data.ptintShopId);
  },


  //打印店选择确定按钮的事件
  onPositionSure:function(){
    app.globalData.printPosition = this.data.posArr[this.data.index];
    app.globalData.printShopId = this.data.posId[this.data.index];
    app.globalData.isPrintPos='true';
    app.globalData.isSend = this.data.posSend[this.data.index];
    console.log(app.globalData.printPosition);
    wx.navigateTo({//页面跳转index
      url: '/pages/printIndex/printIndex',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      posArr:getApp().globalData.positionArray,
      posId: getApp().globalData.positionId,
      posSend: getApp().globalData.sendServce,
    })
  }
})