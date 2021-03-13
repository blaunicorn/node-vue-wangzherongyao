module.exports = options => {
    //引用校验token
    const jwt = require('jsonwebtoken')
    //调用assert来返回错误
    const assert = require('http-assert')
    // 单独引入 AdminUser模型，供后期调用
    const AdminUser = require('../models/AdminUser')
    return async (req, res, next) => {
        const token = String(req.headers.authorization || '').split(' ').pop()
        assert(token, 401, '请提供jwt token 1')
        console.log(222, token, req.app.get('secret'))
        const { id } = jwt.verify(token, req.app.get('secret'), (err, data) => {
            console.log(err, data)
            if (err) {
                return { id: null }
            }
            return data
        })
        console.log('id', id)
        assert(id, 401, '无效的jwt token 2')
        req.user = await AdminUser.findById(id)
        assert(req.user, 401, '请先登陆3')
        console.log(req.user)
        await next()
    }
}