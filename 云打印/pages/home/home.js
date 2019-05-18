import {
  menuIconUrls
} from '../../utils/Icon.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //轮播图组件的数据
    imgUrls: [
      '/images/1.jpg',
      '/images/2.jpg',
      '/images/3.jpg'
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
  },

  onFileTap: function () {
    wx.navigateTo({
      url: '/pages/uploadFile/uploadFile'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.setData({
      iconUrls: {
        docIcon: menuIconUrls.docIconUrl,
        imgIcon: menuIconUrls.imgIconUrl,
        orderIcon: menuIconUrls.orderIconUrl,
        viewIcon: menuIconUrls.viewIconUrl
      }
    });
  },
})