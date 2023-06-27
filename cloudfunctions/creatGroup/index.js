// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'alienspartner-001' })
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('group').add({
      data:
      {
        courseId:event.id,
        openid:event.openid,
        count:2,
        member:[event.launcher,event.me],
        price:event.price,
        theme:event.theme,
        address:event.address,
        endDate:event.endDate,
        grade:event.grade,
        startDate:event.startDate,
        subject:event.subject,
        time:event.time,
        latitude:event.latitude,
        longitude:event.longitude,
        classroomId:event.classroomId
      }
    })
  } catch (e) {
    console.error(e)
  }
}