# 【全栈之巅】Node.js + Vue.js 全栈开发王者荣耀手机端官网和管理后台
> 本项目是 学习[Bilibili 全栈之巅](https://space.bilibili.com/341919508) 视频教程相关源码
> https://gitee.com/blaunicorn/node-vue-wangzherongyao
> 持续更新中... 

# 王者荣耀全栈开发
部分截图
![输入图片说明](https://images.gitee.com/uploads/images/2020/0420/182135_13b694a5_4964818.png "NAG1AQN0%5MG@L}R.png")
![输入图片说明](https://images.gitee.com/uploads/images/2020/0420/182323_789567f4_4964818.png "5I12Y9O{OFE50~CGLO]AYSB_看图王.png")
![输入图片说明](https://images.gitee.com/uploads/images/2020/0420/182445_259638cf_4964818.png "YILW6Z$UEHQPM(JV](B%RJ.png")
![输入图片说明](https://images.gitee.com/uploads/images/2020/0420/182453_4089f826_4964818.png "032RSW2(GS3(IO9HLCT2{FK.png")

## 部署到服务器上，localhost:3000地址是前台首页不是后台的首页，添加admin才是后台的首页
#### 0、下载安装 node 和MongoDB server 、 vscode
#### 1、admin是后台界面部分、web是前台界面部分、server是前后台的后端接口部分

 npm i -g @vue/cli 全局安装vuecli
```js
vue create web

```

```js
vue create admin
```

-g 全局安装
```js
  npm init -y
  npm i -g nodemon
  npm run serve //启动后台服务器
```
#### 2、安装插件
全局安装nodemon

npm i -g nodemon

admin端

vue add element
vue add router
npm install axios

server端
    // 下一个版本  联接mongodb数据库 跨域 
npm i express@next mongoose cors inflection multer

#### 3、server端自定义脚本中用nodemon运行代码
"serve": "nodemon index.js"

#### 4、分类创建及编辑页(admin/src/views/CategoryEdit.vue)
```js
<template>
  <div class="about">
     //id 存在现实编辑，否则现实新建
    <h1>{{id ? "编辑":"新建"}}分类</h1>
    // 提交表单执行save方法
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="分类名称" >
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">上传</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props:{
    id:{}
  },
  data(){
    return{
      model:{}
    }
  },
  methods:{
    async save(){
      if(this.id){
        this.$http.put(`/categories/${this.id}`,this.model)
      }else{
        this.$http.post('/categories',this.model)
      }
      this.$router.push('/categories/list')
      this.$message({
        type:'success',
        message:'保存成功'
      })
    },
    async fetch(){
      const res = await this.$http.get(`/categories/${this.id}`)
      this.model = res.data
    }
  },
  created(){
    this.id && this.fetch()
  }
}
</script>
```


##### 4.1、admin 端请求接口放在http.js中(admin/src/http.js)
```js
import axios from 'axios'

const http = axios.create({
    baseURL:'http://localhost:3000/admin/api'
})

export default http
```

##### 4.2、在Main.js中引用http.js(admin/src/main.js)
```js
import http from './http'
Vue.prototype.$http = http
```

##### 4.3、server端新建数据库、建立数据库模型、设置增删改查路由
```js
// 后端连接数据库(server/plugins/db.js)
module.exports = app =>{
    const mongoose = require('mongoose')
    mongoose.connect('mongodb://127.0.0.1:27017/node-vue-moba',{
        useNewUrlParser: true
    })
}
```
```js
// 创建表模板(server/models/Category.js)
const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    name:{type:String}
})
module.exports = mongoose.model('Category',schema)
```
```js
// 写后端接口(server/route/admin/index.js)
module.exports = app =>{
    const express = require('express')
    const router = express.Router()
    const Category = require('../../models/Category')
    // 增
    router.post('/categories',async(req,res)=>{
       const model = await Category.create(req.body)
       res.send(model)
    })
    // 改
    router.put('/categories/:id',async(req,res)=>{
        const model = await Category.findByIdAndUpdate(req.params.id,req.body)
        res.send(model)
     })
    //删
    router.delete('/categories/:id',async(req,res)=>{
        const model = await Category.findByIdAndDelete(req.params.id,req.body)
        res.send({
            success: true
        })
    })
    // 查
    router.get('/categories',async(req,res)=>{
        const items = await Category.find().limit(10)
        res.send(items)
     })
     router.get('/categories/:id',async(req,res)=>{
        const model = await Category.findById(req.params.id)
        res.send(model)
     })
    app.use('/admin/api',router)
}
```

```js
// 监听端口(server/index.js)
const express = require('express')
const app = express()
app.use(express.json())
app.use(require('cors')())
require('./plugins/db')(app)
require('./route/admin')(app)
app.listen(3000,()=>{
    console.log('http://localhost:3000')
})
```

##### 4.4 admin端定义vue-router路由
```js
// admin端路由定义(admin/src/router/index.js)
const routes = [
    {
        path: '/',
        name: 'Main',
        component: () => import(/* webpackChunkName: "main" */ '../views/Main.vue'),
        children: [
            {
                path: '/categories/create',
                name: 'CategoriyEdit',
                component: () => import('../views/CategoriyEdit.vue')
            }
        ]
    }
]
```
##### 4.5 父类编辑 axios 传参、接收参数
```js
    // 查
    router.get('/categories', async (req, res) => {
        // console.log(req.query)
        const limit = +req.query.limit || 10
        const model = await Category.find().limit(limit)
        res.send(model)
    })
```
```js
      async fetch() {
        const params = {
          limit: 10,
        };
        // 查询字符串传参 用 req.query接收   eg. http://localhost:9999/axios?id=1000  服务端 app.get('/axios', (req, res)
        // restful风格URL  传参 用req.params.id 接收 eg.http://localhost:9999/axios/1000  服务端需要:id
        const res = await this.$http.get('categories', { params });
        console.log(res);
        this.items = res.data;
      },
```
#### 5 父类子类增删改查
##### 5.1、编辑页面添加选择父类按钮
```js

      <el-form-items label="上级分类">
        <el-select v-model="model.parent">
           //上级分类选择,label是显示的内容，value是实际保存的值
          <el-option v-for="item in parents" :key="item._id" :label="item.name" :value="item._id"></el-option>
        </el-select>
      </el-form-items>

<script>
export default {
  data(){
    return{
      parents: []
    }
  },
  methods:{
    async fetchParents(){
      const res = await this.$http.get(`/categories`)
      this.parents = res.data
    }
  },
  created(){
    this.fetchParents()
  }
}
</script>
```
##### 5.2、列表页显示父级分类
```js
      <el-table-column prop="parent.name" label="上级分类"></el-table-column>
```
##### 5.3、server端模型中添加parent字段
```js
    //数据库里面的ID叫Objectid，ref表示关联的模型
    parent:{type:mongoose.SchemaTypes.ObjectId,ref:'Category'}
```
##### 54、修改后端接口
```js
    // populate关联取出
    router.get('/categories',async(req,res)=>{
        const items = await Category.find().populate('parent').limit(10)
        res.send(items)
     })
```
#### 6.通用CRUD,如果使用，需要 保证通用性稳定性和拓展性

##### 6.1、添加mergeParams
```js
    //合并URL参数，将父级的参数合并到router里面

    const router = express.Router({   
        mergeParams: true
    })
```

##### 6.2、动态获取接口地址并在请求对象上挂载Model属性
```js
    //  动态获取接口地址:resource,中间件处理请求模板
    app.use('/admin/api/rest/:resource',async(req,res,next)=>{
        const modelName = require('inflection').classify(req.params.resource)
        // req.Model是在请求对象上挂载Model属性
        req.Model = require(`../../models/${modelName}`)
        next()
    },router)
```
##### 6.3、后端接口代码如下
```js
module.exports = app =>{
    const express = require('express')
    const router = express.Router({
        //合并URL参数，将父级的参数合并到router里面
        mergeParams: true
    })
    // 增
    router.post('/',async(req,res)=>{
        const model = await req.Model.create(req.body)
        res.send(model)
    })
    // 改
    router.put('/:id',async(req,res)=>{
        const model = await req.Model.findByIdAndUpdate(req.params.id,req.body)
        res.send(model)
     })
    //删
    router.delete('/:id',async(req,res)=>{
        const model = await req.Model.findByIdAndDelete(req.params.id,req.body)
        res.send({
            success: true
        })
    })
    // 查，populate关联取出
    router.get('/',async(req,res)=>{
        // const items = await req.Model.find().populate('parent').limit(10)
        const queryOptions = {}
        if(req.Model.modelName === 'Category'){
            queryOptions.populate = 'parent'
        }
        const items = await req.Model.find().setOptions(queryOptions).limit(10)
        res.send(items)
     })
     router.get('/:id',async(req,res)=>{
        const model = await req.Model.findById(req.params.id)
        res.send(model)
     })
    //  动态获取接口地址:resource,中间件处理请求模板
    app.use('/admin/api/rest/:resource',async(req,res,next)=>{
        const modelName = require('inflection').classify(req.params.resource)
        // req.Model是在请求对象上挂载Model属性
        req.Model = require(`../../models/${modelName}`)
        next()
    },router)
```
##### 6.3、修改前端请求接口
```js
//请求接口前面加上/rest
//编辑/新建页
this.$http.put(`/rest/categories/${this.id}`,this.model)
this.$http.post('/rest/categories',this.model)
const res = await this.$http.get(`/rest/categories/${this.id}`)
const res = await this.$http.get(`/rest/categories`)

//列表页
const res = await this.$http.get('/rest/categories')
await this.$http.delete(`/rest/categories/${row._id}`)
```
当通用接口做完后，其他的items和heros的接口也就比较简单了。

## 一、 入门
1. 项目介绍
1. 工具安装和环境搭建(nodejs,npm,mongodb)
1. 初始化项目

## 二、 管理后台
1. 基于Element UI的后台管理基础界面搭建

1. 创建分类
1. 分类列表
1. 修改分类
1. 删除分类
1. 子分类

1. **通用 CRUD 接口**

1. 装备管理
1. 图片上传 (multer)

1. 英雄管理
1. 编辑英雄 (关联,多选,el-select, multiple)
1. 技能编辑

1. 文章管理
1. 富文本编辑器 (quill)

1. 首页广告管理

1. 管理员账号管理 (bcrypt)
1. 登录页面
1. 登录接口 (jwt,jsonwebtoken)
1. 服务端登录校验
1. 客户端路由限制 (beforeEach, meta)
1. 上传文件的登录校验 (el-upload, headers)

## 三、移动端网站

1. "工具样式"概念和 SASS (SCSS)
1. 样式重置
1. 网站色彩和字体定义 (colors, text)
1. 通用flex布局样式定义 (flex)
1. 常用边距定义 (margin, padding)
1. 主页框架和顶部菜单
1. 首页顶部轮播图片 (vue swiper)
1. 使用精灵图片 (sprite)
1. 使用字体图标 (iconfont)
1. 卡片组件 (card)
1. 列表卡片组件 (list-card, nav, swiper)
1. 首页新闻资讯-数据录入(+后台bug修复)
1. 首页新闻资讯-数据接口
1. 首页新闻资讯-界面展示
1. 首页英雄列表-提取官网数据
1. 首页英雄列表-录入数据
1. 首页英雄列表-界面展示
1. 新闻详情页
1. 新闻详情页-完善
1. 英雄详情页-1-前端准备
1. 英雄详情页-2-后台编辑
1. 英雄详情页-3-前端顶部
1. 英雄详情页-4-完善

## 四、发布和部署 (阿里云)

1. 生产环境编译
1. 购买域名和服务器
1. 域名解析
1. Nginx 安装和配置
1. MongoDB数据库的安装和配置
1. git 安装、配置ssh-key
1. Node.js 安装、配置淘宝镜像
1. 拉取代码，安装pm2并启动项目
1. 配置 Nginx 的反向代理
1. 迁移本地数据到服务器 (mongodump)

## 五、进阶
1. 使用免费SSL证书启用HTTPS安全连接
1. 使用阿里云OSS云存储存放上传文件
