//项目设置页
<template>
  <div>
    <h2 class="setting-header">修改项目名称</h2>
    <div>当前名称：{{ projectName }}</div>
    <label for="new-project-name" class="setting-label">新项目名称</label>
    <input
      v-model="newProjectName"
      name="new-project-name"
      autocomplete="off"
      class="setting-input"
    />
    <el-button
      type="primary"
      class="setting-button"
      size="medium"
      @click="updateNameBtnClick"
    >
      修改项目名
    </el-button>
    <h2 class="setting-header">修改项目描述</h2>
    <div>当前描述：{{ projectDescription }}</div>
    <label for="new-description" class="setting-label">新项目描述</label>
    <input
      v-model="newProjectDescription"
      name="new-description"
      autocomplete="off"
      class="setting-input"
    />
    <el-button
      type="primary"
      class="setting-button"
      size="medium"
      @click="updateDescriptionBtnClick"
    >
      修改项目描述
    </el-button>
    <div v-if="isSuperAdmin">
      <h2 class="setting-header">删除项目</h2>
      <p>警告：删除项目后数据将无法恢复。</p>
      <el-button
        type="danger"
        class="setting-button"
        size="medium"
        @click="deleteProjectBtnClick"
      >
        删除项目
      </el-button>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { ProjectJson, MemberJson } from "../utils/jsonmodel";
import * as api from "../utils/ApiUtils"
import { confirmDeleteAsync } from "../utils/UiUtils";

export default {
  data() {
    return {
      /** @type {string} */
      currentRole: MemberJson.ROLE_ADMIN,
      /** @type {ProjectJson} */
      project: null,
      newProjectName: "",
      newProjectDescription: "",
    };
  },
  computed: {
    /** @returns {string} */
    projectId() {
      return this.$route.params.projectId;
    },
    /** @returns {string} */
    projectName() {
      return this.project ? this.project.name : null;
    },
    /** @returns {string} */
    projectDescription() {
      return this.project ? this.project.description : null;
    },
    /** @returns {boolean} */
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
    /** fetch project data */
    async pageChangedAsync() {
      await Promise.all([this.setProjectAsync(), this.setRoleAsync()]);
    },
    async setProjectAsync() {
      this.project = null;
      try {
        this.project = await api.getProjectAsync(this.projectId);
      } catch (error) {
        this.$message({ message: "获取项目信息失败", type: "error" });
        console.log("Get project failed: " + error);
        return;
      }
    },
    async setRoleAsync() {
      this.currentRole = MemberJson.ROLE_ADMIN;
      try {
        this.currentRole = await api.getCurrentRoleAsync(this.projectId);
      } catch (error) {
        this.$message({ message: "获取角色信息失败", type: "error" });
        console.log("Get role failed: " + error);
        return;
      }
    },
    async updateNameBtnClick() {
      try {
        await api.updateProjectNameAndDescriptionAsync(
          this.projectId,
          this.newProjectName,
          this.projectDescription
        );
      } catch (error) {
        this.$message({ message: "项目名称更新失败", type: "error" });
        console.log("Update project name failed: " + error);
        return;
      }
      this.$message({ message: "项目名称更新成功", type: "success" });
      await this.setProjectAsync();
    },
    async updateDescriptionBtnClick() {
      try {
        await api.updateProjectNameAndDescriptionAsync(
          this.projectId,
          this.projectName,
          this.newProjectDescription
        );
      } catch (error) {
        this.$message({ message: "项目描述更新失败", type: "error" });
        console.log("Update project description failed: " + error);
        return;
      }
      this.$message({ message: "项目描述更新成功", type: "success" });
      await this.setProjectAsync();
    },
    async deleteProjectBtnClick() {
      const clickConfirm = await confirmDeleteAsync(
        this,
        "删除项目后数据将无法恢复，是否继续？",
        "删除项目"
      );
      if (clickConfirm) {
        await this.doDeleteAsync();
      }
    },
    async doDeleteAsync() {
      try {
        await api.deleteProjectAsync(this.projectId);
      } catch (error) {
        this.$message({ message: "删除项目失败", type: "error" });
        console.log("Delete project failed: " + error);
        return;
      }
      await this.$alert("删除项目成功", "删除项目成功");
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.setting-header {
  border-style: solid;
  border-width: 0 0 1px 0;
  border-color: #dcdfe6;
  padding: 0 0 10px 0;
}

.setting-label {
  display: block;
  margin: 15px 0;
  font-weight: bold;
}

.setting-button {
  display: block;
  margin: 15px 0 0 0;
  border-radius: 6px;
}

.setting-input {
  display: block;
  width: 400px;
  background: #fafbfc;
  border-color: #dcdfe6;
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  padding: 8px 12px;
  font-size: 16px;
  transition: 0.3s;
}

.setting-input:hover {
  border-color: #409eff;
}

.setting-input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 5px #409eff;
}
</style>
