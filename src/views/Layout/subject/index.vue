<template>
  <div class="subject">
    <!-- 搜索部分 -->
    <el-card>
      <el-form
        style="height:40px;"
        inline
        :model="searchForm"
        ref="searchFormRef"
        label-width="80px"
      >
        <el-form-item prop="rid" label="学科编号">
          <el-input style="width:130px;" v-model="searchForm.rid"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="学科姓名">
          <el-input style="width:130px;" v-model="searchForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="username" label="创建者">
          <el-input style="width:130px;" v-model="searchForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="状态" label-width="60px">
          <el-select style="width:130px;" v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="clear">清除</el-button>
          <el-button type="primary">+新增学科</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 内容部分 -->
    <el-card style="margin-top:20px"></el-card>
  </div>
</template>

<script>
export default {
  name: "SubjectList",
  data() {
    return {
      searchForm: {
        rid: "", // 学科编号
        name: "", // 学科姓名
        username: "", // 创建者
        status: "" // 状态 1（启用） 0（禁用）
      },
      page: 1, // 页码
      limit: 2, // 页容量
      subjectList: [], // 学科列表数据
      total: 0 // 总条数
    };
  },
  created() {
    this.getSubjectList();
  },
  methods: {
    // 获取学科列表
    async getSubjectList() {
      const res = await this.$axios({
        method: "get",
        url: "/subject/list",
        params: {
          page: this.page,
          limit: this.limit,
          ...this.searchForm
        }
      });
      // console.log(res);
      if (res.data.code == 200) {
        this.subjectList = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    // 搜索功能
    search() {
      this.page = 1;
      this.getSubjectList();
    },
    // 清除功能
    clear() {
      this.$refs.searchFormRef.resetFields();
      this.search();
    }
  }
};
</script>

<style>
</style>