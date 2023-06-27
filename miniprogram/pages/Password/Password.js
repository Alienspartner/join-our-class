import { $wuxKeyBoard } from '../../components/index'
const app = getApp()
Page({
  data: {
    passwordOne:'',
    passwordTwo:'',
    titleOne:'Password Modification',
    titleTwo:'修改密码',
    buttonFunc:'openOriginal',
    buttonText:'再次修改'
  },
  onShow() {
    if(app.globalData.password==''){//如果设置密码
      this.setData({titleOne:'Password Setting',titleTwo:'密码设置',buttonFunc:'openNew',buttonText:'再次设置'})
      this.openNew()//打开新密码输入框
    }else{
      this.openOriginal()//打开验证旧密码框
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
  openOriginal: function () {
    var that = this
    $wuxKeyBoard().show({
      titleText: '请输入原密码',
      inputText: 'Original Password',
      disorder: false,
      onClose(value) {
        if(value!=app.globalData.password){
          wx.showToast({
            title: '密码错误',
            icon: 'none'
          })
          this.timeout = setTimeout(that.openOriginal, 500)//500ms后打开验证旧密码框
        }
        else{
          this.timeout = setTimeout(that.openNew,500)//500ms后打开新密码输入框
        }
      }
    })
  },
  openNew: function () {
    var that = this
    $wuxKeyBoard().show({
      titleText: '请输入新密码',
      inputText: 'New Password',
      disorder: false,
      onClose(value) {
        that.setData({ passwordOne: value })
        this.timeout = setTimeout(that.openNewAgain, 500)
      }
    })
  },
  openNewAgain: function () {
    var that = this
    $wuxKeyBoard().show({
      disorder: false,
      titleText: '请确认新密码',
      inputText: 'Confirm Password',
      onClose(value) {
        that.setData({ passwordTwo: value })
        if (that.data.passwordOne != that.data.passwordTwo) {
          wx.showToast({
            title: '密码确认失败',
            icon: 'none'
          })
          this.timeout = setTimeout(that.openNew, 500)
        } else {
          wx.showLoading({
            title: '正在设置',
            mask:true
          })
          app.globalData.password = that.data.passwordOne
          wx.cloud.callFunction({
            name: 'setPassword',
            data: {
              openid: app.globalData.openid,
              password: app.globalData.password
            },
            success: res => {
              wx.showToast({
                title: '设置成功',
              })
              this.timeout = setTimeout(wx.navigateBack, 500)
            },fail:res=>{
              wx.showToast({
                title: '网络错误',
                duration: 3000,
                mask: true,
                icon: 'none'
              })
            }
          })
        }
      },
    })
  }
});