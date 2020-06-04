<template>
  <div class="chart">
    <!-- 统计总数部分 -->
    <el-card>
      <ul class="list">
        <li>
          <div class="itemContent color1">{{totalNumObj.increment_users }}</div>
          <p>今日新增用户</p>
        </li>
        <li>
          <div class="itemContent color1">{{totalNumObj.total_users }}</div>
          <p>总用户量</p>
        </li>
        <li>
          <div class="itemContent color2">{{totalNumObj.increment_questions }}</div>
          <p>新增试题</p>
        </li>
        <li>
          <div class="itemContent color2">{{totalNumObj.total_questions }}</div>
          <p>总试题量</p>
        </li>
        <li>
          <div class="itemContent color3">{{totalNumObj.personal_questions }}</div>
          <p>人均刷题量</p>
        </li>
        <li>
          <div class="itemContent color3">{{totalNumObj.total_done_questions }}</div>
          <p>总刷题量</p>
        </li>
      </ul>
    </el-card>
    <!-- 企业题目数据统计部分 -->
    <el-card style="margin-top:20px">
      <!--2. 为 ECharts 准备一个具备高宽的 DOM 容器。 -->
      <div class="echarts" ref="echartsRef"></div>
    </el-card>
  </div>
</template>

<script>
//1. 引入 ECharts
import echarts from "echarts";
export default {
  name: "Chart",
  data() {
    return {
      totalNumObj: {}, //用户数，题量，刷题量的统计数
      statistics: {} //企业题目数据统计数
    };
  },
  created() {
    // 一进来页面就获取统计用户数，题量，刷题量的数据
    this.getTotalNum();
  },
  mounted() {
    // 把获取企业题目统计数据放在这个钩子函数中 是为了保证在根据这个数据初始化echarts实例的时候已经能够获取到dom元素了
    this.getStatistics();
  },
  methods: {
    async getTotalNum() {
      const res = await this.$axios({
        method: "post", //这里获取数据的方式之所以不用get方式 是因为get发送请求在请求地址不变的情况下存在缓存而导致无法再次发送请求获取新数据
        url: "/data/title"
      });
      // console.log(res);
      if (res.data.code == 200) {
        this.totalNumObj = res.data.data;
      }
    },
    async getStatistics() {
      const res = await this.$axios({
        method: "post",
        url: "/data/statistics"
      });
      // console.log(res);
      if (res.data.code == 200) {
        this.statistics = res.data.data;
        // 确保获取到对应数据再调用方法初始化echarts实例
        // 因为获取数据是异步操作，如果还没获取数据就开始初始化echarts实例会出现问题
        this.initEcharts();
      }
    },
    // 3.初始化echarts实例
    initEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.echartsRef);

      const legendData = this.statistics.map(item => item.name); //简写形式
      // const legendData = this.statistics.map(item => {
      //   return item.name; //这里我们只需要对象中name这个成员 用数组的map方法处理可以达到目的
      // });

      // 指定图表的配置项和数据
      var option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          right: 60,
          data: legendData
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "30",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: this.statistics
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  }
};
</script>

<style lang="less">
.chart {
  .list {
    //弹性例子布局
    display: flex;
    //主轴分布
    justify-content: space-around;
    //侧轴分布
    align-items: center;
    //文本居中
    text-align: center;
    //颜色处理
    .color1 {
      border: 3px solid #0086fa;
      color: #0086fa;
    }
    .color2 {
      border: 3px solid #f76137;
      color: #f76137;
    }
    .color3 {
      border: 3px solid #55cd78;
      color: #55cd78;
    }
    //画圈圈
    .itemContent {
      border-radius: 50%;
      width: 99px;
      height: 99px;
      line-height: 99px;
    }
  }
  .echarts {
    height: 500px;
  }
}
</style>
