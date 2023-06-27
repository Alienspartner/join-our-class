// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'alienspartner-001' })
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('userInfo').add({
      data:
      {
        _openid: event.openid,
        cart:[],
        balance:50,
        order:[],
        password:'',
        area:['北京市','北京市','东城区']
      }
    })
  } catch (e) {
    console.error(e)
  }
}