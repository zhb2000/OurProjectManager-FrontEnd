// 创建任务页面
<template>
  <div>
    <h2>Create Task</h2>
    <div><input v-model="title" placeholder="任务标题" /></div>
    <div><textarea v-model="body" placeholder="任务描述" /></div>
    <div>todo: executors</div>
    <div><button @click="createBtnClick">创建任务</button></div>
  </div>
</template>

<script>
import { createTaskAsync } from "../utils/ApiUtils";
import { TaskJson } from "../utils/jsonmodel";
import { StringUtils } from "../utils/StringUtils";

export default {
  data() {
    return {
      task: null,
      title: "",
      body: "",
      executors: [], //TODO executors in create task
    };
  },
  computed: {
    /** @returns {string} */
    projectId() {
      return this.$route.params.projectId;
    },
  },
  methods: {
    async createBtnClick() {
      if (StringUtils.isEmpty(this.title)) {
        alert("任务标题不能为空");
        return;
      }
      try {
        const task = await createTaskAsync(
          this.projectId,
          this.title,
          this.body,
          this.executors
        );
        this.$router.push("/projects/" + this.projectId + "/tasks/" + task.id);
      } catch (error) {
        console.log("Create task failed: " + error);
        return;
      }
    },
  },
};
</script>