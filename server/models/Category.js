const mongoose = require('mongoose')

// 定义模型字段
const schema = new mongoose.Schema({
    name: { type: String },

    parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' } // 类型为ObjectId 并关联Category表
})

// 导出Category模型，哪里需要用，哪里引入，引入到 routes/admin/index.js
module.exports = mongoose.model('Category', schema)

