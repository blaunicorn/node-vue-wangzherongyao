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
### 0、下载安装 node 和MongoDB server 、 vscode
### 1、admin是后台界面部分、web是前台界面部分、server是前后台的后端接口部分

 npm i -g @vue/cli 全局安装vuecli,-g 全局安装
```js

vue create web

```

```js
vue create admin
```


```js
  // 新建server文件夹，并在其下
  npm init -y
  npm i -g nodemon
  npm run serve //启动后台服务器
```
### 2、安装插件
全局安装nodemon

npm i -g nodemon

admin端

vue add element
vue add router
npm install axios

server端
    // 下一个版本  联接mongodb数据库 跨域 
npm i express@next mongoose cors inflection multer

### 3、server端自定义脚本中用nodemon运行代码
"serve": "nodemon index.js"

### 4、分类创建及编辑页(admin/src/views/CategoryEdit.vue)
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


#### 4.1、admin 端请求接口放在http.js中(admin/src/http.js)
```js
import axios from 'axios'

const http = axios.create({
    baseURL:'http://localhost:3000/admin/api'
})

export default http
```

#### 4.2、在Main.js中引用http.js(admin/src/main.js)
```js
import http from './http'
Vue.prototype.$http = http
```

#### 4.3、server端新建数据库、建立数据库模型、设置增删改查路由
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

#### 4.4 admin端定义vue-router路由
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
#### 4.5 父类编辑 axios 传参、接收参数
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
### 5 父类子类增删改查
#### 5.1、编辑页面添加选择父类按钮
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
#### 5.2、列表页显示父级分类
```js
      <el-table-column prop="parent.name" label="上级分类"></el-table-column>
```
#### 5.3、server端模型中添加parent字段
```js
    //数据库里面的ID叫Objectid，ref表示关联的模型
    parent:{type:mongoose.SchemaTypes.ObjectId,ref:'Category'}
```
#### 54、修改后端接口
```js
    // populate关联取出
    router.get('/categories',async(req,res)=>{
        const items = await Category.find().populate('parent').limit(10)
        res.send(items)
     })
```
### 6.通用CRUD,如果使用，需要 保证通用性稳定性和拓展性

#### 6.1、添加mergeParams
```js
    //合并URL参数，将父级的参数合并到router里面

    const router = express.Router({   
        mergeParams: true
    })
```

#### 6.2、动态获取接口地址并在请求对象上挂载Model属性
```js
    //  动态获取接口地址:resource,中间件处理请求模板
    app.use('/admin/api/rest/:resource',async(req,res,next)=>{
        const modelName = require('inflection').classify(req.params.resource)
        // req.Model是在请求对象上挂载Model属性
        req.Model = require(`../../models/${modelName}`)
        next()
    },router)
```
#### 6.3、后端接口代码如下
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
        // 通用接口的类名转换成数据库一致的方法使用是inflection,把小写的复数名称改成大写开头的单数类名（也可以用lodash去尝试）
        const modelName = require('inflection').classify(req.params.resource)
        // req.Model是在请求对象上挂载Model属性
        req.Model = require(`../../models/${modelName}`)
        next()
    },router)
```
ps 通用接口的类名转换成数据库一致的方法使用是inflection,把小写的复数名称改成大写开头的单数类名（也可以用lodash去尝试）
#### 6.3、修改前端请求接口
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
### 7、物品管理
#### 7.1、Main.vue中左侧side添加物品列表
```js
        <el-menu-item-group>
          <template slot="title">物品</template>
          <el-menu-item index="/items/create">新建物品</el-menu-item>
          <el-menu-item index="/items/list">物品列表</el-menu-item>
        </el-menu-item-group>
```
#### 7.2、复制Category编辑页和列表页为ItemEdit.vue和ItemList.vue并修改页面代码
```js
ItemEdit.vue

