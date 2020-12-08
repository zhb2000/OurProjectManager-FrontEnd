<template>
  <div>
    <h1>SearchResult</h1>
    <div>
      project id:<input v-bind="projectId" />
      <button @click="goProjectBtnClick">go project</button>
    </div>
    <div>
      username:<input v-bind="username" />
      <button @click="goUserBtnClick">go user</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projectId: "",
      username: "",
    };
  },
  methods: {
    goProjectBtnClick() {
      this.$router.push("/projects/" + this.projectId);
    },
    goUserBtnClick() {
      this.$router.push("/users/" + this.username);
    },
  },
};
</script>
