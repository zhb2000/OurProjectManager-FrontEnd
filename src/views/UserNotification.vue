// 用户通知页面
<template>
  <div>
    <h2>user notification</h2>
    <h3>recv</h3>
    <recv-item
      v-for="recvItem in recvNotifications"
      :key="recvItem.id"
      :notification="recvItem"
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
  getRecvNotificationsAsync,
  getSendNotificationsAsync,
} from "../utils/ApiUtils";
import UserRecvNotificationItem from "../components/UserRecvNotificationItem.vue";
import UserSendNotificationItem from "../components/UserSendNotificationItem.vue";

export default {
  data() {
    return {
      /** @type {NotificationJson[]} */
      recvNotifications: [],
      /** @type {NotificationJson[]} */
      sendNotifications: [],
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
      this.recvNotifications = [];
      this.sendNotifications = [];
      try {
        const promises = [
          getRecvNotificationsAsync(this.username),
          getSendNotificationsAsync(this.username),
        ];
        const results = await Promise.all(promises);
        this.recvNotifications = results[0];
        this.sendNotifications = results[1];
      } catch (error) {
        console.log("Get notification failed: " + error);
        return;
      }
    },
  },
  components: {
    "recv-item": UserRecvNotificationItem,
    "send-item": UserSendNotificationItem,
  },
};
</script>
