<template>
  <div class="questionType">
    <div v-if="questionForm.type == 1">
      <div class="item" v-for="(item, index) in questionForm.select_options" :key="index">
        <!-- radio单选框 -->
        <el-radio
          @change="changeValue"
          v-model="questionForm.single_select_answer"
          :label="item.label"
        >{{item.label}}</el-radio>
        <!-- input输入框 -->
        <el-input @change="changeValue" v-model="item.text"></el-input>
        <!-- 上传文件子组件 -->
        <upload-file style="margin-left:15px;" v-model="item.image"></upload-file>
      </div>
    </div>
    <div v-if="questionForm.type == 2">
      <div class="item" v-for="(item, index) in questionForm.select_options" :key="index">
        <!-- checkbox多选框 -->
        <el-checkbox
          @change="changeValue"
          v-model="questionForm.multiple_select_answer"
          :label="item.label"
        ></el-checkbox>
        <!-- input输入框 -->
        <el-input @change="changeValue" v-model="item.text" style="margin-left:25px;"></el-input>
        <!-- 上传文件子组件 -->
        <upload-file style="margin-left:15px;" v-model="item.image"></upload-file>
      </div>
    </div>
    <div v-if="questionForm.type == 3">
      <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="questionForm.short_answer"></el-input>
    </div>
  </div>
</template>

<script>
// 导入上传文件子组件
import UploadFile from "./uploadFile";
export default {
  name: "QuestionType",
  // 通过props接收父组件中questionForm对象的引用地址 这里对该对象进行了修改，也会作用于父组件
  props: ["questionForm"],
  components: {
    UploadFile
  },
  data() {
    return {};
  },

  methods: {
    changeValue() {
      // 通过el-redio和el-checkbox 的change事件 触发该方法
      // 通过$emit的方式告知父组件 不需要传值 因为父组件仅仅需要知道用户是否重新选择了“答案”
      this.$emit("haveChangedValue");
    }
  }
};
</script>

<style lang="less">
.questionType {
  .item {
    display: flex;
    align-items: center;
  }
}
</style>