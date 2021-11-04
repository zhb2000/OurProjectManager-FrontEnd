<template>
  <container-without-side>
    <div class="sign-up-page">
      <div class="sign-up-card">
        <div class="welcome">欢迎注册 Our Project Manager</div>
        <div class="create">注册账号</div>
        <div class="attr-name">用户名</div>
        <input
          class="sign-up-input"
          name="username"
          autocomplete="username"
          v-model="username"
        />
        <div class="attr-name">昵称</div>
        <input
          class="sign-up-input"
          name="nickname"
          autocomplete="nickname"
          v-model="nickname"
        />
        <div class="attr-name">密码</div>
        <input
          class="sign-up-input"
          type="password"
          name="password"
          autocomplete="new-password"
          v-model="password"
        />
        <div class="attr-name">确认密码</div>
        <input
          class="sign-up-input"
          type="password"
          name="confirm-password"
          autocomplete="new-password"
          v-model="confirmPassword"
        />
        <el-button type="primary" class="sign-up-btn" @click="signUpBtnClick">
          注册账号
        </el-button>
        <router-link to="/login" class="login-link">
          已有账号？前去登录
        </router-link>
      </div>
    </div>
  </container-without-side>
</template>

<script>
import axios from "axios";
import {
  BusinessErrorType as BusErrType,
  responseErrorTest as errTest,
} from "../utils/ResponseErrorUtils.js";
import * as StrUtils from "../utils/StringUtils";
import ContainerWithoutSide from "../components/ContainerWithoutSide.vue";

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
    /** 存在某个输入框是空的 */
    someInputEmpty() {
      return [
        this.username,
        this.nickname,
        this.password,
        this.confirmPassword,
      ].some((s) => StrUtils.isEmpty(s));
    },
    async signUpBtnClick() {
      if (this.someInputEmpty()) {
        this.$message({ message: "字段不能为空", type: "error" });
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.$message({ message: "两次输入的密码不一致", type: "error" });
        return;
      }
      try {
        await axios.post("/api/users", {
          username: this.username,
          nickname: this.nickname,
          password: this.password,
        });
      } catch (error) {
        if (errTest(error, BusErrType.USER_ALREADY_EXIST)) {
          this.$message({ message: "同名用户已存在", type: "error" });
        } else {
          this.$message({ message: "注册失败", type: "error" });
          console.log("Sign up failed: " + error);
        }
        return;
      }
      this.$message({ message: "注册成功", type: "success" });
      this.$router.push("/login");
    },
  },
  components: { ContainerWithoutSide },
};
</script>

<style scoped>
.sign-up-page {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  padding: 40px 0px;
}

.sign-up-card {
  width: 500px;
  display: flex;
  flex-direction: column;
}

.attr-name {
  font-weight: bold;
  margin-bottom: 10px;
}

.sign-up-input {
  width: 100%;
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

.sign-up-input:hover {
  border-color: #409eff;
}

.sign-up-input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 5px #409eff;
  background: white;
}

.sign-up-btn {
  display: inline-block;
  margin-top: 10px;
}

.login-link {
  display: inline-block;
  align-self: center;
  margin-top: 15px;
  text-decoration: none;
  color: #0366d6;
}

.login-link:hover {
  text-decoration: underline;
}

.login-link:active {
  color: #0366d6;
}

.welcome {
  font-size: 20px;
  font-weight: lighter;
  align-self: center;
  margin-bottom: 15px;
}

.create {
  font-size: 35px;
  font-weight: bold;
  align-self: center;
  margin-bottom: 25px;
}

@media screen and (max-width: 600px) {
  .sign-up-card {
    width: 100%;
    padding-left: 15px;
    padding-right: 15px;
  }
}
</style>
