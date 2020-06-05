import Vue from 'vue'

import VueRouter from 'vue-router'

Vue.use(VueRouter);

// 导入路由组件
// import Login from '@/views/login/index.vue'
// // 只要该文件夹里面的子文件名是 index.xxx 形式的，可以省略不写
// // 组件名首字母一般大写
// import Layout from '@/views/layout'
// import Chart from '@/views/layout/chart'
// import Enterprise from '@/views/layout/enterprise'
// import Question from '@/views/layout/question'
// import Subject from '@/views/layout/subject'
// import User from '@/views/layout/user'

// 要提高首页的加载效率 git需要配置路由组件的懒加载 
// 只需要在导入路由组件的时候将其定义一个能够被 Webpack 自动代码分割的异步组件即可
const Login = () => import('@/views/login/index.vue')
const Layout = () => import('@/views/layout')
const Chart = () => import('@/views/layout/chart')
const Enterprise = () => import('@/views/layout/enterprise')
const Question = () => import('@/views/layout/question')
const Subject = () => import('@/views/layout/subject')
const User = () => import('@/views/layout/user')

let router = new VueRouter({
    routes: [
        {
            // 路由重定向
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: Login
        },
        {
            //方法一： 设置一进入layout页面直接跳转到子组件user中
            // 注意点：一定要写在 layout的路由配置前面
            path: '/layout',
            redirect: '/layout/user'
        },
        {
            path: '/layout',
            component: Layout,
            // 设置 嵌套路由 
            // 要在嵌套的出口中渲染组件，需要在 VueRouter 的参数中使用 children 配置：
            // 要注意，以 / 开头的嵌套路径会被当作根路径。所以不需要 /
            children: [
                {
                    path: 'chart', component: Chart,
                    // 路由元信息  本项目的后台没有返回对应用户角色的权限列表 
                    // 我们在路由配置的时候，给每个路由通过配置元数据的方式，来简单控制下用户权限
                    meta: {
                        roles: ['超级管理员', '管理员', '老师'], //可以访问这个路由的用户角色
                        icon: "el-icon-pie-chart",
                        fullPath: "/layout/chart",
                        title: "数据预览",
                    }
                },
                {
                    path: 'enterprise', component: Enterprise,
                    meta: {
                        roles: ["超级管理员", "管理员", "老师"],
                        icon: "el-icon-office-building",
                        fullPath: "/layout/enterprise",
                        title: "企业列表",
                    }
                },
                {
                    path: 'question', component: Question,
                    meta: {
                        roles: ["超级管理员", "管理员", "老师", "学生"],
                        icon: "el-icon-edit-outline",
                        fullPath: "/layout/question",
                        title: "题库列表",
                    }
                },
                {
                    path: 'subject', component: Subject,
                    meta: {
                        roles: ["超级管理员", "管理员", "老师"],
                        icon: "el-icon-notebook-2",
                        fullPath: "/layout/subject",
                        title: "学科列表",
                    }
                },
                {
                    path: 'user', component: User,
                    meta: {
                        roles: ["超级管理员", "管理员", "老师"],
                        icon: "el-icon-user",
                        fullPath: "/layout/user",
                        title: "用户列表",
                    }
                },
            ]
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
            //方法二： 设置一进入layout页面直接跳转到子组件user中
            // if (to.fullPath == '/layout') {
            //     next('/layout/user');
            //     return;
            // }
            next(); //有token值  允许访问
        } else {
            next('/login');//没有token值  打回登录页面
        }
    }
});
// 全局后置钩子
// 可在这里设置路由跳转后的内容
router.afterEach((to, from) => {
    // console.log('to:', to);
    // console.log('from:', from);
    // 设置页面标题为前往路由中配置的元信息中的title 或者 取默认值'黑马面面后台管理系统'
    document.title = to.meta.title || '黑马面面后台管理系统';
})

// 暴露出去
export default router;