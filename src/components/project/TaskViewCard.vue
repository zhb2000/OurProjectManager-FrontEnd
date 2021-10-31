// 任务详情页面的卡片
<template>
  <div class="task-outer">
    <router-link :to="userUrl">
      <el-avatar size="medium">{{ nameFirstChar }}</el-avatar>
    </router-link>
    <div class="task-card">
      <div class="card-upper">
        <router-link :to="userUrl" class="user-url">{{ username }}</router-link>
        <div class="create-at">{{ createAt }}</div>
        <div style="flex-grow: 1" />
      </div>
      <div class="card-lower">
        <!-- {{ body }} -->
        <markdown-preview :initialValue="body" />
      </div>
    </div>
  </div>
</template>

<script>
import { TaskJson } from "../../utils/JsonModel";
import { MarkdownPreview } from "vue-meditor";

export default {
  props: {
    task: {
      type: TaskJson,
    },
  },
  computed: {
    user() {
      return this.task ? this.task.creator : null;
    },
    username() {
      return this.user ? this.user.username : null;
    },
    userUrl() {
      return "/users/" + this.username;
    },
    nameFirstChar() {
      if (!this.username) {
        return " ";
      }
      const name = this.username.trim();
      return name.length > 0 ? name[0] : " ";
    },
    createAt() {
      return this.task ? this.task.createAt : null;
    },
    body() {
      return this.task ? this.task.body : "";
    },
  },
  components: {
    MarkdownPreview,
  },
};
</script>

<style scoped>
.task-outer {
  display: flex;
  margin-bottom: 20px;
}
.task-card {
  flex-grow: 1;
  margin-left: 15px;
  border-radius: 6px;
  border: solid 1px #dcdfe6;
  overflow: hidden;
}

.card-upper {
  background: #f6f8fa;
  border-bottom: solid 1px #dcdfe6;
  padding: 0 15px;
  height: 40px;
  display: flex;
  align-items: center;
}

.card-lower {
  /* padding: 15px; */
  padding: 8px 10px 0px 10px;
}

.user-url {
  color: #303133;
  font-weight: bold;
  font-size: 14px;
  text-decoration: none;
  margin-right: 10px;
}

.user-url:hover {
  color: #0366d6;
  text-decoration: underline;
}

.create-at {
  font-size: 14px;
  color: #606266;
}
</style>
