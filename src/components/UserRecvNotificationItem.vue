// 用户收到通知条目
<template>
  <div>
    <div><em>recv notification</em></div>
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
