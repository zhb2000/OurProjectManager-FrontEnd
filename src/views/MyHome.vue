<template>
  <div>
    <router-link to="/">go home</router-link>
    <router-link to="/">go to about</router-link>
    <hello-world msg="lalala" />
    <p>here is home page</p>
  </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "MyHome",
  components: {
    HelloWorld,
  },
};
</script>
