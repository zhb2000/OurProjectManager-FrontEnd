<template>
  <div>
    <div>comment: {{ comment }}</div>
    <div v-if="isAdmin">
      <button @click="deleteCommentBtnClick">删除评论</button>
    </div>
  </div>
</template>

<script>
import { CommentJson } from "../utils/jsonmodel";

export default {
  props: {
    comment: {
      type: CommentJson,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    deleteCommentBtnClick() {
      this.$emit("delete-comment", this.comment.id);
    },
  },
};
</script>
