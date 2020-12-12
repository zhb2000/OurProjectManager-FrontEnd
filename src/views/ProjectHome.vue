// 项目主页
<template>
  <el-container style="height: 100%">
    <el-aside class="project-aside" width="250px">
      <router-link
        :to="overviewPath"
        :class="[{ 'aside-item-active': isOverviewActive }, 'aside-item']"
      >
        <i class="el-icon-menu" />概览
      </router-link>
      <router-link
        :to="tasksPath"
        :class="[{ 'aside-item-active': isTasksActive }, 'aside-item']"
        v-if="isMember"
      >
        <i class="el-icon-s-claim" />任务
      </router-link>
      <router-link
        :to="membersPath"
        :class="[{ 'aside-item-active': isMembersActive }, 'aside-item']"
        v-if="isMember"
      >
        <i class="el-icon-user-solid" />成员
      </router-link>
      <router-link
        :to="invitationsPath"
        :class="[{ 'aside-item-active': isInvitationsActive }, 'aside-item']"
        v-if="isAdmin"
      >
        <i class="el-icon-message" />邀请
      </router-link>
      <router-link
        :to="settingPath"
        :class="[{ 'aside-item-active': isSettingActive }, 'aside-item']"
        v-if="isAdmin"
      >
        <i class="el-icon-s-tools" />设置
      </router-link>
    </el-aside>
    <el-container>
      <el-main>
        <!-- <div>
          <h1>ProjectHome</h1>
          <div>project id: {{ projectId }}</div>
          <div>current role: {{ currentRole }}</div>
        </div> -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
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
    projectHomePath() {
      return "/projects/" + this.projectId;
    },
    overviewPath() {
      return this.projectHomePath + "/overview";
    },
    tasksPath() {
      return this.projectHomePath + "/tasks";
    },
    membersPath() {
      return this.projectHomePath + "/members";
    },
    invitationsPath() {
      return this.projectHomePath + "/invitations";
    },
    settingPath() {
      return this.projectHomePath + "/setting";
    },
    isOverviewActive() {
      return this.$route.name === "ProjectOverview";
    },
    isTasksActive() {
      return (
        this.$route.name === "ProjectTask" ||
        this.$route.name === "ProjectCreateTask" ||
        this.$route.name === "ProjectViewTask"
      );
    },
    isMembersActive() {
      return this.$route.name === "ProjectMember";
    },
    isInvitationsActive() {
      return this.$route.name === "ProjectInvitation";
    },
    isSettingActive() {
      return this.$route.name === "ProjectSetting";
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

<style scoped>
.project-aside {
  border-style: solid;
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
  background: #0366d6;
}

.aside-item-active:hover {
  background: #0366d6;
}
</style>
