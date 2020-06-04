<template>
  <div class="questionEdit">
    <el-dialog center :visible.sync="dialogVisible" fullscreen>
      <div class="title" slot="title">{{mode == 'add' ? '新增题目' : '编辑题目'}}</div>
      <!-- form表单部分 -->
      <el-form
        class="form"
        label-position="left"
        :rules="rules"
        :model="questionForm"
        ref="questionFormRef"
        label-width="120px"
      >
        <el-form-item prop="subject" label="学科">
          <el-select class="selectWidth" v-model="questionForm.subject" placeholder="请选择学科">
            <el-option
              v-for="item in subjectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="step" label="阶段">
          <!-- 在编辑试题时 获取到的后台数据中 step type 和 difficulty 都是 Number类型的
          而由于对象的属性名是字符串 所以选项的value值都是String类型的  导致双向绑定无法匹配到对应value的选项 
          所以需要把选项中相应的value变成Number类型（通过神奇的+号） 可以与后台数据进行匹配
          -->
          <el-select class="selectWidth" v-model="questionForm.step" placeholder="请选择阶段">
            <el-option v-for="(value,name) in stepObj" :key="name" :label="value" :value="+name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="enterprise" label="企业">
          <el-select class="selectWidth" v-model="questionForm.enterprise" placeholder="请选择企业">
            <el-option
              v-for="item in enterpriseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="city" label="城市">
          <!-- 省市区三级联动（不带“全部”选项）   npm install element-china-area-data -S-->
          <!-- 级联选择器可以通过设置Props属性 指定选项的值为选项对象的某个属性值 
          用法：:props="{value:'指定值'}"-->
          <el-cascader
            class="selectWidth"
            size="large"
            :options="citys"
            v-model="questionForm.city"
            :props="{value:'label'}"
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="type" label="题型">
          <!-- 使用单选框组  在el-radio-group中绑定v-model，在el-radio中设置好label即可 label的值对应v-model的值，则被选中 -->
          <el-radio-group v-model="questionForm.type">
            <el-radio v-for="(value, name) in typeObj" :key="name" :label="+name">{{value}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="difficulty" label="难度">
          <!-- 使用单选框组  在el-radio-group中绑定v-model，在el-radio中设置好label即可 label的值对应v-model的值，则被选中 -->
          <el-radio-group v-model="questionForm.difficulty">
            <el-radio v-for="(value, name) in difficultyObj" :key="name" :label="+name">{{value}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <hr class="hrMargin" />
        <el-form-item class="setMargin" prop="title" label="试题标题">
          <!-- 使用富文本编辑器vue-quill-editor -->
          <quill-editor
            @change="onEditorChange('title')"
            :options="{placeholder:'请输入标题...'}"
            v-model="questionForm.title"
          ></quill-editor>
        </el-form-item>
        <el-form-item
          :label="typeObj[questionForm.type]"
          :prop="questionTypeValidate[questionForm.type]"
        >
          <!-- 使用试题类型子组件 并通过自定义属性把questionForm对象的引用地址传值给子组件-->
          <!-- 并通过监听子组件利用$emit方式传值的时候自定义的事件 截取用户是否重新选择了“答案” 的信息 然后在对应方法中做出校验 -->
          <question-type :questionForm="questionForm" @haveChangedValue="validateValue"></question-type>
        </el-form-item>
        <hr class="hrMargin" />
        <el-form-item label="解析视频">
          <!-- 这里巧妙的利用了 v-model == :value="" + @input="" 的特性进行父子组件间的传值 -->
          <!-- 下面的代码相当于 ：<upload-file uploadType="video" :value="questionForm.video" @input="xxx"></upload-file>
          其中input事件触发的方法xxx Vue机制会帮我们自动执行 也就是更改绑定value属性的questionForm.video中的值-->
          <upload-file uploadType="video" v-model="questionForm.video"></upload-file>
        </el-form-item>
        <el-form-item class="setMargin" prop="answer_analyze" label="答案解析">
          <!-- 使用富文本编辑器vue-quill-editor -->
          <quill-editor
            @change="onEditorChange('answer_analyze')"
            :options="{placeholder:'请输入答案解析...'}"
            v-model="questionForm.answer_analyze"
          ></quill-editor>
        </el-form-item>
        <hr class="hrMargin" />
        <el-form-item label="答案备注" prop="remark">
          <el-input v-model="questionForm.remark"></el-input>
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
// 导入Element UI 中国省市区三级联动（不带“全部”选项）数据
import { regionData } from "element-china-area-data";
// 导入富文本编辑器 vue-quill-editor所需模块  npm install vue-quill-editor --save
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
//导入试题类型子组件
import QuestionType from "./questionType";
// 导入上传文件子组件
import UploadFile from "./uploadFile";
export default {
  name: "QuestionEdit",
  //   子组件通过props接收父组件传过来的值
  props: {
    subjectList: Array, //限制接收的数据类型为数组
    enterpriseList: Array,
    stepObj: Object, //限制接收的数据类型为对象
    typeObj: Object,
    difficultyObj: Object
  },
  components: {
    // 注册富文本编辑器 vue-quill-editor
    quillEditor,
    // 注册试题类型子组件
    QuestionType,
    // 注册上传文件子组件
    UploadFile
  },
  data() {
    return {
      citys: regionData, // Element UI 中国省市区三级联动（不带“全部”选项）数据
      dialogVisible: false, // 控制dialog的显示及隐藏
      mode: "", // add 新增 edit 修改
      questionTypeValidate: {
        // 定义一个对象 不同的题型使用不同的校验规则 key对应questionForm.type(题型)
        1: "single_select_answer", //单选的校验规则
        2: "multiple_select_answer", //多选的校验规则
        3: "short_answer" //简答的校验规则
      },
      questionForm: {
        // 这个里面的所有值，将来是传递给服务器的
        subject: "", // 学科id
        step: "", // 阶段
        enterprise: "", // 企业id
        city: [], // 城市
        type: 1, // 题型 并设置默认选中的值
        difficulty: 1, // 难度 并设置默认选中的值
        title: "", // 标题
        single_select_answer: "", // 单选答案
        multiple_select_answer: [], // 多选答案
        short_answer: "", // 简答答案
        answer_analyze: "", // 答案解析
        remark: "", // 答案备注
        video: "", //解析视频地址
        select_options: [
          {
            label: "A",
            text: "shift",
            image: ""
          },
          {
            label: "B",
            text: "pop",
            image: ""
          },
          {
            label: "C",
            text: "splice",
            image: ""
          },
          {
            label: "D",
            text: "slice",
            image: ""
          }
        ]
      },
      rules: {
        subject: [{ required: true, message: "请选择学科", trigger: "change" }],
        step: [{ required: true, message: "请选择阶段", trigger: "change" }],
        enterprise: [
          { required: true, message: "请选择企业", trigger: "change" }
        ],
        city: [{ required: true, message: "请选择城市", trigger: "change" }],
        type: [{ required: true, message: "请选择题型", trigger: "change" }],
        difficulty: [
          { required: true, message: "请选择难度", trigger: "change" }
        ],
        title: [{ required: true, message: "标题不能为空", trigger: "change" }],
        answer_analyze: [
          { required: true, message: "答案解析不能为空", trigger: "change" }
        ],
        single_select_answer: [
          { required: true, message: "单选答案不能为空", trigger: "change" }
        ],
        multiple_select_answer: [
          { required: true, message: "多选答案不能为空", trigger: "change" }
        ],
        short_answer: [
          { required: true, message: "简答答案不能为空", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "答案备注不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // quill-editor中change事件触发的方法
    onEditorChange(val) {
      // validateField	对部分表单字段进行校验的方法
      // 这里使用的富文本编辑器必须用此方法才会触发校验  原生change事件似乎无法触发校验
      this.$refs.questionFormRef.validateField(val);
    },
    validateValue() {
      // validateField	对部分表单字段进行校验的方法
      // 这里使用的子组件中的el-redio和el-checkbox必须用此方法才会触发校验  原生change事件似乎无法触发校验
      this.$refs.questionFormRef.validateField([
        "single_select_answer",
        "multiple_select_answer"
      ]);
    },
    submit() {
      // 最后一次校验
      this.$refs.questionFormRef.validate(async valid => {
        if (!valid) return;

        let res = null;
        if (this.mode == "add") {
          // 新增试题
          res = await this.$axios({
            method: "post",
            url: "/question/add",
            data: this.questionForm
          });
        } else {
          // 编辑试题
          delete this.questionForm.create_time;
          delete this.questionForm.update_time;
          // 修改提交的时候，又必须把城市名数组变成字符串 这应该是后台没有处理好
          this.questionForm.city = this.questionForm.city.join(",");
          res = await this.$axios({
            method: "post",
            url: "/question/edit",
            data: this.questionForm
          });
        }
        if (res.data.code == 200) {
          this.$message({
            message: this.mode == "add" ? "新增成功！" : "编辑成功！",
            type: "success"
          });
          this.dialogVisible = false;
          if (this.mode == "add") {
            this.$parent.search();
          } else {
            this.$parent.getQuestionList();
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  },
  watch: {
    dialogVisible(newValue) {
      //   监听 dialogVisible 的变化  清空表单校验
      // 方法一：会话框弹出时清除校验
      if (newValue) {
        this.$nextTick(() => {
          this.$refs.questionFormRef.clearValidate();
        });
      }
      //     //方法二：会话框关闭后清除校验
      // if (!newValue) {
      //   //当校验结果中有change触发的时候  不能用这种方法
      //   //因为点关闭的时候虽然把校验结果重置了 但是表单值还在 然后又点新增按钮
      //   //相当于把表单的值重新赋值为空串 触发了change事件的  所以弹出校验
      //   //把input置空我们是没有触发blur事件的  所以校验结果没弹出来
      //   this.$refs.questionFormRef.clearValidate();
      // }
    }
  }
};
</script>

<style lang="less">
.questionEdit {
  .title {
    background: linear-gradient(270deg, #01c6fa, #1493fa);
    height: 53px;
    color: #fff;
    line-height: 53px;
    text-align: left;
    padding: 0 15px 0;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
  .form {
    width: 832px;
    margin: 0 auto;
  }
  .selectWidth {
    width: 300px;
  }
  .hrMargin {
    margin-bottom: 20px;
  }
  .setMargin {
    .el-form-item__content {
      margin-left: 0px !important;
      margin-top: 40px;
    }
  }
  .ql-editor {
    height: 100px;
  }
}
</style>