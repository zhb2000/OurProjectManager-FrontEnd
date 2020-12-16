// 查看邀请页面
<template>
  <div class="invitation-view-page">
    <div class="invitation-card">
      <div class="line">
        <span class="attr-name">收件人：</span>
        <router-link :to="recvPath" class="username">
          {{ recvUsername }}
        </router-link>
        <span class="nickname">{{ recvNickname }}</span>
      </div>
      <div class="line">
        <span class="attr-name">发送者：</span>
        <router-link :to="sendPath" class="username">
          {{ sendUsername }}
        </router-link>
        <span class="nickname">{{ sendNickname }}</span>
      </div>
      <div class="line">
        <span class="attr-name">项目：</span>
        <router-link :to="projectPath" class="project-name">
          {{ projectName }}
        </router-link>
      </div>
      <div class="line">
        <span class="attr-name">邀请 ID：</span>
        <span>{{ invitationId }}</span>
      </div>
      <div class="line">
        <span class="attr-name">创建时间：</span>
        <span>{{ createAt }}</span>
      </div>
      <div class="line">
        <span class="attr-name">结束时间：</span>
        <span>{{ endAt }}</span>
      </div>
      <div class="line">
        <span class="attr-name">当前状态：</span>
        <span>{{ statusStr }}</span>
      </div>
      <div v-if="isReceiver && isCreated" class="btn-group">
        <el-button type="primary" @click="acceptBtnClick">接受邀请</el-button>
        <el-button @click="rejectBtnClick">拒绝邀请</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  acceptInvitationAsync,
  rejectInvitationAsync,
  getCurrentUserIdAsync,
  getInvitationAsync,
} from "../utils/ApiUtils";
import { InvitationJson } from "../utils/jsonmodel";

export default {
  data() {
    return {
      /** @type {number} */
      currentUserId: null,
      /** @type {InvitationJson} */
      invitation: null,
    };
  },
  computed: {
    isCreated() {
      return this.isInvitationAtStatus(InvitationJson.STATUS_CREATED);
    },
    /** @returns {string} */
    invitationId() {
      return this.$route.params.invitationId;
    },
    projectName() {
      return this.invitation ? this.invitation.project.name : null;
    },
    /** @returns {string} */
    projectId() {
      return this.$route.params.projectId;
    },
    projectPath() {
      return "/projects/" + this.projectId;
    },
    isReceiver() {
      return (
        this.invitation && this.currentUserId === this.invitation.receiver.id
      );
    },
    recvUsername() {
      return this.invitation ? this.invitation.receiver.username : null;
    },
    recvNickname() {
      return this.invitation ? this.invitation.receiver.nickname : null;
    },
    recvPath() {
      return "/users/" + this.recvUsername;
    },
    sendUsername() {
      return this.invitation ? this.invitation.sender.username : null;
    },
    sendNickname() {
      return this.invitation ? this.invitation.sender.nickname : null;
    },
    sendPath() {
      return "/users/" + this.sendUsername;
    },
    createAt() {
      return this.invitation ? this.invitation.createAt : null;
    },
    endAt() {
      if (this.isCreated) {
        return "暂无";
      }
      return this.invitation ? this.invitation.endAt : null;
    },
    statusStr() {
      if (this.invitation.status === InvitationJson.STATUS_CREATED) {
        return "已创建";
      } else if (this.invitation.status === InvitationJson.STATUS_CANCELED) {
        return "发送者已取消";
      } else if (this.invitation.status === InvitationJson.STATUS_ACCEPTED) {
        return "收件人已接受";
      } else if (this.invitation.status === InvitationJson.STATUS_REJECTED) {
        return "收件人已拒绝";
      } else {
        return "未知状态";
      }
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
      await Promise.all([
        this.setCurrentUserIdAsync(),
        this.setInvitationAsync(),
      ]);
    },
    async setInvitationAsync() {
      try {
        this.invitation = null;
        this.invitation = await getInvitationAsync(
          this.projectId,
          this.invitationId
        );
      } catch (error) {
        this.$message({ message: "获取邀请失败", type: "error" });
        console.log("Get invitation failed: " + error);
        return;
      }
    },
    async setCurrentUserIdAsync() {
      try {
        this.currentUserId = null;
        this.currentUserId = await getCurrentUserIdAsync();
      } catch (error) {
        this.$message({ message: "获取用户 ID 失败", type: "error" });
        console.log("Get uid failed: " + error);
        return;
      }
    },
    async acceptBtnClick() {
      try {
        await acceptInvitationAsync(this.projectId, this.invitationId);
      } catch (error) {
        this.$message({ message: "接受邀请失败", type: "error" });
        console.log("Accept invitation failed: " + error);
        return;
      }
      this.$message({ message: "接受邀请成功", type: "success" });
      await this.setInvitationAsync();
    },
    async rejectBtnClick() {
      try {
        await rejectInvitationAsync(this.projectId, this.invitationId);
      } catch (error) {
        this.$message({ message: "拒绝邀请失败", type: "error" });
        console.log("Reject invitation failed: " + error);
        return;
      }
      this.$message({ message: "拒绝邀请成功", type: "success" });
      await this.setInvitationAsync();
    },
    /**
     * @param {string} status
     */
    isInvitationAtStatus(status) {
      return this.invitation && this.invitation.status === status;
    },
  },
};
</script>

<style scoped>
.invitation-view-page {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: #f6f8fa;
}
.invitation-card {
  display: inline-block;
  border: solid 1px #dcdfe6;
  border-radius: 10px;
  padding: 30px 40px;
  background: white;
  box-shadow: 0px 2px 5px 1px rgba(0,0,0,0.2);
}

.line {
  margin: 20px;
  color: #303133;
}

.attr-name {
  color: black;
  font-weight: bold;
}

.username {
  text-decoration: none;
  color: #0366d6;
  margin-right: 10px;
}

.username:hover {
  text-decoration: underline;
}

.username:focus {
  color: #0366d6;
}

.nickname {
  font-size: 14px;
  color: #606266;
}

.project-name {
  text-decoration: none;
  color: #0366d6;
  font-weight: bold;
}

.project-name:hover {
  text-decoration: underline;
}

.project-name:focus {
  color: #0366d6;
}

.btn-group {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
