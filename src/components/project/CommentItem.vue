<!-- 评论条目 -->
<template>
  <comment-bubble :user="user" :createAt="createAt" :body="body">
    <template v-slot:button>
      <el-button
        v-if="showDelete"
        type="text"
        icon="el-icon-delete"
        class="delete-btn"
        @click="deleteBtnClick"
      />
    </template>
  </comment-bubble>
</template>

<script>
import { CommentJson } from "../../utils/JsonModel";
import * as DateUtils from "../../utils/DateUtils";
import CommentBubble from "./CommentBubble.vue";

export default {
  props: {
    comment: { type: CommentJson, required: true },
    showDelete: { type: Boolean, required: true },
  },
  computed: {
    user() {
      return this.comment.user;
    },
    createAt() {
      return DateUtils.beautify(this.comment.createAt);
    },
    body() {
      return this.comment.body;
    },
  },
  methods: {
    deleteBtnClick() {
      this.$emit("delete-comment", this.comment.id);
    },
  },
  components: { CommentBubble },
};
</script>

<style scoped>
.delete-btn {
  padding: 0px;
  color: #303133;
}

.delete-btn:hover {
  color: #0366d6;
}
</style>
