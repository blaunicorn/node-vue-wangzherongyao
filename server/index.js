// 按需引入
const express = require('express')
// 定义一个实例
const app = express()
// 加入解析json跨域模块的中间件,加()表示去使用它
app.use(require('cors')())
// 加入解析json的中间件
app.use(express.json())

// 引入数据库
require('./plugins/db')(app)
// 导入admin 路由,引入的函数要加（）执行，并引入app
require('./routes/admin')(app)

app.get('/', async (request, response) => {
    response.send('服务器启动')
})

// 在指定端口启动
app.listen(3000, () => {
    console.log('http://localhost:3000')
})