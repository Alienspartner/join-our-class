const app = getApp()
Page({
  data: {
    area:[]//地区
  },
  //监听页面显示
  onShow() {
    this.setData({ area: app.globalData.area })//为了显示地区
  },
  //地区选择器选择完成后
  changeArea: function (e) {
    let value = e.detail.value;
    this.setData({ area: value });//设置地区为当前选择地区并显示
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
  //用户点击确认后函数
  confirm: function () {
    wx.showLoading({
      title: '正在设置',
      mask:true
    })
    var that = this
    app.globalData.area = that.data.area//设置全局变量地区为当前所选地区
    wx.cloud.callFunction({
      name:'setArea',
      data:{
        openid:app.globalData.openid,
        area:app.globalData.area},
      success: res => {
        wx.showToast({
          title: '设置成功',
        })
        app.globalData.refreshCourse=true//下次刷新课程列表
        this.timeout=setTimeout(wx.navigateBack,500)//500ms后返回上一页
      },
      fail: err => {
        wx.showToast({
          title: '网络错误',
          duration:3000,
          mask:true,
          icon: 'none'
        })
      }
    })
  }
});