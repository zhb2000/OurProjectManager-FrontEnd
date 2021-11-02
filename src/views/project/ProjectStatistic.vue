<!-- 项目统计页 -->
<template>
  <div class="main-page">
    <el-tabs v-model="activeTabName">
      <el-tab-pane label="项目活跃度" name="project-contribute" :lazy="true">
        <statistic-project />
      </el-tab-pane>
      <el-tab-pane label="成员贡献" name="member-contribute" :lazy="true">
        <statistic-member />
      </el-tab-pane>
      <el-tab-pane label="任务类型" name="task-type" :lazy="true">
        <statistic-task />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
const StatisticProject = () => import("./StatisticProject.vue");
const StatisticMember = () => import("./StatisticMember.vue");
const StatisticTask = () => import("./StatisticTask.vue");

export default {
  data() {
    return {
      activeTabName: "project-contribute",
    };
  },
  components: {
    StatisticProject,
    StatisticMember,
    StatisticTask,
  },
};
</script>

<style scoped>
.main-page {
  padding: 20px;
}

@media screen and (max-width: 600px) {
  .main-page {
    padding: 15px;
  }
}
</style>