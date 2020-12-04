<template>
  <div>
    <h1>Subpages in Project</h1>
    <ul>
      <li><router-link to="/homedemo">HomeDemo</router-link></li>
      <li><router-link to="/aboutdemo">AboutDemo</router-link></li>
      <li><router-link to="/myhome">MyHome</router-link></li>
      <li><router-link to="/login">Login</router-link></li>
      <li><router-link to="/signup">SignUp</router-link></li>
      <li><router-link to="/create-project">CreateProject</router-link></li>
    </ul>
    <h1>Dev</h1>
    <button @click="logoutBtnClick">logout</button>
    <button @click="showTokenBtnClick">show token</button>
    <button @click="showUserBtnClick">show username</button>
    <div>token: {{ tokenStr }}</div>
    <div>username: {{ userStr }}</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      tokenStr: localStorage.getItem("JWT_TOKEN"),
      userStr: sessionStorage.getItem("CURRENT_USERNAME"),
    };
  },
  methods: {
    showTokenBtnClick() {
      this.tokenStr = localStorage.getItem("JWT_TOKEN");
    },
    showUserBtnClick() {
      this.userStr = sessionStorage.getItem("CURRENT_USERNAME");
    },
    async logoutBtnClick() {
      await axios.get("api/users/logout");
      localStorage.removeItem("JWT_TOKEN");
      sessionStorage.removeItem("CURRENT_USERNAME");
    },
  },
};
</script>
