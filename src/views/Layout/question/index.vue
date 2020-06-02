<template>
  <div class="question">
    <!-- 搜索部分 -->
    <el-card>
      <el-form :model="searchForm" ref="searchFormRef" label-width="60px">
        <el-row>
          <el-col :span="6">
            <el-form-item prop="subject" label="学科">
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
            <el-form-item prop="step" label="阶段">
              <el-select v-model="searchForm.step" placeholder="请选择阶段">
                <!-- v-for除了可以遍历数组 还可以遍历对象 其中name代表键，value代表值 -->
                <el-option v-for="(value,name) in stepObj" :key="name" :label="value" :value="name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="enterprise" label="企业">
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
            <el-form-item prop="type" label="题型">
              <el-select v-model="searchForm.type" placeholder="请选择题型">
                <el-option v-for="(value,name) in typeObj" :key="name" :label="value" :value="name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item prop="difficulty" label="难度">
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
            <el-form-item prop="username" label="作者">
              <el-input style="width:194px;" v-model="searchForm.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="status" label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态">
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="create_date" label="日期">
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
            <el-form-item prop="title" label="标题">
              <el-input style="width:485px;" v-model="searchForm.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button type="primary" @click="search">搜索</el-button>
              <el-button @click="clear">清除</el-button>
              <el-button type="primary" @click="addQuestion">+新增试题</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 内容部分 -->
    <el-card style="margin-top:20px;">
      <el-table :data="questionList" stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="题目" width="250">
          <!-- 返回的数据带标签的（<p>dom与jQuery对象的说法正确的是？</p>） 需要使用到v-html  所以要通过作用域插槽实现 -->
          <template slot-scope="scope">
            <div v-html="scope.row.title"></div>
          </template>
        </el-table-column>
        <!-- 当我们需要对数据进行一些处理的时候 比如拼接两个数据，根据当前数据显示特定对应内容的时候 大致有三种方法可以实现-->
        <!-- 第一种方法：使用 el-table-column 中提供的属性 :formatter:"方法名" -->
        <!-- <el-table-column :formatter="formatSubject" label="学科.阶段"></el-table-column> -->
        <!-- 第二种方法：直接写在作用域插槽中 -->
        <el-table-column label="学科.阶段">
          <template slot-scope="scope">
            <!-- <span>{{scope.row.subject_name}}.{{stepObj[scope.row.step]}}</span> -->
            <!-- 第三种方法：在作用域插槽中调用一个方法获取 把当行数据传过去 -->
            <span>{{formatData(scope.row)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="题型">
          <template slot-scope="scope">
            <span>{{typeObj[scope.row.type]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="enterprise_name" label="企业"></el-table-column>
        <el-table-column prop="username" label="创建者"></el-table-column>
        <el-table-column prop="reads" label="访问量" width="80"></el-table-column>
        <el-table-column label="状态" width="50">
          <template slot-scope="scope">
            <span
              :style="{color:scope.row.status == 0 ? 'red' : '#7ebf50'}"
            >{{scope.row.status == 0 ? '禁用' : '启用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="primary" @click="editQuestion(scope.row)">编辑</el-button>
            <el-button
              @click="changeStatus(scope.row.id)"
              :type="scope.row.status == 0 ? 'success' : 'info'"
            >{{scope.row.status == 0 ? '启用' : '禁用'}}</el-button>
            <el-button @click="deleteQuestion(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:15px;text-align:center;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[2, 4, 6]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
        ></el-pagination>
      </div>
    </el-card>
    <!-- 使用子组件 并通过设置自定义属性传值给子组件 -->
    <question-edit
      ref="questionEditRef"
      :subjectList="subjectList"
      :enterpriseList="enterpriseList"
      :stepObj="stepObj"
      :typeObj="typeObj"
      :difficultyObj="difficultyObj"
    ></question-edit>
  </div>
</template>

<script>
// 导入子组件
import QuestionEdit from "./question-add-or-edit";
export default {
  name: "QuestionList",
  components: {
    // 局部注册子组件
    QuestionEdit
  },
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
      },
      page: 1, // 查询时候的当前页码
      limit: 2, // 查询时候的页容量(每页查询多少条)
      questionList: [], // 查询到的当前页的试题列表
      total: 0 // 查询到的总的试题数目
    };
  },
  created() {
    // 一进入页面就获取 学科列表
    this.getSubjectList();
    // 一进入页面就获取 企业列表
    this.getEnterpriseList();
    // 一进入页面就获取 题库列表
    this.getQuestionList();
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
    },
    // 获取题库列表
    async getQuestionList() {
      const res = await this.$axios({
        method: "get",
        url: "/question/list",
        params: {
          page: this.page,
          limit: this.limit,
          ...this.searchForm
        }
      });
      // console.log(res);
      if (res.data.code == 200) {
        this.questionList = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    // 搜索试题
    search() {
      this.page = 1;
      this.getQuestionList();
    },
    // 清除搜索条件
    clear() {
      this.$refs.searchFormRef.resetFields();
      this.search();
    },
    // 处理学科和阶段的格式器
    // formatSubject(row) {
    //   // console.log(row); //获取到该行的数据
    //   return `${row.subject_name}.${this.stepObj[row.step]}`;
    // }
    // 处理学科和阶段的方法
    formatData(row) {
      return row.subject_name + "." + this.stepObj[row.step];
    },
    // 更改每页显示的条数
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.limit = val;
      this.search();
    },
    // 更改显示的当前页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.getQuestionList();
    },
    // 更改题目状态
    async changeStatus(id) {
      const res = await this.$axios({
        method: "post",
        url: "/question/status",
        data: { id }
      });
      if (res.data.code == 200) {
        this.$message({
          message: "更改状态成功",
          type: "success"
        });
        this.getQuestionList();
      }
    },
    // 删除题目
    deleteQuestion(id) {
      this.$confirm("此操作将永久删除该试题, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios({
            method: "post",
            url: "/question/remove",
            data: {
              id
            }
          });
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            if (this.page > 1 && this.questionList.length == 1) {
              this.page--;
              this.getQuestionList();
              return;
            }
            this.getQuestionList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 新增题目
    addQuestion() {
      this.$refs.questionEditRef.mode = "add";
      this.$refs.questionEditRef.questionForm = {
        // 这个里面的所有值，将来是传递给服务器的
        subject: "", // 学科id
        step: "", // 阶段
        enterprise: "", // 企业id
        city: [], // 城市
        type: "1", // 题型 并设置默认选中的值
        difficulty: "1", // 难度 并设置默认选中的值
        title: "", // 标题
        single_select_answer: "", // 单选答案
        multiple_select_answer: [], // 多选答案
        short_answer: "", // 简答答案
        answer_analyze: "", // 答案解析
        remark: "", // 答案备注
        video: "", //解析视频地址
        select_options: [
          {
            label: "A",
            text: "shift",
            image: ""
          },
          {
            label: "B",
            text: "pop",
            image: ""
          },
          {
            label: "C",
            text: "splice",
            image: ""
          },
          {
            label: "D",
            text: "slice",
            image: ""
          }
        ]
      };
      this.$refs.questionEditRef.dialogVisible = true;
    },
    // 编辑题目
    editQuestion(row) {
      this.$refs.questionEditRef.mode = "edit";
      this.$refs.questionEditRef.questionForm = JSON.parse(JSON.stringify(row));
      // 服务器获取回来的城市是字符串 eg：city: "广东省,深圳市,南山区" 但是展示需要的是一个数组 [0:"广东省",1:"深圳市,2:"南山区"]
      if (row.city) {
        // 原本已有选择城市
        this.$refs.questionEditRef.questionForm.city = row.city.split(",");
      } else {
        // 原本没有选择城市
        this.$refs.questionEditRef.questionForm.city = [];
      }
      // 服务器获取回来的多选答案是字符串 eg：multiple_select_answer:"B,C" 但是展示需要的是一个数组 [0:"B",1:"C]
      if (row.multiple_select_answer) {
        // 原本已有多选答案
        this.$refs.questionEditRef.questionForm.multiple_select_answer = row.multiple_select_answer.split(
          ","
        );
      } else {
        // 原本没有多选答案
        this.$refs.questionEditRef.questionForm.multiple_select_answer = [];
      }
      this.$refs.questionEditRef.dialogVisible = true;
    }
  }
};
</script>

<style>
</style>