// 项目内成员条目
<template>
  <div>
    <div>current role: {{ currentRole }}</div>
    <div>
      <router-link :to="userPath">
        <b>{{ member.user.username }}</b>
      </router-link>
    </div>
    <div>member: {{ member }}</div>
  </div>
</template>

<script>
import { MemberJson } from "../utils/jsonmodel";

export default {
  props: {
    member: {
      type: MemberJson,
      required: true,
    },
    currentRole: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      userPath: "/users/" + this.member.user.username,
    };
  },
};
</script>
