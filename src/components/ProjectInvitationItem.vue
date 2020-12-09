// 项目内邀请条目
<template>
  <div>
    <div>invitation: {{ invitaion }}</div>
  </div>
</template>

<script>
import { InvitationJson } from "../utils/jsonmodel";

export default {
  props: {
    invitaion: {
      type: InvitationJson,
      required: true,
    },
  },
};
</script>
