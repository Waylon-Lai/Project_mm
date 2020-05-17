import Vue from 'vue'
import axios from 'axios'

// 配置axios的默认基地址
axios.defaults.baseURL = process.env.VUE_APP_BASEURL;
// 允许携带cookies
axios.defaults.withCredentials = true;
// 配置全局axios
Vue.prototype.$axios = axios;
