<!-- 任务详情页 -->
<template>
  <div class="main-page">
    <el-page-header @back="goBack" content="任务详情" />
    <div class="title-area">
      <span class="task-title">{{ taskTitle }}</span>
      <div v-show="isComplete" class="complete-label">
        <i class="el-icon-check" />
        <span style="margin-left: 5px">已完成</span>
      </div>
    </div>
    <div class="view-task-grid">
      <!-- 评论楼层 -->
      <div class="left-area">
        <!-- 顶楼（主帖内容） -->
        <task-main
          v-if="task != null"
          :task="task"
          :showEdit="currentCanEdit"
          @edit-task="editTaskClick"
        />

        <!-- 评论楼层 -->
        <comment-item
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          :showDelete="currentIsAdmin"
          @delete-comment="deleteCommentClick"
        />
        <el-divider />

        <!-- 撰写评论区域 -->
        <div class="write-comment-area">
          <div class="create-comment-title">发表评论</div>
          <textarea
            class="input-base comment-textarea"
            placeholder="在此处撰写你的评论"
            v-model="commentBody"
          />
          <el-button
            class="create-comment-btn"
            size="medium"
            type="primary"
            @click="createCommentBtnClick"
          >
            发表评论
          </el-button>
        </div>
      </div>

      <!-- 任务信息卡片 -->
      <div class="right-area">
        <div class="right-title">任务信息</div>
        <el-button
          size="medium"
          :type="completeBtnType"
          :icon="completeBtnIcon"
          :plain="completeBtnPlain"
          class="right-btn"
          @click="completeBtnClick"
        >
          {{ completeBtnStr }}
        </el-button>
        <div style="margin-bottom: 20px">
          <div class="info-line">
            <span class="info-attr-name">状态：</span>
            {{ statusStr }}
          </div>
          <div class="info-line" v-if="isComplete">
            <span class="info-attr-name">完成者：</span>
            {{ completerUsername }}
          </div>
          <div class="info-line" v-if="isComplete">
            <span class="info-attr-name">完成时间：</span>
            {{ completeAt }}
          </div>
        </div>
        <div v-if="currentIsAdmin">
          <div class="right-title">任务执行人</div>
          <div class="executor-input-area">
            <input
              class="input-base executor-input"
              v-model="executorInput"
              placeholder="输入执行人用户名"
            />
            <el-button size="mini" class="add-btn" @click="addExecutorBtnClick">
              添加
            </el-button>
          </div>
          <executor-item
            v-for="user in executors"
            :key="user.username"
            :user="user"
            @remove-executor="removeBtnClick"
          />
          <div class="right-title" style="margin-top: 20px">删除任务</div>
          <el-button
            type="danger"
            size="medium"
            icon="el-icon-delete"
            class="right-btn"
            @click="deleteBtnClick"
          >
            删除任务
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MemberJson } from "../../utils/JsonModel";
import * as api from "../../utils/ApiUtils";
import {
  responseErrorTest as errTest,
  BusinessErrorType as BusErrType,
} from "../../utils/ResponseErrorUtils";
import * as StrUtils from "../../utils/StringUtils";
import * as DateUtils from "../../utils/DateUtils";
import { confirmDeleteAsync } from "../../utils/UiUtils";
import CommentItem from "../../components/project/CommentItem.vue";
import ExecutorItem from "../../components/project/ExecutorItem.vue";
import TaskMain from "../../components/project/TaskMain.vue";
/** @typedef {import("../../utils/JsonModel").UserJson} UserJson */
/** @typedef {import("../../utils/JsonModel").TaskJson} TaskJson */
/** @typedef {import("../../utils/JsonModel").CommentJson} CommentJson */

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
      executorInput: "",
    };
  },
  computed: {
    /** @returns {number} */
    projectId() {
      return parseInt(this.$route.params.projectId);
    },
    /** @returns {number} */
    taskId() {
      return parseInt(this.$route.params.taskId);
    },
    currentIsAdmin() {
      return (
        this.currentRole === MemberJson.ROLE_ADMIN ||
        this.currentRole === MemberJson.ROLE_SUPER_ADMIN
      );
    },
    currentCanEdit() {
      //TODO 作者自己可编辑
      return true;
    },
    taskTitle() {
      return this.task ? this.task.title : null;
    },
    /** @returns {UserJson[]} */
    executors() {
      return this.task ? this.task.executors : [];
    },
    isComplete() {
      if (!this.task) {
        return false;
      }
      return this.task.complete;
    },
    statusStr() {
      return this.isComplete ? "已完成" : "未完成";
    },
    completeBtnStr() {
      return this.isComplete ? "已完成，点击取消" : "点击以完成任务";
    },
    completeBtnType() {
      return this.isComplete ? "success" : "primary";
    },
    completeBtnIcon() {
      return this.isComplete ? "el-icon-success" : null;
    },
    completeBtnPlain() {
      return !this.isComplete;
    },
    completerUsername() {
      return this.task.completer.username;
    },
    completerUrl() {
      return `/users/${encodeURIComponent(this.completerUsername)}`;
    },
    completeAt() {
      return DateUtils.beautify(this.task.completeAt);
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
          this.currentRole = await api.getCurrentRoleAsync(this.projectId);
        };
        await Promise.all([
          setRoleAsync(),
          this.setTaskAsync(),
          this.setCommentsAsync(),
        ]);
      } catch (error) {
        this.$message({ message: "获取角色失败", type: "error" });
        console.log("Get role failed: " + error);
        return;
      }
    },
    async setTaskAsync() {
      try {
        this.task = await api.getTaskAsync(this.projectId, this.taskId);
      } catch (error) {
        this.$message({ message: "获取任务失败", type: "error" });
        console.log("Get task failed: " + error);
        return;
      }
    },
    async setCommentsAsync() {
      try {
        this.comments = await api.getCommentsAsync(this.projectId, this.taskId);
      } catch (error) {
        this.$message({ message: "获取评论失败", type: "error" });
        console.log("Get comments failed: " + error);
        return;
      }
    },
    async createCommentBtnClick() {
      if (StrUtils.isEmpty(this.commentBody)) {
        this.$message("评论内容不能为空");
        return;
      }
      try {
        await api.createCommentAsync(
          this.projectId,
          this.taskId,
          this.commentBody
        );
        this.commentBody = "";
        await this.setCommentsAsync();
      } catch (error) {
        this.$message({ message: "评论发表失败", type: "error" });
        console.log("Create comment failed: " + error);
        return;
      }
      this.$message({ message: "评论发表成功", type: "success" });
    },
    async deleteCommentClick(commentId) {
      const clickConfirm = await confirmDeleteAsync(
        this,
        "确定要删除这条评论吗",
        "删除评论"
      );
      if (clickConfirm) {
        try {
          await api.deleteCommentsAsync(this.projectId, this.taskId, commentId);
          await this.setCommentsAsync();
        } catch (error) {
          this.$message({ message: "评论删除失败", type: "error" });
          console.log("Delete comment failed: " + error);
          return;
        }
      }
    },
    async editTaskClick() {
      //TODO edit task
      await this.$alert("编辑任务功能尚未完成");
    },
    goBack() {
      this.$router.back();
    },
    async addExecutorBtnClick() {
      if (StrUtils.isEmpty(this.executorInput)) {
        return;
      }
      for (let user of this.executors) {
        if (user.username === this.executorInput) {
          this.$message("用户 " + this.executorInput + " 已经是执行人了");
          return;
        }
      }
      try {
        const user = await api.getUserByNameAsync(this.executorInput);
        this.executors.push(user);
        this.executorInput = "";
        await api.updateTaskAsync(this.projectId, this.task);
      } catch (error) {
        if (errTest(error, BusErrType.USER_NOT_FOUND)) {
          this.$message({
            message: "用户 " + this.executorInput + " 不存在",
            type: "error",
          });
        } else {
          this.$message({ message: "添加执行人失败", type: "error" });
          console.log("Add executor failed: " + error);
        }
        return;
      }
    },
    /** @param {UserJson} user */
    async removeBtnClick(user) {
      try {
        for (let i = 0; i < this.executors.length; i++) {
          if (this.executors[i].username === user.username) {
            this.executors.splice(i, 1);
            await api.updateTaskAsync(this.projectId, this.task);
            break;
          }
        }
      } catch (error) {
        this.$message({ message: "移除执行人失败", type: "error" });
        console.log("Remove executor failed: " + error);
        return;
      }
    },
    async completeBtnClick() {
      try {
        const status = !this.task.complete;
        await api.updateTaskCompleteAsync(this.projectId, this.taskId, status);
        this.task = await api.getTaskAsync(this.projectId, this.taskId);
      } catch (error) {
        this.$message({ message: "更新完成状态失败", type: "error" });
        console.log("Update task complete failed: " + error);
        return;
      }
    },
    async deleteBtnClick() {
      const clickConfirm = await confirmDeleteAsync(
        this,
        "确定要删除这个任务吗",
        "删除任务"
      );
      if (clickConfirm) {
        try {
          await api.deleteTaskAsync(this.projectId, this.taskId);
        } catch (error) {
          this.$message({ message: "删除任务失败", type: "error" });
          console.log("Delete task failed: " + error);
          return;
        }
        this.$message({ message: "删除任务成功", type: "success" });
        this.$router.back();
      }
    },
  },
  components: { TaskMain, CommentItem, ExecutorItem },
};
</script>

