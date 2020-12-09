// 用户发送通知条目
<template>
  <div>
    <div><em>send notification</em></div>
    <div>json: {{ notification }}</div>
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
};
</script>
