<template>
  <div>
    <h2>user overview</h2>
    <div>username: {{ username }}</div>
    <div>nickname: {{ nickname }}</div>
    <div>id: {{ userId }}</div>
    <div>project count: {{ projectCount }}</div>
    <div>user: {{ user }}</div>
  </div>
</template>

<script>
import { UserJson } from "../utils/jsonmodel";
import { getUserByNameAsync } from "../utils/ApiUtils";

export default {
  data() {
    return {
      /** @type {UserJson} */
      user: null,
    };
  },
  computed: {
    /** @returns {string} */
    username() {
      return this.$route.params.username;
    },
    /** @returns {string} */
    nickname() {
      return this.user ? this.user.nickname : null;
    },
    /** @returns {number} */
    userId() {
      return this.user ? this.user.id : null;
    },
    /** @returns {string} */
    projectCount() {
      return this.user ? this.user.projectCount : null;
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
    /** fetch user data */
    async pageChangedAsync() {
      try {
        //console.log("user overview changed, page name: " + this.username);
        this.user = await getUserByNameAsync(this.username);
      } catch (error) {
        console.log("get user by name failed: " + error);
        return;
      }
    },
  },
};
</script>
