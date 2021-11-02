<!-- 项目任务列表页 -->
<template>
  <div class="main-page">
    <div v-if="isAdmin" class="input-area">
      <div style="flex-grow: 1" />
      <router-link to="create" append>
        <el-button type="primary" size="medium">创建任务</el-button>
      </router-link>
    </div>
    <task-item
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      :projectId="projectId"
      @complete-change="taskCompleteChange"
    />
  </div>
</template>

<script>
import * as api from "../../utils/ApiUtils";
// eslint-disable-next-line no-unused-vars
import { TaskJson, MemberJson } from "../../utils/JsonModel";
import TaskItem from "../../components/project/TaskItem.vue";

export default {
  data() {
    return {
      /** @type {string} */
      currentRole: MemberJson.ROLE_MEMBER,
      /** @type {TaskJson[]} */
      tasks: [],
    };
  },
  computed: {
    /** @returns {string} */
    projectId() {
      return this.$route.params.projectId;
    },
    isAdmin() {
      return (
        this.currentRole === MemberJson.ROLE_ADMIN ||
        this.currentRole === MemberJson.ROLE_SUPER_ADMIN
      );
    },
  },
  watch: {
    $route() {
      this.pageChangedAsync();
    },
  },
  created() {
    this.pageChangedAsync();
  },
  methods: {
    /** fetch tasks data */
    async pageChangedAsync() {
      try {
        const setRoleAsync = async () => {
          this.currentRole = MemberJson.ROLE_MEMBER;
          this.currentRole = await api.getCurrentRoleAsync(this.projectId);
        };
        await Promise.all([setRoleAsync(), this.setTasksAsync()]);
      } catch (error) {
        this.$message({ message: "角色获取失败", type: "error" });
        console.log("Get role failed: " + error);
        return;
      }
    },
    async setTasksAsync() {
      try {
        this.tasks = await api.getTasksAsync(this.projectId);
        this.tasks.sort((a, b) => b.createAt.localeCompare(a.createAt));
      } catch (error) {
        this.$message({ message: "任务获取失败", type: "error" });
        console.log("Get tasks failed: " + error);
        return;
      }
    },
    /** @param {TaskJson} task */
    async taskCompleteChange(task) {
      try {
        await api.updateTaskCompleteAsync(
          this.projectId,
          task.id,
          task.complete
        );
      } catch (error) {
        this.$message({ message: "更新任务完成状态失败", type: "error" });
        console.log("Update task complete failed: " + error);
        task.complete = !task.complete;
        return;
      }
    },
  },
  components: {
    TaskItem,
  },
};
</script>

<style scoped>
.main-page {
  padding: 20px;
}

.input-area {
  display: flex;
  margin-bottom: 15px;
}

@media screen and (max-width: 600px) {
  .main-page {
    padding: 15px;
  }
}
</style>
