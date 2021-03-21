## 【全栈之巅】Node.js + Vue.js 全栈开发王者荣耀手机端官网和管理后台
> 本项目是 学习[Bilibili 全栈之巅](https://space.bilibili.com/341919508) 视频教程相关源码和体会
> https://gitee.com/blaunicorn/node-vue-wangzherongyao
> 持续更新中... 

### 1.1 王者荣耀全栈开发部分截图
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210316222242490.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80Mzk0MTcxMg==,size_16,color_FFFFFF,t_70#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210316222242438.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80Mzk0MTcxMg==,size_16,color_FFFFFF,t_70#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210316222242358.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80Mzk0MTcxMg==,size_16,color_FFFFFF,t_70#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210316222242314.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80Mzk0MTcxMg==,size_16,color_FFFFFF,t_70#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210316223036308.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80Mzk0MTcxMg==,size_16,color_FFFFFF,t_70#pic_center)


### 1.2 配置环境，下载安装 node 和MongoDB server 、 vscode
### 1.3 项目介绍：admin是后台界面部分、web是前台界面部分、server是前后台的后端接口部分。部署到服务器上，localhost:3000地址是前台首页不是后台的首页，添加admin才是后台的首页
 
```js
// 全局安装vuecli,-g 全局安装
npm i -g @vue/cli  
// 创建web页项目
vue create web 
```

```js
// 创建管理后端项目
vue create admin 
```

```js
  // 新建server文件夹，并在其下
  npm init -y
  npm i -g nodemon
  npm run serve //启动后台服务器
```

### 1.4 安装插件
```js
// 全局安装nodemon
npm i -g nodemon
```

```js
// admin端
vue add element
vue add router
npm install axios
```

```js
// server端安装express@next版本  联接mongodb数据库 跨域 映射 上传文件中间件
npm i express@next mongoose cors inflection multer
```

### 1.5 server端自定义脚本中用nodemon运行代码
```js
"serve": "nodemon index.js"
```

### 2.1 admin端创建分类及编辑页(admin/src/views/CategoryEdit.vue)
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
    this.id && this.fetch() // 判断是否通过router的props传回了id
  }
}
</script>
```

#### 2.1.1 admin 端请求接口放在http.js中(admin/src/http.js)
```js
import axios from 'axios'

const http = axios.create({
    baseURL:'http://localhost:3000/admin/api'
})

export default http
```

#### 2.1.2 在Main.js中引用http.js(admin/src/main.js)
```js
import http from './http'
Vue.prototype.$http = http
```

### 2.2 server端新建数据库、建立数据库模型、设置增删改查路由
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

### 2.3 admin端定义vue-router路由
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

### 2.4 父类编辑 axios 传参、接收参数
```js
    // 后端server查(server\routes\admin\index.js)
    router.get('/categories', async (req, res) => {
        // console.log(req.query)
        const limit = +req.query.limit || 10
        const model = await Category.find().limit(limit)
        res.send(model)
    })
```
```js
    // 前端admin查询请求(admin\src\views\CategoriesList.vue)
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
### 2.5 父类删除 axios 传参、接收参数

```js
     // 前端admin删除具体物品请求(admin\src\views\CategoriesList.vue)
<template>
  <div class="about">
    <h1>分类列表</h1>
    <el-table :data="items">
      <el-table-column prop="_id" label="ID" width="230"> </el-table-column>
      <el-table-column prop="parent.name" label="上级分类" width="120">
      </el-table-column>
      <el-table-column prop="name" label="分类名称" width="120">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="$router.push(`/categories/edit/${scope.row._id}`)"
            >编辑</el-button
          >
          <el-button @click="remove(scope.row)" type="text" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
    ...
      async remove(row) {
        console.log(row);
        this.$confirm(`此操作将永久删除该分类${row.name}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            const res = await this.$http.delete(`/rest/categories/${row._id}`);
            console.log(res);
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
            this.fetch();
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            });
          });
      },
</script>
```

### 2.6 父类子类增删改查

#### 2.6.1 编辑页面添加选择父类按钮
```js
<template>
    <div>
      ...
      <el-form-items label="上级分类">
        <el-select v-model="model.parent">
           //上级分类选择,label是显示的内容，value是实际保存的值
          <el-option v-for="item in parents" :key="item._id" :label="item.name" :value="item._id"></el-option>
        </el-select>
      </el-form-items>
    </div>
</template>
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

#### 2.6.2 列表页显示父级分类
```js
      <el-table-column prop="parent.name" label="上级分类"></el-table-column>
```

#### 2.6.3 server端模型中添加parent字段
```js
    //数据库里面的ID叫Objectid，ref表示关联的模型
    parent:{type:mongoose.SchemaTypes.ObjectId,ref:'Category'}
```
#### 2.6.4 修改后端接口
```js
    // populate关联取出
    router.get('/categories',async(req,res)=>{
        const items = await Category.find().populate('parent').limit(10)
        res.send(items)
     })
```
### 2.7 后端通用CRUD,如果使用，需要保证通用性稳定性和拓展性
#### 2.7.1 添加mergeParams(server\routes\admin\index.js)
```js
    //合并URL参数，将父级的参数合并到router里面
    const router = express.Router({   
        mergeParams: true
    })
```

#### 2.7.2 动态获取接口地址并在请求对象上挂载Model属性(server\routes\admin\index.js)
```js
    //  动态获取接口地址:resource,中间件处理请求模板
    app.use('/admin/api/rest/:resource',async(req,res,next)=>{
        const modelName = require('inflection').classify(req.params.resource)
        // req.Model是在请求对象上挂载Model属性
        req.Model = require(`../../models/${modelName}`)
        next()
    },router)
```
#### 2.7.3 后端完整接口代码如下(server\routes\admin\index.js)
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

#### 2.7.3 修改前端admin请求接口
```js
//请求接口前面加上/rest(admin\src\views\CategoriesEdit.vue)
//编辑/新建页
this.$http.put(`/rest/categories/${this.id}`,this.model)
this.$http.post('/rest/categories',this.model)
const res = await this.$http.get(`/rest/categories/${this.id}`)
const res = await this.$http.get(`/rest/categories`)

//列表页(admin\src\views\CategoriesList.vue)
const res = await this.$http.get('/rest/categories')
await this.$http.delete(`/rest/categories/${row._id}`)
```
当通用接口做完后，其他的items和heros的接口也就比较简单了。

### 2.8 物品管理
#### 2.8.1 Main.vue中左侧side添加物品列表(admin\src\views\Main.vue)
```js
        <el-menu-item-group>
          <template slot="title">物品</template>
          <el-menu-item index="/items/create">新建物品</el-menu-item>
          <el-menu-item index="/items/list">物品列表</el-menu-item>
        </el-menu-item-group>
```

