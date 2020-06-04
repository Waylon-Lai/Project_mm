<template>
  <el-container class="layout">
    <el-header class="header">
      <div class="left">
        <i style="font-size: 20px;" class="el-icon-s-fold" @click="isCollapse = !isCollapse"></i>
        <img src="@/assets/layout_icon.png" class="marginlr" alt />
        <span class="title">黑马面面</span>
      </div>
      <div class="right">
        <!-- <img :src="avatar" alt />
        <span class="name">{{ username }} 欢迎您</span>-->
        <!-- 使用store仓库中的数据 
        在调用仓库中定义在getters里面的方法时，不能加（）-->
        <img :src="BASEURL + '/' + $store.getters.getUserInfo.avatar" alt />
        <span class="name">{{ $store.getters.getUserInfo.username }} 欢迎您</span>
        <el-button type="primary" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <!-- 必须要给侧边栏设置 width="auto" 才会跟随折叠菜单一起被折叠 -->
      <el-aside width="auto" class="aside">
        <!-- router: 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
        <el-menu
          :router="true"
          :default-active="defaultActive"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
        >
          <!-- 在 el-menu-item 的index 属性值中设置要跳转的路由 -->
          <el-menu-item index="/layout/chart">
            <i class="el-icon-pie-chart"></i>
            <span slot="title">数据预览</span>
          </el-menu-item>
          <el-menu-item index="/layout/user">
            <i class="el-icon-user"></i>
            <span slot="title">用户列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/enterprise">
            <i class="el-icon-office-building"></i>
            <span slot="title">企业列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/question">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">题库列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/subject">
            <i class="el-icon-notebook-2"></i>
            <span slot="title">学科列表</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main style="background-color: #f3f3f3">
        <!-- 在内容显示区域设置嵌套路由  点击左侧导航栏跳转的页面将会显示在这里 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { removeToken } from "@/utils/token.js";
export default {
  name: "Layout",
  data() {
    return {
      // avatar:
      //   "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1589955332&di=d294de48ed1922c058c3a34be5a9c873&src=http://b-ssl.duitang.com/uploads/item/201808/05/20180805160830_tvznv.jpg",
      // username: "至安",
      BASEURL: process.env.VUE_APP_BASEURL,
      isCollapse: false, // 是否收起折叠菜单，默认不收起
      defaultActive: "" //左侧导航栏默认选中的栏目（高亮提示）
    };
  },
  created() {
    // 一进来页面就调用获取用户信息的方法
    this.getUserInfo();
    // console.log(this.$route);
    // 根据实时路由地址 赋值给左侧导航栏默认选中的栏目
    this.defaultActive = this.$route.fullPath;
  },
  methods: {
    // 获取用户信息
    async getUserInfo() {
      const res = await this.$axios({
        method: "get",
        url: "/info"
        // 设置请求头  携带token  确保处于"登录状态"
        // headers: {
        //   token: getToken()
        // }
      });
      // console.log(res);
      if (res.data.code == 200) {
        this.username = res.data.data.username;
        this.avatar = process.env.VUE_APP_BASEURL + "/" + res.data.data.avatar;

        // 把获取到的数据存在使用vuex创建的仓库中 以供其他组件使用
        // 'setUserInfo'为store仓库中定义在mutations里面的方法
        this.$store.commit("setUserInfo", res.data.data);
      }
    },
    // 登出功能
    logout() {
      this.$confirm("此操作将会登出当前账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios({
            method: "get",
            url: "/logout"
          });
          // console.log(res);
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "登出成功!"
            });
            // 删除token
            removeToken();
            // 跳转到登录页
            this.$router.push("/login");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消登出"
          });
        });
    }
  }
};
</script>

<style lang="less">
.layout {
  height: 100%;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f3f3f3;
    .left {
      display: flex;
      align-items: center;
      .marginlr {
        margin-left: 10px;
        margin-right: 10px;
      }
      .title {
        font-size: 22px;
        color: #49a1ff;
      }
    }
    .right {
      display: flex;
      align-items: center;
      img {
        width: 43px;
        height: 43px;
        margin-right: 9px;
        border-radius: 50%;
      }
      .name {
        margin-right: 38px;
      }
    }
  }
  .aside {
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
      min-height: 400px;
    }
    .el-menu {
      border-right: 0;
    }
  }
}
</style>