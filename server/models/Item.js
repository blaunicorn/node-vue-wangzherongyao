const mongoose = require('mongoose')

// 定义模型字段
const schema = new mongoose.Schema({
    name: { type: String },
    parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'Item' }, // 类型为ObjectId 并关联Item表
    icon: { type: String }
})

// 导出Item模型，哪里需要用，哪里引入，引入到 routes/admin/index.js
module.exports = mongoose.model('Item', schema)
