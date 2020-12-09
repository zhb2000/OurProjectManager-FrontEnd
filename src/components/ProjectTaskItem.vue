// 项目内任务条目
<template>
  <div>
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
  },
};
</script>
