const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: { type: String },
    password: {
        type: String,
        required: true,
        select: false,//防止查询出密码，此时前端查询返回的密码值为空
        set(val) {
            // 散列同步方法,第二个参数为加密指数
            return require('bcryptjs').hashSync(val, 12)
        }
    }
})

module.exports = mongoose.model('AdminUser', schema)