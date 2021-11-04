<template>
  <div class="main-page">
    <div class="input-area">
      <input
        class="user-input input-item-base"
        placeholder="收件人的用户名"
        v-model="receiverUsername"
      />
      <el-button
        type="primary"
        size="medium"
        class="sendBtn input-item-base"
        @click="sendInvitationBtnClick"
      >
        发送邀请
      </el-button>
    </div>
    <div class="invitation-grid">
      <invitation-item
        v-for="invitation in invitations"
        :key="invitation.id"
        :invitation="invitation"
        @cancel-invitation="cancelInvitationClick"
      />
    </div>
  </div>
</template>

<script>
import * as api from "../../utils/ApiUtils";
import {
  responseErrorTest as errTest,
  BusinessErrorType as BusErrorType,
} from "../../utils/ResponseErrorUtils";
import { projectUrlPrefix } from "../../MyConfig";
import InvitationItem from "../../components/project/InvitationItem.vue";
/** @typedef {import("../../utils/JsonModel").InvitationJson} InvitationJson */

export default {
  data() {
    return {
      /** @type {InvitationJson[]} */
      invitations: [],
      receiverUsername: "",
    };
  },
  computed: {
    /** @returns {number} */
    projectId() {
      return parseInt(this.$route.params.projectId);
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
      await this.setInvitationsAsync();
    },
    async setInvitationsAsync() {
      try {
        const invitations = await api.getInvitationsAsync(this.projectId);
        invitations.sort((a, b) => b.createAt.localeCompare(a.createAt));
        this.invitations = invitations;
      } catch (error) {
        this.$message({ message: "获取邀请失败", type: "error" });
        console.log("Get invitations failed: " + error);
        return;
      }
    },
    async cancelInvitationClick(invitationId) {
      try {
        await api.cancelInvitationAsync(this.projectId, invitationId);
      } catch (error) {
        this.$message({ message: "取消邀请失败", type: "error" });
        console.log("Cancel invitation failed: " + error);
        return;
      }
      this.$message({ message: "取消邀请成功", type: "success" });
      await this.setInvitationsAsync();
    },
    async sendInvitationBtnClick() {
      //获取收件人
      let receiver;
      try {
        receiver = await api.getUserByNameAsync(this.receiverUsername);
      } catch (error) {
        if (errTest(error, BusErrorType.USER_NOT_FOUND)) {
          this.$message({
            message: "用户 " + this.receiverUsername + " 不存在",
            type: "error",
          });
        } else {
          this.$message({ message: "查找用户失败", type: "error" });
          console.log("Find receiver failed: " + error);
        }
        return;
      }
      //发送邀请，并发送通知
      let invitation;
      try {
        invitation = await api.createInvitationAsync(this.projectId, receiver);
      } catch (error) {
        if (errTest(error, BusErrorType.RECEIVER_ALREADY_IN_PROJECT)) {
          this.$message({
            message: "用户 " + this.receiverUsername + " 已在项目中",
            type: "error",
          });
        } else {
          this.$message({ message: "发送邀请失败", type: "error" });
          console.log("Send invitation failed: " + error);
        }
        return;
      }
      this.$message({ message: "邀请发送成功", type: "success" });
      await this.setInvitationsAsync();
      //发送消息给收件人
      try {
        const project = await api.getProjectAsync(this.projectId);
        const invitationUrl =
          projectUrlPrefix() + this.projectId + "/invitations/" + invitation.id;
        //TODO 这里直接生成了邀请的链接
        await api.createNotificationAsync(
          receiver.username,
          "邀请你加入项目：" + project.name,
          "邀请 ID：" + invitation.id + "，邀请链接：" + invitationUrl
        );
      } catch (error) {
        this.$message({ message: "发送通知失败", type: "error" });
        console.log("Send notification failed: " + error);
        return;
      }
    },
  },
  components: {
    InvitationItem,
  },
};
</script>

<style scoped>
.main-page {
  padding: 20px;
}

.invitation-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.input-area {
  margin: 10px;
  display: flex;
  align-content: center;
  flex-wrap: wrap;
  row-gap: 10px;
  column-gap: 10px;
}

.input-item-base {
  height: 36px;
}

.user-input {
  width: 400px;
  background: #fafbfc;
  border-color: #dcdfe6;
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  padding: 8px 12px;
  font-size: 16px;
  transition: 0.3s;
}

.user-input:hover {
  border-color: #409eff;
}

.user-input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 5px #409eff;
  background: white;
}

@media screen and (max-width: 700px) {
  .invitation-grid {
    grid-template-columns: 1fr;
  }
}

@media screen and (max-width: 600px) {
  .main-page {
    padding: 15px 5px;
  }
}
</style>
