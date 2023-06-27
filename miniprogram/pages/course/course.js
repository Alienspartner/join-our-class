const app = getApp()
Page({
  data:{
    merchandise:[],
    merchandise_num:0,
    cart:[],
    exist:false,
    area:[],
    grade:'',
    floorstatus: false,
    title:'有了这个小程序，妈妈再也不用担心我的学习了！',
    info:'',
    imageUrl: '/images/math.jpg'
  },
  //监听页面加载
  onPullDownRefresh(){
    this.getMerchandise()
  },
  onReachBottom: function () {
      if(this.data.merchandise_num>=20){
        wx.showLoading({
          mask: true
        })
        let x = this.data.merchandise_num
        let old_data = this.data.merchandise
        const db = wx.cloud.database({ env: 'alienspartner-001' })
        db.collection('course').orderBy('time', 'desc').where({
          area: app.globalData.area,
          grade: app.globalData.grade
        }).skip(x)
          .get()
          .then(res => {
            if(res.data.length==0){
              wx.showToast({
                title: '暂无更多课程',
                icon:'none'
              })
            }else{
              this.setData({
                merchandise: old_data.concat(res.data),
                merchandise_num: x + res.data.length
              })
              wx.hideLoading()
            }
          })
          .catch(err => {
            console.error(err)
          })
      }
  },
  //监听页面显示
  onShow(){
      this.setData({ 
      balance: app.globalData.balance, 
      area: app.globalData.area,
      grade: app.globalData.grade,
      cart:app.globalData.cart })
      if(app.globalData.refreshCourse){
        this.getMerchandise()
      }
  },
  onShareAppMessage(res){
    if(res.from=='button'){
      let info = res.target.dataset.info._id + ',' + app.globalData.openid + ',' + res.target.dataset.info.address + ',' + res.target.dataset.info.endDate + ',' + res.target.dataset.info.grade + ',' + res.target.dataset.info.price + ',' + res.target.dataset.info.startDate + ',' + res.target.dataset.info.subject + ',' + res.target.dataset.info.theme + ',' + res.target.dataset.info.time + ',' + res.target.dataset.info.latitude + ','+res.target.dataset.info.longitude+','+res.target.dataset.info.classroomId
      this.setData({info:info,
      title:'我发现了一个优秀课程，快和我一起组团享优惠吧！'})
    }
    return{
      title:this.data.title,
      path:'/pages/invite/invite?id='+this.data.info,
      imageUrl:this.data.imageUrl
      }
  },
  route:function(res){
    let id = res.target.dataset.id
    let latitude = res.target.dataset.latitude
    let longitude = res.target.dataset.longitude
    app.route(id,latitude,longitude)
  },
  filter:function(){
    wx.navigateTo({
      url: '/pages/selectArea/selectArea',
    })
  },
 
  getMerchandise:function(){
    wx.showLoading({
      title: '',
      mask:true
    })
    var that = this
    const db = wx.cloud.database({ env: 'alienspartner-001' })
    db.collection('course').where({
      area:app.globalData.area,
      grade:app.globalData.grade
    }).get({
      success: function (res) {
        app.globalData.refreshCourse=false
        that.setData({ merchandise: res.data,merchandise_num:res.data.length})
        wx.stopPullDownRefresh()
        wx.hideLoading()
        if(res.data[0]==undefined){
          wx.showToast({
            title: '暂无课程',
            icon:'none'
          })
        }
      }
    })
  },
  
  addToCart:function(e){
    var that = this
    let id = e.currentTarget.dataset.course._id;
    let merchandise = e.currentTarget.dataset.course;
    let cart=that.data.cart;
    for(let j=0;j<cart.length;j++){
      if(cart[j]._id==id){
        that.setData({exist:true})
        break;
      }
    }
    if(that.data.exist==false){
      wx.showLoading({
        title: '请稍后',
        mask:true
      })
          wx.cloud.callFunction({
            name: 'addToCart',
            data: {
              openid: app.globalData.openid,
              merchandise: merchandise
            },
            success: res => {
              cart.push(merchandise);
              that.setData({cart:cart})
              app.globalData.cart=cart
              wx.showToast({
                title: '收藏成功',
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
          },
        )
    }
    else{
      wx.showToast({
        title: '已收藏该课程',
        icon:'none'
      })
      that.setData({exist:false})
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
  }
});