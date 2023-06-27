import { $wuxKeyBoard } from '../../components/index'
const app = getApp()
Page({
  data:{
    bill:0,
    payPassword:''
  },
  onShow(){
    this.setData({bill:app.globalData.bill})
  },
  doSomething:function(){
    wx.showLoading({
      title: '正在支付',
      mask:true
    })
    var that = this
    let orderItem = app.globalData.merchandise
    orderItem['number'] = app.globalData.number
    orderItem['priceNow'] = app.globalData.bill
    wx.cloud.callFunction({
      name: 'changeInfo',
      data: {
        openid: app.globalData.openid,
        orderItem:orderItem,
        bill: app.globalData.bill
      },
      success: res => {
        let order = {};
        order['number'] = app.globalData.number;
        order['openid'] = app.globalData.openid;
        order['money'] = app.globalData.bill;
        order['name'] = app.globalData.name;
        order['phone'] = app.globalData.phone;
        wx.cloud.callFunction({
          name: 'uploadOrder',
          data: {
            id: app.globalData.id,
            order: order,
            bill: app.globalData.bill
          },
          success: res => {
            wx.cloud.callFunction({
              name: 'confirmPayment',
              data: {
                number: app.globalData.number,
                date: app.getDate(2),
                openid: app.globalData.openid,
                bill: '¥' + app.globalData.bill
              },
              success: res => {
                let order = app.globalData.order
                order.push(orderItem)
                app.globalData.order = order
                wx.hideLoading()
                wx.reLaunch({
                  url: '/pages/pay/success',
                })
              },
              fail: res => {
                wx.reLaunch({
                  url: '/pages/pay/fail',
                })
              }
            })
          },
          fail: res => {
            wx.reLaunch({
              url: '/pages/pay/fail',
            })
          }
        })
      },
      fail: res => {
        wx.reLaunch({
          url: '/pages/pay/fail',
        })
      }
    })
  },
  open: function () {
    var that = this
    $wuxKeyBoard().show({
      titleText: '请输入密码',
      inputText: 'Input Password',
      disorder: false,
      onClose(value) {
        that.setData({ payPassword: value })
        if(that.data.payPassword!=app.globalData.password){
          wx.showToast({
            title: '密码错误',
            icon:'none'
          })
          this.timeout = setTimeout(that.open, 500)
        }else{
          app.globalData.balance -= app.globalData.bill
          app.globalData.number = app.getNumber()
          that.doSomething()
        }
      }
    })
  },
  confirmPay:function(){
    var that = this
      wx.checkIsSoterEnrolledInDevice({
        checkAuthMode: 'fingerPrint',
        success(res){
          if(res.isEnrolled){
            wx.startSoterAuthentication({
              requestAuthModes: ['fingerPrint'],
              challenge: app.getNumber(),
              authContent: '请验证指纹',
              success(res){
                app.globalData.balance -= app.globalData.bill
                app.globalData.number = app.getNumber()
                that.doSomething()
              },fail(res){
                that.open()
              }
            })
          }else{
            that.open()
          }
        }
      })  
  }
});