const app = getApp()
Page({
  data: {
    code:'',
    money:0,
    value:'',
    balance:0
  },
  onShow(){
    this.setData({
      balance:app.globalData.balance
    })
  },
  //监听页面显示
  onShareAppMessage(res) {
    if (res.from == 'button') {
    }
    return {
      title: '有了这个小程序，妈妈再也不用担心我的学习了！',
      path: '/pages/index/index',
      imageUrl: '/images/math.png'
    }
  },
  taobao:function(){
    wx.setClipboardData({
      data: 'fu植这行话￥pM4g18PCZeC￥转移至淘宀┡ē【阿契夫教育】；或https://m.tb.cn/h.VTfAgeG 掂击鏈→接，再选择瀏..覽..噐大开',
    })
    wx.showModal({
      title: '提示',
      content: '淘口令已复制，请打开手机淘宝进入店铺询问客服获取智力码！',
    })
  },
  //当地区选择器完成选择时
  changeCode: function (e) {
    this.setData({code:e.detail.value})
  },
  confirm:function(){
    var that = this
    if(that.data.code.length!=19||that.data.code[4]!='-'||that.data.code[9]!='-'||that.data.code[14]!='-'){
      wx.showToast({
        title: '智力码不合法',
        icon:'none'
      })
    }else{
      wx.requestSubscribeMessage({//申请订阅支付成功通知
        tmplIds: ['cOhuyM2rQr1vJ40xZnxVVnjY5yGFTFxGGqT73aBreRo'],
        success(res) {
          if (res['cOhuyM2rQr1vJ40xZnxVVnjY5yGFTFxGGqT73aBreRo'] == 'accept') {
            wx.showLoading({
              title: '正在检测',
              mask: true
            })
            const db = wx.cloud.database({ env: 'alienspartner-001' })
            db.collection('chargeCode').where({
              code: that.data.code
            }).get({
              success: function (res) {
                if (res.data[0] == undefined) {
                  wx.showToast({
                    title: '智力码不存在',
                    icon: 'none'
                  })
                } else {
                  wx.showLoading({
                    title: '请稍后',
                    mask: true
                  })
                  that.setData({ money: res.data[0].money })
                  wx.cloud.callFunction({
                    name: 'removeCode',
                    data: {
                      code: that.data.code
                    },
                    success: res => {
                      wx.cloud.callFunction({
                        name: 'charge',
                        data: {
                          openid: app.globalData.openid,
                          money: that.data.money
                        },
                        success: res => {
                          app.globalData.balance += that.data.money
                          that.setData({ balance: app.globalData.balance })
                          wx.cloud.callFunction({
                            name: 'chargeSucceed',
                            data: {
                              openid: app.globalData.openid,
                              number: app.getNumber(),
                              money: '¥' + that.data.money,
                              date: app.getDate(2)
                            },
                            success: res => {
                              wx.showToast({
                                title: '提升成功',
                              })
                              this.timeout = setTimeout(wx.navigateBack, 500)
                            },
                            fail: res => {
                              wx.showToast({
                                title: '网络错误',
                                duration: 3000,
                                mask: true,
                                icon: 'none'
                              })
                            }
                          })
                        },
                        fail: res => {
                          wx.showToast({
                            title: '网络错误',
                            duration: 3000,
                            mask: true,
                            icon: 'none'
                          })
                        }
                      })
                    },
                    fail: res => {
                      wx.showToast({
                        title: '网络错误',
                        duration: 3000,
                        mask: true,
                        icon: 'none'
                      })
                    }
                  })
                }
              }
            })
          } else {
            wx.showToast({
              title: '请允许订阅消息申请',
              icon: 'none'
            })
          }
        },
        fail(res) {
          wx.showToast({
            title: '订阅请求失败',
            icon: 'none'
          })
        }
      })
    }
  }
});