import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import './style/index.scss'
import router from './router'

import http from './http'
Vue.prototype.$http = http

// require styles
import 'swiper/css/swiper.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper, /* { default options with global component } */)

import './assets/iconfont/iconfont.css'

// 全局引用组件
import Card from './components/Card.vue'
Vue.component('a-card', Card)

// 全局引用CardList组件
import ListCard from './components/ListCard.vue'
Vue.component('m-list-card', ListCard)

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
