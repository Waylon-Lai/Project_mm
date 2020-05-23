<template>
  <div class="enterprise">
    <!-- 搜索部分 -->
    <el-card>
      <el-form inline :model="enterpriseForm" ref="enterpriseFormRef" label-width="80px">
        <el-form-item label="企业编号">
          <el-input style="width:130px;" v-model="enterpriseForm.eid"></el-input>
        </el-form-item>
        <el-form-item label="企业名称">
          <el-input style="width:130px;" v-model="enterpriseForm.name"></el-input>
        </el-form-item>
        <el-form-item label="创建者">
          <el-input style="width:130px;" v-model="enterpriseForm.username"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="50px">
          <el-select style="width:130px;" v-model="enterpriseForm.status" placeholder="请选择状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="clear">清除</el-button>
          <el-button type="primary">+新增企业</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 内容部分 -->
    <el-card style="margin-top:20px"></el-card>
  </div>
</template>

<script>
export default {
  name: "EnterpriseList",
  data() {
    return {
      enterpriseForm: {
        eid: "", // 企业编号
        name: "", // 企业名称
        username: "", // 创建者
        status: "" // 状态 状态 1（启用） 0（禁用）
      },
      page: 1, // 查询时候的当前页码
      limit: 3 // 查询时候的页容量(每页查询多少条)
    };
  },
  created() {
    // 一进入页面就调用方法获取企业列表  渲染到页面上
    this.getEnterpriseList();
  },
  methods: {
    // 获取企业列表
    getEnterpriseList() {},
    // 搜索功能
    search() {
      this.page = 1;
      this.getEnterpriseList();
    },
    // 清除功能
    clear() {
      this.$refs.enterpriseFormRef.resetFields();
      this.search();
    }
  }
};
</script>

<style>
</style>