#### 2.8.2 复制Category编辑页和列表页为ItemEdit.vue和ItemList.vue并修改页面代码
```js
// admin\src\views\ItemEdit.vue
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

```js
// admin\src\views\ItemList.vue
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

#### 2.8.3 admin端添加路由
```js
// admin\src\router\index.js
import ItemEdit from '../views/ItemEdit.vue'
import ItemList from '../views/ItemList.vue'

      {path:'/items/create',component:ItemEdit},
      {path:'/items/List',component:ItemList},
      {path:'/items/create/:id',component:ItemEdit,props:true} // props: true 允许参数注入
```

#### 2.8.4 server端添加模型Item.js
```js
// server\models\Item.js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name:{type:String},
    icon:{type:String}
})

module.exports = mongoose.model('Item',schema)
```
### 2.9 图片上传
sever目录的uploads文件夹，用来存放图片资源，建议重新编辑所有的图标/图片，保存在你自己本地的数据库里
处理文件需要安装专门用来上传文件的中间件multer ,在server的anmin文件夹中的index.js配置。
#### 2.9.1 admin端添加上传文件图标(admin\src\views\ItemEdit.vue)
```js
    // template
      <el-form-item label="分类名称" >
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="图标" >
        <!-- :action:表单提交地址,on-success:成功之后做什么,before-upload:上传之后做什么 --!>
        <el-upload
          class="avatar-uploader"
          :action="$http.defaults.baseURL + '/upload'"
          :show-file-list="false"
          :on-success="afterUpload"
        >
          <!-- 有图片显示图片，没有则显示上传图标,:src显示的图片 -->
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

#### 2.9.2 server端添加upload文件上传文件夹（server/upload）

#### 2.9.3 在server端安装multer中间件处理文件上传
```js
npm i multer
```
#### 2.9.4、写后端接口(server/route/admin/index.js)
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

#### 2.9.5、为了可以访问图片，创建静态文件托管(server/index.js)
上传的文件使用静态文件托管，存放在uploads文件夹，需要在server的主目录下的index.js定义静态路由（绝对路径）
一般前端的图片等样式文件也要使用静态路由，保证路径的正确（开放出这个路径）
```js
//静态文件托管后面的'/'不能写成 './' 
//uploads文件夹里面的东西是静态文件
app.use('/uploads',express.static(__dirname + '/uploads'))
```
Nodejs中想要访问的东西都要写接口

### 2.10 英雄管理，比较复杂的英雄编辑页面

#### 2.10.1 admin端Main.vue中创建英雄列表组(admin\src\views\Main.vue)
```js
        <el-menu-item-group>
          <template slot="title">英雄</template>
          <el-menu-item index="/heroes/create">新建英雄</el-menu-item>
          <el-menu-item index="/heroes/list">英雄列表</el-menu-item>
        </el-menu-item-group>
```
#### 2.10.2 新建HeroList.vue和HeroEdit.vue，并在route中增加路由
```js
// admin\src\views\HeroEdit.vue

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

```js
// admin\src\views\HeroList.vue
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

#### 2.10.3 路由中引用HeroList.vue和HeroEdit.vue
```js
// admin\src\router\index.js
import HeroEdit from '../views/HeroEdit.vue'
import HeroList from '../views/HeroList.vue'

      {path:'/heroes/create',component:HeroEdit},
      {path:'/heroes/List',component:HeroList},
      {path:'/heroes/create/:id',component:HeroEdit,props:true}
```
#### 2.10.4、添加英雄模型Hero.js
```js
// server\models\Hero.js
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

#### 2.10.5 实现复杂的英雄编辑录入页（HeroEdit.vue） (关联,多选,el-select, multiple)
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

### 2.12 英雄的技能编辑=》将英雄编辑页内容用tab包裹区分为basic 和skills 两个tab页
```js
// admin\src\views\HeroEdit.vue
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
      ...
<script>
  export default {
    props: {
      id: {},
    },
    data() {
      return {
        categories: [],
        items: [],
        model: {
          skills: [],
          scores: {
            difficult: 0,
          },
        },
        parents: [],
        imageUrl: '',
      };
    },
    created() {
      this.fetchParents();
      this.fetchCategories();
      this.fetchItems();
      this.id && this.fetch(this.id);
    },
    methods: {
      afterUpload(res, file) {
        console.log(res, file);
        this.$set(this.model, 'avatar', res.url);
        // this.model.icon = res.url; // 可能会无法响应赋值,也可以先在data上定义好，就 不用set赋值了。
        // this.imageUrl = URL.createObjectURL(res.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      async fetch(id) {
        const res = await this.$http.get(`/rest/hero/${id}`);
        console.log(res);
        // 通过y一次浅拷贝，确保model中有多层属性
        this.model = Object.assign({}, this.model, res.data);
        // this.model = res.data;
      },
      async fetchParents() {
        const res = await this.$http.get(`/rest/hero/`);
        console.log(res);
        this.parents = res.data;
      },
      async fetchCategories() {
        const res = await this.$http.get(`/rest/categories/`);
        console.log(res);
        this.categories = res.data;
      },
      async fetchItems() {
        const res = await this.$http.get(`/rest/item/`);
        // console.log(res);
        this.items = res.data;
      },
      async save() {
        if (this.id) {
          const res = await this.$http.put(`/rest/hero/${this.id}`, this.model);
          console.log(res);
          this.$message({
            type: 'success',
            message: '编辑成功',
          });
          this.$router.push('/hero/list');
          return;
        }
        // async await 与  this.$http.post().then 相似
        const res = await this.$http.post('/rest/hero/', this.model);
        console.log(res);
        this.$message({
          type: 'success',
          message: '创建成功',
        });
        this.$router.push('/hero/list');
      },
    },
  };
</script> 
```

### 2.13 文章管理，同一篇文章可能属于多个分类，这个要注意
#### 2.13.1 admin端Main.vue中添加侧边栏
```js
// admin\src\views\Main.vue
        <el-menu-item-group>
          <template slot="title">文章</template>
          <el-menu-item index="/articles/create">新建文章</el-menu-item>
          <el-menu-item index="/articles/list">文章列表</el-menu-item>
        </el-menu-item-group>
```
#### 2.13.2 admin端复制添加ArticleEdit.vue和ArticleList.vue

#### 2.13.3 admin端router.js中添加路由
```js
// admin\src\router\index.js
import ArticleEdit from '../views/ArticleEdit.vue'
import ArticleList from '../views/ArticleList.vue'

      {path:'/articles/create',component:ArticleEdit},
      {path:'/articles/List',component:ArticleList},
      {path:'/articles/create/:id',component:ArticleEdit,props:true}
```

