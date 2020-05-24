<template>
  <div class="enterprise">
    <!-- 搜索部分 -->
    <el-card>
      <el-form
        style="height:40px"
        inline
        :model="enterpriseForm"
        ref="enterpriseFormRef"
        label-width="80px"
      >
        <el-form-item prop="eid" label="企业编号">
          <el-input style="width:130px;" v-model="enterpriseForm.eid"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="企业名称">
          <el-input style="width:130px;" v-model="enterpriseForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="username" label="创建者">
          <el-input style="width:130px;" v-model="enterpriseForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="状态" label-width="50px">
          <el-select style="width:130px;" v-model="enterpriseForm.status" placeholder="请选择状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="clear">清除</el-button>
          <el-button type="primary" @click="addEnterprise">+新增企业</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 内容部分 -->
    <el-card style="margin-top:20px">
      <el-table :data="enterpriseList" stripe>
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column prop="eid" label="企业编号" width="100"></el-table-column>
        <el-table-column prop="name" label="企业名称"></el-table-column>
        <el-table-column prop="username" label="创建者"></el-table-column>
        <el-table-column prop="create_time" label="创建日期"></el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <!-- v-bind:style 的对象语法(和v-bind:class类似)十分直观——看着非常像 CSS，但其实是一个 JavaScript 对象。 -->
            <!-- CSS property 名可以用驼峰式 (camelCase) 或短横线分隔 (kebab-case，记得用引号括起来) 来命名 -->
            <span
              :style="{color:scope.row.status == 0 ? 'red' : '#7ebf50'}"
            >{{scope.row.status == 0 ? '禁用' : '启用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="primary" @click="editEnterprise(scope.row)">编辑</el-button>
            <el-button
              @click="changeStatus(scope.row.id)"
              :type="scope.row.status == 0 ? 'success' : 'info'"
            >{{scope.row.status == 0 ? '启用' : '禁用'}}</el-button>
            <el-button @click="deleteEnterprise(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:center;margin-top:15px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[2,5,7]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 使用子组件 -->
    <enterprise-edit ref="enterpriseEditRef"></enterprise-edit>
  </div>
</template>

<script>
// 导入子组件
import EnterpriseEdit from "./enterparise-add-or-update";
export default {
  name: "EnterpriseList",
  components: {
    // 局部注册子组件
    EnterpriseEdit
  },
  data() {
    return {
      enterpriseForm: {
        eid: "", // 企业编号
        name: "", // 企业名称
        username: "", // 创建者
        status: "" // 状态 状态 1（启用） 0（禁用）
      },
      page: 1, // 查询时候的当前页码
      limit: 2, // 查询时候的页容量(每页查询多少条)
      enterpriseList: [], // 查询到的当前页的企业列表
      total: 0 // 查询到的总的企业列表
    };
  },
  created() {
    // 一进入页面就调用方法获取企业列表  渲染到页面上
    this.getEnterpriseList();
  },
  methods: {
    // 获取企业列表
    async getEnterpriseList() {
      const res = await this.$axios({
        method: "get",
        url: "/enterprise/list",
        params: {
          page: this.page,
          limit: this.limit,
          ...this.enterpriseForm
        }
      });
      // console.log(res);
      if (res.data.code == 200) {
        this.enterpriseList = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    // 搜索功能
    search() {
      this.page = 1;
      this.getEnterpriseList();
    },
    // 清除功能
    clear() {
      console.log(1);
      //注意点：使用resetFields需要给每个表单项el-form-item 设置 prop属性
      this.$refs.enterpriseFormRef.resetFields();
      this.search(); // 重新搜索第一页的用户列表
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
      this.getEnterpriseList();
    },
    // 改变企业的状态
    async changeStatus(id) {
      const res = await this.$axios({
        method: "post",
        url: "/enterprise/status",
        data: {
          id
        }
      });
      if (res.data.code == 200) {
        this.$message({
          message: "更改状态成功",
          type: "success"
        });
        this.getEnterpriseList();
      }
    },
    // 删除企业
    deleteEnterprise(id) {
      this.$confirm("此操作将永久删除该企业, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios({
            method: "post",
            url: "/enterprise/remove",
            data: {
              id
            }
          });
          console.log(1);
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            if (this.total / this.limit < this.page) {
              this.page--;
              this.getEnterpriseList();
              return;
            }
            this.getEnterpriseList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 新增企业
    addEnterprise() {
      this.$refs.enterpriseEditRef.mode = "add"; //将操作模式更改为新增
      this.$refs.enterpriseEditRef.enterpriseForm = {
        eid: "", //企业编号
        name: "", //企业名称
        short_name: "", //企业简称
        intro: "", //企业简介
        remark: "" //备注
      };
      this.$refs.enterpriseEditRef.dialogVisible = true; //弹出会话框

      // 下面清除校验的代码也可以放到子组件中通过watch监听dialogVisible值的变化来完成
      // this.$nextTick(() => {
      //   this.$refs.enterpriseEditRef.$refs.enterpriseFormRef.clearValidate();
      // });
    },
    // 编辑企业
    editEnterprise(rowData) {
      this.$refs.enterpriseEditRef.mode = "edit"; //将操作模式更改为编辑
      const { id, name, eid, short_name, intro, remark } = rowData; //对象的结构语法赋值
      this.$refs.enterpriseEditRef.enterpriseForm = {
        id,
        name,
        eid,
        short_name,
        intro,
        remark
      };
      this.$refs.enterpriseEditRef.dialogVisible = true; //弹出会话框

      // // 下面清除校验的代码也可以放到子组件中通过watch监听dialogVisible值的变化来完成
      // this.$nextTick(() => {
      //   this.$refs.enterpriseEditRef.$refs.enterpriseFormRef.clearValidate();
      // });
    }
  }
};
</script>

<style>
</style>