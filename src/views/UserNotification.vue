// 用户通知页面
<template>
  <div>
    <h2>user notification</h2>
    <div><input placeholder="接收者用户名" v-model="receiverUsername" /></div>
    <div><input placeholder="消息标题" v-model="title" /></div>
    <div><textarea placeholder="消息内容" v-model="body" /></div>
    <div><button @click="sendBtnClick">发送消息</button></div>
    <h3>recv</h3>
    <recv-item
      v-for="recvItem in recvNotifications"
      :key="recvItem.id"
      :notification="recvItem"
      @read-changed="itemReadClick"
    />
    <h3>send</h3>
    <send-item
      v-for="sendItem in sendNotifications"
      :key="sendItem.id"
      :notification="sendItem"
    />
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
      this.sendNotifications = [];
      try {
        this.sendNotifications = await getSendNotificationsAsync(this.username);
      } catch (error) {
        console.log("Get send notification failed: " + error);
        return;
      }
    },
    async setRecvAsync() {
      this.recvNotifications = [];
      try {
        this.recvNotifications = await getRecvNotificationsAsync(this.username);
      } catch (error) {
        console.log("Get recv notification failed: " + error);
        return;
      }
    },
    async sendBtnClick() {
      if (StringUtils.isEmpty(this.receiverUsername)) {
        alert("接收者用户名不能为空");
        return;
      }
      if (StringUtils.isEmpty(this.title)) {
        alert("消息标题不能为空");
        return;
      }
      try {
        await createNotificationAsync(this.receiverUsername, "title", "body"); //TODO
      } catch (error) {
        if (errorTest(error, BusErrorType.USER_NOT_FOUND)) {
          alert("用户 " + this.receiverUsername + " 不存在");
        } else {
          console.log("Send notification failed: " + error);
        }
        return;
      }
      alert("消息发送成功");
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
