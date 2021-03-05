// 具体路由
// 导出一个函数
module.exports = app => {
    const express = require('express')
    // express的子路由
    const router = express.Router()
    // 引入模型
    const Category = require('../../models/Category')
    // 增加
    router.post('/categories', async (req, res) => {
        // 把数据存入数据库

        const model = await Category.create(req.body)
        //  发回客户端，让客户端知道创建完成，同时创建的数据是什么，下一步去前端发起请求
        res.send(model)

    })
    // 查全部
    router.get('/categories', async (req, res) => {
        // console.log(req.query)
        const limit = +req.query.limit || 10
        const model = await Category.find().populate('parent').limit(limit) // 同时取出关联字段，关联字段就可以变成个对象
        // const model = await Category.find().limit(limit)
        res.send(model)
    })
    // 根据id查询
    router.get('/categories/:id', async (req, res) => {
        // console.log(req.query)
        const limit = +req.query.limit || 10
        const model = await Category.findById(req.params.id).limit(limit)
        res.send(model)
    })
    // 根据id修改
    router.put('/categories/:id', async (req, res) => {
        // console.log(req.query)
        const model = await Category.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })
    // 根据id修改
    router.delete('/categories/:id', async (req, res) => {
        // console.log(req.query)
        const model = await Category.findByIdAndDelete(req.params.id, req.body)
        res.send({
            model,
            success: true
        })
    })

    // 把子路由挂载到app上
    app.use('/admin/api', router)
}