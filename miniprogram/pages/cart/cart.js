const app = getApp()
Page({
  data: {
    cart:[],      
    emptyCart:[],
    floorstatus: false
  },
  onPullDownRefresh(){
    this.getCart()
  },
  onShow(){
    this.setData({cart:app.globalData.cart})
    if (this.data.cart.length == 0) {
      wx.showToast({
        title: '暂无收藏',
        icon: 'none'
      })
    }
  },
  onShareAppMessage(res) {
    if (res.from == 'button') {
    }
    return {
      title: '有了这个小程序，妈妈再也不用担心我的学习了！',
      path: '/pages/index/index',
      imageUrl: '/images/math.png'
    }
  },
  onPageScroll: function (e) {
    if (e.scrollTop > 1000) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  route: function (res) {
    let id = res.target.dataset.id
    let latitude = res.target.dataset.latitude
    let longitude = res.target.dataset.longitude
    app.route(id, latitude, longitude)
  },
  pay:function(e){
    app.globalData.merchandise = e.currentTarget.dataset.merchandise
    app.globalData.bill = e.currentTarget.dataset.merchandise.price
    app.globalData.id = e.currentTarget.dataset.merchandise._id
    var that = this
    if(app.globalData.balance<app.globalData.bill){
      wx.showToast({
        title: '智力不足',
        icon: 'none'
      })
    }else{
      wx.requestSubscribeMessage({//申请订阅支付成功通知
        tmplIds: ['j1jpuIHs-HHOD0HXcCcoXYQQe1nZUdVX0uNyCFXGlAw'],
        success(res) {
          if (res["j1jpuIHs-HHOD0HXcCcoXYQQe1nZUdVX0uNyCFXGlAw"] == "accept") {
            wx.navigateTo({
              url: '/pages/pay/name',
            })
          }
          else {
            wx.showToast({
              title: '请允许订阅申请',
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
  },
  //确认移除商品
  confirmRemove: function (e) {
    let course = e.currentTarget.dataset.course
    let id = e.currentTarget.dataset.course._id
    var that = this
    wx.showLoading({
      title: '请稍后',
      mask: true
    })
    let cart = that.data.cart;
        wx.cloud.callFunction({
          name: 'removeFromCart',
          data: {
            openid: app.globalData.openid,
            merchandise:course
          },
          success: res => {
            for(let i=0;i<cart.length;i++){
                if(cart[i]._id==id){
                  cart.splice(i, 1);
                  break;
                }        
            }
            that.setData({ cart: cart });
            app.globalData.cart = cart
            wx.showToast({
              title: '移除成功',
            })
            if (that.data.cart.length == 0) {
              wx.showToast({
                title: '暂无收藏',
                icon: 'none'
              })
            }
          },
          fail: err => {
            wx.showToast({
              title: '网络错误',
              duration: 3000,
              mask: true,
              icon: 'none'
            })
          }
        })
  },
  
  getCart:function(){
    wx.showLoading({
      title: '',
      mask:true
    })
    var that = this
    const db = wx.cloud.database({ env: 'alienspartner-001' })
    db.collection('userInfo').where({
      _openid:app.globalData.openid
    }).get({
      success: function (res) {
        that.setData({cart:res.data[0].cart})
        app.globalData.cart=res.data[0].cart
        app.globalData.balance=res.data[0].balance
        let cart=res.data[0].cart;
        wx.stopPullDownRefresh()
        wx.hideLoading()
        if (that.data.cart.length == 0) {
          wx.showToast({
            title: '暂无收藏',
            icon: 'none'
          })
         }
      } 
    })
  },
  confirmEmpty:function(){
    if(this.data.cart.length==0){
      wx.showToast({
        title: '暂无收藏',
        icon: 'none'
      })
    }else{
      var that = this
      wx.showModal({
        title: '确认',
        content: '确定清空收藏吗？',
        confirmText: "确定",
        cancelText: "取消",
        success: function (res) {
          if (res.confirm) {
            wx.showLoading({
              title: '请稍后',
            })
            wx.cloud.callFunction({
              name: 'emptyCart',
              data: {
                openid: app.globalData.openid,
                emptyCart: that.data.emptyCart
              },
              success: res => {//调用成功
                app.globalData.cart=[]
                that.setData({
                  cart: [],
                });
                wx.showToast({
                  title: '清空成功',
                })
              },
              fail: err => {
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
      });
    }
  }
});