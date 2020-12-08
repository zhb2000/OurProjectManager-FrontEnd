<template>
  <div>
    <div>
      username:
      <input name="username" autocomplete="username" v-model="username" />
    </div>
    <div>
      password:
      <input
        type="password"
        name="password"
        autocomplete="current-password"
        v-model="password"
      />
    </div>
    <div><button @click="loginBtnClick">登录</button></div>
    <div><router-link to="/signup">注册</router-link></div>
    <div>{{ display }}</div>
  </div>
</template>

<script>
import axios from "axios";
import { BusinessErrorType, responseErrorTest } from "../utils/ResponseErrorUtils";

export default {
  mounted() {},
  data() {
    return {
      username: "",
      password: "",
      display: "",
    };
  },
  methods: {
    async loginBtnClick() {
      let result;
      try {
        result = await axios.post("/api/login", {
          username: this.username,
          password: this.password,
        });
      } catch (error) {
        if (
          responseErrorTest(error, BusinessErrorType.WRONG_PASSWORD_OR_USERNAME)
        ) {
          alert("用户名或密码不正确");
        } else {
          alert(error);
        }
        return;
      }
      const token = result.data;
      localStorage.setItem("JWT_TOKEN", token);
      result = await axios.get("/api/whoami");
      const currentUser = result.data;
      const username = currentUser.username;
      sessionStorage.setItem("CURRENT_USERNAME", username);
      this.$router.push("/users/" + username);
    },
  },
};
</script>
