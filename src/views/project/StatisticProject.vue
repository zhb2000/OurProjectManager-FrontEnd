<!-- 项目统计-项目活跃度 -->
<template>
  <div>
    <div class="chart-header">热力图</div>
    <calendar-heatmap
      class="chart"
      :values="heatmapData"
      :end-date="new Date()"
    />
    <div class="chart-header">完成任务</div>
    <column-chart
      class="chart"
      v-bind="completeChartConfig"
      :data="completeChartData"
    />
    <div class="chart-header">创建任务</div>
    <column-chart
      class="chart"
      v-bind="createChartConfig"
      :data="createChartData"
    />
    <div class="chart-header">评论数量</div>
    <column-chart
      class="chart"
      v-bind="commentChartConfig"
      :data="commentChartData"
    />
  </div>
</template>

<script>
import { CalendarHeatmap } from "vue-calendar-heatmap";
import { ColumnChart } from "@opd/g2plot-vue";
import { randInt, randBoolean, dateToDayStr } from "../../utils/utils.js";

export default {
  data() {
    const self = this;
    return {
      heatmapData: self.dataDemo(0.7, 10 + 1),
      completeChartData: self.dataDemo(0.5, 5 + 1),
      completeChartConfig: {
        height: 250,
        xField: "date",
        yField: "count",
        xAxis: {
          label: {
            autoRotate: false,
          },
        },
        slider: {
          start: 0.9,
          end: 1.0,
        },
      },
      createChartData: self.dataDemo(0.5, 5 + 1),
      createChartConfig: {
        height: 250,
        xField: "date",
        yField: "count",
        xAxis: {
          label: {
            autoRotate: false,
          },
        },
        slider: {
          start: 0.9,
          end: 1.0,
        },
      },
      commentChartData: self.dataDemo(0.5, 10 + 1),
      commentChartConfig: {
        height: 250,
        xField: "date",
        yField: "count",
        xAxis: {
          label: {
            autoRotate: false,
          },
        },
        slider: {
          start: 0.9,
          end: 1.0,
        },
      },
    };
  },
  methods: {
    dataDemo(boolProb, maxNum) {
      const result = [];
      const date = new Date();
      date.setFullYear(date.getFullYear() - 1);
      const now = new Date();
      while (new Date(date) <= new Date(now)) {
        if (randBoolean(boolProb)) {
          result.push({
            date: dateToDayStr(date),
            count: randInt(1, maxNum),
          });
        } else {
          result.push({
            date: dateToDayStr(date),
            count: 0,
          });
        }
        date.setDate(date.getDate() + 1);
      }
      return result;
    },
  },
  components: {
    CalendarHeatmap,
    ColumnChart,
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
    margin-left: 0px;
    margin-right: 0px;
  }
}
</style>