<template>
  <div class="register">
    <el-dialog width="600px" center :visible.sync="dialogVisible">
      <div slot="title" class="title">用户注册</div>
      <!-- 中间form表单部分 -->
      <el-form :model="registerForm" :rules="rules" ref="registerFormRef" label-width="100px">
        <!-- 上传用户头像 -->
        <el-form-item prop="avatar" label="头像" ref="uploadAvatar">
          <!-- action是elementUI封装的用来发送请求上传头像的方法(底层基于FormData)
            需要设置name属性的值为 对应接口的提交参数   类似FormData提交参数
          -->
          <el-upload
            class="avatar-uploader"
            :action="uploadAction"
            name="image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item prop="username" label="昵称">
          <el-input v-model="registerForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="registerForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机">
          <el-input v-model="registerForm.phone"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="registerForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item prop="picCode" label="图形码">
          <el-row>
            <el-col :span="17">
              <el-input v-model="registerForm.picCode"></el-input>
            </el-col>
            <el-col style="margin-left:15px" :span="6">
              <img :src="codeUrl" class="captcha" @click="updateCodeUrl" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="rcode" label="验证码">
          <el-row>
            <el-col :span="17">
              <!-- 数字类型的验证需要在 v-model 处加上 .number 的修饰符，这是 Vue 自身提供的用于将绑定值(纯数字）转化为 number 类型的修饰符。 -->
              <el-input v-model.number="registerForm.rcode"></el-input>
            </el-col>
            <el-col style="margin-left:15px" :span="6">
              <el-button @click="getCaptcha" style="width:100%;">获取验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="submit" type="primary">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Register",
  //   props: ["isShow"],
  data() {
    return {
      //   dialogVisible: this.isShow
      dialogVisible: false, //是否显示弹出会话框
      imageUrl: "", // 头像的url
      uploadAction: process.env.VUE_APP_BASEURL + "/uploads", //头像上传的接口地址
      codeUrl: process.env.VUE_APP_BASEURL + "/captcha?type=sendsms", //获取图形码的接口地址
      registerForm: {
        // 这里面的数据，将来是要提交给服务器
        username: "", // 用户名
        phone: "", // 手机号
        email: "", // 邮箱
        avatar: "", // 头像地址
        password: "", // 密码
        picCode: "", // 图形码
        rcode: "" // 验证码
      },
      rules: {
        username: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur"
          }
        ],
        avatar: [
          {
            required: true,
            message: "必须上传头像"
            // trigger: "change"
          }
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
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          },
          {
            min: 8,
            max: 16,
            message: "密码长度在 8 到 16 个字符",
            trigger: "blur"
          }
        ],
        picCode: [
          { required: true, message: "图形码不能为空", trigger: "blur" },
          {
            min: 4,
            max: 4,
            message: "图形码长度为 4 个字符",
            trigger: "blur"
          }
        ],
        rcode: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("验证码不能为空"));
              }
              if (!Number.isInteger(value)) {
                return callback(new Error("验证码必须为数字"));
              }
              if (value.toString().length != 4) {
                return callback(new Error("验证码长度为4个字符"));
              }
              callback();
            },
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 更换图形码
    updateCodeUrl() {
      this.codeUrl =
        process.env.VUE_APP_BASEURL +
        "/captcha?type=sendsms&ranNum=" +
        Math.random();
    },
    // 获取验证码 （使用async & await）
    async getCaptcha() {
      const res = await this.$axios({
        method: "post",
        url: "/sendsms",
        data: {
          code: this.registerForm.picCode,
          phone: this.registerForm.phone
        }
      });
      //   console.log(res);
      if (res.data.code == 200) {
        //   获取到验证码了  赋值给验证码输入框
        this.registerForm.rcode = res.data.data.captcha;
      } else {
        //   没有获取到验证码 提示错误信息
        this.$message.error(res.data.message);
        // 重新刷新图形码
        this.updateCodeUrl();
      }
    },
    // 图片真正上传之前的回调函数
    beforeAvatarUpload(file) {
      //   console.log(file); //上传的头像文件信息
      const isImage =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImage) {
        this.$message.error("上传头像图片只能是 JPG/PNG/GIF 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      // 如果要进行上传文件的请求，我们必须返回true，它才会进行文件上传
      return isImage && isLt2M;
    },
    // 上传成功之后的回调函数  可选参数res，file
    handleAvatarSuccess(res) {
      //   console.log(res);
      // 给imageUrl赋值
      this.imageUrl = process.env.VUE_APP_BASEURL + "/" + res.data.file_path;
      // 给registerForm中的avatar模型赋值
      this.registerForm.avatar = res.data.file_path;
      // 上传头像成功之后关闭校验  注意：ref属性要给 el-form-item 设置
      this.$refs.uploadAvatar.clearValidate();
    },
    // 完成注册
    submit() {
      // 提交form表单前的最后一步校验
      this.$refs.registerFormRef.validate(async valid => {
        // console.log(valid);
        if (!valid) return;
        const res = await this.$axios({
          method: "post",
          url: "/register",
          data: this.registerForm
        });
        // console.log(res);
        if (res.data.code == 200) {
          this.$message({
            message: "注册成功",
            type: "success"
          });
          // 关闭掉当前会话窗口
          this.dialogVisible = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
  //   watch: {
  //     isShow(newValue) {
  //       this.dialogVisible = newValue;
  //     }
  //   }
};
</script>

<style lang="less">
.register {
  .el-dialog__header {
    padding: 0;
    .title {
      background: linear-gradient(270deg, #01c6fa, #1493fa);
      height: 53px;
      color: #fff;
      text-align: center;
      line-height: 53px;
    }
    .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
    }
  }
  .captcha {
    width: 100%;
    height: 40px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>