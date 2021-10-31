<template>
  <container-without-side>
    <div>
      <h1>SearchResult</h1>
      <div>
        project id:<input v-model="projectId" />
        <button @click="goProjectBtnClick">go project</button>
      </div>
      <div>
        username:<input v-model="username" />
        <button @click="goUserBtnClick">go user</button>
      </div>
    </div>
  </container-without-side>
</template>

<script>
import ContainerWithoutSide from "../components/ContainerWithoutSide.vue";

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
  components: { ContainerWithoutSide },
};
</script>
