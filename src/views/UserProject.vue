// 用户项目页面
<template>
  <div>
    <h2>user project</h2>
    <project-item
      v-for="project in projects"
      :key="project.id"
      :project="project"
    />
  </div>
</template>

<script>
import { ProjectJson } from "../utils/jsonmodel";
import { getUserProjectsAsync } from "../utils/ApiUtils";
import UserProjectItem from "../components/UserProjectItem.vue";

export default {
  data() {
    return {
      /** @type {ProjectJson[]} */
      projects: [],
    };
  },
  computed: {
    /** @returns {string} */
    username() {
      return this.$route.params.username;
    },
  },
  watch: {
    async $route() {
      await this.pageChangedAsync();
    },
  },
  async mounted() {
    await this.pageChangedAsync();
  },
  methods: {
    /** fetch user's projects */
    async pageChangedAsync() {
      this.projects = [];
      try {
        this.projects = await getUserProjectsAsync(this.username);
      } catch (error) {
        console.log("Get user projects failed: " + error);
        return;
      }
    },
  },
  components: {
    "project-item": UserProjectItem,
  },
};
</script>
