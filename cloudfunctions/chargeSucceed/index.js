const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openid,
      page: '/pages/index/index',
      lang: 'zh_CN',
      data: {
        character_string1: {
          value: event.number
        },
        thing6: {
          value: '智力提升'
        },
        amount3: {
          value: event.money
        },
        date4: {
          value: event.date
        },
        thing5: {
          value: '智力码已销毁，请勿重复使用'
        }
      },
      templateId: 'cOhuyM2rQr1vJ40xZnxVVnjY5yGFTFxGGqT73aBreRo'
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}