const app = getApp()
Page({
  data: {
    name:''
  },
  changeName: function (e) {
    this.setData({ name: e.detail.value })
  },
  next:function(e){
    if(this.data.name.length<2){
      wx.showToast({
        title: '请认真填写',
        icon:'none'
      })
    }else{
      app.globalData.name=this.data.name
      wx.navigateTo({
        url: '/pages/pay/phone',
      })
    }
  }
});