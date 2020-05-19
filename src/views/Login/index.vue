<template>
  <div class="login-container">
    <div class="left">
      <div class="title-box">
        <img src="@/assets/login_icon.png" alt />
        <span class="title">黑马面面</span>
        <span class="line"></span>
        <span class="sub-title">用户登录</span>
      </div>
      <!-- form表单部分 -->
      <el-form :model="loginForm" :rules="rules" ref="loginForm" class="login-form">
        <el-form-item prop="phone">
          <el-input v-model="loginForm.phone" prefix-icon="el-icon-user" placeholder="请输入手机号"></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row :gutter="15">
            <el-col :span="16">
              <el-input v-model="loginForm.code" prefix-icon="el-icon-key" placeholder="请输入验证码"></el-input>
            </el-col>
            <el-col :span="8">
              <img :src="codeURL" @click="refleshCode" class="captcha" alt />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="isChecked">
          <el-checkbox v-model="loginForm.isChecked"></el-checkbox>&nbsp;我已阅读并同意
          <el-link type="primary" href="https:/www.baidu.com">用户协议</el-link>&nbsp;和&nbsp;
          <el-link type="primary">隐私条款</el-link>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%;" @click="loginClick" type="primary">登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%;" @click="register" type="primary">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="right">
      <img src="@/assets/login_bg.png" alt />
    </div>
    <!-- 使用register子组件 -->
    <!-- 1.通过ref属性方式进行父传子传值 -->
    <register ref="registerRef"></register>
    <!-- 1.通过props方式进行父传子传值 -->
    <!-- <register :isShow="isShow"></register> -->
  </div>
</template>

