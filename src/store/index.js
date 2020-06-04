import Vue from 'vue'
import Vuex from 'vuex'

// 使用vuex插件
Vue.use(Vuex);

// 创建一个 store 仓库
const store = new Vuex.Store({
    state: {
        // 定义将来仓库中要操作的数据
        userInfo: {},
    },
    mutations: {
        // 所有操作仓库数据的方法都写在这里
        /**
         * state 就代表上面 state对象
         * userInfo 代表要传递过来的用户信息 ，也就是普通的形参
         */
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        }
    },
    getters: {
        // 所有获取仓库中数据的方法，写在getters中
        getUserInfo(state) {
            return state.userInfo;
        }
    }
});

// 暴露出去
export default store;