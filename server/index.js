// 按需引入
const express = require('express')
// 定义一个实例
const app = express()
// 加入解析json跨域模块的中间件,加()表示去使用它
app.use(require('cors')())
// 加入解析json的中间件
app.use(express.json())



//静态文件托管后面的'/'不能写成 './' 
app.use('/uploads', express.static(__dirname + '/uploads')) // 表示uploads为托管的静态文件夹,可以通过/uploads来访问

// 引入数据库
require('./plugins/db')(app)

// 设置全局秘钥，一般放在环境变量里
// app.set('secret', 'afafsafsd')
console.log(app.secret_test)
app.set('secret', app.secret_test)

// 导入admin 路由,引入的函数要加（）执行，并引入app
require('./routes/admin')(app)
// 导入web 路由
require('./routes/web')(app)

app.get('/', async (request, response) => {
    response.send('服务器启动')
})

// 在指定端口启动
app.listen(3000, () => {
    console.log('http://localhost:3000')
})