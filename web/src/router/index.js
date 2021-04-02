import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'main',
        component: Main,
        redirect: '/home',
        children: [{
            path: '/home',
            name: 'Home',
            component: () => import(/* webpackChunkName: "Home" */ '../views/Home.vue')
        }, {
            path: '/articles/:id',
            name: 'Article',
            component: () => import(/* webpackChunkName: "Article" */ '../views/Article.vue'),
            props: true
        }]
    },
    // 因为不会集成顶部布局，所以不用放在main的children里
    {
        path: '/heroes/:id',
        name: 'Hero',
        component: () => import(/* webpackChunkName: "Hero" */ '../views/Hero.vue'),
        props: true
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
]

const router = new VueRouter({
    routes
})

export default router
