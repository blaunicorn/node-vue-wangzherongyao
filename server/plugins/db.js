// 数据库插件 要求必须是个函数，接收一个参数app
module.exports = app => {
    let secret_test = null
    if (process.env.NODE_ENV === 'development') {
        console.log('开发环境')
        secret_test = 'afafsafsd'
    } else {
        console.log('正式环境')
        secret_test = '11111'
    }
    app.secret_test = secret_test
    // 引入MongoDB数据库
    const mongoose = require('mongoose')
    // 联接数据库
    mongoose.connect('mongodb://127.0.0.1:27017/node-vue-moba', {
        useNewUrlParser: true,
        useFindAndModify: true,
        useCreateIndex: true,
    })
}