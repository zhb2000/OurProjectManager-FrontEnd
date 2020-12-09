<template>
  <div>
    <h2>user setting</h2>
    <h3>修改昵称</h3>
    <div>当前昵称：{{ nickname }}</div>
    <div>新昵称：<input v-model="newNickname" autocomplete="nickname" /></div>
    <div><button @click="modifyNicknameBtnClick">修改昵称</button></div>
    <h3>修改用户名</h3>
    <div>当前用户名：{{ username }}</div>
    <div>新用户名：<input v-model="newUsername" autocomplete="off" /></div>
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
  </div>
</template>

<script>
import { UserJson } from "../utils/jsonmodel";
import { getUserByNameAsync } from "../utils/ApiUtils";

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
      try {
        this.user = await getUserByNameAsync(this.username);
      } catch (error) {
        console.log("get user by name failed: " + error);
        return;
      }
    },
    async modifyNicknameBtnClick() {},
    async modifyUsernameBtnClick() {},
    async modifyPasswordBtnClick() {},
  },
};
</script>
