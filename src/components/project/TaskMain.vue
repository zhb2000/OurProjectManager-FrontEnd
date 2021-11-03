<!-- 任务主体（顶楼） -->
<template>
  <comment-bubble :user="user" :createAt="createAt" :body="body">
    <template v-slot:button>
      <el-button
        v-if="showEdit"
        type="text"
        icon="el-icon-edit"
        class="edit-btn"
        @click="editBtnClick"
      />
    </template>
  </comment-bubble>
</template>

<script>
import { TaskJson } from "../../utils/JsonModel";
import * as DateUtils from "../../utils/DateUtils";
import CommentBubble from "./CommentBubble.vue";

export default {
  props: {
    task: { type: TaskJson, required: true },
    showEdit: { type: Boolean, required: true },
  },
  computed: {
    user() {
      return this.task.creator;
    },
    createAt() {
      return DateUtils.beautify(this.task.createAt);
    },
    body() {
      return this.task.body;
    },
  },
  methods: {
    editBtnClick() {
      this.$emit("edit-task");
    },
  },
  components: { CommentBubble },
};
</script>

<style scoped>
.edit-btn {
  padding: 0px;
  color: #303133;
}

.edit-btn:hover {
  color: #0366d6;
}
</style>
