//index.js
//获取应用实例
const app = getApp()
Page({
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
    //日期选择的数据
    date: '2018-09-01',
    //时间选择器的数据
    time: '12:00',
    //学校数据信息,被选择的学校和ID用数组加schoolIndex来取
    schoolArray: [],
    schoolId: [],
    schoolIndex: 0,
    //打印店信息
    printShopPos: [],
    printShopName: [],
    printShopIndex: 0,
    hiddenPrintPos: true,
    //收件人姓名
    name: '',
    //收件人手机号码
    phone: '',
    //存储页数
    pageNum: 0,
    //我的地址
    myAddressArray: [],
    myAddressNameArray: [],
    myAddressIndex: 0,
    myAddress: '',
    //可以通过hidden是否掩藏要不要配送的属性，来指定那个弹出框  
    hiddenmodalput: false,
    sendSelect: '不配送',
    //是否显示选择我的地址（配送地址）
    hiddenSelectMyPos: true,
  },
  file: function () {
    wx.navigateTo({ //页面跳转myPosition
      url: '../uploadFile/uploadFile'
    });
  },
  //收件人姓名输入框事件
  userName: function (params) {
    console.log('姓名input发送选择改变，携带值为', params.detail.value)
    this.setData({
      name: params.detail.value
    })
  },
  //收件人手机号输入框事件
  userPhone: function (params) {
    console.log('手机号input发送选择改变，携带值为', params.detail.value)
    this.setData({
      phone: params.detail.value
    })
  },
  //添加文件事件
  onAddFile: function () {
    wx.navigateTo({ //页面跳转upload
      url: '/pages/uploadFile/uploadFile',
    })
  },
  //取件日期改变事件
  onDateChange: function (params) {
    console.log('picker发送选择改变，携带值为', params.detail.value)
    this.setData({
      date: params.detail.value
    })
  },
  //取件时间改变事件
  onTimeChange: function (params) {
    console.log('picker发送选择改变，携带值为', params.detail.value)
    this.setData({
      time: params.detail.value
    })
  },
  //学校改变事件
  onPickerChangeSchool: function (params) {
    this.setData({
      schoolIndex: params.detail.value,
    });
    this.printShopChanged();
  },
  printShopChanged: function () {
    var that = this;
    //请求学校打印店位置信息
    wx.request({
      url: 'http://120.77.32.233/print/shop/list/' + this.data.schoolId[this.data.schoolIndex],
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'cookie': wx.getStorageSync('sessionid') //读取cookie
      },
      success: function (res) {
        //服务器返回打印店位置数据
        let posTempName = [];
        let posTempId = [];
        for (let n in res.data.data) {
          posTempName[n] = res.data.data[n].address;
          //console.log(posTempName[n]);
        }
        that.setData({
          printShopPos: res.data.data,
          printShopName: posTempName,
        })
        that.setData({
          hiddenmodalput: that.data.printShopPos[0].distribution,
        })
      }
    })
  },
  //选择打印店地址按钮的监听事件
  onPickerChangePrintPos: function (params) {
    this.setData({
      printShopIndex: params.detail.value,
      hiddenmodalput: that.data.printShopPos[that.data.printShopIndex].distribution,
    });
  },
  //不需要配送按钮  
  onCancel: function () {
    this.setData({
      sendSelect: '不配送',
      hiddenmodalput: false
    });
  },
  //需要配送按钮  
  onConfirm: function () {
    //显示我的地址
    var that = this;
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
        that.setData({
          myAddress: that.data.myAddressArray[0],
          hiddenSelectMyPos: false,
          hiddenmodalput: false
        })
      }
    })
  },
  //选择我的地址
  onSelectMyAddress: function (params) {
    this.setData({
      myAddressIndex: params.detail.value,
    })
    //console.log(this.data.myAddressIndex)
  },

  //选择地址取消事件
  onCancelMyPosition: function () {
    this.setData({
      sendSelect: '不配送',
      hiddenSelectMyPos: true,
    })
  },
  //选择地址确定事件 
  onConfirmMyPosition: function () {
    let address = this.data.myAddressArray[this.data.myAddressIndex];
    //console.log(this.data.myAddressIndex+"     "+address);
    this.setData({
      myAddress: address,
      sendSelect: '配送',
      hiddenSelectMyPos: true,
    })
    //console.log(this.data.myAddress);
  },
  //下一步按钮的监听事件事件
  onNextPageButton: function () {
    this.setData({
      pageNum: app.globalData.filePage,
    })
    //数据存入本地缓存
    wx.setStorageSync('userName', this.data.name);
    wx.setStorageSync('userPhone', this.data.phone);
    wx.setStorageSync('takeDate', this.data.date);
    wx.setStorageSync('takeTime', this.data.time);
    wx.setStorageSync('schoolName', this.data.schoolArray[this.data.schoolIndex]);
    wx.setStorageSync('positionName', this.data.printShopName[this.data.printShopIndex]);
    wx.setStorageSync('pageNum', this.data.pageNum);
    wx.setStorageSync('myPosition', this.data.myAddress.address);
    wx.setStorageSync('sendSelect', this.data.sendSelect);
    console.log(this.data.name);
    console.log(this.data.date);
    console.log(this.data.phone);
    console.log(this.data.time);
    console.log(this.data.schoolArray[this.data.schoolIndex]);
    console.log(this.data.printShopName[this.data.printShopIndex]);
    console.log(this.data.pageNum);
    console.log(this.data.myAddress.address);
    console.log(this.data.sendSelect);
    //页面跳转printAttribution
    wx.navigateTo({
      url: '/pages/printAttribution/printAttribution'
    })
  },

  onLoad: function (options) {
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
        let schoolArr = [], schoolnum = [];
        for (let i in res.data.data) {
          schoolArr[i] = res.data.data[i].name;
          schoolnum[i] = res.data.data[i].id;
        }
        that.setData({
          schoolArray: schoolArr,
          schoolId: schoolnum,
        })
        //初始化打印店数据
        //请求学校打印店位置信息
        wx.request({
          url: 'http://120.77.32.233/print/shop/list/' + that.data.schoolId[that.data.schoolIndex],
          method: 'POST',
          header: {
            'content-type': 'application/json',
            'cookie': wx.getStorageSync('sessionid') //读取cookie
          },
          success: function (res) {
            //服务器返回打印店位置数据
            let posTempName = [];
            let posTempId = [];
            for (let n in res.data.data) {
              posTempName[n] = res.data.data[n].address;
            }
            that.setData({
              printShopPos: res.data.data,
              printShopName: posTempName,
            })
            that.setData({
              hiddenPrintPos: that.data.printShopPos[0].distribution
            })
          }
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

    if (options != null && app.globalData.filemask && (options.page != undefined)) {
      //存储文件上传后返回的文件信息，存入全局变量
      console.log(options.id);
      console.log(options.userId);
      console.log(options.size);
      console.log(options.name);
      console.log(options.page);
      app.globalData.fileId = options.id;
      app.globalData.fileName = options.name;
      app.globalData.fileSize = options.size;
      app.globalData.userId = options.userId;
      app.globalData.filePage = parseInt(options.page);
      app.globalData.filemask = false;
    }
  },
})