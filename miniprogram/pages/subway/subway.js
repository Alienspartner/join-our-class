const app = getApp()
Page({
  data: {

  },
  onLoad: function () {
    let plugin = requirePlugin("subway");
    let key = app.globalData.key[Math.floor(Math.random() * 5)];
    let referer = '阿契夫';
    wx.redirectTo({
      url: 'plugin://subway/index?key=' + key + '&referer=' + referer
    });
  }
})