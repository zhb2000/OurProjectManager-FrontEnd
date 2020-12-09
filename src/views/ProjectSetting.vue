<template>
  <div>
    <h2>project setting</h2>
    <h3>修改项目名称</h3>
    <div>当前名称：{{ projectName }}</div>
    <div>新名称：<input v-model="newProjectName" autocomplete="off" /></div>
    <div><button @click="updateNameBtnClick">修改项目名</button></div>
    <h3>修改项目描述</h3>
    <div>当前描述：{{ projectDescription }}</div>
    <div>
      新描述：<input v-model="newProjectDescription" autocomplete="off" />
    </div>
    <div><button @click="updateDescriptionBtnClick">修改项目描述</button></div>
    <div v-if="isSuperAdmin">
      <h3>删除项目</h3>
      <div><button @click="DeleteProjectBtnClick">删除项目</button></div>
    </div>
  </div>
</template>

<script>
import { ProjectJson, MemberJson } from "../utils/jsonmodel";
import {
  deleteProjectAsync,
  getCurrentRoleAsync,
  getProjectAsync,
  updateProjectNameAndDescriptionAsync,
} from "../utils/ApiUtils";

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
      try {
        this.currentRole = MemberJson.ROLE_ADMIN;
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
    async updateNameBtnClick() {
      try {
        await updateProjectNameAndDescriptionAsync(
          this.projectId,
          this.newProjectName,
          this.projectDescription
        );
      } catch (error) {
        console.log("Update project name failed: " + error);
        return;
      }
      alert("项目名称更新成功");
      this.$router.go(); //refresh
    },
    async updateDescriptionBtnClick() {
      try {
        await updateProjectNameAndDescriptionAsync(
          this.projectId,
          this.projectName,
          this.newProjectDescription
        );
      } catch (error) {
        console.log("Update project name failed: " + error);
        return;
      }
      alert("项目描述更新成功");
      this.$router.go(); //refresh
    },
    async DeleteProjectBtnClick() {
      try {
        await deleteProjectAsync(this.projectId);
      } catch (error) {
        console.log("Delete project failed: " + error);
        return;
      }
      alert("删除项目成功");
      this.$router.push("/");
    },
  },
};
</script>
