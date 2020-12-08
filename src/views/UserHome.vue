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
import axios from "axios";

export default {
  data() {
    return {
      currentUsername: "noname",
    };
  },
  async mounted() {
    //TODO don't fetch data here
    //TODO 获取当前用户名封装成异步函数
    console.log("mounted");
    if (!sessionStorage.getItem("CURRENT_USERNAME")) {
      let result;
      try {
        result = await axios.get("/api/users/whoami");
      } catch (error) {
        console.log(error);
        console.log(error.response);
        return;
      }
      const currentUser = result.data;
      const username = currentUser.username;
      sessionStorage.setItem("CURRENT_USERNAME", username);
    }
    this.currentUsername = sessionStorage.getItem("CURRENT_USERNAME");
  },
};
</script>
