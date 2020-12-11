<template>
  <div>
    <h2>user setting</h2>
    <h3>修改昵称</h3>
    <div>当前昵称：{{ nickname }}</div>
    <div>新昵称：<input v-model="newNickname" autocomplete="nickname" /></div>
    <div><button @click="modifyNicknameBtnClick">修改昵称</button></div>
    <h3>修改用户名</h3>
    <div>当前用户名：{{ username }}</div>
    <div>新用户名：<input v-model="newUsername" autocomplete="username" /></div>
    <div><button @click="modifyUsernameBtnClick">修改用户名</button></div>
    <h3>修改密码</h3>
    <div>
      旧密码：<input
        type="password"
        autocomplete="current-password"
        v-model="oldPassword"
      />
    </div>
    <div>
      新密码：<input
        type="password"
        autocomplete="new-password"
        v-model="newPassword"
      />
    </div>
    <div><button @click="modifyPasswordBtnClick">修改密码</button></div>
    <h3>注销账户</h3>
    <div><button @click="deleteAccountBtnClick">注销账户</button></div>
  </div>
</template>

<script>
import { UserJson } from "../utils/jsonmodel";
import {
  getUserByNameAsync,
  updateUsernameAndNicknameAsync,
  updatePasswordAsync,
  logoutAsync,
  deleteUserAsync,
  clearStorage,
} from "../utils/ApiUtils";
import {
  responseErrorTest as errorTest,
  BusinessErrorType as BusErrorType,
} from "../utils/ResponseErrorUtils";

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
        this.user = await getUserByNameAsync(this.username);
      } catch (error) {
        console.log("get user by name failed: " + error);
        return;
      }
    },
    async modifyNicknameBtnClick() {
      try {
        await updateUsernameAndNicknameAsync(
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
        await updateUsernameAndNicknameAsync(
          this.username,
          this.newUsername,
          this.nickname
        );
        await logoutAsync();
      } catch (error) {
        if (errorTest(error, BusErrorType.USER_ALREADY_EXIST)) {
          this.$message({ message: "同名用户已存在", type: "error" });
        } else {
          this.$message({ message: "用户名更新失败", type: "error" });
          console.log("Update username failed: " + error);
        }
        return;
      }
      this.$alert("请重新登录", "用户名更新成功");
      this.$router.push("/login");
    },
    async modifyPasswordBtnClick() {
      try {
        await updatePasswordAsync(
          this.username,
          this.oldPassword,
          this.newPassword
        );
        await logoutAsync();
      } catch (error) {
        if (errorTest(error, BusErrorType.WRONG_OLD_PASSWORD)) {
          this.$message({ message: "旧密码错误", type: "error" });
        } else {
          console.log("Update password failed: " + error);
        }
        return;
      }
      this.$alert("请重新登录", "密码更新成功");
      this.$router.push("/login");
    },
    async deleteAccountBtnClick() {
      try {
        await deleteUserAsync(this.username);
      } catch (error) {
        console.log("Delete user account failed: " + error);
        return;
      }
      clearStorage();
      this.$alert("请重新登录或注册", "用户账户删除成功");
      this.$router.push("/login");
    },
  },
};
</script>