#### 2.13.4 修改ArticleEdit.vue
```js
// admin\src\views\ArticleEdit.vue
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

#### 2.13.5 server端添加Article.js模型
```js
// server\models\Article.js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title:{type:String},
    categories:[{type:mongoose.SchemaTypes.ObjectId,ref:'Category'}]
    body:{type:String}
})

module.exports = mongoose.model('Article',schema)
```

#### 10.6、admin端修改ArticleList.vue
```js
// admin\src\views\ArticleList.vue
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

### 2.14 富文本编辑器使用github上的 vue2-editor 可直接npm下载 或 vue-quill-editor
```js
// admin 目录下安装
npm install --save vue2-editor
```
ps:优化富文本内 图片上传 vue2-editor 自定义上传图片函数已经改为 @image-added
```js
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
  //   import aaa from 'vue2-editor';  // 另一种写法，对象写法 ，用 aaa.VueEditor 获取
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
```

### 2.15 广告位轮播图
```js
// admin\src\views\Main.vue
          <el-menu-item-group>
            <template slot="title">广告位</template>
            <el-menu-item index="/ad/create">新建广告位</el-menu-item>
            <el-menu-item index="/ad/list">广告位列表</el-menu-item>
          </el-menu-item-group>
```

```js
// admin\src\router\index.js
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
```

admin端src/views新建 AdEdit.vue AdList.vue

server端model下新建Ad.js
```js
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
```

### 2.16 管理员账号设置
```js
// 服务端设置模型  server/models/AdminUser.js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: { type: String },
    password: { type: String }
})

module.exports = mongoose.model('AdminUser', schema)
```

管理端main.vue页面设置联接
router/index.js设置路由
服务端安装插件，并建立模型，密码加盐 
```js
npm i bcrypt  // 因gyp错误未安装成功，改成
npm install bcryptjs
```

```js
// server\models\AdminUser.js
// let bcrypt= require('bcryptjs')  可以定义变量引用，也可以直接引用
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
```

### 2.17 后台登录页面
```js
// admin\src\views\Login.vue
<template>
  <div class="login-container">
    <video
      autoplay
      muted
      loop
      poster="../assets/bg.jpg"
      class="bgvid"
      id="bgvid"
    >
      <!-- <source src="../assets/bg.mp4" type="video/mp4" /> -->
    </video>
    <el-card header="请先登录" class="login-card">
      <el-form label-width="70px" @submit.native.prevent="login">
        <el-form-item label="用户名">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="model.username"
            required
            minlength="3"
            maxlength="20"
            placeholder="name"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            type="password"
            prefix-icon="el-icon-s-opportunity"
            clearable
            required
            maxlength="20"
            error
            v-model="model.password"
            placeholder="password"
            minlength="5"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item
          style="display: flex; justify-content: space-between; flex-wrap: wrap"
        >
          <el-button type="primary" native-type="submit">登录</el-button>
          <el-button type="primary" @click="afterpage">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        model: {},
      };
    },
    created() {
      this.model = {};
    },
    methods: {
      async login() {
        const res = await this.$http.post('login', this.model);
        console.lo(res);
      },
      afterpage() {},
    },
  };
</script>
<style scoped>
  #bgvid {
    position: fixed;
    right: 0;
    bottom: 0;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    z-index: -2;
    background: url(../assets/bg.jpg) no-repeat;
    background-size: cover;
  }
  .login-card {
    width: 20rem;
    margin: 5rem auto;
  }
  .login-container {
    text-align: center;
  }
</style>
```

```js
// server/routes/admin/index.js
    // server端新建登录接口
    app.post('/admin/api/login', async (req, res) => {
        // 结构赋值
        const { username, password } = req.body
        // 1.根据用户名找用户,引入模型，定义方法
        const AdminUser = require('../../models/AdminUser')
        // 简化 {username：username}
        const user = await AdminUser.findOne({ username })
        if (!user) {
            return res.status(422).send({ message: '用户不存在' })
        }
        // 2.校验密码

        // 3.返回token，如果是错误，则在http.js中拦截器统一处理
        res.send({ code: 20000, message: 'ok' })
    })
```

```js
    admin/http.js
// 统一处理http错误
http.interceptors.response.use(res => {
    return res
}, err => {
    console.log(err, err.response)
    if (err.response.data.message) {
        // console.log(err.response.data.message)
        // 统一处理时， 用vue的实例弹出这个错误
        Vue.prototype.$message({
            type: 'error',
            message: err.response.data.message
        })
    }

    return Promise.reject(err)
})
```

```js
//  server/routes/admin/index.js
// 优化登录接口，增加密码校验和生成token
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
        if (!isValid) {
            return res.status(422).send({ message: '密码校验错误' })
        }

        // 3.返回token，如果是错误，则在http.js中拦截器统一处理
        // npm i jsonwebtoken
        // 
        const jwt = require('jsonwebtoken')

        // 签名，生成token,加密返回,get会和路由冲突，通过参数的设置让路由进行判断
        const token = jwt.sign({ id: user.id }, app.get('secret'))
        res.send({ code: 20000, message: 'ok', data: { token } })
    })
```

### 2.19 继续增加中间件，校验用户是否登录, 此时在前端admin头上添加token
```js
    //前端 http.js
    // 2-19 请求拦截器，增加token header
http.interceptors.request.use(config => {
    //标准授权请求头
    config.headers.Authorization = 'Bearer ' + localStorage.token || ''
    return config
}, error => {
    return Promise.reject(error)
})
```

```js
        // 后端server/routes/admin/index.js
        // 单独引入 AdminUser模型，供后期调用
    const AdminUser = require('../../models/AdminUser')
    //引用校验token
    const jwt = require('jsonwebtoken')
    router.get('/', async (req, res, next) => {
        const token = String(req.headers.authorization || '').split(' ').pop()
        console.log(token)
        // const tokenData = jwt.verify(token, app.get('secret'), (err, data) => {
        //     console.log(err, data)
        //     if (err && err.message === 'invalid token') return res.send({ message: '无效 token', code: 0 })

        //     if (err && err.message === 'jwt expired') return res.send({ message: 'token 失效', code: 0 })

        //    
        // })
        // tokenData: {id:'String',iat: 'Number'} 既解析出了id
        const { id } = jwt.verify(token, app.get('secret'))
        // // 把用户信息挂载到req上
        req.user = await AdminUser.findById(id)
        console.log(req.user)
        next()

    }, async (req, res) => {})
```

```js
    // node.js服务端报错使用http-assert，能够很方便的返回错误
    // 2-19 继续增加 npm install http-assert 这个是node.js下判断条件是否成立。用法： assert（确保条件存在，如果不存在抛出什么状态码，信息是什么)
```

