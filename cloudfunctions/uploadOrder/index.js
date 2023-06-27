const cloud = require('wx-server-sdk')

cloud.init({ env: 'alienspartner-001' })
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('order').where({
      _id: event.id
    }).update({
      data: {
        order: _.push([event.order]),
        total: _.inc(event.bill)
      }
    })
  } catch (e) {
    console.error(e)
  }
}