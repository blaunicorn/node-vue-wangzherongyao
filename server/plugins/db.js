// 数据库插件 要求必须是个函数，接收一个参数app
module.exports = app => {
    // 引入MongoDB数据库
    const mongoose = require('mongoose')
    // 联接数据库
    mongoose.connect('mongodb://127.0.0.1:27017/node-vue-moba', {
        useNewUrlParser: true,
        useFindAndModify: true,
        useCreateIndex: true,
    })
}