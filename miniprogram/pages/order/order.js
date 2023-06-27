const app = getApp()
Page({
  data: {
    order: [],
    floorstatus: false
  },
  //监听页面加载
  onPullDownRefresh() {
    this.getOrder()
  },
  onLoad(){
    this.getOrder()
  },
  service:function(){
    wx.showModal({
      title: '提示',
      content: '请关注小程序关联的微信公众号',
    })
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
  route: function (res) {
    let id = res.target.dataset.id
    let latitude = res.target.dataset.latitude
    let longitude = res.target.dataset.longitude
    app.route(id, latitude, longitude)
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
  onShareAppMessage(res) {
    if (res.from == 'button') {
    }
    return {
      title: '有了这个小程序，妈妈再也不用担心我的学习了！',
      path: '/pages/index/index',
      imageUrl: '/images/math.png'
    }
  },
 
  getOrder: function () {
    wx.showLoading({
      title: '',
      mask:true
    })
    var that = this
    const db = wx.cloud.database({ env: 'alienspartner-001' })
    db.collection('userInfo').where({
      _openid: app.globalData.openid
    }).get({
      success: function (res) {
        app.globalData.order=res.data[0].order
        app.globalData.balance = res.data[0].balance
        let order = res.data[0].order;
        for (let i = 0; i < order.length; i++) { 
          if (order[i].openid != app.globalData.openid && order[i].openid != undefined) {
            order[i].priceNow += 10
          }
        }
        that.setData({order:order})//刷新本地价格
        wx.stopPullDownRefresh()
        wx.hideLoading()
        if (that.data.order.length == 0) {
          wx.showToast({
            title: '暂无课程记录',
            icon: 'none'
          })
        }
      }
    })
  }
});