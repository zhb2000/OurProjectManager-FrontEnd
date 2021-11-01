<!-- 用户参加的项目条目 -->
<template>
  <div class="project-item-card">
    <router-link :to="projectPath" class="project-name">
      {{ projectName }}
    </router-link>
    <div class="description">{{ project.description }}</div>
    <div class="info-line">
      <span class="down-info">
        项目主管：
        <router-link :to="superAdminPath" class="super-admin">
          {{ superAdminName }}
        </router-link>
      </span>
      <span class="down-info">最近更新：{{ updateAt }}</span>
      <span class="down-info">项目 ID：{{ projectId }}</span>
    </div>
  </div>
</template>

<script>
import { ProjectJson } from "../../utils/JsonModel";

export default {
  props: {
    project: {
      type: ProjectJson,
      required: true,
    },
  },
  computed: {
    projectPath() {
      return "/projects/" + this.project.id;
    },
    projectName() {
      return this.project.name;
    },
    description() {
      return this.project.description;
    },
    projectId() {
      return this.project.id;
    },
    updateAt() {
      return this.project.updateAt;
    },
    superAdminName() {
      return this.project.superAdmin.username;
    },
    superAdminPath() {
      return "/users/" + this.superAdminName;
    },
  },
};
</script>

<style scoped>
.project-item-card {
  border-style: solid;
  border-width: 1px;
  border-color: #dcdfe6;
  border-radius: 10px;
  padding: 20px 25px;
  margin: 16px 0;
}

.project-name {
  display: inline-block;
  text-decoration: none;
  font-weight: bold;
  font-size: 20px;
  color: #0366d6;
}

.project-name:hover {
  text-decoration: underline;
}

.project-name:active {
  color: #0366d6;
}

.description {
  margin-top: 8px;
  margin-bottom: 3px;
  color: #606266;
}

.info-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.down-info {
  color: #909399;
  font-size: 14px;
  margin-right: 20px;
  margin-top: 5px;
  white-space: nowrap;
}

.super-admin {
  text-decoration: none;
  color: #909399;
  font-weight: bold;
}

.super-admin:hover {
  text-decoration: underline;
  color: #0366d6;
}

.super-admin:active {
  color: #909399;
}

@media screen and (max-width: 600px) {
  .project-item-card {
    padding: 20;
  }
}
</style>
