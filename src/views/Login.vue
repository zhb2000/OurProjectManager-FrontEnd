<template>
  <div>
    <h1>Login</h1>
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
import {
  BusinessErrorType as BusErrType,
  responseErrorTest as errorTest,
} from "../utils/ResponseErrorUtils";
import { loginAsync } from "../utils/ApiUtils";

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
      try {
        await loginAsync(this.username, this.password);
      } catch (error) {
        if (errorTest(error, BusErrType.WRONG_PASSWORD_OR_USERNAME)) {
          alert("用户名或密码不正确");
        } else {
          alert(error);
        }
        return;
      }
      this.$router.push("/users/" + this.username);
    },
  },
};
</script>
