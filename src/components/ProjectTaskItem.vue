// 项目内任务条目
<template>
  <div>
    <div>
      <router-link :to="taskPath">
        <b>{{ task.title }}</b>
      </router-link>
    </div>
    <div>tasks: {{ task }}</div>
  </div>
</template>

<script>
import { TaskJson } from "../utils/jsonmodel";

export default {
  props: {
    task: {
      type: TaskJson,
      required: true,
    },
    projectId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      taskPath: "/projects/" + this.projectId + "/tasks/" + this.task.id,
    };
  },
};
</script>
