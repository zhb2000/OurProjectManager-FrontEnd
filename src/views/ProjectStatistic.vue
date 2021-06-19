<template>
  <div>
    <el-tabs v-model="activeTabName">
      <el-tab-pane label="项目活跃度" name="project-contribute">
        <project-statistic-project/>
      </el-tab-pane>
      <el-tab-pane label="成员贡献" name="member-contribute">
        <project-statistic-member/>
      </el-tab-pane>
      <el-tab-pane label="任务类型" name="task-type">
        <project-statistic-task-type/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ProjectStatisticTaskType from "./ProjectStatisticTaskType.vue";
import ProjectStatisticMember from "./ProjectStatisticMember.vue";
import ProjectStatisticProject from "./ProjectStatisticProject.vue";

export default {
  data() {
    return {
      activeTabName: "project-contribute",
    };
  },
  components: {
    ProjectStatisticTaskType,
    ProjectStatisticMember,
    ProjectStatisticProject,
  },
};
</script>

<style>
</style>