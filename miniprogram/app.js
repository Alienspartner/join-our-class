const app = getApp()
App({
  //初始化函数
  onGetOpenid: function () {
    wx.showLoading({
      title: '初始化',
      mask:true
    })
    var that = this
    wx.cloud.init()//初始化云端
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        this.globalData.openid = res.result.openid//成功回调，设置全局变量openid
        const db = wx.cloud.database({ env: 'alienspartner-001' })
        db.collection('userInfo').where({
          _openid: this.globalData.openid // 填入全局变量openid
        }).get({
          success: function (res) {
            wx.showToast({
              title: '初始化完成',
            })
            if (res.data[0] == undefined) {//如果未找到当前用户信息，说明是第一次登录
              that.creatAccount()//自动创建账户
            }
            else {//如果当前用户信息已存在
              that.globalData.area = res.data[0].area
              that.globalData.balance = res.data[0].balance
              that.globalData.password = res.data[0].password
              that.globalData.cart = res.data[0].cart
              that.globalData.order = res.data[0].order
            }
          }
        })
      },
      fail: err => {//调用失败
      wx.hideLoading()
        wx.showModal({
          title: '初始化失败',
          content: '请检查网络设置，然后重试！',
          confirmText:'重试',
          success: function (res) {
            that.onGetOpenid()
          }
        })
      }
    })
  },
  //更新小程序
  update:function(){
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  //创建账户函数
  creatAccount:function(){
      var that = this
      wx.showLoading({
        title: '正在设置',
        mask:true
      })
      wx.cloud.callFunction({
        name: 'creatAccount',
        data: {
          openid: that.globalData.openid
        },
        success:res=>{
          wx.showToast({
            title: '设置成功',
          })
        },
        fail:res=>{
          wx.hideLoading()
          wx.showModal({
            title: '设置失败',
            content: '请检查网络设置，然后重试！',
            confirmText: '重试',
            success: function (res) {
              that.creatAccount()
            }
          })
        }
      })
  },
    onLaunch: function () {
     this.update()//请求更新
     this.onGetOpenid()//获取openid以及用户相关信息
    },
    onShow: function () {
        console.log('App Show')
    },
    onHide: function () {
        console.log('App Hide')
    },
    //获取当前日期函数
  getDate:function(format) {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth()+1;
    var date = now.getDate();
    var day = now.getDay();
    var hour = now.getHours();
    var minu = now.getMinutes();
    var sec = now.getSeconds();
    var _time;
    if(format== 1){
  _time = year + "-" + month + "-" + date
}
    else if (format == 2) {
  _time = year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + sec
}
return _time
},
getNumber:function(){
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth()+1;
  var date = now.getDate();
  var day = now.getDay();//得到周几
  var hour = now.getHours();//得到小时
  var minu = now.getMinutes();//得到分钟
  var sec = now.getSeconds();//得到秒
  var number='';
  for(let i=0;i<6;i++){
    number+=Math.floor(Math.random()*10).toString();
  }
  return year.toString()+month.toString()+date.toString()+day.toString()+hour.toString()+minu.toString()+sec.toString()+number
},
  route: function (id,latitude,longitude) {
    let plugin = requirePlugin('routePlan');
    let key = this.globalData.key[Math.floor(Math.random() * 5)];  //使用在腾讯位置服务申请的key
    let referer = '阿契夫';   //调用插件的app的名称
    let endPoint = JSON.stringify({  //终点
      'name': '阿契夫' + id + '号教室',
      'latitude': latitude,
      'longitude': longitude
    });
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint + '&navigation=1'
    });
  },
    //当前全局变量number,merchandise
    globalData: {
        area: [],
        balance:50,
        password:'',
        cart:[],
        order:[],
        grade:'高三',
        refreshCourse:true,
      key: ['YERBZ-5QMN4-MCAUD-XMYFS-TRYUK-JXBBS', 'WXQBZ-ZYNEK-25SJY-AOIUY-UYDAZ-W7FTD', 'ALFBZ-BNE63-MJP36-Y2PNJ-SE4JO-5EFCN', 'ZCOBZ-B5E6P-EANDU-VTAUI-ETVZJ-GMFCJ','JDABZ-DGUL2-YTBUR-C2GE7-VDRCV-ZJFKG']
    }
});