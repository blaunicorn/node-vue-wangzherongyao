// web端接口
module.exports = app => {
    const router = require('express').Router()
    //通过访问一个路径来写入数据,这样是数据能通过js的方式来写入数据库，不用自己在后台一个个添加
    // 初始化新闻数据

    // const Article = require('../../models/Article') // 这种要一个个引入相对麻烦些
    const mongoose = require('mongoose')// 另外一种方式是直接通过mongoose读取数据库
    // 使用模型
    const Article = mongoose.model('Article')
    const Category = mongoose.model('Category')
    const Hero = mongoose.model('Hero')

    // 导入新闻资讯接口
    router.get('/news/init', async (req, res) => {
        const parent = await Category.findOne({
            name: '新闻资讯'
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

    // 新闻列表接口，用于前端调用。以分类为主题，关联新闻
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
            newsList: await Article.find().where({
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

    // 导入英雄列表接口
    router.get('/heroes/init', async (req, res) => {
        // 清空原有数据库,再插入数据
        await Hero.deleteMany({})
        const rawData = [{ "heroes": [{ "name": "鲁班七号", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/112/112.jpg" }, { "name": "安琪拉", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/142/142.jpg" }, { "name": "亚瑟", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg" }, { "name": "后羿", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/169/169.jpg" }, { "name": "吕布", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/123/123.jpg" }, { "name": "孙悟空", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/167/167.jpg" }, { "name": "妲己", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/109/109.jpg" }, { "name": "瑶", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/505/505.jpg" }, { "name": "马可波罗", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/132/132.jpg" }, { "name": "诸葛亮", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/190/190.jpg" }], "name": "热门" }, { "heroes": [{ "name": "赵云", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/107/107.jpg" }, { "name": "墨子", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/108/108.jpg" }, { "name": "钟无艳", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/117/117.jpg" }, { "name": "吕布", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/123/123.jpg" }, { "name": "夏侯惇", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/126/126.jpg" }, { "name": "曹操", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/128/128.jpg" }, { "name": "典韦", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/129/129.jpg" }, { "name": "宫本武藏", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/130/130.jpg" }, { "name": "达摩", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/134/134.jpg" }, { "name": "老夫子", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/139/139.jpg" }, { "name": "关羽", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/140/140.jpg" }, { "name": "程咬金", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/144/144.jpg" }, { "name": "露娜", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/146/146.jpg" }, { "name": "花木兰", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/154/154.jpg" }, { "name": "橘右京", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/163/163.jpg" }, { "name": "亚瑟", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg" }, { "name": "孙悟空", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/167/167.jpg" }, { "name": "刘备", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/170/170.jpg" }, { "name": "杨戬", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/178/178.jpg" }, { "name": "雅典娜", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/183/183.jpg" }, { "name": "哪吒", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/180/180.jpg" }, { "name": "铠", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/193/193.jpg" }, { "name": "苏烈", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/194/194.jpg" }, { "name": "梦奇", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/198/198.jpg" }, { "name": "裴擒虎", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/502/502.jpg" }, { "name": "狂铁", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/503/503.jpg" }, { "name": "孙策", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/510/510.jpg" }, { "name": "李信", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/507/507.jpg" }, { "name": "盘古", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/529/529.jpg" }, { "name": "云中君", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/506/506.jpg" }, { "name": "曜", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/522/522.jpg" }, { "name": "马超", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/518/518.jpg" }, { "name": "蒙恬", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/527/527.jpg" }, { "name": "夏洛特", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/536/536.jpg" }, { "name": "司空震", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/537/537.jpg" }], "name": "战士" }, { "heroes": [{ "name": "小乔", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/106/106.jpg" }, { "name": "墨子", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/108/108.jpg" }, { "name": "妲己", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/109/109.jpg" }, { "name": "嬴政", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/110/110.jpg" }, { "name": "高渐离", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/115/115.jpg" }, { "name": "孙膑", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/118/118.jpg" }, { "name": "扁鹊", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/119/119.jpg" }, { "name": "芈月", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/121/121.jpg" }, { "name": "周瑜", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/124/124.jpg" }, { "name": "甄姬", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/127/127.jpg" }, { "name": "武则天", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/136/136.jpg" }, { "name": "貂蝉", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/141/141.jpg" }, { "name": "安琪拉", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/142/142.jpg" }, { "name": "露娜", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/146/146.jpg" }, { "name": "姜子牙", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/148/148.jpg" }, { "name": "王昭君", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/152/152.jpg" }, { "name": "张良", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/156/156.jpg" }, { "name": "不知火舞", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/157/157.jpg" }, { "name": "钟馗", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/175/175.jpg" }, { "name": "诸葛亮", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/190/190.jpg" }, { "name": "干将莫邪", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/182/182.jpg" }, { "name": "女娲", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/179/179.jpg" }, { "name": "杨玉环", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/176/176.jpg" }, { "name": "弈星", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/197/197.jpg" }, { "name": "米莱狄", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/504/504.jpg" }, { "name": "司马懿", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/137/137.jpg" }, { "name": "沈梦溪", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/312/312.jpg" }, { "name": "上官婉儿", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/513/513.jpg" }, { "name": "嫦娥", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/515/515.jpg" }, { "name": "西施", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/523/523.jpg" }, { "name": "司空震", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/537/537.jpg" }], "name": "法师" }, { "heroes": [{ "name": "廉颇", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/105/105.jpg" }, { "name": "庄周", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/113/113.jpg" }, { "name": "刘禅", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/114/114.jpg" }, { "name": "钟无艳", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/117/117.jpg" }, { "name": "白起", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/120/120.jpg" }, { "name": "芈月", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/121/121.jpg" }, { "name": "吕布", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/123/123.jpg" }, { "name": "夏侯惇", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/126/126.jpg" }, { "name": "达摩", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/134/134.jpg" }, { "name": "项羽", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/135/135.jpg" }, { "name": "程咬金", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/144/144.jpg" }, { "name": "刘邦", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/149/149.jpg" }, { "name": "亚瑟", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg" }, { "name": "牛魔", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/168/168.jpg" }, { "name": "张飞", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/171/171.jpg" }, { "name": "太乙真人", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/186/186.jpg" }, { "name": "东皇太一", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/187/187.jpg" }, { "name": "铠", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/193/193.jpg" }, { "name": "苏烈", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/194/194.jpg" }, { "name": "梦奇", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/198/198.jpg" }, { "name": "孙策", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/510/510.jpg" }, { "name": "盾山", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/509/509.jpg" }, { "name": "嫦娥", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/515/515.jpg" }, { "name": "猪八戒", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/511/511.jpg" }, { "name": "蒙恬", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/527/527.jpg" }, { "name": "阿古朵", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/533/533.jpg" }], "name": "坦克" }, { "heroes": [{ "name": "赵云", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/107/107.jpg" }, { "name": "阿轲", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/116/116.jpg" }, { "name": "李白", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/131/131.jpg" }, { "name": "貂蝉", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/141/141.jpg" }, { "name": "韩信", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/150/150.jpg" }, { "name": "兰陵王", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/153/153.jpg" }, { "name": "花木兰", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/154/154.jpg" }, { "name": "不知火舞", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/157/157.jpg" }, { "name": "娜可露露", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/162/162.jpg" }, { "name": "橘右京", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/163/163.jpg" }, { "name": "孙悟空", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/167/167.jpg" }, { "name": "百里守约", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/196/196.jpg" }, { "name": "百里玄策", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/195/195.jpg" }, { "name": "裴擒虎", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/502/502.jpg" }, { "name": "元歌", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/125/125.jpg" }, { "name": "司马懿", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/137/137.jpg" }, { "name": "上官婉儿", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/513/513.jpg" }, { "name": "云中君", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/506/506.jpg" }, { "name": "马超", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/518/518.jpg" }, { "name": "镜", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/531/531.jpg" }, { "name": "澜", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/528/528.jpg" }], "name": "刺客" }, { "heroes": [{ "name": "孙尚香", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/111/111.jpg" }, { "name": "鲁班七号", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/112/112.jpg" }, { "name": "马可波罗", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/132/132.jpg" }, { "name": "狄仁杰", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/133/133.jpg" }, { "name": "后羿", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/169/169.jpg" }, { "name": "李元芳", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/173/173.jpg" }, { "name": "虞姬", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/174/174.jpg" }, { "name": "成吉思汗", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/177/177.jpg" }, { "name": "黄忠", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/192/192.jpg" }, { "name": "百里守约", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/196/196.jpg" }, { "name": "公孙离", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/199/199.jpg" }, { "name": "伽罗", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/508/508.jpg" }, { "name": "蒙犽", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/524/524.jpg" }], "name": "射手" }, { "heroes": [{ "name": "庄周", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/113/113.jpg" }, { "name": "刘禅", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/114/114.jpg" }, { "name": "孙膑", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/118/118.jpg" }, { "name": "牛魔", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/168/168.jpg" }, { "name": "张飞", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/171/171.jpg" }, { "name": "钟馗", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/175/175.jpg" }, { "name": "蔡文姬", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/184/184.jpg" }, { "name": "太乙真人", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/186/186.jpg" }, { "name": "大乔", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/191/191.jpg" }, { "name": "东皇太一", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/187/187.jpg" }, { "name": "鬼谷子", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/189/189.jpg" }, { "name": "明世隐", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/501/501.jpg" }, { "name": "盾山", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/509/509.jpg" }, { "name": "瑶", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/505/505.jpg" }, { "name": "鲁班大师", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/525/525.jpg" }, { "name": "阿古朵", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/533/533.jpg" }], "name": "辅助" }]
        // 数组用for in 循环 返回的是索引值。 用of 返回的对象的数据
        for (let cat of rawData) {
            if (cat.name === '热门') {
                continue
            }
            // 增加分类的id,找到当前分类在数据库中对应的数据
            const category = await Category.findOne({
                name: cat.name
            })
            console.log(cat, category)
            cat.heroes = cat.heroes.map(hero => {
                // 可以写id，但mongodb足够智能，可以自动判断。
                // 对象引用传值，改了里面的也相当于改了本身
                hero.categories = [category]
                // hero.categories = [category.id]
                return hero
            })
            // 录入英雄

            await Hero.insertMany(cat.heroes)

        }
        res.send(await Hero.find())
    })

    // 英雄列表接口
    router.get('/hero/list', async (req, res) => {
        // 查找英雄列表
        const parent = await Category.findOne({
            name: '英雄分类'
        })
        // 聚合管道查询，多个条件1.查所有parent._id字段=上面的parent._id  2.关联查询heroes集合，本地字段_id,外键，也就是在heroes中的字段是categories，as 是作为什么名字
        const cats = await Category.aggregate([
            { $match: { parent: parent._id } },
            {
                $lookup: {
                    from: 'heroes',
                    localField: '_id',
                    foreignField: 'categories',
                    as: 'heroList'
                }
            },
            // 查出后，添加修改一个字段，把heroList 从原有的所有个字段中取10个，暂时不需要限制取几条
            // {
            //     $addFields: {
            //         heroList: { $slice: ['$heroList', 10] }
            //     }
            // }
        ])
        // console.log(cats)
        // 由于没有热门 这个分类，需要我们手动去查询添加。查询hero模型，关联categories模型，限制10条，
        const subCats = cats.map(v => v._id)
        cats.unshift({
            name: '热门',
            heroList: await Hero.find().where({
                categories: { $in: subCats }
            }).limit(10).lean()
            // }).populate('categories').limit(10).lean()
        })
        // console.log(cats)
        // cats.map(cat => {
        //     cat.heroList.map(news => {
        //         news.categoryName = (cat.name === '热门') ? news.categories[0].name : cat.name
        //         return news
        //     })
        //     return cat
        // })
        res.send(cats)
    })

    // 文章详情
    // :id 定义时是带冒号的形参
    router.get('/articles/:id', async (req, res) => {
        // console.log(req.params.id)
        // 3.19 增加lean()变成纯粹的json对象
        const data = await Article.findById(req.params.id).lean()
        data.related = await Article.find().where({
            // 不包含查询本身
            // title: { $ne: data.categories.title }
            // 包含查询本身
            categories: { $in: data.categories }
        }).limit(2)
        res.send(data)
    })

    //英雄详情简略
    router.get('/heroes/:id', async (req, res) => {
        // 这里主要要关联调用，取出分类的名字，否则只是分类的_id
        const data = await Hero.findById(req.params.id).populate('categories').lean()
        res.send(data)
    })

    app.use('/web/api', router)
}