<template>
  <div class="about">
    <h1>{{id ? "编辑":"新建"}}物品</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="分类名称" >
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="图标" >
        <el-input v-model="model.icon"></el-input>
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
      model:{},
      parents: []
    }
  },
  methods:{
    async save(){
      if(this.id){
        this.$http.put(`/rest/items/${this.id}`,this.model)
      }else{
        this.$http.post('/rest/items',this.model)
      }
      this.$router.push('/items/list')
      this.$message({
        type:'success',
        message:'保存成功'
      })
    },
    async fetch(){
      const res = await this.$http.get(`/rest/items/${this.id}`)
      this.model = res.data
    },
    async fetchParents(){
      const res = await this.$http.get(`/rest/items`)
      this.parents = res.data
    }
  },
  created(){
    this.fetchParents()
    this.id && this.fetch()
  }
}
</script>
```
ItemList.vue
```js
<template>
  <div class="about">
    <h1>物品列表</h1>
    <el-table :data="items">
      <el-table-column prop="_id" label="ID" width="230"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="$router.push(`/items/create/${scope.row._id}`)" type="text" size="small">编辑</el-button>
        <el-button @click="remove(scope.row)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
    </el-table>
  </div>
</template>


<script>
export default {
  data(){
    return{
      items:[]
    }
  },
  methods:{
    async fetch(){
      const res = await this.$http.get('/rest/items')
      this.items = res.data
    },
    async remove(row){
      this.$confirm(`是否要删除分类${row.name}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.$http.delete(`/rest/items/${row._id}`)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.fetch()
        })
    }
  },
  created(){
    this.fetch()
  }
}
</script>
```

#### 7.3、添加路由
```js
import ItemEdit from '../views/ItemEdit.vue'
import ItemList from '../views/ItemList.vue'

      {path:'/items/create',component:ItemEdit},
      {path:'/items/List',component:ItemList},
      {path:'/items/create/:id',component:ItemEdit,props:true}
```

#### 7.4、添加模型Item.js
```js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name:{type:String},
    icon:{type:String}
})

module.exports = mongoose.model('Item',schema)
```
### 8. 图片上传
sever目录的uploads文件夹，用来存放图片资源，建议重新编辑所有的图标/图片，保存在你自己本地的数据库里
处理文件需要安装专门用来上传文件的中间件multer ,在server的anmin文件夹中的index.js配置。
#### 8.1、添加上传文件图标(ItemEdit.vue)
```js
      <el-form-item label="分类名称" >
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="图标" >
        //:action:表单提交地址,on-success:成功之后做什么,before-upload:上传之后做什么
        <el-upload
          class="avatar-uploader"
          :action="$http.defaults.baseURL + '/upload'"
          :show-file-list="false"
          :on-success="afterUpload"
        >
          //有图片显示图片，没有则显示上传图标,:src显示的图片
          <img v-if="model.icon" :src="model.icon" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      
	//js
    afterUpload(res){
      console.log(res)
      //vue提供的方法(赋值主体，赋值的属性，res.url),效果类似this.model.icon = res.url
      this.$set(this.model,'icon',res.url)
    }
    
    
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
```
#### 8.2、添加upload文件上传文件夹（server/upload）
#### 8.3、在server端安装multer中间件处理文件上传
```js
npm i multer
```
#### 8.4、写后端接口(server/route/admin/index.js)
```js
    //使用，multer中间件专门处理数据上传
    const multer = require('multer')
    const upload = multer({dest: __dirname + '/../../uploads'})
    //upload.single：单个文件上传,在req上挂载file属性
    app.post('/admin/api/upload',upload.single('file'),async(req,res)=>{
        const file = req.file
        //将图片的地址拼接出来
        file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file)
    })
    
    //方法
   afterUpload(res){
      console.log(res)
      //vue提供的方法(赋值主体，赋值的属性，res.url),效果类似this.model.icon = res.url
      this.$set(this.model,'icon',res.url)
    }
```
#### 8.5、为了可以访问图片，创建静态文件托管(server/index.js)
上传的文件使用静态文件托管，存放在uploads文件夹，需要在server的主目录下的index.js定义静态路由（绝对路径）
一般前端的图片等样式文件也要使用静态路由，保证路径的正确（开放出这个路径）
```js
//静态文件托管后面的'/'不能写成 './' 
//uploads文件夹里面的东西是静态文件
app.use('/uploads',express.static(__dirname + '/uploads'))
```
Nodejs中想要访问的东西都要写接口
### 9.英雄管理，比较复杂的英雄编辑页面

#### 9.1、Main.vue中创建英雄列表组
```js
        <el-menu-item-group>
          <template slot="title">英雄</template>
          <el-menu-item index="/heroes/create">新建英雄</el-menu-item>
          <el-menu-item index="/heroes/list">英雄列表</el-menu-item>
        </el-menu-item-group>
```
#### 9.2、新建HeroList.vue和HeroEdit.vue，并在route中增加路由
```js
HeroEdit.vue

<template>
  <div class="about">
    <h1>{{id ? "编辑":"新建"}}英雄</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="名称" >
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="头像" >
        <!-- :action:表单提交地址,on-success:成功之后做什么,before-upload:上传之后做什么 -->
        <el-upload
          class="avatar-uploader"
          :action="$http.defaults.baseURL + '/upload'"
          :show-file-list="false"
          :on-success="afterUpload"
        >
          <!-- 有图片显示图片，没有则显示上传图标,:src显示的图片 -->
          <img v-if="model.avatar" :src="model.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
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
      model:{
        name: '',
        avatar: ''
      },
    }
  },
  methods:{
    afterUpload(res){
      console.log(res)
      //vue提供的方法(赋值主体，赋值的属性，res.url),效果类似this.model.icon = res.url
      // this.$set(this.model,'avatar',res.url)
      //上面data中设置了属性就可以用这个方法了，推荐使用
      this.model.avatar = res.url
    },
    async save(){
      if(this.id){
        this.$http.put(`/rest/heroes/${this.id}`,this.model)
      }else{
        this.$http.post('/rest/heroes',this.model)
      }
      this.$router.push('/heroes/list')
      this.$message({
        type:'success',
        message:'保存成功'
      })
    },
    async fetch(){
      const res = await this.$http.get(`/rest/heroes/${this.id}`)
      this.model = res.data
    },
    async fetchParents(){
      const res = await this.$http.get(`/rest/items`)
      this.parents = res.data
    }
  },
  created(){
    this.fetchParents()
    this.id && this.fetch()
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
```
HeroList.vue
```js
<template>
  <div class="about">
    <h1>英雄列表</h1>
    <el-table :data="items">
      <el-table-column prop="_id" label="ID" width="230"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="avatar" label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" alt="" style="height:3rem">
        </template>
      </el-table-column>
      <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="$router.push(`/heroes/create/${scope.row._id}`)" type="text" size="small">编辑</el-button>
        <el-button @click="remove(scope.row)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
    </el-table>
  </div>
</template>


<script>
export default {
  data(){
    return{
      items:[]
    }
  },
  methods:{
    async fetch(){
      const res = await this.$http.get('/rest/heroes')
      this.items = res.data
    },
    async remove(row){
      this.$confirm(`是否要删除分类${row.name}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.$http.delete(`/rest/heroes/${row._id}`)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.fetch()
        })
    }
  },
  created(){
    this.fetch()
  }
}
</script>
```
#### 9.3、路由中引用HeroList.vue和HeroEdit.vue
```js
import HeroEdit from '../views/HeroEdit.vue'
import HeroList from '../views/HeroList.vue'

      {path:'/heroes/create',component:HeroEdit},
      {path:'/heroes/List',component:HeroList},
      {path:'/heroes/create/:id',component:HeroEdit,props:true}
