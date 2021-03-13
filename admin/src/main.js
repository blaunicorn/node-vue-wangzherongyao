import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import './style/index.css'
Vue.use(ElementUI);

Vue.config.productionTip = false

import http from './http'
Vue.prototype.$http = http

// 图片上传的url 和 header混入。
Vue.mixin({
    computed: {
        uploadUrl() {
            return this.$http.defaults.baseURL + '/upload'
        }
    },
    methods: {
        getAuthHeaders() {
            return {
                Authorization: `Bearer ${localStorage.token || ''}`
            }
        }
    }
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
