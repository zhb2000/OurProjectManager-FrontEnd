// 用户发送通知条目
<template>
  <div class="send-card">
    <div class="title">{{ title }}</div>
    <div class="info-line">
      <span class="attr-name">收件人：</span>
      <router-link :to="recvPath" class="username">
        {{ recvUsername }}
      </router-link>
      <span class="attr-name">发送时间：</span>
      <span class="info">{{ createAt }}</span>
      <span class="attr-name">状态：</span>
      <span class="info">{{ statusStr }}</span>
    </div>
    <div class="body-area">
      <div>{{ body }}</div>
    </div>
  </div>
</template>

<script>
import { NotificationJson } from "../utils/jsonmodel";

export default {
  props: {
    notification: {
      type: NotificationJson,
      required: true,
    },
  },
  computed: {
    receiver() {
      return this.notification.receiver;
    },
    recvUsername() {
      return this.receiver.username;
    },
    recvNickname() {
      return this.receiver.nickname;
    },
    recvPath() {
      return "/users/" + this.recvUsername;
    },
    title() {
      return this.notification.title;
    },
    body() {
      return this.notification.body;
    },
    createAt() {
      return this.notification.createAt;
    },
    statusStr() {
      return this.notification.read ? "已读" : "未读";
    },
  },
};
</script>

<style scoped>
.send-card {
  border: solid 1px #dcdfe6;
  border-radius: 10px;
  padding: 15px 25px;
  margin: 10px;
}

.info-line {
  margin: 5px 0;
}

.info {
  color: #606266;
  margin-right: 20px;
}

.attr-name {
  font-weight: bold;
  color: #303133;
}

.username {
  text-decoration: none;
  color: #0366d6;
  font-weight: bold;
  margin-right: 20px;
}

.username:hover {
  text-decoration: underline;
}

.username:focus {
  color: #0366d6;
}

.title {
  font-size: 26px;
}

.body-area {
  margin-top: 10px;
}
</style>
