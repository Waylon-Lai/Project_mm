import Vue from 'vue'
import App from './App.vue'

// 导入axios插件
// import axios from 'axios'

import '@/styles/base.less'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
