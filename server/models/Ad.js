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
