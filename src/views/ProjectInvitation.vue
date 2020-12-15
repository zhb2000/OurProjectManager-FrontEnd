<template>
  <div>
    <div class="input-area">
      <input
        class="user-input"
        placeholder="收件人的用户名"
        v-model="receiverUsername"
      />
      <el-button type="primary" size="medium" @click="sendInvitationBtnClick">
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
import {
  cancelInvitationAsync,
  createInvitationAsync,
  getInvitationsAsync,
  getUserByNameAsync,
} from "../utils/ApiUtils";
import { InvitationJson } from "../utils/jsonmodel";
import {
  responseErrorTest as errorTest,
  BusinessErrorType as BusErrorType,
} from "../utils/ResponseErrorUtils";
import ProjectInvitationItem from "../components/ProjectInvitationItem.vue";

export default {
  data() {
    return {
      /** @type {InvitationJson[]} */
      invitations: [],
      receiverUsername: "",
    };
  },
  computed: {
    /** @returns {string} */
    projectId() {
      return this.$route.params.projectId;
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
        this.invitations = await getInvitationsAsync(this.projectId);
      } catch (error) {
        this.$message({ message: "获取邀请失败", type: "error" });
        console.log("Get invitations failed: " + error);
        return;
      }
    },
    async cancelInvitationClick(invitaionId) {
      try {
        await cancelInvitationAsync(this.projectId, invitaionId);
      } catch (error) {
        this.$message({ message: "取消邀请失败", type: "error" });
        console.log("Cancel invitation failed: " + error);
        return;
      }
      this.$message({ message: "取消邀请成功", type: "success" });
      this.invitations = await getInvitationsAsync(this.projectId);
    },
    async sendInvitationBtnClick() {
      let receiver;
      try {
        receiver = await getUserByNameAsync(this.receiverUsername);
      } catch (error) {
        if (errorTest(error, BusErrorType.USER_NOT_FOUND)) {
          this.$message({
            message: "用户 " + this.receiverUsername + " 不存在",
            type: "error",
          });
        } else {
          console.log("Find receiver failed: " + error);
        }
        return;
      }
      try {
        await createInvitationAsync(this.projectId, receiver);
      } catch (error) {
        if (errorTest(error, BusErrorType.RECEIVER_ALREADY_IN_PROJECT)) {
          this.$message({
            message: "用户 " + this.receiverUsername + " 已在项目中",
            type: "error",
          });
        } else {
          console.log("Send invitation failed: " + error);
        }
        return;
      }
      this.$message({ message: "邀请发送成功", type: "error" });
      this.invitations = await getInvitationsAsync(this.projectId);
    },
  },
  components: {
    "invitation-item": ProjectInvitationItem,
  },
};
</script>

<style scoped>
.invitation-grid {
  display: grid;
  grid-template-columns: 50% 50%;
}

.input-area {
  margin: 0 10px;
}

.user-input {
  width: 400px;
  margin-right: 10px;
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
}
</style>
