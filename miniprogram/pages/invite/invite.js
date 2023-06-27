const app = getApp()
Page({
  data:{
    exist:false
  },
  onLoad(res){
    if (res.id != undefined && res.id != '') {
      let info = res.id.split(',')
      this.setData({ info: info })
      if(this.data.info[1]==app.globalData.openid){
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
    }
  },
  agree:function(){
    var that = this
    wx.showModal({
      title: '提示',
      content: '需要消耗10点智力才能参团哦~',
      confirmText:'同意',
      cancelText:'拒绝',
      success:function(res){
        if(res.confirm){
          if(app.globalData.balance>=10){
            const db = wx.cloud.database({ env: 'alienspartner-001' })
            db.collection('group').where({
              courseId: that.data.info[0],
              openid: that.data.info[1]
            }).get({
              success: function (res) {
                if (res.data[0] == undefined) {
                    that.creatGroup()
              }
               else {
                  let list = res.data[0].member
                  for (let i = 0; i < list.length; i++) {
                    if (list[i] == app.globalData.openid) {
                      that.setData({ exist: true })
                      break
                    }
                  }
                  if (that.data.exist == false) {
                    that.enterGroup()
                  } 
                  else {
                    that.setData({ exist: false })
                    wx.showModal({
                      title: '提示',
                      content: '你已经参加过了哦~',
                      confirmText: '确定',
                      cancelText: '返回',
                      success: function (res) {
                        wx.reLaunch({
                          url: '/pages/index/index',
                        })
                      }
                    })
                  }
                }
              }
            })
          }else{
            wx.showToast({
              title: '智力不足',
              icon:'none'
            })
          }
        }
      }
    })
  },
  deny:function(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  creatGroup: function () {
    wx.showLoading({
      title: '请稍后',
      mask: true
    })
    var that = this
    wx.cloud.callFunction({
      name: 'creatGroup',
      data: {
        id: that.data.info[0],
        openid: that.data.info[1],
        launcher: that.data.info[1],
        me: app.globalData.openid,
        price: parseInt(that.data.info[5]),
        theme:that.data.info[8],
        address:that.data.info[2],
        endDate: that.data.info[3],
        grade: that.data.info[4],
        startDate: that.data.info[6],
        subject: that.data.info[7],
        time: that.data.info[9],
        latitude:parseFloat(that.data.info[10]),
        longitude:parseFloat(that.data.info[11]),
        classroomId:that.data.info[12]
      },
      success: res => {
        wx.cloud.callFunction({
          name: 'balance',
          data: {
            balance: 10,
            openid:app.globalData.openid
          }, success: res => {
            app.globalData.balance -= 10
            wx.showToast({
              title: '加入成功',
            })
            wx.reLaunch({
              url: '/pages/index/index',
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
  enterGroup: function () {
    wx.showLoading({
      title: '请稍后',
      mask: true
    })
    var that = this
    wx.cloud.callFunction({
      name: 'enterGroup',
      data: {
        id: that.data.info[0],
        openid: that.data.info[1],
        me: app.globalData.openid
      },
      success: res => {
        wx.cloud.callFunction({
          name:'balance',
          data:{
            balance:10,
            openid:app.globalData.openid
          },success:res=>{
            app.globalData.balance-=10
            wx.showToast({
              title: '加入成功',
            })
            wx.reLaunch({
              url: '/pages/index/index',
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
});