### 2.20 admin前端还需要对没有axios请求的页面进行登录限制，譬如 /item/create 页面没有请求，后端就限制不到
```js
// router/index.js增加全局前置路由守卫
router.beforeEach((to, from, next) => {
    if (!to.meta.isPublic && !localStorage.token) {
        return next('/login')
    }
    next()
})
```

```js
// 增加中间件后，上传图片因为没有token header出错,el-upload 增加headers参数
        <el-upload
          class="avatar-uploader"
          :action="$http.defaults.baseURL + '/upload'"
          :headers="headers"
          :show-file-list="false"
          :on-success="afterUpload"
          :before-upload="beforeAvatarUpload"
        >
        ...
        data() {
            return {
                headers: {
                  Authorization: 'Bearer ' + localStorage.token,
                },
            }
        }
```

```js
// 图片上传headers错误的另一种处理方法：url 和 header混入。
Vue.mixin({
    computed: {
        uploadUrl() {
            return this.$http.defaults.baseURL + '/upload'
        }
    },
    methods: {
        getAuthHeaders() {
            return {
                Authorization: `Bearer ${localStorage.token}`
            }
        }
    }
})
```

### 3.1-3.2 Web界面安装sass 和样式重置
```js
// sass-loader 最新版会不兼容，所以要安装老版本
npm install -D sass
npm install -D sass-loader@7.x
```
```js
// 新建src/style/index.scss，重置并设置样式
// reset

* {
    box-sizing: border-box; //  统一margin、padding样式
    outline: none; // 取消tab高亮
}
html {
    font-size: 13px;
}
body {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.2rem;
    background-color: #f1f1f1;
}
a {
    color: #999;
}

```
### 3.3 web端src/style/index.scss，网站色彩和字体定义,熟悉函数的使用

```js

// colors 定义颜色,注意是内部逗号结尾，外部分号结尾
$colors: (
    'primary': #db9e3f,
    'white': #fff,
    'black': #000,
   'dark':#222,
   'grey':#999,
   'light':#f9f9f9,
   'dark-1':#343440

);
@each $colorKey,$color in $colors {
    .text-#{$colorKey} {
        color: $color;
    }
    .bg-#{$colorKey} {
        background-color: $color;
    }
}
// text 文字对齐方式
@each $var in (left,center,right) {
    .text-#{$var} {
        text-align: $var;
    }
};
// font size
$base-font-size: 1rem;
$font-sizes: (
    xs: .769231,  // 10px
    sm: .923077,  //12px
    md:1,  //13px
    lg: 1.076923, //14px
    xl: 1.230769, //16px
    );
@each $sizeKey,$size in $font-sizes {
    .fs-#{$sizeKey} {
        font-size: $size * $base-font-size;
    }
}

```

### 3.4 web端src/style/index.scss，通用flex布局样式定义
```js
// flex
.d-flex {
    display: flex;
}
.flex-column {
    flex-direction: column;
}
$flex-jc: (
    start: flex-start,
    end: flex-end,
    center: center,
    between: space-between,
    around:space-around,
);
@each $key,$value in $flex-jc {
    .jc-#{$key} {
        justify-content: $value
    }
}
$flex-ai: (
    start: flex-start,
    end: flex-end,
    center: center,
    stretch: stretch,
);
@each $key,$value in $flex-ai {
    .ai-#{$key} {
        align-items: $value
    }
}
// 拓展整个空余空间
.flex-1 {
    flex: 1
}
//  等同于上一个类，意味着填充整个剩余空间
.flex-grow-1 {
    flex-grow:1
}
```

### 3.5 web端src/style/index.scss，常用边距margin、padding定义
```js
// spacing
// 0-5 : 0
// .mt-1 margin top level1; .pb-2 padding bottom level2
// 类型
$spacing-types: (m: margin,p: padding);
// 方向
$spacing-directions: (t: top,r:right,b:bottom,l:left);
// 定义单位尺寸
$pacing-base-size: 1rem;
$spaceing-sizes: (0:0,1:0.25,2:0.5,3:1,4:1.5,5:3);
// @each $typeKey,$type in $spacing-types {
//     .#{$typeKey} {
//         #{$type}: 0
//     }
// }
// 根据上面的结构，去三级嵌套循环,生成带方位和不带方位的
@each $typeKey,$type in $spacing-types {
    // .m-1 不带方位的形式
        @each $sizeKey,$size in $spaceing-sizes {
            // .m-1 {margin:0.25rem}
            .#{$typeKey}-#{$sizeKey}{ 
                #{$type}:$size*$pacing-base-size}
        }
    // .mt-1 带方位的形式
    @each $directionKey,$direction in $spacing-directions {
        @each $sizeKey,$size in $spaceing-sizes {
            // .mt-1 {margin-top:0.25rem}
            .#{$typeKey}#{$directionKey}-#{$sizeKey}{ 
                #{$type}-#{$direction}:$size*$pacing-base-size
            }
        }
    }
    // .mx-1 水平左右保持一致 .my-1 垂直上下保持一致
            @each $sizeKey,$size in $spaceing-sizes {
            // .mx-1 {margin:0.25rem}
            .#{$typeKey}x-#{$sizeKey}{ 
                #{$type}-left:$size*$pacing-base-size;
                #{$type}-right:$size*$pacing-base-size;
            }
            // .my-1 {margin:0.25rem}   
            .#{$typeKey}y-#{$sizeKey}{ 
                #{$type}-top:$size*$pacing-base-size;
                #{$type}-bottom:$size*$pacing-base-size;
            }
        }
}
```

### 3.6 web页面主页框架和顶部菜单

```js
vue add router //增加路由
```
```js
// web\src\views\Main.vue
<template>
  <div>
    <div class="topbar bg-black py-2 text-white px-3 d-flex ai-center">
      <img src="../assets/logo.png" height="30" alt="" sizes="" srcset="" />
      <!-- 用flex-1去占据全部的剩余空间 -->
      <div class="px-2 flex-1">
        <div class="text-white">王者荣耀</div>
        <div class="text-dark-1">团队成就更多</div>
      </div>
      <button type="button" class="btn bg-primary jc-end">立即下载</button>
    </div>
    <div class="bg-primary pt-3 pb-2">
      <!-- 增加反色nav-inverse,去掉d-flex text-white -->
      <div class="nav nav-inverse jc-around pb-1">
        <div class="nav-item active">
          <router-link class="nav-link" to="/" tag="div">首页</router-link>
        </div>
        <div class="nav-item">
          <router-link class="nav-link" to="/about" tag="div"
            >攻略中心</router-link
          >
        </div>
        <div class="nav-item">
          <router-link class="nav-link" to="/" tag="div">赛事中心</router-link>
        </div>
      </div>
    </div>
    <!-- 所有子路由入口 -->
    <router-view></router-view>
  </div>
</template>

<script>
  export default {};
</script>

<style>
</style>
```

