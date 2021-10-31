<template>
  <div class="login-page">
    <div class="login-card">
      <div class="welcome">欢迎登录</div>
      <div class="attr-name">用户名</div>
      <input
        name="username"
        autocomplete="username"
        v-model="username"
        class="login-input"
      />
      <div class="attr-name">密码</div>
      <input
        type="password"
        name="password"
        autocomplete="current-password"
        v-model="password"
        class="login-input"
      />
      <el-button
        type="primary"
        size="medium"
        class="login-btn"
        @click="loginBtnClick"
      >
        登录
      </el-button>
      <router-link to="/signup" class="sign-up-link">
        没有账号？前去注册
      </router-link>
    </div>
  </div>
</template>

<script>
import {
  BusinessErrorType as BusErrType,
  responseErrorTest as errorTest,
} from "../utils/ResponseErrorUtils";
import * as api from "../utils/ApiUtils";

export default {
  mounted() {},
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async loginBtnClick() {
      try {
        await api.loginAsync(this.username, this.password);
      } catch (error) {
        if (errorTest(error, BusErrType.WRONG_PASSWORD_OR_USERNAME)) {
          this.$message({ message: "用户名或密码不正确", type: "error" });
        } else {
          this.$message({ message: "登录失败", type: "error" });
          console.log("Login failed: " + error);
        }
        return;
      }
      this.$router.push("/users/" + this.username);
    },
  },
};
</script>

<style scoped>
.login-page {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: #f6f8fa;
}

.login-card {
  display: flex;
  flex-direction: column;
  border: solid 1px #dcdfe6;
  border-radius: 10px;
  padding: 30px 40px;
  background: white;
  box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.2);
}

.attr-name {
  font-weight: bold;
  margin-bottom: 10px;
}

.login-input {
  width: 300px;
  margin-bottom: 15px;
  background: #fafbfc;
  border-color: #dcdfe6;
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  padding: 8px 12px;
  font-size: 16px;
  transition: 0.3s;
}

.login-input:hover {
  border-color: #409eff;
}

.login-input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 5px #409eff;
}

.login-btn {
  display: block;
  width: 100%;
  align-self: center;
  margin-top: 10px;
}

.sign-up-link {
  display: block;
  align-self: center;
  margin-top: 15px;
  text-decoration: none;
  color: #0366d6;
}

.sign-up-link:hover {
  text-decoration: underline;
}

.sign-up-link:active {
  color: #0366d6;
}

.welcome{
  font-size: 25px;
  font-weight: lighter;
  align-self: center;
  margin-bottom: 25px;
}
</style>
