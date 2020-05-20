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
            redirect: '/login'
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

// 按需导入 操作token的方法
import { getToken } from "@/utils/token.js";

// 设置全局前置守卫 用来判断用户是否有权限前往某个页面
// 只要一发生路由跳转 便会执行这个方法
// to: Route: 即将要进入的目标 路由对象
// from: Route: 当前导航正要离开的路由
// next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
router.beforeEach((to, from, next) => {
    // console.log('前往页面：', to);
    // console.log('当前页面：', from);
    if (to.fullPath == '/login') {
        next(); //前往的是login登录页面  默认允许访问
    } else {
        const token = getToken(); //查看本地有没有用户登录后设置在本地的token值  核实用户有没有权限访问对应页面
        if (token) {
            next(); //有token值  允许访问
        } else {
            next('/login');//没有token值  打回登录页面
        }
    }
})

export default router;