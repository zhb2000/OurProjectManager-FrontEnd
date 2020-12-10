// 用户发送通知条目
<template>
  <div>
    <div><b>send notification</b></div>
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
