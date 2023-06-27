Page({
  data: {
    latitude: 0,
    longitude: 0,
    speed: 0,
    accuracy: 0,
    altitude: 0,
    horizontalAccuracy: 0,
    verticalAccuracy:0
  },
  getLocation:function(){
    wx.showLoading({
      title: '请稍后',
      mask:true
    })
    var that = this
    wx.getLocation({
      alitude:"true",
      isHighAccuracy:true,
      highAccuracyExpireTime:5000,
      success(res) {
        that.setData({latitude:res.latitude,
        longitude:res.longitude,
        speed:res.speed,
        accuracy:res.accuracy,
        altitude:res.altitude,
        horizontalAccuracy:res.horizontalAccuracy,
        verticalAccuracy:res.verticalAccuracy
        })
        if(res.altitude==undefined){
          that.setData({altitude:'无法获取高度信息'})
        }
        if(res.verticalAccuracy==0){
          that.setData({verticalAccuracy:'Android无法获取垂直精度'})
        }
        wx.hideLoading()
      },
      fail(res){
        wx.showToast({
          title: '网络超时',
          mask:true,
          duration:3000,
          icon:'none'
        })
      }
    })

  }
})