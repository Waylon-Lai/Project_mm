<template>
  <el-container class="layout">
    <el-header class="header">
      <div class="left">
        <i style="font-size: 20px;" class="el-icon-s-fold" @click="isCollapse = !isCollapse"></i>
        <img src="@/assets/layout_icon.png" class="marginlr" alt />
        <span class="title">黑马面面</span>
      </div>
      <div class="right">
        <img :src="avatar" alt />
        <span class="name">{{ username }} 欢迎您</span>
        <el-button type="primary" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="auto" class="aside">
        <el-menu default-active="3" class="el-menu-vertical-demo" :collapse="isCollapse">
          <el-menu-item index="1">
            <i class="el-icon-pie-chart"></i>
            <span slot="title">数据预览</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-user"></i>
            <span slot="title">用户列表</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-office-building"></i>
            <span slot="title">企业列表</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">题库列表</span>
          </el-menu-item>
          <el-menu-item index="5">
            <i class="el-icon-notebook-2"></i>
            <span slot="title">学科列表</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main style="background-color: #f3f3f3">内容部分</el-main>
    </el-container>
  </el-container>
</template>

<script>
import { removeToken } from "@/utils/token.js";
export default {
  name: "Layout",
  data() {
    return {
      avatar:
        "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1589955332&di=d294de48ed1922c058c3a34be5a9c873&src=http://b-ssl.duitang.com/uploads/item/201808/05/20180805160830_tvznv.jpg",
      username: "至安",
      isCollapse: false
    };
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
  },
  created() {
    // 一进来页面就调用获取用户信息的方法
    this.getUserInfo();
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