// 任务详情页
<template>
  <div>
    <h2>View Task</h2>
    <div>task: {{ task }}</div>
    <div>currentRole: {{ currentRole }}</div>
    <comment-item
      v-for="comment in comments"
      :key="comment.id"
      :comment="comment"
      :isAdmin="isAdmin"
      @delete-comment="deleteCommentClick"
    />
    <p><b>发表评论</b></p>
    <div>
      <textarea placeholder="在此处撰写你的评论" v-model="commentBody" />
    </div>
    <div><button @click="createCommentBtnClick">发表评论</button></div>
  </div>
</template>

<script>
import { TaskJson, CommentJson, MemberJson } from "../utils/jsonmodel";
import {
  createCommentAsync,
  deleteCommentsAsync,
  getCommentsAsync,
  getCurrentRoleAsync,
  getTaskAsync,
} from "../utils/ApiUtils";
import TaskCommentItem from "../components/TaskCommentItem.vue";
import { StringUtils } from "../utils/StringUtils";

export default {
  data() {
    return {
      /** @type {string} */
      currentRole: MemberJson.ROLE_MEMBER,
      /** @type {TaskJson} */
      task: null,
      /** @type {CommentJson[]} */
      comments: [],
      commentBody: "",
    };
  },
  computed: {
    /** @returns {string} */
    projectId() {
      return this.$route.params.projectId;
    },
    /** @returns {string} */
    taskId() {
      return this.$route.params.taskId;
    },
    isAdmin() {
      return (
        this.currentRole === MemberJson.ROLE_ADMIN ||
        this.currentRole === MemberJson.ROLE_SUPER_ADMIN
      );
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
    async pageChangedAsync() {
      try {
        const setRoleAsync = async () => {
          this.currentRole = MemberJson.ROLE_MEMBER;
          this.currentRole = await getCurrentRoleAsync(this.projectId);
        };
        const setTaskAsync = async () => {
          this.task = null;
          this.task = await getTaskAsync(this.projectId, this.taskId);
        };
        await Promise.all([
          setRoleAsync(),
          setTaskAsync(),
          this.setCommentsAsync(),
        ]);
      } catch (error) {
        console.log("Get role or task or comments failed: " + error);
        return;
      }
    },
    async setCommentsAsync() {
      try {
        this.comments = await getCommentsAsync(this.projectId, this.taskId);
      } catch (error) {
        console.log("Get comments failed: " + error);
        return;
      }
    },
    async createCommentBtnClick() {
      if (StringUtils.isEmpty(this.commentBody)) {
        alert("评论内容不能为空");
        return;
      }
      try {
        await createCommentAsync(this.projectId, this.taskId, this.commentBody);
        this.commentBody = "";
        await this.setCommentsAsync();
      } catch (error) {
        console.log("Create comment failed: " + error);
        return;
      }
    },
    async deleteCommentClick(commentId) {
      try {
        await deleteCommentsAsync(this.projectId, this.taskId, commentId);
        await this.setCommentsAsync();
      } catch (error) {
        console.log("Delete comment failed: " + error);
        return;
      }
    },
  },
  components: {
    "comment-item": TaskCommentItem,
  },
};
</script>