### 3.7 web页面swiper
```js
npm install vue-awesome-swiper --save
// web\src\views\Home.vue
// template
    <swiper ref="mySwiper" :options="swiperOptions">
      <swiper-slide>
        <img
          class="w-100"
          src="../assets/images/201.jpeg"
          alt=""
          sizes=""
          srcset=""
        />
      </swiper-slide>
      <swiper-slide>
        <img
          class="w-100"
          src="../assets/images/202.jpeg"
          alt=""
          sizes=""
          srcset=""
        />
      </swiper-slide>
      <div
        class="swiper-pagination pagination-home text-right px-3 pb-2"
        slot="pagination"
      ></div>
    </swiper>
    ...
// js
// 自动播放 点击选择
        swiperOptions: {
          slidesPerView: 1,
          autoplay: {
            disableOnInteraction: false,
            delay: 1000,
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
```
### 3.8 web页面使用精灵图
```js
// sprite 
// web\src\style\index.scss
.sprite {
    background: url(../assets/images/index.png) no-repeat 0 0;
    // 一般双倍像素设计
    background-size: 28.846154rem;
    // 要设置宽高必须用 inline-block
    display: inline-block;
    // spritecow.com网站 可以自动定位雪碧图
    &.sprite-news {
    width: 1.769231rem;
	height: 1.538462rem;
    background-position: 63.546% 15.517%;
    }
    &.sprite-arrow {
    width: .769231rem;
	height: .769231rem;
    background-position: 38.577% 52.076%;
    }
    &.sprite-news {
    width: 1.769231rem;
	height: 1.538462rem;
    background-position: 63.546% 15.517%;
    }
    &.sprite-practice {
    width: 1.7692rem;
    height: 1.5385rem;
    background-position: 90.483% 15.614%;
  }
  &.sprite-affair {
    background-position: 36.746% 0.924%;
    width: 1.4615rem;
    height: 1.6923rem;
  }
  &.sprite-mall {
    background-position: 10.408% 15.517%;
    width: 1.5385rem;
    height: 1.5385rem;
    border: none;
  }
  &.sprite-start {
    background-position: 89.733% 1.266%;
    width: 1.5385rem;
    height: 1.6154rem;
  }
  &.sprite-honour {
    background-position: 36.467% 15.287%;
    width: 1.8462rem;
    height: 1.5385rem;
  }
  &.sprite-community {
    background-position: 9.728% 1.266%;
    width: 2rem;
    height: 1.6154rem;
  }
  &.sprite-base {
    margin-top: -3px;
    background-position: 63.3% 0.927%;
    width: 1.8462rem;
    height: 1.8462rem;
  }
  &.sprite-echart {
    background-position: 0 96.207%;
    width: 1.8462rem;
    height: 1.5385rem;
  }
  &.sprite-edition {
    background: url(../assets/images/version-icon.png) no-repeat -1px 0px;
    background-size: 100% 100%;
    width: 1.8462rem;
    height: 1.8462rem;
  }
}
```
```js
// 精灵图的收起和展开
        <div
          class="bg-light py-2 fs-sm;"
          style="width: 100%"
          @click="switchActive"
        >
          <i
            class="sprite sprite-arrow mr-1"
            :style="{ transform: isCollapse ? 'rotate(180deg)' : '' }"
          ></i>
          <span class="retract">{{ isCollapse ? '收起' : '展开' }}</span>
        </div>
```

### 3.9 web页面字体图标
https://www.iconfont.cn/ 选择图标，下载代码压缩包，解压之
```js
import './assets/iconfont/iconfont.css'
<i class="iconfont icon-news text-primary"></i>
```

### 3.10 web页面卡片容器并调整为组件字体图标
  所有的新闻资讯、英雄列表都可以变成一个卡片包装
```js
// web\src\main.js 全局引入，也可局部引入

import './assets/iconfont/iconfont.css'

<i class="iconfont icon-news text-primary"></i>
```

```js
// components/Card.vue
<template>
  <div class="card mt-3 p-3 bg-white">
    <div class="card-header d-flex ai-center pb-3">
      <i class="iconfont" :class="`icon-${icon}`" style="color: deeppink"></i>
      <div class="fs-xl flex-1 px-2">{{ title }}</div>
      <i class="iconfont icon-menu"></i>
    </div>
    <div class="card-body pt-3">
      <!-- 使用插槽功能,展示父组件的内容 -->
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    // 父子组件传值
    props: {
      title: {
        type: String,
        required: true,
        default: '',
      },
      icon: {
        type: String,
        required: true,
        default: '',
      },
    },
  };
</script>

<style lang="scss">
  @import '../style/_variables.scss';
  .card {
    border-bottom: 1px solid $border-color;
    .card-header {
      border-bottom: 1px solid $border-color;
    }
  }
</style>
```

card组件的引入，有两种方式，全局引入、局部引入
```js
// 如果全局引用组件
// web\src\main.js
import Card from './components/Card.vue'
Vue.component('a-card', Card)
```

```js
// 如果局部引入组件
// web\src\views\Home.vue
</template>
  <div>
    <a-card icon="caidananniudianji" title="新闻资讯-全局组件"></a-card>
    <m-card icon="caidananniudianji" title="图文攻略"></m-card>
  </div>
</template>
<script>
  // @ is an alias to /src
  import Card from '../components/Card';
  export default {
    name: 'Home',
    components: { 'm-card': Card },
    ...
```

### 3.11 web页继续优化card，抽象首页card的各个部分，形成listcard、nav、swiper组件
```js
// web\src\components\ListCard.vue 理想是传入数据，直接展示新闻、英雄列表和图文攻略
<template>
  <a-card :icon="icon" :title="title">
    <!-- 应用插槽展示数据 -->
    <div class="nav jc-between">
      <div
        class="nav-item"
        :class="{ active: active === index }"
        v-for="(category, index) in categories"
        :key="index"
        @click="
          () => {
            active = index;
            $refs.list.$swiper.slideTo(index);
          }
        "
      >
        <div class="nav-link" v-text="category.name">热门</div>
      </div>
    </div>
    <div class="card-body pt-3">
      <swiper
        ref="list"
        @slide-change="() => (active = $refs.list.$swiper.realIndex)"
      >
        <swiper-slide v-for="(category, index) in categories" :key="index">
          <!-- 具名插槽，把子组件的数据再传递给父组件，便于后面区分新闻资讯、英雄列表、视频列表的不同样式展示 -->
          <slot name="items" :category="category"></slot>
        </swiper-slide>
      </swiper>
    </div>
  </a-card>
</template>

<script>
  export default {
    props: {
      icon: { type: String, required: true },
      title: {
        type: String,
        required: true,
      },
      // 分类
      categories: { type: Array, required: true },
    },
    data() {
      return {
        active: 0,
      };
    },
  };
</script>

<style>
</style>
```

