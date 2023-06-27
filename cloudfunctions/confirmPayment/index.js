const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openid,
      page: '/pages/index/index',
      lang: 'zh_CN',
      data: {
        number1: {
          value: event.number
        },
        thing2: {
          value: '线下课程'
        },
        amount3: {
          value: event.bill
        },
        phrase4: {
          value: '在线支付'
        },
        date5:{
          value:event.date
        }
      },
      templateId: 'j1jpuIHs-HHOD0HXcCcoXYQQe1nZUdVX0uNyCFXGlAw'
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}