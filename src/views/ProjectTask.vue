<template>
  <div>
    <h2>project task</h2>
    <task-item v-for="task in tasks" :key="task.id" :task="task" />
  </div>
</template>

<script>
import { getTasksAsync } from "../utils/ApiUtils";
import { TaskJson } from "../utils/jsonmodel";
import ProjectTaskItem from "../components/ProjectTaskItem.vue";

export default {
  data() {
    return {
      /** @type {TaskJson[]} */
      tasks: [],
    };
  },
  computed: {
    /** @returns {string} */
    projectId() {
      return this.$route.params.projectId;
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
        this.tasks = [];
        this.tasks = await getTasksAsync(this.projectId);
      } catch (error) {
        console.log("Get tasks failed: " + error);
        return;
      }
    },
  },
  components: {
    "task-item": ProjectTaskItem,
  },
};
</script>