```js
// web\src\main.js
// 全局引用CardList组件
import ListCard from './components/ListCard.vue'
Vue.component('m-list-card', ListCard)
```
 
```js
// Web界面中的swiper的点击和滑动控制样式功能
// 点击转跳区域
@click = "$refs.list.$swiper.slideTo(i)"
//区域改变，active的样式也跟随变化
@slide-change="() => active = $refs.list.$swiper.realIndex"
```

```js
// web\src\views\Home.vue 引入ListCard组件
    <!-- 封装好的高级组件 -->
    <m-list-card
      icon="caidananniudianji"
      title="新闻资讯-ListCard组件"
      :categories="newsCats"
    >
      <!-- 在父组件里，不通过循环，直接拿到子组件里的具名slot的数据，
      这样的好处是 子组件的内容可以由父组件决定怎么展示 -->
      <template #items="{ category }">
        <div
          class="py-2"
          v-for="(item, index) in category.newsList"
          :key="index"
        >
          <span v-text="item.categoryName">[新闻]</span>
          <span>|</span>
          <span v-text="item.title + item._id"
            >春和景明柳垂莺娇，峡谷好礼随春报到</span
          >
          <span v-text="item.date">06/12</span>
        </div>
      </template>
      <!-- <template v-slot:heros="{ category }"></template> -->
    </m-list-card>
```
### 3.12 web页新闻资讯的数据录入
```js
// web\src\components\ListCard.vue 理想是传入数据，直接展示新闻、英雄列表和图文攻略

```
```js
web\src\views\Main.vue
<style lang="scss">
  //   增加吸顶效果
  .topbar {
    position: sticky;
    top: 0;
    z-index: 999;
  }
</style>
```
```js
// console终端中输出html中的文字
$$('.news_list_cont a').map(el=>el.innerHTML)
$$('.news_list .title').map(el=>el.innerHTML).slice(5)
```
```js
// 写一个接口去自动录入新闻资讯的标题
// 1.server端引入插件，可以直接读取文件夹下所有文件
npm install require-all --save

// server\plugins\db.js使用该插件
    // 2.（）当成一个函数使用，再传入一个路径,回退到上级路径
    require('require-all')(__dirname + '/../models')
    //初始化数据

 // server\routes\web\index.js
module.exports = app => {
    const router = require('express').Router()
    //通过访问一个路径来写入数据,这样是数据能通过js的方式来写入数据库，不用自己在后台一个个添加
    // 初始化新闻数据

    // const Article = require('../../models/Article') // 这种要一个个引入相对麻烦些
    const mongoose = require('mongoose')// 另外一种方式是直接通过mongoose读取数据库
    // 使用模型
    const Artice = mongoose.model('Article')
    const Category = mongoose.model('Category')

    router.get('/news/init', async (req, res) => {
        const parent = await Category.findOne({
            name: '新闻分类'
        })
        console.log(parent)
        //获取分类，lean表示获取纯粹的json数组，用where限制分类新闻分类
        const cats = await Category.find().lean().where({
            parent: parent
        });
        // console.log(cats);
        const newsTitles = ["嫦娥皮肤设计大赛最终投票开启公告", "狄某有话说｜姜子牙化身“象棋高手”？", "3月17日外挂专项打击公告", "3月17日“演员”惩罚名单", "3月17日净化游戏环境声明及处罚公告", "3月16日体验服停机更新公告", "老亚瑟的答疑时间：貂蝉-仲夏夜之梦海报优化计划，王昭君-凤凰于飞优化海报过程稿", "嫦娥皮肤设计大赛人气创意奖、优秀创意奖公布", "3月16日账号注销流程变更说明", "春和景明柳垂莺娇，峡谷好礼随春报到", "3月16日全服不停机更新公告", "3月13日体验服不停机更新公告", "3月12日体验服停机更新公告", "3月12日体验服停机更新公告", "狄某有话说｜江湖规矩，对线不打“WiFi”牛", "第三届王者荣耀全国大赛赛事日历公布", "嫦娥皮肤设计大赛最终投票开启公告", "狄某有话说｜姜子牙化身“象棋高手”？", "老亚瑟的答疑时间：貂蝉-仲夏夜之梦海报优化计划，王昭君-凤凰于飞优化海报过程稿", "嫦娥皮肤设计大赛人气创意奖、优秀创意奖公布", "超丰厚奖励等你赢！第三届王者荣耀全国大赛北京海选首站（北京丰科万达站）即将开赛！", "第三届王者荣耀全国大赛——安徽省再次启航！", "第三届王者荣耀全国大赛城市赛道——第一期海选赛赛点信息", "斗鱼新势力战队选拔赛", "狄某有话说｜江湖规矩，对线不打“WiFi”牛", "老亚瑟的答疑时间：貂蝉-仲夏夜之梦及金色仲夏夜优化后海报展示", "王者荣耀·女神节 峡谷女神才艺showtime还不来围观！", "狄某有话说｜春节回顾，2月对局环境数据盘点！", "嫦娥皮肤设计大赛首轮投票开启公告", "老亚瑟的答疑时间：皮肤优化沟通月历上线，公孙离-祈雪灵祝优化进度展示"]
        // 打算制造随机分类，slice是为了防止影响数据本身，复制一份数据去排序。Math.random()-0.5是让数据在正负0.5之间随机，slice(0,2)是取两个数
        const randomCats = cats.slice(0).sort((a, b) => Math.random() - 0.5).slice(0, 2)
        const newList = newsTitles.map(title => {
            return {
                categories: randomCats, // 打乱随机取2个分类
                title: title
            }
        })
        // 清空原有数据库,再插入数据
        await Artice.deleteMany({})
        await Artice.insertMany(newList)
        res.send(newList)
    })

    app.use('/web/api', router)
}

// server\index.js
// 导入web 路由
require('./routes/web')(app)

//3. http://localhost:3000/web/api/news/init  后端api可以访问到数据
``` 
### 3.13 web页新闻资讯的数据接口
```js
// server\models\Category.js
// 优化完善分类模型，建立虚拟联接
const mongoose = require('mongoose')

// 定义模型字段
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' } // 类型为ObjectId 并关联Category表
})

// 3.13 设置虚拟字段：子分类,类似vue中的计算属性，它是通过已定义的schema属性的计算\组合\拼接得到的新的值
schema.virtual('children', {
    localField: '_id', // 内键,schema对应的模型Title的_id
    foreignField: 'parent', //外键,关联模型Category的parent键
    justOne: false, // 只查询一条数据
    ref: 'Category' // 关联的模型
})

// 3.13 分类关联新闻标题
schema.virtual('newsList', {
    localField: '_id', // 内键,schema对应的模型Category的_id
    foreignField: 'categories', //外键,关联模型Article的categories键
    justOne: false, // 只查询一条数据
    ref: 'Article' // 关联的模型
})


// 导出Category模型，哪里需要用，哪里引入，引入到 routes/admin/index.js
module.exports = mongoose.model('Category', schema)
```

