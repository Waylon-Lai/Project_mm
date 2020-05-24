<template>
  <div class="enterpriseEdit">
    <el-dialog center :visible.sync="dialogVisible" width="600px">
      <div slot="title" class="title">{{mode == 'add' ? '新增企业' : '编辑企业'}}</div>
      <el-form :rules="rules" :model="enterpriseForm" ref="enterpriseFormRef" label-width="80px">
        <el-form-item prop="eid" label="企业编号">
          <el-input v-model="enterpriseForm.eid"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="企业名称">
          <el-input v-model="enterpriseForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="short_name" label="企业简称">
          <el-input v-model="enterpriseForm.short_name"></el-input>
        </el-form-item>
        <el-form-item prop="intro" label="企业简介">
          <el-input v-model="enterpriseForm.intro"></el-input>
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input v-model="enterpriseForm.remark"></el-input>
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
  name: "EnterpriseEdit",
  data() {
    return {
      dialogVisible: false,
      mode: "",
      enterpriseForm: {
        eid: "", //企业编号
        name: "", //企业名称
        short_name: "", //企业简称
        intro: "", //企业简介
        remark: "" //备注
      },
      rules: {
        eid: [
          {
            required: true,
            message: "企业编号不能为空",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "企业名称不能为空",
            trigger: "blur"
          }
        ],
        short_name: [
          {
            required: true,
            message: "企业简称不能为空",
            trigger: "blur"
          }
        ],
        intro: [
          {
            required: true,
            message: "企业简介不能为空",
            trigger: "blur"
          }
        ],
        remark: [
          {
            required: true,
            message: "备注不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    // 通过watch监听dialogVisible值的变化来完成清除form的校验
    dialogVisible(newValue) {
      // 方法一：会话框弹出时清除校验
      //   if (newValue) {
      //     this.$nextTick(() => {
      //       //   等dom结构加载完再执行回调
      //       this.$refs.enterpriseFormRef.clearValidate();
      //     });
      //   }
      //   方法二：会话框关闭后清除校验
      if (!newValue) {
        // 此时dom结构已加载完  不用再放在回调里面执行
        this.$refs.enterpriseFormRef.clearValidate();
      }
    }
  },
  methods: {
    submit() {
      this.$refs.enterpriseFormRef.validate(async valid => {
        if (!valid) return;
        let res = null;
        if (this.mode == "add") {
          //新增企业
          res = await this.$axios({
            method: "post",
            url: "/enterprise/add",
            data: this.enterpriseForm
          });
        } else {
          //编辑企业
          res = await this.$axios({
            method: "post",
            url: "/enterprise/edit",
            data: this.enterpriseForm
          });
        }
        if (res.data.code == 200) {
          this.$message({
            message: this.mode == "add" ? "新增企业成功" : "编辑企业成功",
            type: "success"
          });
          this.dialogVisible = false;
          if (this.mode == "add") {
            this.$parent.search();
          } else {
            this.$parent.getEnterpriseList();
          }
        }
      });
    }
  }
};
</script>

<style lang="less">
.enterpriseEdit {
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