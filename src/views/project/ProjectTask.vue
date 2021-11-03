<!-- 项目任务列表页 -->
<template>
  <div class="main-page">
    <!-- search, filter and sort -->
    <div class="input-container">
      <!-- 搜索框 -->
      <input
        v-model="searchWord"
        placeholder="搜索任务"
        class="search-input input-item-base"
      />
      <!-- 按项目类型筛选 -->
      <el-select
        v-model="filterValue"
        size="medium"
        class="input-select input-item-base"
        style="width: 120px"
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
        style="width: 120px"
      >
        <el-option
          v-for="option in sortOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
      <router-link v-if="isAdmin" to="create" append>
        <el-button type="primary" size="medium">创建任务</el-button>
      </router-link>
    </div>

    <!-- task list -->
    <task-item
      v-for="task in showedTasks"
      :key="task.id"
      :task="task"
      :projectId="projectId"
      @complete-change="taskCompleteChange"
    />
  </div>
</template>

<script>
import * as api from "../../utils/ApiUtils";
import { MemberJson } from "../../utils/JsonModel";
import * as StrUtils from "../../utils/StringUtils";
import TaskItem from "../../components/project/TaskItem.vue";
/** @typedef {import("../../utils/JsonModel").TaskJson} TaskJson */

export default {
  data() {
    return {
      /** @type {string} */
      currentRole: MemberJson.ROLE_MEMBER,
      /** @type {TaskJson[]} */
      tasks: [],
      searchWord: "",
      filterOptions: [
        { value: "All", label: "所有" },
        { value: "NotComplete", label: "未完成" },
        { value: "Completed", label: "已完成" },
        { value: "NotAssign", label: "未分配" },
        { value: "Assigned", label: "已分配" },
      ],
      /** @type {'All' | 'NotComplete' | 'Completed' | 'NotAssign' | 'Assigned'} */
      filterValue: "All",
      sortOptions: [
        { value: "CreateAt", label: "创建时间" },
        { value: "Name", label: "任务名称" },
      ],
      /** @type {'CreateAt' | 'Name'} */
      sortValue: "CreateAt",
    };
  },
  computed: {
    /** @returns {number} */
    projectId() {
      return parseInt(this.$route.params.projectId);
    },
    isAdmin() {
      return (
        this.currentRole === MemberJson.ROLE_ADMIN ||
        this.currentRole === MemberJson.ROLE_SUPER_ADMIN
      );
    },
    /** @returns {TaskJson[]} */
    showedTasks() {
      /** @type {(task: TaskJson) => boolean} */
      let searcher; //过滤搜索词
      if (StrUtils.notEmpty(this.searchWord)) {
        searcher = (task) =>
          StrUtils.includeIgnoreCase(task.title, this.searchWord);
      } else {
        searcher = () => true;
      }

      /** @type {(task: TaskJson) => boolean} */
      let filter; //过滤任务类型
      if (this.filterValue === "NotComplete") {
        filter = (task) => !task.complete;
      } else if (this.filterValue === "Completed") {
        filter = (task) => task.complete;
      } else if (this.filterValue === "NotAssign") {
        filter = (task) => task.executors.length === 0;
      } else if (this.filterValue === "Assigned") {
        filter = (task) => task.executors.length > 0;
      } else {
        filter = () => true; // All
      }

      /** @type {(a: TaskJson, b: TaskJson) => number} */
      let comparator; //排序
      if (this.sortValue === "CreateAt") {
        comparator = (a, b) => b.createAt.localeCompare(a.createAt);
      } else {
        comparator = (a, b) => a.title.localeCompare(b.title); // Name
      }

      return this.tasks.filter(searcher).filter(filter).sort(comparator);
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
    /** fetch tasks data */
    async pageChangedAsync() {
      try {
        const setRoleAsync = async () => {
          this.currentRole = MemberJson.ROLE_MEMBER;
          this.currentRole = await api.getCurrentRoleAsync(this.projectId);
        };
        await Promise.all([setRoleAsync(), this.setTasksAsync()]);
      } catch (error) {
        this.$message({ message: "角色获取失败", type: "error" });
        console.log("Get role failed: " + error);
        return;
      }
    },
    async setTasksAsync() {
      try {
        this.tasks = await api.getTasksAsync(this.projectId);
      } catch (error) {
        this.$message({ message: "任务获取失败", type: "error" });
        console.log("Get tasks failed: " + error);
        return;
      }
    },
    /** @param {TaskJson} task */
    async taskCompleteChange(task) {
      try {
        await api.updateTaskCompleteAsync(
          this.projectId,
          task.id,
          task.complete
        );
      } catch (error) {
        this.$message({ message: "更新任务完成状态失败", type: "error" });
        console.log("Update task complete failed: " + error);
        task.complete = !task.complete;
        return;
      }
    },
  },
  components: { TaskItem },
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
  row-gap: 5px;
}

.input-item-base {
  height: 36px;
}

.input-select {
  margin-right: 10px;
}

@media screen and (max-width: 600px) {
  .main-page {
    padding: 15px;
  }
}
</style>
