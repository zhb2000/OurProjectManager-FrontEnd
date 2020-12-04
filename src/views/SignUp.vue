<template>
  <div>
    <div>
      用户名：<input
        name="username"
        autocomplete="username"
        v-model="username"
      />
    </div>
    <div>
      昵称：<input name="nickname" autocomplete="nickname" v-model="nickname" />
    </div>
    <div>
      密码：<input
        type="password"
        name="password"
        autocomplete="new-password"
        v-model="password"
      />
    </div>
    <div>
      确认密码：<input
        type="password"
        name="confirm-password"
        autocomplete="new-password"
        v-model="confirmPassword"
      />
    </div>
    <div><button @click="signUpBtnClick">注册</button></div>
    <div><router-link to="/login">登录</router-link></div>
  </div>
</template>

<script>
import axios from "axios";
import { BusinessErrorType, responseErrorTest } from "@/utils/ApiResponse.js";
import { StringUtils } from "@/utils/StringUtils.js";

export default {
  data() {
    return {
      username: "",
      nickname: "",
      password: "",
      confirmPassword: "",
    };
  },
  methods: {
    async signUpBtnClick() {
      for (let s of [
        this.username,
        this.nickname,
        this.password,
        this.confirmPassword,
      ]) {
        if (StringUtils.isEmpty(s)) {
          alert("字段不能为空");
          return;
        }
      }
      if (this.password !== this.confirmPassword) {
        alert("两次输入的密码不一致");
        return;
      }
      try {
        await axios.post("/api/users/", {
          username: this.username,
          nickname: this.nickname,
          password: this.password,
        });
      } catch (error) {
        if (responseErrorTest(error, BusinessErrorType.USER_ALREADY_EXIST)) {
          alert("同名用户已存在");
        } else {
          alert(error);
        }
        return;
      }
      alert("注册成功");
      this.$router.go("/login");
    },
  },
};
</script>
