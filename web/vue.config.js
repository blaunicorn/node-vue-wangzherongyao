module.exports = {

    publicPath: process.env.NODE_ENV === 'production' ? '/' : './',
    // 输出到指定文件夹
    // __dirname 指vue.config.js的当前文件夹，后面用..回退到server文件夹
    outputDir: __dirname + '/../server/wwwroot/web',
    assetsDir: 'static'
}