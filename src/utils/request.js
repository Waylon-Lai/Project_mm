import Vue from 'vue'
import axios from 'axios'
// 按需导入 操作token的方法
import { getToken, removeToken } from "@/utils/token.js";
// 导入路由文件
import router from '../router';

// 配置axios的默认基地址
axios.defaults.baseURL = process.env.VUE_APP_BASEURL;
// 允许携带cookies
axios.defaults.withCredentials = true;

// 设置请求拦截器  每次发送请求都会调用
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    // 在发送请求前需要做的事
    // 这里主要要在发送请求前设置请求头 携带token 
    const token = getToken();
    if (token) {
        //如果存在token  就设置请求头  携带token  确保处于"登录状态"
        config.headers.token = token;
    }
    // console.log('config', config);
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// 设置响应拦截器  每次发送请求都会调用
axios.interceptors.response.use(function (response) {
    // Do something with response data
    // 对响应回来内容进行一些处理
    // 这里主要是判断 token 是否已过期
    // console.log('response:', response);
    if (response.data.code == 206) {
        // token 已过期 那么就删除token   并跳回到登录页
        removeToken();
        router.push('/login'); //此处的 router === 组件中的 this.$router
        return; //不需要再返回响应数据了
    }
    return response;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});

// 配置全局axios
Vue.prototype.$axios = axios;
