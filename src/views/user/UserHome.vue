// 用户主页
<template>
  <container-with-side>
    <template v-slot:side>
      <router-link
        to="./overview"
        :class="[{ 'aside-item-active': isOverviewActive }, 'aside-item']"
      >
        <i class="el-icon-user-solid" />概览
      </router-link>
      <router-link
        to="./projects"
        v-if="isCurrentUser"
        :class="[{ 'aside-item-active': isProjectsActive }, 'aside-item']"
      >
        <i class="el-icon-menu" />项目
      </router-link>
      <router-link
        to="./notifications"
        v-if="isCurrentUser"
        :class="[{ 'aside-item-active': isNotificationsActive }, 'aside-item']"
      >
        <i class="el-icon-message-solid" />消息
      </router-link>
      <router-link
        to="./setting"
        v-if="isCurrentUser"
        :class="[{ 'aside-item-active': isSettingActive }, 'aside-item']"
      >
        <i class="el-icon-s-tools" />设置
      </router-link>
    </template>
    <template v-slot:main>
      <router-view />
    </template>
  </container-with-side>
</template>

<script>
import * as api from "../../utils/ApiUtils";
import ContainerWithSide from "../../components/ContainerWithSide.vue";

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
    isOverviewActive() {
      return this.$route.name === "UserOverview";
    },
    isProjectsActive() {
      return this.$route.name === "UserProject";
    },
    isNotificationsActive() {
      return this.$route.name === "UserNotification";
    },
    isSettingActive() {
      return this.$route.name === "UserSetting";
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
        this.currentUsername = await api.getCurrentUsernameAsync();
      } catch (error) {
        console.log("Get current username failed: " + error);
        return;
      }
    },
  },
  components: { ContainerWithSide },
};
</script>

<style scoped>
.user-aside {
  /* background: #f3f4f5; */
  border-style: solid;
  /* border-color: #e4e6e8; */
  border-color: lightgray;
  border-width: 0 1px 0 0;
}

.aside-item {
  display: block;
  margin: 10px;
  padding: 10px 16px;
  border-radius: 5px;
  color: #606266;
  text-decoration: none;
}

.aside-item:hover {
  background: #f6f8fa;
  font-weight: bold;
}

.aside-item > i {
  margin: 0 10px 0 0;
}

.aside-item-active {
  font-weight: bold;
  color: white;
  /* background: #0366d6; */
  background: #409eff;
}

.aside-item-active:hover {
  /* background: #0366d6; */
  background: #409eff;
}
</style>
