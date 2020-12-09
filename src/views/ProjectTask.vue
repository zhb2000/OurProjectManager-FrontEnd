<template>
  <div>
    <h2>project task</h2>
    <div v-if="isAdmin">
      <router-link to="create" append><button>创建任务</button></router-link>
    </div>
    <task-item v-for="task in tasks" :key="task.id" :task="task" />
  </div>
</template>

<script>
import { getCurrentRoleAsync, getTasksAsync } from "../utils/ApiUtils";
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
        const setRole = async () => {
          this.currentRole = MemberJson.ROLE_MEMBER;
          this.currentRole = await getCurrentRoleAsync(this.projectId);
        };
        const setTasks = async () => {
          this.tasks = [];
          this.tasks = await getTasksAsync(this.projectId);
        };
        await Promise.all([setRole(), setTasks()]);
      } catch (error) {
        console.log("Get role or tasks failed: " + error);
        return;
      }
    },
  },
  components: {
    "task-item": ProjectTaskItem,
  },
};
</script>