```js
    // server\routes\web\index.js
    // 新增 新闻列表接口，用于前端调用。以分类为主题，关联新闻
    router.get('/news/list', async (req, res) => {
        // //3.13 调出子分类，顺便调出子分类里的新闻，用populate关联,用lean展示出来，但存在问题不能查询单独的分类数量
        // const parent = await Category.findOne({
        //     name: '新闻资讯'
        // }).populate({
        //     path: 'children',
        //     populate: {
        //         path: 'newsList'
        //     }
        // }).lean()
        // 3.13 另一种方式，聚合查询,可以同时查询多次，聚合参数叫聚合管道
        const parent = await Category.findOne({
            name: '新闻资讯'
        })
        const cats = await Category.aggregate([
            // 条件查询:字段 = 上级分类，找到分类，这一步与where查询没有太大区别
            { $match: { parent: parent._id } },
            // 类似与关系数据库的关联联接，左关联联接left join
            // 定义模型是，第三个参数collection省略了，它表示集合的名字，省略后默认是模型的复数小写。
            // 从哪个集合，本地键，外键、as给起个名字
            { $lookup: { from: 'articles', localField: '_id', foreignField: 'categories', as: 'newsList' } },
            // 定义要几个.添加\修改字段，特殊操作符slice 
            //  每一个分类只要5个
            { $addFields: { newsList: { $slice: ['$newsList', 5] } } }
        ]
        )
        const subCats = cats.map(v => v._id)
        // 热门分类，是独立于四个分类，新增的,不限制分类，条件是 子分类是那些 in操作符会筛选出字段值等于制定数组中任何值的文档
        cats.unshift({
            name: '热门',
            newsList: await Artice.find().where({
                categories: { $in: subCats }
                // 关联 categories字段，把_id拓展为名称
            }).populate('categories').limit(5).lean()
        })
        // 把newsList上增加catergoryName，方便前端显示
        cats.map(cat => {
            cat.newsList.map(news => {
                news.categoryName = cat.name === '热门' ? news.categories[0].name : cat.name
                return news
            })
            return cat
        })

        res.send(cats)
    })
```

