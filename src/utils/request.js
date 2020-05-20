import Vue from 'vue'
import axios from 'axios'
// 按需导入 操作token的方法
import { getToken } from "@/utils/token.js";

// 配置axios的默认基地址
axios.defaults.baseURL = process.env.VUE_APP_BASEURL;
// 允许携带cookies
axios.defaults.withCredentials = true;

// 设置请求拦截器  每次发送请求都会调用
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    // 在发送请求前需要做的事
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

// 配置全局axios
Vue.prototype.$axios = axios;
