const app = getApp()
Page({
    data: {
        list: [
            {
                id: 'group',
                name: '学习小组',
                open: false,
                pages: [{ch:'我发起的',en:'groupCreated'},{ch:'我加入的',en:'groupJoined'}]
            },
            {
                id: 'map',
                name: '地图工具',
                open: false,
              pages: [{ ch: '地铁路线', en: 'subway' }, { ch: '获取定位', en: 'position' }]
            },
            {
                id: 'myIQ',
                name: '我的智力',
                open: false,
              pages: [{ ch: '提升智力', en: 'charge' }, { ch: '课程历史', en: 'order' }]
            },
            {
                id: 'setting',
                name: '信息设置',
                open: false,
                pages: [{ch:'默认地区',en:'Location'},{ch:'安全密码',en:'Password'}]
            },
            {
                id: 'about',
                name: '关于软件',
                open: false,
              pages: [{ ch: '软件许可及服务协议', en: 'article' }]
            }
        ]
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
    kindToggle: function (e) {
        var id = e.currentTarget.id, list = this.data.list;
        for (var i = 0, len = list.length; i < len; ++i) {
            if (list[i].id == id) {
                list[i].open = !list[i].open
            } else {
                list[i].open = false
            }
        }
        this.setData({
            list: list,
            exist:false,
            info:[]
        });
    }
});
