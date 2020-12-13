// 用户项目页面
<template>
  <div>
    <div>
      <input
        v-model="searchWord"
        placeholder="搜索你的项目"
        class="search-input"
      />
      <el-select v-model="filterValue">
        <el-option
          v-for="option in filterOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
      <el-select v-model="sortValue">
        <el-option
          v-for="option in sortOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
      <button><router-link to="/create-project">新建项目</router-link></button>
    </div>
    <project-item
      v-for="project in showedProjects"
      :key="project.id"
      :project="project"
    />
  </div>
</template>

<script>
import { ProjectJson } from "../utils/jsonmodel";
import { getUserProjectsAsync } from "../utils/ApiUtils";
import UserProjectItem from "../components/UserProjectItem.vue";
import { StringUtils } from "../utils/StringUtils";

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
  },
  watch: {
    async $route() {
      await this.pageChangedAsync();
    },
  },
  async mounted() {
    await this.pageChangedAsync();
  },
  methods: {
    /** fetch user's projects */
    async pageChangedAsync() {
      this.projects = [];
      try {
        this.projects = await getUserProjectsAsync(this.username);
      } catch (error) {
        console.log("Get user projects failed: " + error);
        return;
      }
    },
  },
  components: {
    "project-item": UserProjectItem,
  },
};
</script>

<style scoped>
.search-input {
  padding: 4px;
}
</style>
