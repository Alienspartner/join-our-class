const app = getApp()
Page({
  data: {
    group: [],
    title: '有了这个小程序，妈妈再也不用担心我的学习了！',
    info: '',
    imageUrl: '/images/math.jpg',
    floorstatus: false
  },
  //监听页面加载
  onPullDownRefresh() {
    this.getGroup()
  },
  onReachBottom: function () {
    if (this.data.group_num >= 20) {
      wx.showLoading({
        mask: true
      })
      let x = this.data.group_num
      let old_data = this.data.group
      const db = wx.cloud.database({ env: 'alienspartner-001' })
      db.collection('group').orderBy('time', 'desc').where({
        member: app.globalData.openid
      }).skip(x)
        .get()
        .then(res => {
          if (res.data.length == 0) {
            wx.showToast({
              title: '暂无更多团队',
              icon: 'none'
            })
          } else {
            var that = this
            let new_data = res.data
            for (let i = 0; i < new_data.length; i++) {
              if (new_data[i].count >= 4 && new_data[i].count < 8) {
                new_data[i].priceNow = new_data[i].price * 0.9
              } else if (group[i].count >= 8) {
                new_data[i].priceNow = new_data[i].price * 0.85
              } else {
                new_data[i].priceNow = new_data[i].price
              }
            }
            that.setData({
              group: old_data.concat(new_data),
              group_num: x + res.data.length
            })
            wx.hideLoading()
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
  },
  onLoad(){
    this.getGroup()
  },
  onShareAppMessage(res) {
    if (res.from == 'button') {
      let info = res.target.dataset.info.courseId + ',' + res.target.dataset.info.openid + ',' + res.target.dataset.info.address + ',' + res.target.dataset.info.endDate + ',' + res.target.dataset.info.grade + ',' + res.target.dataset.info.price + ',' + res.target.dataset.info.startDate + ',' + res.target.dataset.info.subject + ',' + res.target.dataset.info.theme + ',' + res.target.dataset.info.time + ',' + res.target.dataset.info.latitude + ',' + res.target.dataset.info.longitude + ',' + res.target.dataset.info.classroomId
      this.setData({
        info: info,
        title: '我发现了一个优秀课程，快和我一起组团享优惠吧！'
      })
    }
    return {
      title: this.data.title,
      path: '/pages/invite/invite?id=' + this.data.info,
      imageUrl: this.data.imageUrl
    }
  },
  route: function (res) {
    let id = res.target.dataset.id
    let latitude = res.target.dataset.latitude
    let longitude = res.target.dataset.longitude
    app.route(id, latitude, longitude)
  },
  toCourse: function () {
    app.globalData.refreshCourse = true
    wx.reLaunch({
      url: '/pages/course/course',
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
 
  getGroup: function () {
    wx.showLoading({
      title: '',
      mask: true
    })
    var that = this
    const db = wx.cloud.database({ env: 'alienspartner-001' })
    db.collection('group').where({
      member: app.globalData.openid
    }).get({
      success: function (res) {
        let group = res.data
        for (let i = 0; i < group.length; i++) {
          if (group[i].count >= 4 && group[i].count < 8) {
            group[i].priceNow=group[i].price*0.9
          } else if (group[i].count >= 8) {
            group[i].priceNow=group[i].price*0.85
          }else{
            group[i].priceNow = group[i].price
          }
        }
        that.setData({ group: group ,group_num:res.data.length})
        wx.stopPullDownRefresh()
        wx.hideLoading()
        if (res.data[0] == undefined) {
          wx.showToast({
            title: '暂无团队',
            icon: 'none'
          })
        }
      }
    })
  },
  pay: function (e) {
    var that = this
    app.globalData.merchandise = e.currentTarget.dataset.merchandise
    app.globalData.id = e.currentTarget.dataset.merchandise.courseId;//当前商品id
    let openid = e.currentTarget.dataset.merchandise.openid;
    let group = that.data.group;
    if (openid == app.globalData.openid) {
      app.globalData.bill = app.globalData.merchandise.priceNow;
    } else {
      app.globalData.bill = app.globalData.merchandise.priceNow - 10;
    }
    if (app.globalData.balance < app.globalData.bill) {
      wx.showToast({
        title: '智力不足',
        icon: 'none'
      })
    } else {
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
});