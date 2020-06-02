<template>
  <div class="upload">
    <!-- action是elementUI封装的用来发送请求上传头像的方法(底层基于FormData)
            需要设置name属性的值为 对应接口的提交参数   类似FormData提交参数
    -->
    <el-upload
      class="avatar-uploader"
      :action="BaseUrl + '/question/upload'"
      name="file"
      :show-file-list="false"
      :on-success="handleFileSuccess"
      :before-upload="beforeFileUpload"
    >
      <div v-if="uploadType == 'video'">
        <!-- 当value有值了 会重新加载渲染显示出来 -->
        <video v-if="value" :src="BaseUrl + '/' + value" controls class="avatar"></video>
        <!-- 一开始value值为空字符串，所以会执行下面的代码  页面中显示+号 -->
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </div>
      <div v-else>
        <img v-if="value" :src="BaseUrl + '/' + value" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "UploadFile",
  props: {
    uploadType: {
      //上传文件类型
      type: String, //接收传值的类型为String
      default: "image" //默认值
    },
    value: String //父组件通过巧妙利用v-model传过来的值 在上传视频时是questionForm.video中的值 在上传图片时是questionForm.select_options.image中的值
  },
  data() {
    return {
      BaseUrl: process.env.VUE_APP_BASEURL //接口基地址
    };
  },
  methods: {
    // 图片真正上传之前的回调函数
    beforeFileUpload(file) {
      //   console.log(file); //上传的头像文件信息
      if (this.uploadType == "video") {
        //   这里要上传的是视频
        const isVideo = file.type === "video/mp4";
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isVideo) {
          this.$message.error("上传文件只能是 MP4 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传文件大小不能超过 2MB!");
        }
        // 如果要进行上传文件的请求，我们必须返回true，它才会进行文件上传
        return isVideo && isLt2M;
      } else {
        //   这里要上传的是图片
        const isImage =
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "image/gif";
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isImage) {
          this.$message.error("上传文件只能是 JPG/PNG/GIF 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传文件大小不能超过 2MB!");
        }
        // 如果要进行上传文件的请求，我们必须返回true，它才会进行文件上传
        return isImage && isLt2M;
      }
    },
    // 上传成功之后的回调函数  可选参数res，file
    handleFileSuccess(res) {
      //   console.log(res);
      // 由于v-model == :value="" + @input="" 的特性 所以这里通过子组件传值给父组件的时候  自定义事件名要定义为input
      // 然后在父组件那边会自动监听执行input事件，会把:value绑定的questionForm.video值更改为res.data.url对应的值
      // 并且Vue存在这样的机制，只要模型值发生了改变，就会自动重新渲染对应页面，也就是把视频或图片渲染出来
      this.$emit("input", res.data.url);

      //   // 上传头像成功之后关闭校验  注意：ref属性要给 el-form-item 设置
      //   this.$refs.uploadAvatar.clearValidate();
    }
  }
};
</script>

<style lang="less">
.upload {
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