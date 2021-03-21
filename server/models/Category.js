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

