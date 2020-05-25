<template>
  <div class="user">
    <!-- 搜索部分 -->
    <el-card>
      <!-- inline 让form表单的表单项 在水平一行显示 -->
      <el-form
        ref="searchFormRef"
        style="height:40px"
        :model="searchForm"
        inline
        label-width="80px"
      >
        <el-form-item prop="username" label="用户名称">
          <el-input style="width:180px;" v-model="searchForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="用户邮箱">
          <el-input style="width:180px;" v-model="searchForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="role_id" label="角色">
          <el-select style="width:180px;" v-model="searchForm.role_id" placeholder="请选择">
            <el-option label="超级管理员" value="1"></el-option>
            <el-option label="管理员" value="2"></el-option>
            <el-option label="老师" value="3"></el-option>
            <el-option label="学生" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left:50px;">
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="default" @click="clear">清除</el-button>
          <el-button type="primary" @click="addUser">+新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 内容部分 -->
    <el-card style="margin-top:20px;">
      <el-table :data="userList" style="width: 100%" stripe>
        <!-- 设置 type="index" 会自动根据索引生成序号 -->
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <!-- 使用作用域插槽自定义 列 不再使用 prop (不再把数据交给table管理，自已管理使用)  -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- scope.row 相当于 userList 数组中的每一项 -->
            <span style="color:red;" v-if="scope.row.status == 0">禁用</span>
            <span style="color:#7ebf50;" v-if="scope.row.status == 1">启用</span>
          </template>
        </el-table-column>
        <el-table-column width="280" label="操作">
          <template slot-scope="scope">
            <!-- 调用编辑方法的时候把 每一项（row）的数据都传过去 -->
            <el-button @click="editUser(scope.row)" type="primary">编辑</el-button>
            <el-button
              @click="changeStatus(scope.row.id)"
              :type="scope.row.status == 0 ? 'success' : 'info'"
            >{{scope.row.status == 0 ? '启用' : '禁用'}}</el-button>
            <el-button @click="deleteUser(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页部分 -->
      <div style="text-align:center;margin-top:15px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[3, 5, 7, 9]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 使用子组件 -->
    <!-- <UserEdit ref="userEditRef"></UserEdit> -->
    <!-- 也可以写成这样 -->
    <user-edit ref="userEditRef"></user-edit>
  </div>
</template>

