import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/hoem',
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
