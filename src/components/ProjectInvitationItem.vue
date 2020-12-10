// 项目内邀请条目
<template>
  <div>
    <div>invitation: {{ invitation }}</div>
    <div v-if="isCreated">
      <button @click="cancelBtnClick">取消邀请</button>
    </div>
  </div>
</template>

<script>
import { InvitationJson } from "../utils/jsonmodel";

export default {
  props: {
    invitation: {
      type: InvitationJson,
      required: true,
    },
  },
  computed: {
    isCreated() {
      return this.invitation.status === InvitationJson.STATUS_CREATED;
    },
  },
  methods: {
    cancelBtnClick() {
      this.$emit("cancel-invitation", this.invitation.id);
    },
  },
};
</script>