```
#### 9.4、添加英雄模型Hero.js
```js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name:{type:String},
    avatar:{type:String},
    title:{type:String},
    // 实现多选
    categories:[{type:mongoose.SchemaTypes.ObjectId,ref:'Category'}],
    // 评分
    scores:{
        difficult:{type:Number},
        skills:{type:Number},
        attack:{type:Number},
        survive:{type:Number}
    },
    // 多个技能
    skills:[{
        icon:{type:String},
        name:{type:String},
        description:{type:String},
        tips:{type:String}
    }],
    // 装备
    items1:[{type:mongoose.SchemaTypes.ObjectId,ref:'Item'}],
    items2:[{type:mongoose.SchemaTypes.ObjectId,ref:'Item'}],
    //使用技巧
    usageTips:{type:String},
    //对抗技巧
    battleTips:{type:String},
    //团战技巧
    teamTips:{type:String},
    //英雄关系
    partners:[{
        hero:{type:mongoose.SchemaTypes.ObjectId,ref:'Hero'},
        description:{type:String}
    }]
})

module.exports = mongoose.model('Hero',schema)
```
#### 9.5、实现复杂的英雄编辑录入页（HeroEdit.vue） (关联,多选,el-select, multiple)
```js
<template>
  <div class="about">
    <h1>{{id ? "编辑":"新建"}}英雄</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="名称" >
        <el-input v-model="model.name"></el-input>
      </el-form-item>

      <el-form-item label="称号" >
        <el-input v-model="model.title"></el-input>
      </el-form-item>

      <el-form-item label="头像" >
        <!-- :action:表单提交地址,on-success:成功之后做什么,before-upload:上传之后做什么 -->
        <el-upload
          class="avatar-uploader"
          :action="$http.defaults.baseURL + '/upload'"
          :show-file-list="false"
          :on-success="afterUpload"
        >
          <!-- 有图片显示图片，没有则显示上传图标,:src显示的图片 -->
          <img v-if="model.avatar" :src="model.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="类型" >
        <!-- 加multiple就可以多选 -->
        <el-select v-model="model.categories" multiple >
          <el-option v-for="item of categories" :key="item._id" :label="item.name" :value="item._id"></el-option>
        </el-select>


        <!-- 分数 -->
      <el-form-item label="难度" >
        <el-rate style="margin-top:0.6rem" :max="9" show-score v-model="model.scores.difficult"></el-rate>
      </el-form-item>

        <!-- 分数 -->
      <el-form-item label="技能" >
        <el-rate style="margin-top:0.6rem" :max="9" show-score v-model="model.scores.skills"></el-rate>
      </el-form-item>


        <!-- 分数 -->
      <el-form-item label="攻击" >
        <el-rate style="margin-top:0.6rem" :max="9" show-score v-model="model.scores.attack"></el-rate>
      </el-form-item>


        <!-- 分数 -->
      <el-form-item label="生存" >
        <el-rate style="margin-top:0.6rem" :max="9" show-score v-model="model.scores.survive"></el-rate>
      </el-form-item>

    </el-form-item>

      <el-form-item label="顺风出装" >
        <!-- 加multiple就可以多选 -->
        <el-select v-model="model.items1" multiple >
          <el-option v-for="item of items" :key="item._id" :label="item.name" :value="item._id"></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="逆风出装" >
        <!-- 加multiple就可以多选 -->
        <el-select v-model="model.items2" multiple >
          <el-option v-for="item of items" :key="item._id" :label="item.name" :value="item._id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="使用技巧">
        <el-input type="textarea" v-model="model.usageTips"></el-input>
      </el-form-item>

      <el-form-item label="对抗技巧">
        <el-input type="textarea" v-model="model.battleTips"></el-input>
      </el-form-item>

      <el-form-item label="团战技巧">
        <el-input type="textarea" v-model="model.teamTips"></el-input>
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
      categories:[],
      items:[],
      model:{
        name: '',
        avatar: '',
        scores:{
          difficult:0
        }
      },
    }
  },
  methods:{
    afterUpload(res){
      console.log(res)
      //vue提供的方法(赋值主体，赋值的属性，res.url),效果类似this.model.icon = res.url
      // this.$set(this.model,'avatar',res.url)
      //上面data中设置了属性就可以用这个方法了，推荐使用
      this.model.avatar = res.url
    },
    async save(){
      if(this.id){
        this.$http.put(`/rest/heroes/${this.id}`,this.model)
      }else{
        this.$http.post('/rest/heroes',this.model)
      }
      this.$router.push('/heroes/list')
      this.$message({
        type:'success',
        message:'保存成功'
      })
    },
    async fetch(){
      const res = await this.$http.get(`/rest/heroes/${this.id}`)
      // this.model = res.data
      this.model = Object.assign({},this.model,res.data)
    },
    async fetchCategories(){
      const res = await this.$http.get(`/rest/categories`)
      this.categories = res.data
    },
    async fetchItems(){
      const res = await this.$http.get(`/rest/items`)
      this.items = res.data
    }
  },
  created(){
    this.fetchCategories()
    this.fetchItems()
    this.id && this.fetch()
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
```
#### 9.6、技能编辑=》将英雄编辑页内容用tab包裹区分为basic 和skills 两个tab页
```js
<el-tab-pane label="技能" name="skills">
          <!-- type默认为按钮，type="text"为文字链接样式 -->
          <!-- 数据中skills必须是数组 -->
          <el-button style="margin-bottom:1rem;" size="small" @click="model.skills.push({})"><i class="el-icon-plus"></i>添加技能</el-button>
          <el-row type="flex" style="flex-wrap:wrap">
            <!-- :md="12"表示在普通屏幕上一行显示两个框 -->
            <el-col :md="12" v-for="(item,i) in model.skills" :key="i">
              <el-form-item label="名称">
                <el-input v-model="item.name"></el-input>
              </el-form-item>
              <el-form-item label="图标">
                <!-- 将res.url赋值到item.icon上，res => item.icon = res.url -->
                <!-- res => $set(item,'icon',res.url,将res.url赋值在item主体的icon属性上 -->
                <el-upload
                  class="avatar-uploader"
                  :action="$http.defaults.baseURL + '/upload'"
                  :show-file-list="false"
                  :on-success="res => $set(item,'icon',res.url)"
                >
                  <!-- 有图片显示图片，没有则显示上传图标,:src显示的图片 -->
                  <img v-if="item.icon" :src="item.icon" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="描述">
                <!-- 大文本框 -->
                <el-input v-model="item.description" type="textarea"></el-input>
              </el-form-item>
              <el-form-item label="小提示">
                <el-input v-model="item.tips" type="textarea"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="danger" @click="model.skills.splice(i,1)">删除</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>

      </el-tabs>
```
### 10、文章管理，同一篇文章可能属于多个分类，这个要注意
#### 10.1、Main.vue中添加侧边栏
```js
        <el-menu-item-group>
          <template slot="title">文章</template>
          <el-menu-item index="/articles/create">新建文章</el-menu-item>
          <el-menu-item index="/articles/list">文章列表</el-menu-item>
        </el-menu-item-group>
```
#### 10.2、添加ArticleEdit.vue和ArticleList.vue
#### 10.3、router.js中添加路由
```js
import ArticleEdit from '../views/ArticleEdit.vue'
import ArticleList from '../views/ArticleList.vue'

      {path:'/articles/create',component:ArticleEdit},
      {path:'/articles/List',component:ArticleList},
      {path:'/articles/create/:id',component:ArticleEdit,props:true}
```
#### 10.4、修改ArticleEdit.vue
```js
<template>
  <div class="about">
    <h1>{{id ? "编辑":"新建"}}分类</h1>
    <el-form label-width="120px" @submit.native.prevent="save">

      <!-- 上级分类选择,label是显示的内容，value是实际保存的值 -->
      <el-form-item label="所属分类">
        <el-select v-model="model.categories" multiple >
          <el-option v-for="item in categories" :key="item._id" :label="item.name" :value="item._id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="标题" >
        <el-input v-model="model.title"></el-input>
      </el-form-item>
      <el-form-item label="详情" >
        <el-input v-model="model.body"></el-input>
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
      model:{},
      categories: []
    }
  },
  methods:{
    async save(){
      if(this.id){
        this.$http.put(`/rest/articles/${this.id}`,this.model)
      }else{
        this.$http.post('/rest/articles',this.model)
      }
      this.$router.push('/articles/list')
      this.$message({
        type:'success',
        message:'保存成功'
      })
    },
    async fetch(){
      const res = await this.$http.get(`/rest/articles/${this.id}`)
      this.model = res.data
    },
    async fetchCategories(){
      const res = await this.$http.get(`/rest/categories`)
      this.categories = res.data
    }
  },
  created(){
    this.fetchCategories()
    this.id && this.fetch()
  }
}
</script>
```
#### 10.5、添加Article.js模型
```js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title:{type:String},
    categories:[{type:mongoose.SchemaTypes.ObjectId,ref:'Category'}]
    body:{type:String}
})

