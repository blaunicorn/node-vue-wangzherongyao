import axios from 'axios'
import Vue from 'vue'
import router from './router/index'
const http = axios.create({
    // 4.1 替换变量
    baseURL: process.env.VUE_APP_API_URL || '/web/api'
    // baseURL: 'http://localhost:3000/web/api'
})
// 2-19 请求拦截器，增加token header
http.interceptors.request.use(config => {
    //标准授权请求头
    if (localStorage.token) {
        config.headers.Authorization = 'Bearer ' + localStorage.token
    }

    return config
}, error => {
    return Promise.reject(error)
})
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
        // 2-19 细化返回错误的逻辑，如果报401 返回login页 需要前后端统一约定
        if (err.response.status === 401) {
            // 2-19 需要模块化引入router和vue 否则会因为没有router模块报错。
            // Vue.prototype.$router.push('./login')
            router.push('/login')
        }
    }


    return Promise.reject(err)
})
export default http