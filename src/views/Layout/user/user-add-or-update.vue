<template>
  <div class="userEdit">
    <el-dialog center :visible.sync="dialogVisible" width="600px">
      <div slot="title" class="title">{{mode == 'add' ? '新增用户' : '编辑用户'}}</div>
      <!-- form表单部分 -->
      <el-form :rules="rules" :model="userForm" ref="userFormRef" label-width="80px">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="电话">
          <el-input v-model="userForm.phone"></el-input>
        </el-form-item>
        <el-form-item prop="role_id" label="角色">
          <!-- 在编辑用户时 获取到的后台数据中 role_id 和 status 都是 Number类型的
          而下拉菜单中的选项的value值都是String类型的  所以导致双向绑定无法匹配到对应value的选项 
          所以需要给选项中的value加上绑定 ： 让其变成Number类型 可以与后台数据进行匹配
          -->
          <el-select v-model="userForm.role_id" placeholder="请选择角色">
            <el-option label="超级管理员" :value="1"></el-option>
            <el-option label="管理员" :value="2"></el-option>
            <el-option label="老师" :value="3"></el-option>
            <el-option label="学生" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-select v-model="userForm.status" placeholder="请选择状态">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="remark" label="用户备注">
          <el-input v-model="userForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "UserEdit",
  data() {
    return {
      dialogVisible: false, //是否显示会话框
      mode: "", //判断用户选择的操作模式 add 代表新增  edit 代表修改
      userForm: {
        username: "", // 用户名
        email: "", // 邮箱
        phone: "", // 手机号
        role_id: "", // 角色 1：超级管理员 2：管理员 3：老师 4：学生
        status: "", // 状态 1：启用 0：禁用
        remark: "" // 备注
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        email: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("邮箱不能为空"));
              }
              // 邮箱的正则表达式
              const reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/;
              if (!reg.test(value)) {
                return callback(new Error("输入的邮箱不合法"));
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("手机号不能为空"));
              }
              // 手机号的正则表达式
              const reg = /^1[345678][0-9]{9}$/;
              if (!reg.test(value)) {
                return callback(new Error("输入的手机号不合法"));
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        role_id: [
          { required: true, message: "必须选择用户角色", trigger: "change" }
        ],
        status: [
          { required: true, message: "必须选择用户状态", trigger: "change" }
        ],
        remark: [{ required: true, message: "备注不能为空", trigger: "blur" }]
      }
    };
  },
  // watch: {
  //   dialogVisible(newValue) {
  //     if (newValue) {
  //       this.$nextTick(() => {
  //         this.$refs.userFormRef.clearValidate();
  //       });
  //     }
  //     // if (!newvalue) {
  //     //   this.$refs.userFormRef.clearValidate();
  //     // }
  //   }
  // },
  methods: {
    submit() {
      //   最后一次校验
      this.$refs.userFormRef.validate(async valid => {
        if (!valid) return;

        let res = null;
        //判断操作模式是新增还是编辑
        if (this.mode == "add") {
          // 进到这里是新增
          // 本次项目的后台有bug  需要删除这两个对象成员
          delete this.userForm.create_time;
          delete this.userForm.update_time;
          //如果在父组件中设置弹出新增会话框的时候  没有重置为userForm为我们一开始写的空串，而是row
          //那么还需要把id去掉  不然在新增的时候会导致id重复报错
          delete this.userForm.id;
          res = await this.$axios({
            method: "post",
            url: "/user/add",
            data: this.userForm
          });
        } else {
          // 进到这里是编辑
          // 本次项目的后台有bug  需要删除这两个对象成员
          delete this.userForm.create_time;
          delete this.userForm.update_time;
          res = await this.$axios({
            method: "post",
            url: "/user/edit",
            data: this.userForm
          });
        }
        console.log(res);
        if (res.data.code == 200) {
          this.$message({
            message: this.mode == "add" ? "新增成功" : "编辑成功", //根据不同的操作显示不同的提示
            type: "success"
          });
          // 关闭会话框
          this.dialogVisible = false;
          // 调用父组件的方法 刷新用户列表
          if (this.mode == "add") {
            this.$parent.search(); //回到第一页
          } else {
            this.$parent.getUserList(); //停留在当前页
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>

<style lang="less">
.userEdit {
  .title {
    background: linear-gradient(270deg, #01c6fa, #1493fa);
    height: 53px;
    color: #fff;
    text-align: center;
    line-height: 53px;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
}
</style>