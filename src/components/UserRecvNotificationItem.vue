// 用户收到通知条目
<template>
  <div>
    <div><b>recv notification</b></div>
    <div>json: {{ notification }}</div>
    <div>
      <button @click="readBtnClick">{{ readBtnText }}</button>
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
    read() {
      return this.notification.read;
    },
    readBtnText() {
      return this.read ? "标为未读" : "标为已读";
    },
  },
  methods: {
    readBtnClick() {
      this.$emit("read-changed", this.notification.id);
    },
  },
};
</script>
