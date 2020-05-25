<template>
  <div class="subjectEdit">
    <el-dialog center :visible.sync="dialogVisible" width="600px">
      <div slot="title" class="title">{{mode == 'add' ? '新增学科' : '编辑学科'}}</div>
      <!-- 表单部分 -->
      <el-form :rules="rules" :model="subjectForm" ref="subjectFormRef" label-width="80px">
        <el-form-item prop="rid" label="学科编号">
          <el-input v-model="subjectForm.rid"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="学科名称">
          <el-input v-model="subjectForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="short_name" label="学科简称">
          <el-input v-model="subjectForm.short_name"></el-input>
        </el-form-item>
        <el-form-item prop="intro" label="学科简介">
          <el-input v-model="subjectForm.intro"></el-input>
        </el-form-item>
        <el-form-item prop="remark" label="学科备注">
          <el-input v-model="subjectForm.remark"></el-input>
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
  name: "SubjectEdit",
  data() {
    return {
      dialogVisible: false,
      mode: "",
      subjectForm: {
        rid: "", //学科编号
        name: "", //学科名称
        short_name: "", //学科简称
        intro: "", //学科简介
        remark: "" //学科备注
      },
      rules: {
        rid: [
          {
            required: true,
            message: "学科编号不能为空",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "学科名称不能为空",
            trigger: "blur"
          }
        ],
        short_name: [
          {
            required: true,
            message: "学科简称不能为空",
            trigger: "blur"
          }
        ],
        intro: [
          {
            required: true,
            message: "学科简介不能为空",
            trigger: "blur"
          }
        ],
        remark: [
          {
            required: true,
            message: "学科备注不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    dialogVisible(newValue) {
      //   监听 dialogVisible 的变化  清空表单校验
      //   if (newValue) {
      //     this.$nextTick(() => {
      //       this.$refs.subjectFormRef.clearValidate();
      //     });
      //   }
      if (!newValue) {
        this.$refs.subjectFormRef.clearValidate();
      }
    }
  },
  methods: {
    submit() {
      this.$refs.subjectFormRef.validate(async valid => {
        if (!valid) return;
        let res = null;
        if (this.mode == "add") {
          // 新增学科
          res = await this.$axios({
            method: "post",
            url: "/subject/add",
            data: this.subjectForm
          });
        } else {
          // 编辑学科
          res = await this.$axios({
            method: "post",
            url: "/subject/edit",
            data: this.subjectForm
          });
        }
        if (res.data.code == 200) {
          this.$message({
            message: this.mode == "add" ? "新增成功" : "编辑成功",
            type: "success"
          });
          // 关闭会话框
          this.dialogVisible = false;
          // 调用父组件对应的方法更新数据
          if (this.mode == "add") {
            this.$parent.search();
          } else {
            this.$parent.getSubjectList();
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
.subjectEdit {
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