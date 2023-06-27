const cloud = require('wx-server-sdk')

cloud.init({ env: 'alienspartner-001' })
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('userInfo').where({
      _openid: event.openid
    }).update({
      data: {
        balance: _.inc(event.money)
      }
    })
  } catch (e) {
    console.error(e)
  }
}