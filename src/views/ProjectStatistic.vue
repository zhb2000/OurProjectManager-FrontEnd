<template>
  <div>
    <el-tabs v-model="activeTabName">
      <el-tab-pane label="项目活跃度" name="project-contribute" :lazy="true">
        <project-statistic-project />
      </el-tab-pane>
      <el-tab-pane label="成员贡献" name="member-contribute" :lazy="true">
        <project-statistic-member />
      </el-tab-pane>
      <el-tab-pane label="任务类型" name="task-type" :lazy="true">
        <project-statistic-task-type />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
const ProjectStatisticTaskType = () => import("./ProjectStatisticTaskType.vue");
const ProjectStatisticMember = () => import("./ProjectStatisticMember.vue");
const ProjectStatisticProject = () => import("./ProjectStatisticProject.vue");

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