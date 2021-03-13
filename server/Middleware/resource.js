module.exports = options => {
    // return 和 async不能换行，如果换行 返回的就是空
    return async (req, res, next) => {
        //  放在前置的中间件内，请求时会先用async处理 url
        const modelName = require('inflection').classify(req.params.resource) // 通用crud时，转类名转为大写单数
        const Model = require(`../models/${modelName}`) // 通用crud时，增加通用模型
        console.log(modelName, Model)
        // req.Model是在请求对象上挂载Model属性
        req.Model = Model
        next()
    }

}