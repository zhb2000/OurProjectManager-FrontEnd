<template>
  <div>
    <h2 class="setting-header">修改昵称</h2>
    <div>当前昵称：{{ nickname }}</div>
    <div>新昵称：<input v-model="newNickname" autocomplete="nickname" /></div>
    <div><el-button @click="modifyNicknameBtnClick">修改昵称</el-button></div>
    <h2 class="setting-header">修改用户名</h2>
    <div>当前用户名：{{ username }}</div>
    <div>新用户名：<input v-model="newUsername" autocomplete="username" /></div>
    <div><el-button @click="modifyUsernameBtnClick">修改用户名</el-button></div>
    <h2 class="setting-header">修改密码</h2>
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
    <div><el-button @click="modifyPasswordBtnClick">修改密码</el-button></div>
    <h2 class="setting-header">注销账户</h2>
    <p>警告：注销账户后所有数据都将无法恢复。</p>
    <div>
      <el-button type="danger" @click="deleteAccountBtnClick">
        注销账户
      </el-button>
    </div>
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
      await this.$alert("请重新登录", "用户名更新成功");
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
      await this.$alert("请重新登录", "密码更新成功");
      this.$router.push("/login");
    },
    async deleteAccountBtnClick() {
      this.$confirm("删除账户后数据将无法恢复，是否继续？", "删除账户", {
        confirmButtonText: "确认删除",
        cancelButtonText: "取消",
        type: "warning",
      }).then(this.deleteAccountAsync);
      return;
    },
    async deleteAccountAsync() {
      try {
        await deleteUserAsync(this.username);
      } catch (error) {
        console.log("Delete user account failed: " + error);
        return;
      }
      clearStorage();
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
</style>
