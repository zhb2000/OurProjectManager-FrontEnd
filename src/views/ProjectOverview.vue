// 项目概览页面
<template>
  <div>
    <div class="project-card">
      <el-avatar :size="150">
        <span style="font-size: 50px">{{ nameFirstChar }}</span>
      </el-avatar>
      <div class="info-area">
        <div class="project-name-title">{{ projectName }}</div>
        <div class="info-list-area">
          <div class="info-left-col">
            <div>项目 ID：</div>
            <div>项目描述：</div>
            <div>创建时间：</div>
            <div>更新时间：</div>
            <div>我的角色：</div>
          </div>
          <div class="info-right-col">
            <div>{{ projectId }}</div>
            <div>{{ description }}</div>
            <div>{{ createAt }}</div>
            <div>{{ updateAt }}</div>
            <div>{{ myRoleStr }}</div>
          </div>
        </div>
      </div>
    </div>
    <div>project: {{ project }}</div>
  </div>
</template>

<script>
import { getCurrentRoleAsync, getProjectAsync } from "../utils/ApiUtils";
import { ProjectJson, UserJson, MemberJson } from "../utils/jsonmodel";

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
    /** @returns {string} */
    createAt() {
      return this.project ? this.project.createAt : null;
    },
    /** @returns {string} */
    updateAt() {
      return this.project ? this.project.updateAt : null;
    },
    /** @returns {UserJson} */
    superAdmin() {
      return this.project ? this.project.superAdmin : null;
    },
    /** @returns {UserJson[]} */
    admins() {
      return this.project ? this.project.superAdmin : null;
    },
    /** @type {string} */
    nameFirstChar() {
      if (!this.projectName) {
        return " ";
      }
      const name = this.projectName.trim();
      return name.length > 0 ? name[0] : " ";
    },
    myRoleStr() {
      if (this.currentRole === MemberJson.ROLE_SUPER_ADMIN) {
        return "项目主管";
      } else if (this.currentRole === MemberJson.ROLE_ADMIN) {
        return "项目管理员";
      } else if (this.currentRole === MemberJson.ROLE_MEMBER) {
        return "项目成员";
      } else {
        return "非项目成员";
      }
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
        this.currentRole = null;
        this.project = null;
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

<style scoped>
.project-card {
  padding: 20px 40px;
  margin: 20px;
  border-style: solid;
  border-width: 1px;
  border-color: #dcdfe6;
  border-radius: 10px;
  color: #303133;
  display: flex;
  align-items: center;
}

.project-name-title {
  font-weight: bold;
  font-size: 30px;
  margin: 0 0 10px 0;
}

.info-area {
  margin: 0 0 0 40px;
}

.info-list-area {
  display: flex;
}

.info-left-col {
  font-weight: bold;
  margin: 0 10px 0 0;
  line-height: 40px;
}

.info-right-col {
  line-height: 40px;
}
</style>
