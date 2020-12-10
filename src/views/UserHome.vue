// 用户主页
<template>
  <div>
    <h1>UserHome</h1>
    <p>page user: {{ username }}</p>
    <p>current user: {{ currentUsername }}</p>
    <div>is current: {{ isCurrentUser }}</div>
    <div><router-link to="/users/Bob">Bob</router-link></div>
    <div><router-link to="/users/Alice123">Alice123</router-link></div>
    <div>
      <router-link to="./overview">概览</router-link> |
      <router-link to="./projects" v-if="isCurrentUser">项目</router-link> |
      <router-link to="./notifications" v-if="isCurrentUser"> 通知 </router-link>
      |
      <router-link to="./setting" v-if="isCurrentUser">设置</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
import { getCurrentUsernameAsync } from "../utils/ApiUtils";

export default {
  data() {
    return {
      /** @type {string} */
      currentUsername: null,
    };
  },
  computed: {
    /** @returns {string} */
    username() {
      return this.$route.params.username;
    },
    isCurrentUser() {
      return this.currentUsername && this.currentUsername === this.username;
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
    /** set current username */
    async pageChangedAsync() {
      try {
        this.currentUsername = await getCurrentUsernameAsync();
      } catch (error) {
        console.log("Get current username failed: " + error);
        return;
      }
    },
  },
};
</script>
