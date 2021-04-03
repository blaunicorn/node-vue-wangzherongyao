// 2-20 这样写中间件比较乱，所以要建立一个中间件的文件夹，合并精简下
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


    //引用校验token
    const jwt = require('jsonwebtoken')
    //调用assert来返回错误
    const assert = require('http-assert')
    // 单独引入 AdminUser模型，供后期调用
    const AdminUser = require('../../models/AdminUser')

    router.post('/', async (req, res) => {
        // 把数据存入数据库

        // const Model = require(`../../models/${req.params.resource}`) // 通用crud时，增加通用模型，需要把${req.params.resource} 转化为类名既大写单数形式
        const model = await req.Model.create(req.body) // 把所有Category替换为req.Model
        // const model = await Category.create(req.body)
        //  发回客户端，让客户端知道创建完成，同时创建的数据是什么，下一步去前端发起请求
        res.send(model)

    })


    // 2 - 20 将2-19添加的错误处理，提取出来，放在各个请求上，顺序： 设定路由是什么，看用户用户是不是存在，，看看对应的model模型是什么，最后挂载在路由。增加了2个中间件，用户登录和自动获取模型。上传也需要
    // 封装成登录检验中间件 ,放在各个路由上
    // const authMiddleware = async (req, res, next) => {
    //     const token = String(req.headers.authorization || '').split(' ').pop()
    //     assert(token, 401, '请提供jwt token 1')
    //     console.log(222, token, app.get('secret'))
    //     const { id } = jwt.verify(token, app.get('secret'), (err, data) => {
    //         console.log(err, data)
    //         if (err) {
    //             return { id: null }
    //         }
    //         return data
    //     })
    //     console.log('id', id)
    //     assert(id, 401, '无效的jwt token 2')
    //     req.user = await AdminUser.findById(id)
    //     assert(req.user, 401, '请先登陆3')
    //     console.log(req.user)
    //     await next()
    // }

    // 2-21 将中间件抽离放在Middelware文件中,原函数隐藏
    const authMiddleware = require('../../Middleware/auth') // 此时调用需要用authMiddleware()
    const resourceMiddleware = require('../../Middleware/resource')
    // console.log('resourceMiddleware', resourceMiddleware.toLocaleString())

    // 资源列表
    // 2 - 19 继续增加中间件，校验用户是否登录, 此时在前端头上添加token

    router.get('/', async (req, res, next) => {
        const token = String(req.headers.authorization || '').split(' ').pop()
        console.log('token', token)
        // const tokenData = jwt.verify(token, app.get('secret'), (err, data) => {
        //     console.log(err, data)
        //     if (err && err.message === 'invalid token') return res.send({ message: '无效 token', code: 0 })

        //     if (err && err.message === 'jwt expired') return res.send({ message: 'token 失效', code: 0 })

        //    
        // })
        // 考虑到token为空时，无法调用jwt方法，所以如果token为空也抛出错误。
        assert(token, 401, '请提供jwt token 1')
        console.log(222, token, app.get('secret'))
        // tokenData: {id:'String',iat: 'Number'} 既解析出了id
        const { id } = jwt.verify(token, app.get('secret'), (err, data) => {
            console.log(err, data)
            if (err) {
                return { id: null }
            }
            return data
        })
        console.log('id', id)
        // 如果id不存在也应该报错
        assert(id, 401, '无效的jwt token 2')
        // // 把用户信息挂载到req上
        req.user = await AdminUser.findById(id)
        // 如果没有查询到用户
        assert(req.user, 401, '请先登陆3')
        console.log(req.user)
        // 2-19 修改为assert统一错误处理
        // assert(req.user, 401, '请先登录')
        await next()

    }, async (req, res) => {
        console.log(req.params)
        // //  放在前置的中间件内
        // const modelName = require('inflection').classify(req.params.resource) // 通用crud时，转类名转为大写单数
        // const Model = require(`../../models/${modelName}`) // 通用crud时，增加通用模型
        // const Model = require(`../../models/${req.params.resource}`) // 通用crud时，增加通用模型
        const limit = +req.query.limit || 20
        // npm i inflection 此插件可以负责单复数的转换
        // 优化阶段，可以把populate关联取出
        const queryOptions = {}
        if (req.Model.modelName === 'Category') {
            queryOptions.populate = 'parent'
        }
        // const model = await req.Model.find().populate('parent').limit(limit)
        const model = await req.Model.find().setOptions(
            queryOptions
        ).limit(limit)
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
    // 根据id修改资源
    router.put('/:id', async (req, res) => {
        // console.log(req.query)
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })
    // 根据id删除
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
    // 2-20 放置auth中间件 并把获取模型封装成中间件
    // const resourceMiddleware = async (req, res, next) => {
    //     //  放在前置的中间件内，请求时会先用async处理 url
    //     const modelName = require('inflection').classify(req.params.resource) // 通用crud时，转类名转为大写单数
    //     const Model = require(`../../models/${modelName}`) // 通用crud时，增加通用模型
    //     console.log(modelName, Model)
    //     // req.Model是在请求对象上挂载Model属性
    //     req.Model = Model
    //     next()
    // }
    app.use('/admin/api/rest/:resource', authMiddleware(), resourceMiddleware(), router)
    // app.use('/admin/api/rest/:resource', async (req, res, next) => {
    //  放在前置的中间件内，请求时会先用async处理 url
    //     const modelName = require('inflection').classify(req.params.resource) // 通用crud时，转类名转为大写单数
    //     const Model = require(`../../models/${modelName}`) // 通用crud时，增加通用模型
    //     console.log(modelName, Model)
    //     // req.Model是在请求对象上挂载Model属性
    //     req.Model = Model
    //     next()
    // }, router)

    // app.use('/admin/api/rest/:resource', router)

    // 处理上传文件
    // 增加中间件 npm i multer 
    const multer = require('multer') // 引入module 模块
    // 5.2 引入阿里云云存储模块 需要收费，暂不实现
    // const MAO = require('multer-aliyun-oss')
    // const upload = multer({
    //     storage: MAO({
    //         config: {
    //             region: '',
    //             accessKeyId: '',
    //             accessKeySecret: '',
    //             bucket: ''
    //         }
    //     })
    // })
    // 5.2 改成阿里云云存储模块，去掉 
    const upload = multer({ dest: __dirname + '/../../uploads' })  // 定义一个中间件，并执行它,同时传递一个参数dest ，目标地址是哪里(当前文件夹 退两级) ， __dirname为绝对地址
    // 2-20 上传图片需要验证中间件
    app.post('/admin/api/upload', authMiddleware(), upload.single('file'), async (req, res) => { // upload.singel('file) 接收单一文件，文件名为file
        // app.post('/admin/api/upload', upload.single('file'), async (req, res) => { // upload.singel('file) 接收单一文件，文件名为file

        const file = req.file // 是通过multer中间件增加的req.file对象
        // 4.10 把图片访问地址改成线上地址，注意没有端口号了，因为nginx启动了反向代理
        file.url = `http://39.97.105.248/uploads/${file.filename}`
        // file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file)  // 返回前段需要定义一个静态的文件并把路径返回给前端
    })
    // 登录接口
    app.post('/admin/api/login', async (req, res) => {
        // 结构赋值
        const { username, password } = req.body
        // 1.根据用户名找用户,引入模型，定义方法
        const AdminUser = require('../../models/AdminUser')
        // 简化 {username：username}
        const user = await AdminUser.findOne({ username }).select('+password')
        if (!user) {
            return res.status(422).send({ message: '用户不存在' })
        }
        // 2.校验密码
        // 比较密码,返回布尔值.数据表密码设置select为false不可读取,此时需要强制取出密码 findOne.select('+item')
        const isValid = require('bcryptjs').compareSync(password, user.password)
        // 2-18 密码校验
        // if (!isValid) {
        //     return res.status(422).send({ message: '密码校验错误' })
        // }
        // 2-19 修改为统一错误处理
        assert(isValid, 422, '密码错误')

        // 3.返回token，如果是错误，则在http.js中拦截器统一处理
        // npm i jsonwebtoken
        //  把他移到程序头
        // const jwt = require('jsonwebtoken')

        // 签名，生成token,加密返回,get会和路由冲突，通过参数的设置让路由进行判断
        const token = jwt.sign({ id: user.id }, app.get('secret'))
        console.log('密码正确')
        res.send({ code: 20000, message: 'ok', data: { token } })
    })

    //  2 - 19 在最后捕获异常
    // 2-19 继续增加 npm install http-assert 这个是node.js下判断条件是否成立 assert（确保条件存在，如果不存在抛出什么状态码，信息是什么),这样可以替换掉res.status(422).send('错误提示)
    // 封装下assert逻辑,抛出错误处理信息assert(user, 422, '用户不存在')

    app.use(async (err, req, res, next) => {
        console.log('进入错误反馈逻辑', err.statusCode)
        // res.status(500).send({ message: err.message })
        res.status(err.statusCode || 500).send({ message: err.message })
    })
}