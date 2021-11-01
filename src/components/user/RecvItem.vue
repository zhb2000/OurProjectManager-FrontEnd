// 用户收到通知条目
<template>
  <div class="recv-card">
    <div :class="[{ 'bold-font': !read }, 'title']">{{ title }}</div>
    <div class="info-line">
      <span class="info-span">
        <span class="attr-name">发件人：</span>
        <router-link :to="sendPath" class="username">
          {{ sendUsername }}
        </router-link>
      </span>
      <span class="info-span">
        <span class="attr-name">发送时间：</span>
        <span class="info">{{ createAt }}</span>
      </span>
      <span class="info-span">
        <span class="attr-name">状态：</span>
        <span class="info">{{ statusStr }}</span>
      </span>
      <el-button
        class="info-span"
        size="mini"
        :type="readBtnType"
        @click="readBtnClick"
      >
        {{ readBtnText }}
      </el-button>
    </div>
    <div class="body-area">{{ body }}</div>
  </div>
</template>

<script>
import { NotificationJson } from "../../utils/JsonModel";

export default {
  props: {
    notification: {
      type: NotificationJson,
      required: true,
    },
  },
  computed: {
    sender() {
      return this.notification.sender;
    },
    sendUsername() {
      return this.sender.username;
    },
    sendNickname() {
      return this.sender.nickname;
    },
    sendPath() {
      return "/users/" + this.sendUsername;
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
    read() {
      return this.notification.read;
    },
    statusStr() {
      return this.read ? "已读" : "未读";
    },
    readBtnText() {
      return this.read ? "标为未读" : "标为已读";
    },
    readBtnType() {
      return this.read ? null : "primary";
    },
  },
  methods: {
    readBtnClick() {
      this.$emit("read-changed", this.notification.id);
    },
  },
};
</script>

<style scoped>
.recv-card {
  border: solid 1px #dcdfe6;
  border-radius: 10px;
  padding: 35px 30px;
  margin-bottom: 20px;
  margin-left: 10px;
  margin-right: 10px;
}

.info-line {
  margin-top: 15px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.info-span {
  white-space: nowrap;
  margin-top: 5px;
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
  font-size: 24px;
}

.bold-font {
  font-weight: bold;
}

.body-area {
  margin-top: 10px;
  word-wrap: break-word;
}

@media screen and (max-width: 600px) {
  .recv-card {
    padding: 20px;
    margin-left: 0px;
    margin-right: 0px;
  }
}
</style>
