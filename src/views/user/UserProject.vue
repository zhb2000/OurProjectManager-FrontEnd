<!-- 用户项目页面 -->
<template>
  <div class="main-page">
    <!-- search, filter and sort -->
    <div class="input-container">
      <!-- 搜索框 -->
      <input
        v-model="searchWord"
        placeholder="搜索你的项目"
        class="search-input input-item-base"
      />
      <!-- 按项目类型筛选 -->
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
      <!-- 排序选项 -->
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
import * as api from "../../utils/ApiUtils";
import ProjectItem from "../../components/user/ProjectItem.vue";
import * as StrUtils from "../../utils/StringUtils";
/** @typedef {import("../../utils/JsonModel").ProjectJson} ProjectJson */

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
      /** @type {'All' | 'SuperAdmin' | 'Admin'} */
      filterValue: "All",
      sortOptions: [
        { value: "NearlyUpdate", label: "最近更新" },
        { value: "CreateAt", label: "创建时间" },
        { value: "Name", label: "项目名称" },
      ],
      /** @type {'NearlyUpdate' | 'CreateAt' | 'Name'} */
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
    showedProjects() {
      /** @type {(project: ProjectJson) => boolean} */
      let searcher; //过滤搜索词
      if (StrUtils.notEmpty(this.searchWord)) {
        searcher = (project) =>
          StrUtils.includeIgnoreCase(project.name, this.searchWord);
      } else {
        searcher = () => true;
      }

      /** @type {(project: ProjectJson) => boolean} */
      let filter; //过滤项目类型
      if (this.filterValue === "SuperAdmin") {
        filter = (project) => project.superAdmin.username === this.username;
      } else if (this.filterValue === "Admin") {
        filter = (project) =>
          project.superAdmin.username === this.username ||
          project.admins.map((admin) => admin.username).includes(this.username);
      } else {
        filter = () => true; // All
      }

      /** @type {(a: ProjectJson, b: ProjectJson) => number} */
      let comparator; //排序
      if (this.sortValue === "NearlyUpdate") {
        comparator = (a, b) => b.updateAt.localeCompare(a.updateAt);
      } else if (this.sortValue === "CreateAt") {
        comparator = (a, b) => b.createAt.localeCompare(a.createAt);
      } else {
        comparator = (a, b) => a.name.localeCompare(b.name); // Name
      }

      return this.projects.filter(searcher).filter(filter).sort(comparator);
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
      if (StrUtils.isEmpty(this.projectName)) {
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
  background: white;
}

.input-container {
  display: flex;
  align-content: center;
  flex-wrap: wrap;
  row-gap: 10px;
  column-gap: 10px;
}

.input-item-base {
  height: 36px;
}

.input-select {
  width: 120px;
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
  background: white;
}

.create-btn-area {
  display: flex;
  justify-content: flex-end;
}

@media screen and (max-width: 600px) {
  .main-page {
    padding: 15px;
  }
}
</style>
