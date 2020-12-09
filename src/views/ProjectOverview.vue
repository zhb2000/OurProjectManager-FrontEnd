<template>
  <div>
    <h2>Project Overview</h2>
    <div>project id: {{ projectId }}</div>
    <div>project name: {{ projectName }}</div>
    <div>description: {{ description }}</div>
    <div>project: {{ project }}</div>
  </div>
</template>

<script>
import { getProjectAsync } from "../utils/ApiUtils";
import { ProjectJson } from "../utils/jsonmodel";

export default {
  data() {
    return {
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
        this.project = await getProjectAsync(this.projectId);
      } catch (error) {
        console.log("get project by id failed: " + error);
        return;
      }
    },
  },
};
</script>
