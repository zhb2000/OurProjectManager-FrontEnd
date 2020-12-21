<template>
  <div>
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
import {
  getCurrentRoleAsync,
  getTasksAsync,
  updateTaskCompleteAsync,
} from "../utils/ApiUtils";
import { TaskJson, MemberJson } from "../utils/jsonmodel";
import ProjectTaskItem from "../components/ProjectTaskItem.vue";

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
          this.currentRole = await getCurrentRoleAsync(this.projectId);
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
        this.tasks = await getTasksAsync(this.projectId);
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
        await updateTaskCompleteAsync(this.projectId, task.id, task.complete);
      } catch (error) {
        this.$message({ message: "更新任务完成状态失败", type: "error" });
        console.log("Update task complete failed: " + error);
        task.complete = !task.complete;
        return;
      }
    },
  },
  components: {
    "task-item": ProjectTaskItem,
  },
};
</script>

<style scoped>
.input-area {
  display: flex;
  margin-bottom: 15px;
}
</style>
