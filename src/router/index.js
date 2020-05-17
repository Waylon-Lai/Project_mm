import Vue from 'vue'

import VueRouter from 'vue-router'

Vue.use(VueRouter);

import Login from '@/views/login/index.vue'
// 只要该文件夹里面的子文件名是 index.xxx 形式的，可以省略不写
// 组件名首字母一般大写
import Layout from '@/views/layout'

let router = new VueRouter({
    routes: [
        {
            // 路由重定向
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