### 3.14 web页首页新闻资讯界面展示
前端安装 axios 配置http.js 偷个懒，和admin一致，注意的是请求地址为
```js
 baseURL: 'http://localhost:3000/web/api'
```
```js
// web端安装日期时间格式化工具
npm install dayjs --save
```
```js
// 单行文字，多余的省略掉
// text overflow
.text-ellipsis {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
```
完整代码如下
```js
// web\src\views\Home.vue
<template>
  <div class="home">
    <swiper ref="mySwiper" :options="swiperOptions">
      <swiper-slide>
        <img
          class="w-100"
          src="../assets/images/201.jpeg"
          alt=""
          sizes=""
          srcset=""
        />
      </swiper-slide>
      <swiper-slide>
        <img
          class="w-100"
          src="../assets/images/202.jpeg"
          alt=""
          sizes=""
          srcset=""
        />
      </swiper-slide>
      <swiper-slide>
        <img
          class="w-100"
          src="../assets/images/203.jpeg"
          alt=""
          sizes=""
          srcset=""
        />
      </swiper-slide>
      <swiper-slide>
        <img
          class="w-100"
          src="../assets/images/204.jpeg"
          alt=""
          sizes=""
          srcset=""
        />
      </swiper-slide>
      <div
        class="swiper-pagination pagination-home text-right px-3 pb-2"
        slot="pagination"
      ></div>
    </swiper>
    <!-- end of swiper -->
    <!-- 图标导航 -->
    <!-- 外部容器text-center pt-3 内部容易mb-3 这样能统一样式 -->
    <transition name="fade" mode="out-in">
      <div
        class="nav-icons bg-white mt-3 d-flex flex-wrap text-center pt-3 text-grey-1"
      >
        <!-- <div class="nav-icons bg-white mt-3 text-center pt-3 text-grey-1"> -->
        <!-- <div class="nav-item mb-3" v-for="n in 10" :key="n">
        <i class="sprite sprite-news"></i>
        <div class="py-2">爆料站</div>
      </div> -->
        <!-- 处理底部的收起按钮，需要把d-flex flex-wrap 放在子集的div上，跟它平级写个收起的div -->

        <div class="d-flex flex-wrap" :class="{ toggleActive: isCollapse }">
          <a href class="nav-item my-3">
            <i class="sprite sprite-news"></i>
            <div>爆料站</div>
          </a>
          <a href class="nav-item my-3">
            <i class="sprite sprite-practice"></i>
            <div>故事站</div>
          </a>
          <a href class="nav-item my-3">
            <i class="sprite sprite-affair"></i>
            <div>周边商城</div>
          </a>
          <a href class="nav-item my-3 border-none">
            <i class="sprite sprite-mall"></i>
            <div>体验服</div>
          </a>
          <a href class="nav-item my-2">
            <i class="sprite sprite-start"></i>
            <div>新人专区</div>
          </a>
          <a href class="nav-item my-2">
            <i class="sprite sprite-honour"></i>
            <div>荣耀·传承</div>
          </a>
          <a href class="nav-item my-2">
            <i class="sprite sprite-community"></i>
            <div>同人社区</div>
          </a>
          <a href class="nav-item my-2 border-none">
            <i class="sprite sprite-base"></i>
            <div>王者营地</div>
          </a>
          <a href class="nav-item my-2">
            <i class="sprite sprite-echart"></i>
            <div>公众号</div>
          </a>
          <a href class="nav-item my-2">
            <i class="sprite sprite-edition"></i>
            <div>版本介绍</div>
          </a>
        </div>
        <!-- <div class="d-flex flex-wrap"> -->
        <div
          class="bg-light py-2 fs-sm;"
          style="width: 100%"
          @click="switchActive"
        >
          <i
            class="sprite sprite-arrow mr-1"
            :style="{ transform: isCollapse ? 'rotate(180deg)' : '' }"
          ></i>
          <span class="retract">{{ isCollapse ? '收起' : '展开' }}</span>
        </div>
      </div>
    </transition>
    <!-- end of 图标模块 -->
    <!-- begin of 字体图标 -->
    <!-- <i class="iconfont icon-news text-primary"></i> -->
    <!-- end of 字体图标 -->
    <!-- begin of 新闻资讯卡片 -->
    <div class="card mt-3 p-3 bg-white">
      <div class="card-header d-flex ai-center pb-3">
        <i class="iconfont icon-caidananniudianji" style="color: deeppink"></i>
        <div class="fs-xl flex-1 px-2">新闻资讯</div>
        <i class="iconfont icon-menu"></i>
      </div>
      <div class="card-body pt-3">
        <div class="nav jc-between">
          <div class="nav-item active">
            <div class="nav-link">热门</div>
          </div>
          <div class="nav-item">
            <div class="nav-link">新闻</div>
          </div>
          <div class="nav-item">
            <div class="nav-link">新闻</div>
          </div>
          <div class="nav-item">
            <div class="nav-link">新闻</div>
          </div>
          <div class="nav-item">
            <div class="nav-link">新闻</div>
          </div>
        </div>
        <div class="pt-3">
          <swiper>
            <swiper-slide v-for="m in 5" :key="m"
              ><div class="py-2" v-for="n in 5" :key="n">
                <span>[新闻]</span>
                <span>|</span>
                <span>春和景明柳垂莺娇，峡谷好礼随春报到</span>
                <span>06/12</span>
              </div></swiper-slide
            >
          </swiper>
        </div>
      </div>
    </div>
    <a-card icon="caidananniudianji" title="新闻资讯-全局组件">
      <!-- 应用插槽展示数据 -->
      <div class="nav jc-between">
        <div class="nav-item active">
          <div class="nav-link">热门</div>
        </div>
        <div class="nav-item">
          <div class="nav-link">新闻</div>
        </div>
        <div class="nav-item">
          <div class="nav-link">新闻</div>
        </div>
        <div class="nav-item">
          <div class="nav-link">新闻</div>
        </div>
        <div class="nav-item">
          <div class="nav-link">新闻</div>
        </div>
      </div>
      <div class="pt-3">
        <swiper>
          <swiper-slide v-for="m in 5" :key="m"
            ><div class="py-2" v-for="n in 5" :key="n">
              <span>[新闻]</span>
              <span>|</span>
              <span>春和景明柳垂莺娇，峡谷好礼随春报到</span>
              <span>06/12</span>
            </div></swiper-slide
          >
        </swiper>
      </div>
    </a-card>
    <!-- 封装好的高级组件 -->
    <m-list-card
      icon="caidananniudianji"
      title="新闻资讯-ListCard组件"
      :categories="newsCats"
    >
      <!-- 在父组件里，不通过循环，直接拿到子组件里的具名slot的数据，
      这样的好处是 子组件的内容可以由父组件决定怎么展示 -->
      <template #items="{ category }">
        <div
          class="py-2 fs-lg d-flex"
          v-for="(item, index) in category.newsList"
          :key="index"
        >
          <span class="text-info" v-text="`[${item.categoryName}]`"
            >[新闻]</span
          >
          <span class="px-1">|</span>
          <span
            class="flex-1 text-dark-1 text-ellipsis pr-2"
            v-text="item.title"
            >春和景明柳垂莺娇，峡谷好礼随春报到</span
          >
          <span class="text-grey-1 fs-sm">{{ item.createdAt | date }}</span>
        </div>
      </template>
      <!-- <template v-slot:heros="{ category }"></template> -->
    </m-list-card>
    <m-card icon="caidananniudianji" title="新闻资讯-局部组件"></m-card>
    <m-card icon="caidananniudianji" title="英雄列表"></m-card>
    <m-card icon="caidananniudianji" title="精彩视频"></m-card>
    <m-card icon="caidananniudianji" title="图文攻略"></m-card>
    <!-- end of 新闻资讯卡片 -->
  </div>
</template>

<script>
  import dayjs from 'dayjs';
  // @ is an alias to /src
  import Card from '../components/Card';
  export default {
    filters: {
      date(val) {
        return dayjs(val).format('MM/DD');
      },
    },
    name: 'Home',
    components: { 'm-card': Card },
    data() {
      return {
        swiperOptions: {
          slidesPerView: 1,
          autoplay: {
            disableOnInteraction: false,
            delay: 2000,
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
        },
        isCollapse: true,
        // 定义ListCard组件的数据结构
        // newsList的简单写法，新建数组5填充1，再map循环替换成对象
        newsCats: [
          {
            _id: 1,
            name: '热门',
            newsList: new Array(5).fill(1).map((v) => ({
              _id: v + 201,
              categoryName: '赛事',
              title: '景明柳垂莺娇，峡谷好礼随春报到',
              date: '06/01',
            })),
          },
          {
            _id: 2,
            name: '新闻',
            newsList: new Array(5).fill(2).map((v) => ({
              _id: v + 202,
              categoryName: '赛事',
              title: '景明柳垂莺娇，峡谷好礼随春报到',
              date: '06/01',
            })),
          },
        ],
        // 后台数据
        // newsCats: [],
        herosCats: [],
      };
    },
    created() {
      this.fetchNewsCats();
    },
    mounted() {
      console.log('Current Swiper instance object', this.swiper);
      //   this.swiper.slideTo(3, 1000, false);
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.$swiper;
      },
    },
    methods: {
      async fetchNewsCats() {
        const res = await this.$http.get('news/list');
        this.newsCats = res.data;
      },
      switchActive() {
        this.isCollapse = !this.isCollapse;
      },
    },
  };
</script>
<style lang='scss' scope>
  @import '../style/variables.scss';
  //  重新定义一个class，便于单独管理各个页面的swipers
  .pagination-home {
    .swiper-pagination-bullet {
      display: inline-block;
      opacity: 1;
      border-radius: 0.1538rem;
      background-color: map-get($colors, 'white');
      //   background-color: #ffffff;
      &.swiper-pagination-bullet-active {
        background: map-get($colors, 'info');
      }
    }
  }
  .nav-icons {
    border-top: 1px solid $border-color;
    border-bottom: 1px solid $border-color;
    .nav-item {
      width: 25%;
      // 取消右侧的边框
      border-right: 1px solid $border-color;
      &:nth-child(4n) {
        border-right: none;
      }
    }
  }
  .toggleActive {
    height: 60px;
    overflow: hidden;
  }
  .fade-enter {
    opacity: 0;
  }
  .fade-leave {
    opacity: 1;
  }
  .fade-leave-active,
  .fade-enter-active {
    transition: opacity 0.9s;
  }
</style>

```

### 3.15 web首页英雄列表提取官方数据
```js
$$('.hero-nav > li').map(( li,i)=>{return {heros:$$('li',$$('.hero-list')[i]).map(el=>{return {name:$$('h3',el)[0].innerHTML}}),name:li.innerText}})
```
```js
$$('.hero-nav > li').map(( li,i)=>{return {heros:$$('li',$$('.hero-list')[i]).map(el=>{return {name:$$('h3',el)[0].innerHTML,avatar:$$('img',el)[0].src}}),name:li.innerText}})
```


### 13、 使用jsonwebtoken进行登陆数据传输

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
