import Vue from 'vue'
import App from './App.vue'

// 导入axios插件
// import axios from 'axios'

// 在main.js里面也可以导入全局样式less/css文件
// import '@/styles/base.less' //@代表src vue脚手架中 @ === src 

Vue.config.productionTip = false

import '@/plugins/element.js'

// import router from '@/router/index.js'
// 只要该文件夹里面的子文件名是 index.xxx 形式的，可以省略不写
import router from '@/router'

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