<script>
// 按需导入 操作token的方法
import { setToken } from "@/utils/token.js";
// 导入register子组件
import register from "./register";
export default {
  name: "Login",
  components: {
    // 注册register子组件
    register
  },
  data() {
    return {
      // isShow: false,
      codeURL: process.env.VUE_APP_BASEURL + "/captcha?type=login",
      // 表单模型对象
      loginForm: {
        phone: "18511111111",
        password: "12345678",
        code: "",
        isChecked: true //是否勾选用户协议  并且名字必须与对应校验规则的名字保持一致
      },
      rules: {
        // 校验规则
        phone: [
          // 是个数组，代表这个里面可以写多个校验规则
          // { required: true, message: "必须输入手机号", trigger: "blur" },
          // { min: 11, max: 11, message: "手机号必须为11位", trigger: "blur" }
          // 自定义手机号校验规则
          {
            validator: (rule, value, callback) => {
              // console.log("value is" + value);
              if (!value) {
                //return callback(new Error("手机号不能为空"));
                //这里的return并不是要返回内容，只是纯粹的终止函数  也可以写成这种形式：
                callback(new Error("手机号不能为空"));
                return;
              }
              // 手机号的正则表达式
              const reg = /^1[3456789][0-9]{9}$/;
              if (!reg.test(value)) {
                return callback(new Error("输入的手机号不合法"));
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "必须输入密码", trigger: "blur" },
          {
            min: 8,
            max: 16,
            message: "密码长度在 8 到 16 个字符",
            trigger: "blur"
          }
        ],
        code: [
          { required: true, message: "必须输入验证码", trigger: "blur" },
          {
            min: 4,
            max: 4,
            message: "验证码长度为 4 个字符",
            trigger: "blur"
          }
        ],
        // 自定义用户协议是否勾选 校验规则
        isChecked: [
          {
            validator: (rule, value, callback) => {
              // console.log("value is:" + value);
              if (!value) {
                return callback(new Error("必须同意用户协议和隐私条款"));
              }
              callback();
            },
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    // 刷新验证码
    refleshCode() {
      // 由于是get方式发送的请求 并且存在缓存  所以要让每次发送请求的url接口地址都不一样才能更换验证码
      this.codeURL =
        process.env.VUE_APP_BASEURL +
        "/captcha?type=login&randomNum=" +
        Math.random();
    },
    // 登录功能
    loginClick() {
      // 要实现点击登录 拿到form数据，然后调用它的 validate 方法，来校验哪些还没有通过校验
      // 需要先给 el-form标签 设置ref属性  获取到该标签 再调用方法
      //--------------------平时的写法-----------------------------------------------
      // this.$refs.loginForm.validate(valid => {
      //   // console.log(valid); //值为true说明全部通过检验了 只要有一项没通过 值就为false
      //   if (!valid) return; // 没有通过校验，终止函数
      //   // 通过检验,发送axios请求验证是否能登录
      //   this.$axios({
      //     method: "post",
      //     url: "/login",
      //     data: this.loginForm
      //   }).then(res => {
      //     console.log(res);
      //     if (res.data.code == 200) {
      //       // 登录成功 使用element的成功提示
      //       // this.$message.success("登录成功");
      //       this.$message({
      //         message: "登录成功",
      //         type: "success"
      //       });
      //       // 调用导入的方法在localStorage中设置token  确保'登录状态'
      //       setToken(res.data.data.token);
      //       // 跳转到后台管理页面
      //       this.$router.push("/layout");
      //     } else {
      //       // 登录失败 使用element的错误提示
      //       this.$message.error(res.data.message);
      //       // 刷新验证码
      //       this.refleshCode();
      //     }
      //   });
      // });
      //--------------------平时的写法-----------------------------------------------
      //--------------------异步函数的写法-----------------------------------------------
      // 为什么要用async和await
      // 为了使我们的异步代码，更像同步的代码
      // eg：
      // function 摇色子() {
      //   return new Promise((resolve, reject) => {
      //     let sino = parseInt(Math.random() * 6 + 1);
      //     setTimeout(() => {
      //       resolve(sino);
      //     }, 3000);
      //   });
      // }
      // async function test() {
      //   let n = await 摇色子();
      //   console.log(n);
      // }
      // test();
      // 上面这段代码async中使await 摇色子()先执行，等到三秒后执行完再把得到的结果赋值给左边的n，
      // 也就是说test函数需要三秒钟才执行完成，所以test函数是异步的，因此前面必须写async

      this.$refs.loginForm.validate(async valid => {
        // console.log(valid); //值为true说明全部通过检验了 只要有一项没通过 值就为false
        if (!valid) return; // 没有通过校验，终止函数
        // 通过检验,发送axios请求验证是否能登录

        // await后面接一个会return一个promise实例化对象的函数并执行它
        // await只能放在async函数里
        const res = await this.$axios({
          method: "post",
          url: "/login",
          data: this.loginForm
        });

        console.log(res);
        if (res.data.code == 200) {
          // 登录成功 使用element的成功提示
          // this.$message.success("登录成功");
          this.$message({
            message: "登录成功",
            type: "success"
          });
          // 调用导入的方法在localStorage中设置token  确保'登录状态'
          setToken(res.data.data.token);
          // 跳转到后台管理页面
          this.$router.push("/layout");
        } else {
          // 登录失败 使用element的错误提示
          this.$message.error(res.data.message);
          // 刷新验证码
          this.refleshCode();
        }
      });

      //--------------------异步函数的写法-----------------------------------------------
    },
    // 注册功能
    register() {
      this.$refs.registerRef.dialogVisible = true; //弹出注册会话框
      // this.isShow = !this.isShow;
    }
  }
};
</script>

<style lang="less">
.login-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: linear-gradient(225deg, #1493fa, #01c6fa);
  .left {
    width: 478px;
    height: 550px;
    background: #f5f5f5;
    padding: 48px;
    .title-box {
      display: flex;
      align-items: center;
      img {
        width: 22px;
        height: 17px;
        margin-right: 16px;
      }
      .title {
        font-size: 24px;
        margin-right: 14px;
      }
      .line {
        width: 1px;
        background-color: #c7c7c7;
        height: 27px;
        margin-right: 12px;
      }
      .sub-title {
        font-size: 22px;
      }
    }
    .login-form {
      margin-top: 29px;
      .captcha {
        width: 100%;
        height: 40px;
      }
    }
  }
}
</style>