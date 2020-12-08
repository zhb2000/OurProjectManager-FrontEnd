<template>
  <div>
    <h1>UserHome</h1>
    <p>page user: {{ $route.params.username }}</p>
    <p>current user: {{ currentUsername }}</p>
    <div><router-link to="/users/Bob">Bob</router-link></div>
    <div><router-link to="/users/Alice123">Alice123</router-link></div>
    <div>
      <router-link to="./project">project</router-link> |
      <router-link to="./notification">notification</router-link> |
      <router-link to="./setting">setting</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
import { getCurrentUsernameAsync } from "../utils/ApiUtils.js";

export default {
  data() {
    return {
      currentUsername: "noname",
    };
  },
  async mounted() {
    //TODO don't fetch data here
    console.log("UserHome: mounted");
    try {
      this.currentUsername = await getCurrentUsernameAsync();
    } catch (error) {
      alert(error);
      return;
    }
  },
};
</script>
