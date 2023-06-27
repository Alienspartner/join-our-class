const app = getApp()
Page({
  data:{
    grade:"",
    area:[],//默认当前地址为空
    array:['一年级','二年级','三年级','四年级','五年级','六年级','七年级','八年级','九年级','高一','高二','高三']
  },
  //监听页面显示
  onShow(){
    this.setData({area:app.globalData.area,grade:app.globalData.grade})//初始化当前地区为全局变量地区
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
  //当地区选择器完成选择时
  changeArea: function (e) {
    let value = e.detail.value;//当前选择的地区
    this.setData({ area: value });//设置data地区为当前选择的地区
  },
  changeGrade:function(e){
    let i = e.detail.value;
    let value = this.data.array[i];
    this.setData({ grade: value });
  },
  //当用户点击确定时的函数
  confirm:function(){
    app.globalData.area = this.data.area//刷新全局地区
    app.globalData.grade = this.data.grade
    app.globalData.refreshCourse=true//下次刷新商品列表
    wx.navigateBack({
      //返回上一页
    })
  }
});