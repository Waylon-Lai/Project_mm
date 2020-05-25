<template>
  <div class="question">
    <!-- 搜索部分 -->
    <el-card>
      <el-form :model="searchForm" ref="searchFormRef" label-width="60px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="学科">
              <el-select v-model="searchForm.subject" placeholder="请选择学科">
                <el-option
                  v-for="item in subjectList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="阶段">
              <el-select v-model="searchForm.step" placeholder="请选择阶段">
                <!-- v-for除了可以遍历数组 还可以遍历对象 其中name代表键，value代表值 -->
                <el-option v-for="(value,name) in stepObj" :key="name" :label="value" :value="name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="企业">
              <el-select v-model="searchForm.enterprise" placeholder="请选择企业">
                <el-option
                  v-for="item in enterpriseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="题型">
              <el-select v-model="searchForm.type" placeholder="请选择题型">
                <el-option v-for="(value,name) in typeObj" :key="name" :label="value" :value="name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="难度">
              <el-select v-model="searchForm.difficulty" placeholder="请选择难度">
                <el-option
                  v-for="(value,name) in difficultyObj"
                  :key="name"
                  :label="value"
                  :value="name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="作者">
              <el-input style="width:194px;" v-model="searchForm.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态">
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日期">
              <el-date-picker
                style="width:194px;"
                v-model="searchForm.create_date"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题">
              <el-input style="width:480px;" v-model="searchForm.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button type="primary">搜索</el-button>
              <el-button>清除</el-button>
              <el-button type="primary">+新增试题</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 内容部分 -->
    <el-card style="margin-top:20px;"></el-card>
  </div>
</template>

<script>
export default {
  name: "QuestionList",
  data() {
    return {
      subjectList: [], //学科列表
      enterpriseList: [], //企业列表

      stepObj: { 1: "初级", 2: "中级", 3: "高级" }, //阶段
      typeObj: { 1: "单选", 2: "多选", 3: "简答" }, //题型
      difficultyObj: { 1: "简单", 2: "一般", 3: "困难" }, //难度

      searchForm: {
        // 搜索的时候要传递给后台的
        subject: "", // 学科id
        enterprise: "", // 企业id
        step: "", // 题目阶段:1(初级),2(中级),3(高级)
        type: "", // 题目类型:1(单选),2(多选),3(简答)
        difficulty: "", // 题目难度: 1(简单),2(一般),3(困难)
        username: "", // 作者
        status: "", // 状态 0 禁用 1 启用
        create_date: "", // 创建日期
        title: "" // 标题
      }
    };
  },
  created() {
    // 一进入页面就获取 学科列表
    this.getSubjectList();
    // 一进入页面就获取 企业列表
    this.getEnterpriseList();
  },
  methods: {
    // 获取学科列表
    async getSubjectList() {
      const res = await this.$axios({
        method: "get",
        url: "/subject/list"
        //这里不用传参  获取所有的学科列表
      });
      // console.log(res);
      if (res.data.code == 200) {
        this.subjectList = res.data.data.items;
      }
    },
    // 获取学科列表
    async getEnterpriseList() {
      const res = await this.$axios({
        method: "get",
        url: "/enterprise/list"
        //这里不用传参  获取所有的学科列表
      });
      // console.log(res);
      if (res.data.code == 200) {
        this.enterpriseList = res.data.data.items;
      }
    }
  }
};
</script>

<style>
</style>