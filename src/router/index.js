import Vue from 'vue'

import VueRouter from 'vue-router'

Vue.use(VueRouter);

import Login from '@/views/Login/index.vue'
// 只要该文件夹里面的子文件名是 index.xxx 形式的，可以省略不写
import Layout from '@/views/Layout'

let router = new VueRouter({
    routes: [
        {
            path: '*',
            redirect: '/Login'
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/layout',
            component: Layout
        }
    ]
});

export default router;