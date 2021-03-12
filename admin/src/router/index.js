import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [

    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/home',
        name: 'Home',
        component: Home
    },
    {
        path: '/',
        name: 'Main',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "main" */ '../views/Main.vue'),
        children: [
            {
                path: '/categories/create',
                name: 'CategoriesCreate',
                component: () => import('../views/CategoriesEdit.vue')
            },
            {
                path: '/categories/edit/:id',
                name: 'CategoriesEdit',
                component: () => import('../views/CategoriesEdit.vue'),
                props: true // 允许参数注入
            },
            {
                path: '/categories/list',
                name: 'CategoriesList',
                component: () => import('../views/CategoriesList.vue')
            },
            {
                path: '/item/create',
                name: 'ItemCreate',
                component: () => import('../views/ItemEdit.vue')
            },
            {
                path: '/item/edit/:id',
                name: 'ItemEdit',
                component: () => import('../views/ItemEdit.vue'),
                props: true // 允许参数注入
            },
            {
                path: '/item/list',
                name: 'ItemList',
                component: () => import('../views/ItemList.vue')
            },
            {
                path: '/hero/create',
                name: 'HeroCreate',
                component: () => import('../views/HeroEdit.vue')
            },
            {
                path: '/hero/edit/:id',
                name: 'HeroEdit',
                component: () => import('../views/HeroEdit.vue'),
                props: true // 允许参数注入
            },
            {
                path: '/hero/list',
                name: 'HeroList',
                component: () => import('../views/HeroList.vue')
            },
            {
                path: '/article/create',
                name: 'ArticleCreate',
                component: () => import('../views/ArticleEdit.vue')
            },
            {
                path: '/article/edit/:id',
                name: 'ArticleEdit',
                component: () => import('../views/ArticleEdit.vue'),
                props: true // 允许参数注入
            },
            {
                path: '/article/list',
                name: 'ArticleList',
                component: () => import('../views/ArticleList.vue')
            },
            {
                path: '/ad/create',
                name: 'AdCreate',
                component: () => import('../views/AdEdit.vue')
            },
            {
                path: '/ad/edit/:id',
                name: 'AdEdit',
                component: () => import('../views/AdEdit.vue'),
                props: true // 允许参数注入
            },
            {
                path: '/ad/list',
                name: 'AdList',
                component: () => import('../views/AdList.vue')
            },
            {
                path: '/admin_user/create',
                name: 'AdminUserCreate',
                component: () => import('../views/AdminUserEdit.vue')
            },
            {
                path: '/admin_user/edit/:id',
                name: 'AdminUserEdit',
                component: () => import('../views/AdminUserEdit.vue'),
                props: true // 允许参数注入
            },
            {
                path: '/admin_user/list',
                name: 'AdminUserList',
                component: () => import('../views/AdminUserList.vue')
            }
        ]
    }

    //   {
    //     path: '/about',
    //     name: 'About',
    //     // route level code-splitting
    //     // this generates a separate chunk (about.[hash].js) for this route
    //     // which is lazy-loaded when the route is visited.
    //     component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    //   }
]

const router = new VueRouter({
    routes
})

export default router
