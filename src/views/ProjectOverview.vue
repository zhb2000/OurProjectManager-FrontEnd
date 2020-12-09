// 项目概览页面
<template>
  <div>
    <h2>Project Overview</h2>
    <div>project id: {{ projectId }}</div>
    <div>project name: {{ projectName }}</div>
    <div>description: {{ description }}</div>
    <div>current role: {{ currentRole }}</div>
    <div>project: {{ project }}</div>
  </div>
</template>

<script>
import { getCurrentRoleAsync, getProjectAsync } from "../utils/ApiUtils";
import { ProjectJson } from "../utils/jsonmodel";

export default {
  data() {
    return {
      /** @type {string} */
      currentRole: null,
      /** @type {ProjectJson} */
      project: null,
    };
  },
  computed: {
    /** @returns {string} */
    projectId() {
      return this.$route.params.projectId;
    },
    /** @type {string} */
    projectName() {
      return this.project ? this.project.name : null;
    },
    /** @type {string} */
    description() {
      return this.project ? this.project.description : null;
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
    /** fetch project data */
    async pageChangedAsync() {
      try {
        const promises = [
          getCurrentRoleAsync(this.projectId),
          getProjectAsync(this.projectId),
        ];
        const results = await Promise.all(promises);
        this.currentRole = results[0];
        this.project = results[1];
      } catch (error) {
        console.log("get role or project failed: " + error);
        return;
      }
    },
  },
};
</script>
