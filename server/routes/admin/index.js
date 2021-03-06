// 具体路由
// 导出一个函数
module.exports = app => {
    const express = require('express')
    // express的子路由
    const router = express.Router({
        mergeParams: true  // 通用crud时，合并URL参数 增加允许把获取到的req参数合并到路由里取
    })
    // 引入模型
    // const Category = require('../../models/Category') // 通用crud时，去掉对应的固定模型

    // 增加
    router.post('/', async (req, res) => {
        // 把数据存入数据库

        // const Model = require(`../../models/${req.params.resource}`) // 通用crud时，增加通用模型，需要把${req.params.resource} 转化为类名既大写单数形式
        const model = await req.Model.create(req.body) // 把所有Category替换为req.Model
        // const model = await Category.create(req.body)
        //  发回客户端，让客户端知道创建完成，同时创建的数据是什么，下一步去前端发起请求
        res.send(model)

    })
    // 查列表
    router.get('/', async (req, res) => {
        console.log(req.params)
        // //  放在前置的中间件内
        // const modelName = require('inflection').classify(req.params.resource) // 通用crud时，转类名转为大写单数
        // const Model = require(`../../models/${modelName}`) // 通用crud时，增加通用模型
        // const Model = require(`../../models/${req.params.resource}`) // 通用crud时，增加通用模型
        const limit = +req.query.limit || 10
        // npm i inflection 此插件可以负责单复数的转换
        // 优化阶段，可以把populate关联取出
        const queryOptions = {}
        if (req.Model.modelName === 'Category') {
            queryOptions.populate = 'parent'
        }
        const model = await req.Model.find().setOptions({
            queryOptions
        }).limit(limit)
        // const model = await req.Model.find().populate('parent').limit(limit) // 同时取出关联字段，关联字段就可以变成个对象
        // const model = await req.Model.find().populate('parent').limit(limit) // 同时取出关联字段，关联字段就可以变成个对象
        // const model = await Category.find().populate('parent').limit(limit) // 同时取出关联字段，关联字段就可以变成个对象
        // const model = await Category.find().limit(limit)
        res.send(model)
    })
    // 根据id查询
    router.get('/:id', async (req, res) => {
        // console.log(req.query)
        const limit = +req.query.limit || 100
        const model = await req.Model.findById(req.params.id).limit(limit)
        res.send(model)
    })
    // 根据id修改
    router.put('/:id', async (req, res) => {
        // console.log(req.query)
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })
    // 根据id修改
    router.delete('/:id', async (req, res) => {
        // console.log(req.query)
        const model = await req.Model.findByIdAndDelete(req.params.id, req.body)
        res.send({
            model,
            success: true
        })
    })

    // 把子路由挂载到app上
    //  通用crud时， 修改为通用接口 增加/rest/:resource 去掉固定的/名，rest 是防止通用接口与其他接口产生冲突， resource可以是任意名 heros=》Hero items=》Item categories对应模型Category
    app.use('/admin/api/rest/:resource', async (req, res, next) => {
        //  放在前置的中间件内，请求时会先用async处理 url
        const modelName = require('inflection').classify(req.params.resource) // 通用crud时，转类名转为大写单数
        const Model = require(`../../models/${modelName}`) // 通用crud时，增加通用模型
        console.log(modelName, Model)
        // req.Model是在请求对象上挂载Model属性
        req.Model = Model
        next()
    }, router)
    // app.use('/admin/api/rest/:resource', router)

    // 处理上传文件
    // 增加中间件 npm i multer 
    const multer = require('multer') // 引入module 模块
    const upload = multer({ dest: __dirname + '/../../uploads' })  // 定义一个中间件，并执行它,同时传递一个参数dest ，目标地址是哪里(当前文件夹 退两级) ， __dirname为绝对地址
    app.post('/admin/api/upload', upload.single('file'), async (req, res) => { // upload.singel('file) 接收单一文件，文件名为file
        const file = req.file // 是通过multer中间件增加的req.file对象
        file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file)  // 返回前段需要定义一个静态的文件并把路径返回给前端
    })


}