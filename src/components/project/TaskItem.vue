<!-- 项目内任务条目 -->
<template>
  <div class="task-card">
    <div class="checkbox-area">
      <el-checkbox
        class="complete-checkbox"
        v-model="task.complete"
        @change="completeChange"
      />
    </div>
    <div class="card-main">
      <div class="upper-area">
        <router-link
          :to="taskPath"
          :class="['task-title', { 'task-title-complete': isComplete }]"
        >
          {{ taskTitle }}
        </router-link>
        <div style="flex-grow: 1" />
        <div class="icon-area">
          <i class="el-icon-user number-icon" />
          <span>{{ executorNum }}</span>
          <i class="el-icon-chat-square number-icon" />
          <span>{{ commentNum }}</span>
        </div>
      </div>
      <div class="lower-area">
        <span style="white-space: nowrap; margin-top: 5px; margin-right: 15px">
          创建者：{{ creatorUsername }}
        </span>
        <span style="white-space: nowrap; margin-top: 5px">
          创建时间：{{ createAt }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { TaskJson } from "../../utils/JsonModel";

export default {
  props: {
    task: {
      type: TaskJson,
      required: true,
    },
    projectId: {
      type: [String, Number],
      required: true,
    },
  },
  computed: {
    taskPath() {
      return "/projects/" + this.projectId + "/tasks/" + this.task.id;
    },
    taskTitle() {
      return this.task.title;
    },
    creator() {
      return this.task.creator;
    },
    creatorUsername() {
      return this.creator.username;
    },
    createAt() {
      return this.task.createAt;
    },
    isComplete() {
      return this.task.complete;
    },
    commentNum() {
      return this.task.commentNum;
    },
    executorNum() {
      if (!this.task.executors) {
        return 0;
      }
      return this.task.executors.length;
    },
  },
  methods: {
    completeChange() {
      this.$emit("complete-change", this.task);
    },
  },
};
</script>

<style scoped>
.task-card {
  border: solid 1px #dcdfe6;
  border-radius: 10px;
  padding: 15px 20px;
  margin: 10px 0;
  display: flex;
  align-items: center;
}

.checkbox-area {
  margin-right: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.complete-checkbox {
  transform: scale(1.5);
  color: antiquewhite;
}

.card-main {
  flex-grow: 1;
}

.upper-area {
  display: flex;
  align-items: center;
}

.lower-area {
  color: #606266;
  font-size: 14px;
  margin-top: 5px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.task-title {
  color: #0366d6;
  font-weight: bold;
  text-decoration: none;
}

.task-title:hover {
  text-decoration: underline;
  color: #0366d6;
}

.task-title-complete {
  color: #606266;
  text-decoration: line-through;
}

.icon-area {
  color: #606266;
  display: flex;
  align-items: center;
}

.number-icon {
  margin-left: 15px;
  margin-right: 5px;
}
</style>
