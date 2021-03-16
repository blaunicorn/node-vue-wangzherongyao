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
        }]
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
