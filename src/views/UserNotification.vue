// 用户通知页面
<template>
  <div>
    <div style="display: flex">
      <div style="flex-grow: 1" />
      <el-button type="primary" size="medium" @click="dialogVisible = true">
        编写新消息
      </el-button>
    </div>
    <el-dialog title="编写新消息" :visible.sync="dialogVisible">
      <div>
        <input
          class="send-input receiver-input"
          placeholder="接收者用户名"
          v-model="receiverUsername"
        />
        <input class="send-input" placeholder="消息标题" v-model="title" />
        <textarea
          class="send-input send-textarea"
          placeholder="消息内容"
          v-model="body"
        />
        <div class="send-btn-area">
          <el-button type="primary" @click="sendBtnClick">发送消息</el-button>
        </div>
      </div>
    </el-dialog>
    <el-tabs v-model="activeTabName">
      <el-tab-pane label="收件箱" name="recv">
        <recv-item
          v-for="recvItem in recvNotifications"
          :key="-recvItem.id"
          :notification="recvItem"
          @read-changed="itemReadClick"
        />
      </el-tab-pane>
      <el-tab-pane label="发件箱" name="send">
        <send-item
          v-for="sendItem in sendNotifications"
          :key="sendItem.id"
          :notification="sendItem"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { NotificationJson } from "../utils/jsonmodel";
import {
  createNotificationAsync,
  getRecvNotificationsAsync,
  getSendNotificationsAsync,
  updateNotificationReadAsync,
} from "../utils/ApiUtils";
import {
  responseErrorTest as errorTest,
  BusinessErrorType as BusErrorType,
} from "../utils/ResponseErrorUtils";
import UserRecvNotificationItem from "../components/UserRecvNotificationItem.vue";
import UserSendNotificationItem from "../components/UserSendNotificationItem.vue";
import { StringUtils } from "../utils/StringUtils";

export default {
  data() {
    return {
      /** @type {NotificationJson[]} */
      recvNotifications: [],
      /** @type {NotificationJson[]} */
      sendNotifications: [],
      receiverUsername: "",
      title: "",
      body: "",
      dialogVisible: false,
      activeTabName: "recv",
    };
  },
  computed: {
    /** @returns {string} */
    username() {
      return this.$route.params.username;
    },
  },
  watch: {
    async $route() {
      await this.pageChangedAsync();
    },
  },
  async mounted() {
    await this.pageChangedAsync();
  },
  methods: {
    /** fetch user's recv and send notifications */
    async pageChangedAsync() {
      await Promise.all([this.setSendAsync(), this.setRecvAsync()]);
    },
    async setSendAsync() {
      try {
        const notifications = await getSendNotificationsAsync(this.username);
        notifications.sort((a, b) => b.createAt.localeCompare(a.createAt));
        this.sendNotifications = notifications;
      } catch (error) {
        this.$message({ message: "获取已发送消息失败", type: "error" });
        console.log("Get send notification failed: " + error);
        return;
      }
    },
    async setRecvAsync() {
      try {
        const notifications = await getRecvNotificationsAsync(this.username);
        notifications.sort((a, b) => b.createAt.localeCompare(a.createAt));
        this.recvNotifications = notifications;
      } catch (error) {
        this.$message({ message: "获取已接收消息失败", type: "error" });
        console.log("Get recv notification failed: " + error);
        return;
      }
    },
    async sendBtnClick() {
      if (StringUtils.isEmpty(this.receiverUsername)) {
        this.$message({ message: "接收者用户名不能为空", type: "error" });
        return;
      }
      if (StringUtils.isEmpty(this.title)) {
        this.$message({ message: "消息标题不能为空", type: "error" });
        return;
      }
      try {
        await createNotificationAsync(
          this.receiverUsername,
          this.title,
          this.body
        );
      } catch (error) {
        if (errorTest(error, BusErrorType.USER_NOT_FOUND)) {
          this.$message({
            message: "用户 " + this.receiverUsername + " 不存在",
            type: "error",
          });
        } else {
          this.$message({ message: "发送消息失败", type: "error" });
          console.log("Send notification failed: " + error);
        }
        return;
      }
      this.$message({ message: "消息发送成功", type: "success" });
      this.dialogVisible = false;
      this.receiverUsername = this.title = this.body = "";
      await this.setSendAsync();
    },
    async itemReadClick(notificationId) {
      let index;
      for (let i = 0; i < this.recvNotifications.length; i++) {
        if (this.recvNotifications[i].id === notificationId) {
          index = i;
          break;
        }
      }
      const read = !this.recvNotifications[index].read;
      try {
        await updateNotificationReadAsync(this.username, notificationId, read);
      } catch (error) {
        this.$message({ message: "更新已读状态失败", type: "error" });
        console.log("Update notification read failed: " + error);
        return;
      }
      this.recvNotifications[index].read = read;
    },
  },
  components: {
    "recv-item": UserRecvNotificationItem,
    "send-item": UserSendNotificationItem,
  },
};
</script>

<style scoped>
.send-input {
  display: block;
  width: 100%;
  background: #fafbfc;
  border-color: #dcdfe6;
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  padding: 8px 12px;
  font-size: 16px;
  margin-bottom: 10px;
}

.send-input:hover {
  border-color: #409eff;
}

.send-input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 5px #409eff;
}

.receiver-input {
  color: #0366d6;
}

.send-textarea {
  resize: vertical;
  width: 100%;
  font-family: sans-serif;
  min-height: 150px;
}

.send-btn-area {
  display: flex;
  justify-content: flex-end;
}
</style>
