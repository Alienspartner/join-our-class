const cloud = require('wx-server-sdk')

cloud.init({ env: 'alienspartner-001' })
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('group').where({
      courseId:event.id,
      openid:event.openid
    }).update({
      data: {
        member: _.push([event.me]),
        count: _.inc(1)
      }
    })
  } catch (e) {
    console.error(e)
  }
}