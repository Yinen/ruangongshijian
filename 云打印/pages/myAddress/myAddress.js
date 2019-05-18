// pages/myPosition/myPosition.js

//获取应用实例
const app = getApp()


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

    //我的地址列表信息
    myAddressArray: [],
    myAddressNameArray: [],
    myAddressIndex: 0,

    clickAddressName: '',
    clickAddressIndex: '',
    hiddenClickList: true,

    //区别默认地址与普通地址
    isChecked: false,

    //可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框
    hiddenmodalput: true,
    mySchoolIndex: 0,
    schoolNameArray: [],
    schoolArr: [],
    myDetailPosition: '',
    index: 0,
  },

  onLoad:function(){
    var that=this;
    //请求我的地址信息
    wx.request({
      url: 'http://120.77.32.233/print/address/list',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'cookie': wx.getStorageSync('sessionid')//读取cookie
      },
      success: function (res) {
        //服务器返回我的地址数据信息
        console.log(res.data);
        let temp = [];
        for (let j in res.data.data) {
          temp[j] = res.data.data[j].address
        }
        that.setData({
          myAddressArray: res.data.data,
          myAddressNameArray: temp,
        })
      }
    })
  },


  //列表点击事件
  onModelTap: function (e) {
    this.setData({
      clickAddressName: e.currentTarget.dataset.name,
      clickAddressIndex: e.currentTarget.dataset.value,
      hiddenClickList: false,
    });
  },

  onDefaultconfirm: function () {
    this.setData({
      isChecked: true,
      hiddenClickList: true
    })
    //修改默认地址，请求接口
    wx.request({
      url: 'http://120.77.32.233/print/address/update/default/' + this.data.myAddressArray[this.data.clickAddressIndex].id,
      header: {
        'Content-Type': 'application/json',
        'cookie': wx.getStorageSync("sessionid") //读取cookie
      },
      method: 'POST',
      success: function (res) {
        wx.redirectTo({ //页面跳转myPosition
          url: '/pages/myAddress/myAddress',
        })
      }
    })
  },

  onDefaultcancel: function () {
    this.setData({
      hiddenClickList: true,
    })
  },

  //添加地址按钮的监听事件
  onAddPosition: function () {
    var that = this;
    //请求学校信息
    wx.request({
      url: 'http://120.77.32.233/print/college/get/list',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'cookie': wx.getStorageSync('sessionid')//读取cookie
      },
      success: function (res) {
        //服务器返回学校数据信息
        let schoolNameArr = [];
        for (let i in res.data.data) {
          schoolNameArr[i] = res.data.data[i].name;
        }
        that.setData({
          schoolNameArray: schoolNameArr,
          schoolArr: res.data.data,
        })
        that.setData({
          hiddenmodalput: !that.data.hiddenmodalput
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '',
          success: function (res) { }
        })
      }
    })
  },

  //选择我的学校
  onSelectMySchool: function (e) {
    this.setData({
      mySchoolIndex: e.detail.value,
    });
  },

  //我的详细地址
  onMyDetailPosition: function (e) {
    console.log('姓名input发送选择改变，携带值为', e.detail.value)
    this.setData({
      myDetailPosition: e.detail.value
    })
  },

  //取消
  onCancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认  
  onConfirm: function () {
    //将地址通过接口存入,访问接口
    let myPosition = this.data.schoolNameArray[this.data.mySchoolIndex] + this.data.myDetailPosition;
    if (myPosition === null) {

    } else {
      console.log(myPosition);
      wx.request({
        url: 'http://120.77.32.233/print/address/add',
        data: {
          address: myPosition
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'cookie': wx.getStorageSync("sessionid") //读取cookie
        },
        method: 'POST',
        success: function (res) {
          wx.redirectTo({ //页面跳转myAddress
            url: '/pages/myAddress/myAddress',
          })
        }
      })
    }
    //访问接口取出所有地址，更新全局变量，更新myPositionArr进而更新myPositionsList
    this.setData({
      hiddenmodalput: true
    })
  },

})