module.exports = mongoose.model('Article',schema)
```

#### 10.6、修改ArticleList.vue
```js
<template>
  <div class="about">
    <h1>文章列表</h1>
    <el-table :data="items">
      <el-table-column prop="_id" label="ID"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      
      <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="$router.push(`/article/create/${scope.row._id}`)" type="text" size="small">编辑</el-button>
        <el-button @click="remove(scope.row)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
    </el-table>
  </div>
</template>


<script>
export default {
  data(){
    return{
      items:[]
    }
  },
  methods:{
    async fetch(){
      const res = await this.$http.get('/rest/article')
      this.items = res.data
    },
    async remove(row){
      this.$confirm(`是否要删除文章${row.title}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.$http.delete(`/rest/article/${row._id}`)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.fetch()
        })
    }
  },
  created(){
    this.fetch()
  }
}
</script>
```
### 11.富文本编辑器使用github上的 vue2-editor 可直接npm下载 或 vue-quill-editor
ps:优化富文本内 图片上传 vue2-editor 自定义上传图片函数已经改为 @image-added
```js
// admin 目录下
npm install --save vue2-editor
```
<template>
    <vue-editor
        id="editor"
        useCustomImageHandler
        @image-added="handleImageAdded" 
        v-model="model.body"
    ></vue-editor>
</template>
<script>
  import { VueEditor } from 'vue2-editor'; // 解构写法
  //   import a from 'vue2-editor';  // 另一种写法，对象写法 ，用 a.VueEditor 获取
  export default {
    components: {
      VueEditor,
    },
    methods: {
      // 富文本编辑器图片处理
      async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
        console.log(111);
        const formData = new FormData();
        formData.append('file', file);
        const res = await this.$http.post('upload', formData);
        Editor.insertEmbed(cursorLocation, 'image', res.data.url);
        resetUploader();
      },
    }
  }
</script>
 
### 12.广告位轮播图
main.vue
          <el-menu-item-group>
            <template slot="title">广告位</template>
            <el-menu-item index="/ad/create">新建广告位</el-menu-item>
            <el-menu-item index="/ad/list">广告位列表</el-menu-item>
          </el-menu-item-group>
router/index.js
            {
                path: '/ad/create',
                name: 'AdCreate',
                component: () => import('../views/AdEdit.vue')
            },
            {
                path: '/ad/edit/:id',
                name: 'AdEdit',
                component: () => import('../views/AdEdit.vue'),
                props: true // 允许参数注入
            },
            {
                path: '/ad/list',
                name: 'AdList',
                component: () => import('../views/AdList.vue')
            }
新建 AdEdit.vue AdList.vue
新建Ad.js
const mongoose = require('mongoose')

// 定义模型字段 一个广告位内要有多个广告
const schema = new mongoose.Schema({
    name: { type: String },
    items: [{
        image: { type: String },
        url: { type: String },
        title: { type: String },

    }],
})

// 导出Item模型，哪里需要用，哪里引入，引入到 routes/admin/index.js
module.exports = mongoose.model('Ad', schema)

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
