<template>
  <div>
    <div>project name: {{ project.name }}</div>
    <div>project id: {{ project.id }}</div>
    <div>description: {{ project.description }}</div>
    <div>project: {{ project }}</div>
  </div>
</template>

<script>
import { ProjectJson } from "../utils/jsonmodel";

export default {
  props: {
    project: {
      type: ProjectJson,
      required: true,
    },
  },
};
</script>