<style scoped>
.main-page {
  padding: 20px;
}

.view-task-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  margin-top: 20px;
}

.title-area {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.task-title {
  font-size: 34px;
  margin-right: 20px;
}

.complete-label {
  background: #67c23a;
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 14px;
}

.right-area {
  margin-left: 20px;
}

.input-base {
  display: block;
  margin-bottom: 15px;
  background: #fafbfc;
  border-color: #dcdfe6;
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  padding: 8px 12px;
  font-size: 16px;
}

.input-base:hover {
  border-color: #409eff;
}

.input-base:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 5px #409eff;
}

.comment-textarea {
  font-family: sans-serif;
  width: 100%;
  min-height: 150px;
  resize: vertical;
}

.executor-input {
  margin-right: 10px;
  margin-bottom: 0;
  flex-grow: 1;
}

.right-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.executor-input-area {
  display: flex;
  margin-bottom: 10px;
}

.add-btn {
  padding: 10px;
  border-radius: 6px;
}

.info-line {
  color: #606266;
  font-size: 14px;
  padding: 5px 0;
}

.info-attr-name {
  font-weight: bold;
}

.right-btn {
  border-radius: 6px;
  margin-bottom: 10px;
  display: block;
  width: 100%;
}

.write-comment-area {
  display: flex;
  flex-direction: column;
}

.create-comment-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.create-comment-btn {
  display: inline-block;
  align-self: flex-end;
}

@media screen and (max-width: 950px) {
  .view-task-grid {
    grid-template-columns: 1fr;
  }

  .right-area {
    margin-left: 0px;
    margin-top: 20px;
  }
}

@media screen and (max-width: 600px) {
  .main-page {
    padding: 20px 15px;
  }
}
</style>
