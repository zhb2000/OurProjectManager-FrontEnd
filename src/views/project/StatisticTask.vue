// 项目统计-任务类型
<template>
  <div>
    <div class="chart-header">任务类型占比</div>
    <bar-chart class="chart" v-bind="typeConfig" :data="typeData" />
  </div>
</template>

<script>
import { BarChart } from "@opd/g2plot-vue";

export default {
  data() {
    const typeDataY = "任务类型";
    return {
      typeData: [
        { type: "未分配", count: 10, y: typeDataY },
        { type: "已分配", count: 20, y: typeDataY },
        { type: "已完成", count: 30, y: typeDataY },
      ],
      typeConfig: {
        height: 150,
        maxBarWidth: 50,
        xField: "count",
        yField: "y",
        seriesField: "type",
        isPercent: true,
        isStack: true,
        yAxis: {
          label: null,
        },
        label: {
          position: "middle",
          content: (item) => {
            return item.count.toFixed(2);
          },
          style: {
            fill: "#fff",
          },
        },
      },
    };
  },
  components: {
    BarChart,
  },
};
</script>

<style scoped>
.chart-header {
  margin: 0 20px;
  font-weight: bold;
  font-size: 25px;
}

.chart {
  margin: 20px;
}

@media screen and (max-width: 700px) {
  .chart {
    margin: 20px 0px;
  }

  .chart-header {
    margin: 0px;
  }
}
</style>
