const cloud = require('wx-server-sdk')
cloud.init({
  env: 'alienspartner-001'
})
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('chargeCode').where({
      code: event.code
    }).remove()
  } catch (e) {
    console.error(e)
  }
}