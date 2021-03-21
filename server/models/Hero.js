const mongoose = require('mongoose')

// 定义模型字段
const schema = new mongoose.Schema({
    name: { type: String },
    parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'Hero' }, // 类型为ObjectId 并关联Item表
    avatar: { type: String },
    title: { type: String }, // 称号
    categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }], //分类可能是多个，譬如 法师/战士，所以类型是个数组，不用{}用[]
    // 打分
    scores: {
        difficult: { type: Number },
        skills: { type: Number },
        attack: { type: Number },
        survive: { type: Number },
    }, // 打分 声明为对象键值对数据，包含难度、技能、攻击、生存 ,在关系型数据库中可能不会这么定义。
    // 技能 多个
    skills: [{
        icon: { type: String },
        name: { type: String },
        description: { type: String },
        tips: { type: String }
    }],
    // 装备 2个字段 顺风装备、逆风装备
    items1: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Item' }],
    items2: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Item' }],
    // 使用技巧 文本类型
    usageTips: { type: String },
    battleTips: { type: String },
    teamTips: { type: String },
    // 搭档 选择英雄并增加描述
    partners: [{
        hero: { type: mongoose.SchemaTypes.ObjectId, ref: 'Hero' },
        description: { type: String }
    }]

})

// 导出Item模型，哪里需要用，哪里引入，引入到 routes/admin/index.js
// 需要注意的是如果指定第三个参数 集合 如果自动指定会变成heros这是不合理的，需要手动指定为heroes
module.exports = mongoose.model('Hero', schema, 'heroes')
