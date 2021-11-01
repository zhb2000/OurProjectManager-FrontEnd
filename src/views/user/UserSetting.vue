<!-- 用户设置页面 -->
<template>
  <div style="padding: 20px">
    <h2 class="setting-header">修改昵称</h2>
    <div>当前昵称：{{ nickname }}</div>
    <label for="new-nickname" class="setting-label">新昵称</label>
    <input
      v-model="newNickname"
      name="new-nickname"
      autocomplete="nickname"
      class="setting-input"
    />
    <el-button
      type="primary"
      class="setting-button"
      size="medium"
      @click="modifyNicknameBtnClick"
    >
      修改昵称
    </el-button>
    <h2 class="setting-header">修改用户名</h2>
    <div>当前用户名：{{ username }}</div>
    <label for="new-username" class="setting-label">新用户名</label>
    <input
      v-model="newUsername"
      name="new-username"
      autocomplete="username"
      class="setting-input"
    />
    <el-button
      type="primary"
      class="setting-button"
      size="medium"
      @click="modifyUsernameBtnClick"
    >
      修改用户名
    </el-button>
    <h2 class="setting-header">修改密码</h2>
    <label for="current-password" class="setting-label">旧密码</label>
    <input
      type="password"
      name="current-password"
      autocomplete="current-password"
      v-model="oldPassword"
      class="setting-input"
    />
    <label for="new-password" class="setting-label">新密码</label>
    <input
      type="password"
      name="new-password"
      autocomplete="new-password"
      v-model="newPassword"
      class="setting-input"
    />
    <el-button
      type="primary"
      size="medium"
      class="setting-button"
      @click="modifyPasswordBtnClick"
    >
      修改密码
    </el-button>
    <h2 class="setting-header">删除账户</h2>
    <p>警告：删除账户后所有数据都将无法恢复。</p>
    <el-button
      type="danger"
      size="medium"
      class="setting-button"
      @click="deleteAccountBtnClick"
    >
      注销账户
    </el-button>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { UserJson } from "../../utils/JsonModel";
import * as api from "../../utils/ApiUtils";
import {
  responseErrorTest as errTest,
  BusinessErrorType as BusErrorType,
} from "../../utils/ResponseErrorUtils";
import { confirmAsync } from "../../utils/UiUtils";

export default {
  data() {
    return {
      /** @type {UserJson} */
      user: null,
      newNickname: "",
      newUsername: "",
      oldPassword: "",
      newPassword: "",
    };
  },
  computed: {
    /** @returns {string} */
    username() {
      return this.$route.params.username;
    },
    /** @returns {string} */
    nickname() {
      return this.user ? this.user.nickname : null;
    },
    /** @returns {number} */
    userId() {
      return this.user ? this.user.id : null;
    },
  },
  watch: {
    $route() {
      this.pageChangedAsync();
    },
  },
  created() {
    this.pageChangedAsync();
  },
  methods: {
    /** fetch user data */
    async pageChangedAsync() {
      await this.setUserAsync();
    },
    async setUserAsync() {
      try {
        this.user = await api.getUserByNameAsync(this.username);
      } catch (error) {
        this.$message({ message: "获取用户信息失败", type: "error" });
        console.log("get user by name failed: " + error);
        return;
      }
    },
    async modifyNicknameBtnClick() {
      try {
        await api.updateUsernameAndNicknameAsync(
          this.username,
          this.username,
          this.newNickname
        );
      } catch (error) {
        this.$message({ message: "昵称更新失败", type: "error" });
        console.log("Update nickname failed: " + error);
        return;
      }
      this.$message({ message: "昵称更新成功", type: "success" });
      await this.setUserAsync();
    },
    async modifyUsernameBtnClick() {
      try {
        await api.updateUsernameAndNicknameAsync(
          this.username,
          this.newUsername,
          this.nickname
        );
        await api.logoutAsync();
      } catch (error) {
        if (errTest(error, BusErrorType.USER_ALREADY_EXIST)) {
          this.$message({ message: "同名用户已存在", type: "error" });
        } else {
          this.$message({ message: "用户名更新失败", type: "error" });
          console.log("Update username failed: " + error);
        }
        return;
      }
      await this.$alert("请重新登录", "用户名更新成功");
      this.$router.push("/login");
    },
    async modifyPasswordBtnClick() {
      try {
        await api.updatePasswordAsync(
          this.username,
          this.oldPassword,
          this.newPassword
        );
        await api.logoutAsync();
      } catch (error) {
        if (errTest(error, BusErrorType.WRONG_OLD_PASSWORD)) {
          this.$message({ message: "旧密码错误", type: "error" });
        } else {
          console.log("Update password failed: " + error);
        }
        return;
      }
      await this.$alert("请重新登录", "密码更新成功");
      this.$router.push("/login");
    },
    async deleteAccountBtnClick() {
      const clickConfirm = await confirmAsync(
        this,
        "删除账户后数据将无法恢复，是否继续？",
        "删除账户",
        {
          type: "warning",
          confirmButtonText: "确认删除账户",
          cancelButtonText: "取消",
        }
      );
      if (clickConfirm) {
        await this.deleteAccountAsync();
      }
    },
    async deleteAccountAsync() {
      try {
        await api.deleteUserAsync(this.username);
      } catch (error) {
        this.$message({ message: "删除账户失败", type: "error" });
        console.log("Delete user account failed: " + error);
        return;
      }
      api.clearStorage();
      await this.$alert("请重新登录或注册", "用户账户删除成功");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.setting-header {
  border-style: solid;
  border-width: 0 0 1px 0;
  border-color: #dcdfe6;
  padding: 0 0 10px 0;
}

.setting-label {
  display: block;
  margin: 15px 0;
  font-weight: bold;
}

.setting-button {
  display: block;
  margin: 15px 0 0 0;
  border-radius: 6px;
}

.setting-input {
  display: block;
  max-width: 400px;
  width: 100%;
  background: #fafbfc;
  border-color: #dcdfe6;
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  padding: 8px 12px;
  font-size: 16px;
  transition: 0.3s;
}

.setting-input:hover {
  border-color: #409eff;
}

.setting-input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 5px #409eff;
}
</style>
