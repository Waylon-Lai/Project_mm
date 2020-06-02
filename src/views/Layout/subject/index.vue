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
          <el-button type="primary" @click="addSubject">+新增学科</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 内容部分 -->
    <el-card style="margin-top:20px">
      <el-table :data="subjectList" stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="rid" label="学科编号" width="130"></el-table-column>
        <el-table-column prop="name" label="学科名称"></el-table-column>
        <el-table-column prop="short_name" label="简称"></el-table-column>
        <el-table-column prop="username" label="创建者"></el-table-column>
        <el-table-column prop="create_time" label="创建日期"></el-table-column>
        <!-- 自定义列  使用作用域插槽 -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span
              :style="{color:scope.row.status == 0 ? 'red' : '#7ebf50'}"
            >{{scope.row.status == 0 ? '禁用' : '启用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="primary" @click="editSubject(scope.row)">编辑</el-button>
            <el-button
              @click="changeStatus(scope.row.id)"
              :type="scope.row.status == 0 ? 'success' : 'info'"
            >{{scope.row.status == 0 ? '启用' : '禁用'}}</el-button>
            <el-button @click="deleteSubject(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="margin-top:15px;text-align:center;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[2, 4, 6]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>

    <subject-edit ref="subjectEditRef"></subject-edit>
  </div>
</template>

<script>
import SubjectEdit from "./subject-add-or-edit";
export default {
  name: "SubjectList",
  components: {
    SubjectEdit
  },
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
      total: 0 // 总条数 必须为数值类型
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
      this.getSubjectList();
    },
    // 更改学科状态
    async changeStatus(id) {
      const res = await this.$axios({
        method: "post",
        url: "/subject/status",
        data: {
          id
        }
      });
      if (res.data.code == 200) {
        this.$message({
          message: "更改状态成功",
          type: "success"
        });
        this.getSubjectList();
      }
    },
    // 删除学科
    deleteSubject(id) {
      this.$confirm("此操作将永久删除该学科, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios({
            method: "post",
            url: "/subject/remove",
            data: {
              id
            }
          });
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            if (this.page > 1 && this.subjectList.length == 1) {
              this.page--;
              this.getSubjectList();
              return;
            }
            this.getSubjectList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 新增学科
    addSubject() {
      this.$refs.subjectEditRef.mode = "add";
      this.$refs.subjectEditRef.subjectForm = {
        rid: "", //学科编号
        name: "", //学科名称
        short_name: "", //学科简称
        intro: "", //学科简介
        remark: "" //学科备注
      };
      this.$refs.subjectEditRef.dialogVisible = true;
    },
    // 编辑学科
    editSubject(row) {
      this.$refs.subjectEditRef.mode = "edit";
      // this.$refs.subjectEditRef.subjectForm = JSON.parse(JSON.stringify(row));
      const { id, rid, name, short_name, intro, remark } = row;
      this.$refs.subjectEditRef.subjectForm = {
        id,
        rid,
        name,
        short_name,
        intro,
        remark
      };
      this.$refs.subjectEditRef.dialogVisible = true;
    }
  }
};
</script>

<style>
</style>