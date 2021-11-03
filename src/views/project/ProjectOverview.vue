<!-- 项目概览页面 -->
<template>
  <div class="main-page">
    <!-- 项目信息卡片 -->
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

    <!-- 项目主管区域 -->
    <div class="admin-header">项目主管</div>
    <div class="admin-grid">
      <admin-card v-if="superAdmin != null" :user="superAdmin" />
    </div>

    <!-- 项目管理员区域 -->
    <div v-if="showAdmins">
      <div class="admin-header">项目管理员</div>
      <div class="admin-grid">
        <admin-card v-for="admin in admins" :key="admin.id" :user="admin" />
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "../../utils/ApiUtils";
import { MemberJson } from "../../utils/JsonModel";
import * as DateUtils from "../../utils/DateUtils";
import * as StrUtils from "../../utils/StringUtils";
import AdminCard from "../../components/project/AdminCard.vue";
/** @typedef {import("../../utils/JsonModel").UserJson} UserJson */
/** @typedef {import("../../utils/JsonModel").ProjectJson} ProjectJson */

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
    /** @returns {string?} */
    projectName() {
      return this.project?.name;
    },
    /** @returns {string?} */
    description() {
      return this.project?.description;
    },
    /** @returns {string?} */
    createAt() {
      return this.project != null
        ? DateUtils.beautify(this.project.createAt)
        : null;
    },
    /** @returns {string?} */
    updateAt() {
      return this.project != null
        ? DateUtils.beautify(this.project.updateAt)
        : null;
    },
    /** @returns {UserJson?} */
    superAdmin() {
      return this.project?.superAdmin;
    },
    /** @returns {UserJson[]} */
    admins() {
      return this.project?.admins ?? [];
    },
    /** @returns {string} */
    nameFirstChar() {
      return StrUtils.firstCharOfName(this.projectName);
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
    showAdmins() {
      return this.admins != null && this.admins.length > 0;
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
          api.getCurrentRoleAsync(this.projectId),
          api.getProjectAsync(this.projectId),
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
  components: { AdminCard },
};
</script>

<style scoped>
.main-page {
  padding: 40px;
}

.project-card {
  padding: 20px 40px;
  border-style: solid;
  border-width: 1px;
  border-color: #dcdfe6;
  border-radius: 10px;
  color: #303133;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.project-name-title {
  font-weight: bold;
  font-size: 30px;
  margin: 0 0 10px 0;
}

.info-area {
  margin-left: 40px;
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

.admin-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 15px;
  column-gap: 15px;
}

.admin-header {
  margin-top: 40px;
  margin-bottom: 15px;
  font-weight: bold;
  font-size: 24px;
}

@media screen and (min-width: 800px) and (max-width: 950px) {
  .project-card {
    flex-direction: column;
    padding-left: 0px;
    padding-right: 0px;
  }

  .info-area {
    margin-left: 0px;
    margin-top: 20px;
  }

  .admin-grid {
    grid-template-columns: 1fr;
    row-gap: 15px;
  }
}

@media screen and (max-width: 700px) {
  .project-card {
    flex-direction: column;
    padding-left: 0px;
    padding-right: 0px;
  }

  .info-area {
    margin-left: 0px;
    margin-top: 20px;
  }

  .admin-grid {
    grid-template-columns: 1fr;
    row-gap: 15px;
  }
}

@media screen and (max-width: 600px) {
  .main-page {
    padding: 15px;
  }
}
</style>
