const app = getApp()
Page({
  data: {
    phone: ''
  },
  changePhone: function (e) {
    this.setData({ phone: e.detail.value })
  },
  next: function (e) {
    if (this.data.phone.length!=11) {
      wx.showToast({
        title: '请认真填写',
        icon: 'none'
      })
    } else {
      app.globalData.phone = this.data.phone
      wx.navigateTo({
        url: '/pages/pay/form',
      })
    }
  }
});