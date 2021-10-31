// 评论条目
<template>
  <div class="comment-outer">
    <router-link :to="userUrl">
      <el-avatar size="medium">{{ nameFirstChar }}</el-avatar>
    </router-link>
    <div class="comment-card">
      <div class="card-upper">
        <router-link :to="userUrl" class="user-url">{{ username }}</router-link>
        <div class="create-at">{{ createAt }}</div>
        <div style="flex-grow: 1" />
        <el-button
          v-if="showDelete"
          type="text"
          icon="el-icon-delete"
          class="delete-btn"
          @click="deleteCommentBtnClick"
        />
      </div>
      <div class="card-lower">
        <!-- {{ body }} -->
        <markdown-preview :initialValue="body" />
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { CommentJson, UserJson } from "../utils/JsonModel";
import { MarkdownPreview } from "vue-meditor";

export default {
  props: {
    comment: {
      type: CommentJson,
      required: true,
    },
    showDelete: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    /** @returns {UserJson} */
    user() {
      return this.comment.user;
    },
    username() {
      return this.user.username;
    },
    userUrl() {
      return "/users/" + this.username;
    },
    nameFirstChar() {
      const name = this.username.trim();
      return name.length > 0 ? name[0] : " ";
    },
    createAt() {
      return this.comment.createAt;
    },
    body() {
      return this.comment.body;
    },
  },
  methods: {
    deleteCommentBtnClick() {
      this.$emit("delete-comment", this.comment.id);
    },
  },
  components: {
    MarkdownPreview,
  },
};
</script>

<style scoped>
.comment-outer {
  display: flex;
  margin-bottom: 20px;
}
.comment-card {
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

.delete-btn {
  padding: 0px;
  color: #303133;
}

.delete-btn:hover {
  color: #0366d6;
}
</style>
