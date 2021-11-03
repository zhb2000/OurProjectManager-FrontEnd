<!-- 项目内邀请条目 -->
<template>
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
      <span class="attr-name">邀请 ID：</span>
      <span>{{ invitationId }}</span>
    </div>
    <div class="line">
      <span class="attr-name">当前状态：</span>
      <span>{{ statusStr }}</span>
      <el-button
        v-if="isCreated"
        size="mini"
        class="cancel-btn"
        @click="cancelBtnClick"
      >
        取消邀请
      </el-button>
    </div>
    <div class="line">
      <span class="attr-name">创建时间：</span>
      <span>{{ createAt }}</span>
    </div>
    <div class="line">
      <span class="attr-name">结束时间：</span>
      <span>{{ endAt }}</span>
    </div>
  </div>
</template>

<script>
import * as DateUtils from "../../utils/DateUtils";
import { InvitationJson } from "../../utils/JsonModel";
/** @typedef {import("../../utils/JsonModel").UserJson} UserJson */

export default {
  props: {
    invitation: { type: InvitationJson, required: true },
  },
  computed: {
    isCreated() {
      return this.invitation.status === InvitationJson.STATUS_CREATED;
    },
    /** @returns {UserJson} */
    receiver() {
      return this.invitation.receiver;
    },
    /** @returns {UserJson} */
    sender() {
      return this.invitation.sender;
    },
    recvUsername() {
      return this.receiver.username;
    },
    recvNickname() {
      return this.receiver.nickname;
    },
    recvPath() {
      return `/users/${encodeURIComponent(this.recvUsername)}`;
    },
    sendUsername() {
      return this.sender.username;
    },
    sendNickname() {
      return this.sender.nickname;
    },
    sendPath() {
      return `/users/${encodeURIComponent(this.sendUsername)}`;
    },
    invitationId() {
      return this.invitation.id;
    },
    createAt() {
      return DateUtils.beautify(this.invitation.createAt);
    },
    endAt() {
      return this.isCreated
        ? "暂无"
        : DateUtils.beautify(this.invitation.endAt);
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
  methods: {
    cancelBtnClick() {
      this.$emit("cancel-invitation", this.invitation.id);
    },
  },
};
</script>

<style scoped>
.invitation-card {
  border: solid 1px #dcdfe6;
  border-radius: 10px;
  padding: 10px 20px;
  margin: 10px;
}

.line {
  margin: 10px 0;
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

.username:active {
  color: #0366d6;
}

.nickname {
  font-size: 14px;
  color: #606266;
}

.cancel-btn {
  margin-left: 10px;
  padding-left: 10px;
  padding-right: 10px;
}
</style>
