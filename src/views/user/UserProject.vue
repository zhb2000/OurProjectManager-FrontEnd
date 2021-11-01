<!-- 用户项目页面 -->
<template>
  <div class="main-page">
    <!-- search and filter -->
    <div class="input-container">
      <input
        v-model="searchWord"
        placeholder="搜索你的项目"
        class="search-input input-item-base"
      />
      <el-select
        v-model="filterValue"
        size="medium"
        class="input-select input-item-base"
      >
        <el-option
          v-for="option in filterOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
      <el-select
        v-model="sortValue"
        size="medium"
        class="input-select input-item-base"
      >
        <el-option
          v-for="option in sortOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
      <el-button
        class="input-item-base"
        type="primary"
        size="medium"
        @click="dialogVisible = true"
      >
        新建项目
      </el-button>
    </div>

    <!-- project list -->
    <project-item
      v-for="project in showedProjects"
      :key="project.id"
      :project="project"
    />

    <!-- create project dialog -->
    <el-dialog
      title="创建项目"
      :width="dialogWidth"
      :visible.sync="dialogVisible"
    >
      <div class="attr-name">项目名称</div>
      <input
        class="create-input"
        name="projectName"
        v-model="projectName"
        placeholder="项目名称"
        autocomplete="off"
      />
      <div class="attr-name">项目描述</div>
      <input
        class="create-input"
        name="projectDescription"
        v-model="projectDescription"
        placeholder="项目描述"
        autocomplete="off"
      />
      <div class="create-btn-area">
        <el-button type="primary" @click="createBtnClick">创建项目</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { ProjectJson } from "../../utils/JsonModel";
import * as api from "../../utils/ApiUtils";
import ProjectItem from "../../components/user/ProjectItem.vue";
import { StringUtils } from "../../utils/StringUtils";

export default {
  data() {
    return {
      /** @type {ProjectJson[]} */
      projects: [],
      searchWord: "",
      filterOptions: [
        { value: "All", label: "所有" },
        { value: "SuperAdmin", label: "我创建的" },
        { value: "Admin", label: "我管理的" },
      ],
      filterValue: "All",
      sortOptions: [
        { value: "NearlyUpdate", label: "最近更新" },
        { value: "CreateAt", label: "创建时间" },
        { value: "Name", label: "项目名称" },
      ],
      sortValue: "NearlyUpdate",
      dialogVisible: false,
      projectName: "",
      projectDescription: "",
      windowWidth: window.innerWidth,
    };
  },
  computed: {
    /** @returns {string} */
    username() {
      return this.$route.params.username;
    },
    /** @returns {ProjectJson[]} */
    afterSearchProjects() {
      if (!this.projects) {
        return [];
      }
      if (StringUtils.isEmpty(this.searchWord)) {
        return this.projects;
      }
      const arr = [];
      for (let project of this.projects) {
        if (
          project.name.toLowerCase().includes(this.searchWord.toLowerCase())
        ) {
          arr.push(project);
        }
      }
      return arr;
    },
    afterFilterProjects() {
      if (this.filterValue === "SuperAdmin") {
        const arr = [];
        for (let project of this.afterSearchProjects) {
          if (project.superAdmin.username === this.username) {
            arr.push(project);
          }
        }
        return arr;
      } else if (this.filterValue === "Admin") {
        const arr = [];
        for (let project of this.afterSearchProjects) {
          if (project.superAdmin.username === this.username) {
            arr.push(project);
          } else {
            for (let admin of project.admins) {
              if (admin.username === this.username) {
                arr.push(project);
              }
            }
          }
        }
        return arr;
      } else {
        // All
        return this.afterSearchProjects;
      }
    },
    /** @returns {ProjectJson[]} */
    showedProjects() {
      const arr = [];
      for (let project of this.afterFilterProjects) {
        arr.push(project);
      }
      if (this.sortValue === "NearlyUpdate") {
        arr.sort((pa, pb) => pb.updateAt.localeCompare(pa.updateAt));
      } else if (this.sortValue === "CreateAt") {
        arr.sort((pa, pb) => pa.createAt.localeCompare(pb.createAt));
      } else {
        // Name
        arr.sort((pa, pb) => pa.name.localeCompare(pb.name));
      }
      return arr;
    },
    dialogWidth() {
      if (this.windowWidth > 800) {
        return "50%";
      } else if (this.windowWidth > 400) {
        return "80%";
      } else {
        return "90%";
      }
    },
  },
  watch: {
    async $route() {
      await this.pageChangedAsync();
    },
  },
  async mounted() {
    this.$nextTick(() => window.addEventListener("resize", this.onResize));
    await this.pageChangedAsync();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    /** fetch user's projects */
    async pageChangedAsync() {
      this.projects = [];
      try {
        this.projects = await api.getUserProjectsAsync(this.username);
      } catch (error) {
        this.$message({ message: "获取项目失败", type: "error" });
        console.log("Get user projects failed: " + error);
        return;
      }
    },
    async createBtnClick() {
      if (StringUtils.isEmpty(this.projectName)) {
        this.$message({ message: "项目名称不能为空", type: "error" });
        return;
      }
      let projectId;
      try {
        const project = await api.createProjectAsync(
          this.projectName,
          this.projectDescription
        );
        projectId = project.id;
      } catch (error) {
        this.$message({ message: "创建项目失败", type: "error" });
        console.log("Create project failed: " + error);
        return;
      }
      this.dialogVisible = false;
      this.$router.push("/projects/" + projectId);
    },
    onResize() {
      this.windowWidth = window.innerWidth;
    },
  },
  components: { ProjectItem },
};
</script>

<style scoped>
.main-page {
  padding: 20px;
}

.search-input {
  width: 400px;
  margin-right: 10px;
  background: #fafbfc;
  border-color: #dcdfe6;
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  padding: 8px 12px;
  font-size: 16px;
  transition: 0.3s;
}

.search-input::placeholder {
  color: #909399;
}

.search-input:hover {
  border-color: #409eff;
}

.search-input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 5px #409eff;
}

.input-container {
  display: flex;
  align-content: center;
  flex-wrap: wrap;
}

.input-item-base {
  margin-top: 5px;
  height: 36px;
}

.input-select {
  margin-right: 10px;
  width: 150px;
}

.attr-name {
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 16px;
}

.create-input {
  width: 100%;
  display: block;
  margin-bottom: 10px;
  background: #fafbfc;
  border-color: #dcdfe6;
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  padding: 8px 12px;
  font-size: 16px;
  transition: 0.3s;
}

.create-input:hover {
  border-color: #409eff;
}

.create-input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 5px #409eff;
}

.create-btn-area {
  display: flex;
  justify-content: flex-end;
}
</style>