<script>
// 导入子组件
import UserEdit from "./user-add-or-update";
export default {
  name: "UserList",
  // 注册子组件
  components: {
    UserEdit
  },
  data() {
    return {
      searchForm: {
        username: "", // 昵称
        email: "", // 邮箱
        role_id: "" // 角色数字 1、超级管理员 2管理员、3老师、 4学生
      },
      page: 1, // 查询时候的当前页码
      limit: 3, // 查询时候的页容量(每页查询多少条)
      userList: [], // 查询到的当前页的用户列表
      total: 0 // 查询到的总的用户列表
    };
  },
  created() {
    // 一进入页面就调用方法获取用户列表  渲染到页面上
    this.getUserList();
  },
  methods: {
    // 获取当前页用户列表
    async getUserList() {
      const res = await this.$axios({
        method: "get",
        url: "/user/list",
        params: {
          page: this.page,
          limit: this.limit,
          ...this.searchForm
          // 上面使用的对象展开法  相当于：
          // username:this.searchForm.username,
          // email:this.searchForm.email,
          // role_id:this.searchForm.role_id,
        }
      });
      // console.log(res);
      if (res.data.code == 200) {
        this.userList = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    // 搜索功能
    search() {
      this.page = 1; //每次搜索  都让当前页回到第一页
      this.getUserList(); //重新获取对应条件的用户列表
    },
    // 清除搜索功能
    clear() {
      // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      //注意点：使用resetFields需要给每个表单项el-form-item 设置 prop属性
      this.$refs.searchFormRef.resetFields();
      this.search(); // 重新搜索第一页的用户列表
    },
    // 更改每页显示的条数
    handleSizeChange(val) {
      // console.log("每页显示的条数:", val);
      this.limit = val; //修改每页显示的条数
      this.search(); // 重新搜索第一页的用户列表
    },
    // 更改显示的当前页
    handleCurrentChange(val) {
      // console.log("当前页:", val);
      this.page = val; //修改当前页
      this.getUserList(); //重新获取当前页对应条件的用户列表
    },
    // 改变用户的状态
    async changeStatus(id) {
      const res = await this.$axios({
        method: "post",
        url: "/user/status",
        data: {
          id
        }
      });
      // console.log(res.data);
      if (res.data.code == 200) {
        this.$message({
          message: "更改状态成功",
          type: "success"
        });
        this.getUserList(); //重新获取更改后的当前页对应条件的用户列表
      }
    },
    // 删除用户
    deleteUser(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios({
            method: "post",
            url: "/user/remove",
            data: {
              id
            }
          });
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            // console.log(this.page);
            // console.log(this.userList.length);
            if (this.page > 1 && this.userList.length == 1) {
              // 此时删除的是当前页的最后一条数据  并且页数大于一页
              this.page--; //当前页没有数据了 那么应该-1
              this.getUserList(); //重新获取删除后的当前页对应条件的用户列表
              return;
            }
            this.getUserList(); //重新获取删除后的当前页对应条件的用户列表
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 新增用户
    addUser() {
      // 传值给子组件
      this.$refs.userEditRef.dialogVisible = true; //弹出会话框
      this.$refs.userEditRef.mode = "add"; //将操作模式更改为新增
      // 每次弹出新增会话框的时候  应先把上一次点击取消操作 form表单留下来的数据和检验提示清除掉
      // 方法一：
      // a.清除form表单中的模型数据 全部变成空串
      // this.$refs.userEditRef.userForm = {
      //   username: "", // 用户名
      //   email: "", // 邮箱
      //   phone: "", // 手机号
      //   role_id: "", // 角色 1：超级管理员 2：管理员 3：老师 4：学生
      //   status: "", // 状态 1：启用 0：禁用
      //   remark: "" // 备注
      // };
      // b.调用el-form的方法 clearValidate 清除校验
      // this.$refs.userEditRef.$refs.userFormRef.clearValidate();
      // 出现了报错：Cannot read property 'clearValidate' of undefined
      // 原因是：dialog弹出框form表单部分是懒加载的，也就是其dom结构其实并还没有渲染出来
      // 只有当 第一次 把dialogVisible的值改为true 才会真正开始渲染
      // 而渲染是需要一定时间的 可能dom结构还没渲染完毕就开始执行代码了，所以获取不到form表单元素 也就无法使用他的方法了

      // 改善：使用$nextTick，当我们需要等到某个dom节点渲染完毕之后，拿到它，或者做什么事情，那么我们就是用nextTick
      // $nextTick作用：保证dom节点，渲染完毕之后，再执行回调
      this.$nextTick(() => {
        //   //dialog中的form表单渲染完毕之后，会自动执行该回调函数
        // this.$refs.userEditRef.$refs.userFormRef.clearValidate();
        // 方法二： 使用el-form的方法resetFields 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
        this.$refs.userEditRef.$refs.userFormRef.resetFields();
        //注意点：使用clearValidate和resetFields犯法 需要给每个表单项el-form-item 设置 prop属性
      });
    },
    // 编辑用户
    editUser(row) {
      // console.log(row); // 拿到每一项（row）的数据 对应每一个用户的信息
      // 传值给子组件
      this.$refs.userEditRef.dialogVisible = true; //弹出会话框
      this.$refs.userEditRef.mode = "edit"; //将操作模式更改为编辑
      // 编辑的第一步：把要修改的用户的信息 渲染到弹出框的form表单中
      // this.$refs.userEditRef.userForm = row; //浅拷贝
      // 由于是浅拷贝，直接把对象赋值给另外一个对象，他们的引用还是指向同一块内存空间
      // 所以会导致一个bug 如果在会话框内对form表单数据进行了修改
      // 即使点击了取消 表格内对应的数据也会同时被修改 这是因为userForm和row指向同一个对象
      // 因此  我们应该采用深拷贝的方法让userForm和row分别指向不同的对象
      // 深拷贝：把copy的对象拷贝过来之后，再单独开辟一块内容空间，拷贝形成之后的对象，跟之前的对象不指向同一块内存空间
      // 以下是两种常用的深拷贝的方法
      // this.$refs.userEditRef.userForm = { ...row }; //只能拷贝一层的简单对象 eg:{name:'cindy',age:18}
      // this.$refs.userEditRef.userForm = JSON.parse(JSON.stringify(row)); //无论对象的层次有多深都能进行拷贝 eg:{name:'cindy',age:18,friends:[{name:'jack',age:18},name:'judy',age:20]}
      // 每次弹出新增会话框的时候  应先把上一次点击取消操作 form表单留下来的检验提示清除掉
      this.$nextTick(() => {
        this.$refs.userEditRef.userForm = JSON.parse(JSON.stringify(row));
        //如果在新增用户的时候使用的是resetFields对表单进行重置的方式 必须把赋值给userForm放在$nextTick里面的回调函数
        //因为如果放在$nextTick外面，并且用户第一次点击的是编辑按钮 那么此时给userForm赋值的话 就相当于把row当做是初始值渲染dom了
        //放到里面，由于$nextTick保证dom节点渲染完毕之后，再执行回调 所以此时的userForm还是我们自己写的默认值（都是空串）
        this.$refs.userEditRef.$refs.userFormRef.clearValidate();
      });
    }
  }
};
</script>

<style>
</style>