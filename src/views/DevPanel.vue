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
      <li><router-link to="/jump-to">JumpTo</router-link></li>
      <li>
        <router-link to="/users/Alice123">UserHome: Alice123</router-link>
      </li>
      <li>
        <router-link to="/projects/14">project-14</router-link>
      </li>
    </ul>
    <h1>Dev</h1>
    <el-button @click="logoutBtnClick">logout</el-button>
    <el-button @click="showTokenBtnClick">show token</el-button>
    <el-button @click="showUserBtnClick">show username</el-button>
    <div>token: {{ tokenStr }}</div>
    <div>username: {{ userStr }}</div>
  </div>
</template>

<script>
import {
  JWT_TOKEN_KEY,
  CURRENT_USERNAME_KEY,
  logoutAsync,
} from "../utils/ApiUtils";

export default {
  data() {
    return {
      tokenStr: localStorage.getItem(JWT_TOKEN_KEY),
      userStr: sessionStorage.getItem(CURRENT_USERNAME_KEY),
    };
  },
  methods: {
    showTokenBtnClick() {
      this.tokenStr = localStorage.getItem(JWT_TOKEN_KEY);
    },
    showUserBtnClick() {
      this.userStr = sessionStorage.getItem(CURRENT_USERNAME_KEY);
    },
    async logoutBtnClick() {
      await logoutAsync();
      this.showTokenBtnClick();
      this.showUserBtnClick();
      alert("logout succeeded");
    },
  },
};
</script>
