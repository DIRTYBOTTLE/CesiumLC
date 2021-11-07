import {
    createRouter,
    createWebHistory
} from 'vue-router'
import Cookies from 'js-cookie'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('views/Login.vue')
        },
        {
            path: '/home',
            name: 'home',
            component: () => import('views/Home.vue'),
            children: [
                { path: '', component: () => import('views/Home/HomePage.vue') },
                { path: 'homepage', name: 'homepage', component: () => import('views/Home/HomePage.vue') },
                { path: 'geodata', name: 'geodata', component: () => import('views/Home/GeoData.vue') },
                { path: 'service', name: 'service', component: () => import('views/Home/Service.vue') },
                { path: 'application', name: 'application', component: () => import('views/Home/Application.vue') },
                { path: 'cadviewer', name: 'cadviewer', component: () => import('views/Home/CadViewer.vue') },
                { path: "three", name: 'three', component: () => import('views/Home/Three.vue') },
                { path: "suggestion", name: 'suggestion', component: () => import('views/Home/Suggestion.vue') },
                { path: "user", name: 'user', component: () => import('views/Home/User.vue') }
            ]
        },
    ]
})

router.beforeEach((to, from, next) => {
    // if (to.name !== 'login' && !Cookies.get('username')) next({ name: 'login' })
    // else
    next()
})

export default router