<template>
  <div>
    <h1>ProjectHome</h1>
    <div>id: {{ projectId }}</div>
    <div>name:</div>
    <div>
      <router-link to="./todo">待办</router-link> |
      <router-link to="./member">成员</router-link> |
      <router-link to="./setting">设置</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      projectId: this.$route.params.projectId,
      projectName: "noname",
    };
  },
};
</script>
