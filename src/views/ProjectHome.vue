// 项目主页
<template>
  <div>
    <h1>ProjectHome</h1>
    <div>project id: {{ projectId }}</div>
    <div>current role: {{ currentRole }}</div>
    <div>
      <router-link to="./overview">概览</router-link> |
      <router-link to="./task" v-if="isMember">任务</router-link> |
      <router-link to="./member" v-if="isMember">成员</router-link> |
      <router-link to="./invitation" v-if="isAdmin">邀请</router-link> |
      <router-link to="./setting" v-if="isAdmin">设置</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
import { getCurrentRoleAsync } from "../utils/ApiUtils";
import { MemberJson } from "../utils/jsonmodel";

export default {
  data() {
    return {
      /** @type {string} */
      currentRole: null,
    };
  },
  computed: {
    /** @returns {string} */
    projectId() {
      return this.$route.params.projectId;
    },
    isMember() {
      return this.isAdmin || this.currentRole === MemberJson.ROLE_MEMBER;
    },
    isAdmin() {
      return this.isSuperAdmin || this.currentRole === MemberJson.ROLE_ADMIN;
    },
    isSuperAdmin() {
      return this.currentRole === MemberJson.ROLE_SUPER_ADMIN;
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
    //get current current role in project
    async pageChangedAsync() {
      try {
        this.currentRole = await getCurrentRoleAsync(this.projectId);
      } catch (error) {
        console.log("Get current role failed: " + error);
        return;
      }
    },
  },
};
</script>
