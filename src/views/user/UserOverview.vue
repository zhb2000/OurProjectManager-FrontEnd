<!-- 用户概览页面 -->
<template>
  <div class="main-page">
    <div class="avatar-container">
      <div>
        <el-avatar :size="150" style="user-avatar">
          <span style="font-size: 50px">{{ usernameFirstChar }}</span>
        </el-avatar>
        <div>
          <div class="username-left">{{ username }}</div>
          <div class="nickname-left">{{ nickname }}</div>
        </div>
      </div>
    </div>
    <div class="detail-container">
      <div class="detail-card">
        <div class="card-left-col">
          <div>用户名：</div>
          <div>昵称：</div>
          <div>用户 ID：</div>
          <div>项目总数：</div>
          <div>注册时间：</div>
          <div>更新时间：</div>
        </div>
        <div class="card-right-col">
          <div>{{ username }}</div>
          <div>{{ nickname }}</div>
          <div>{{ userId }}</div>
          <div>{{ projectCount }}</div>
          <div>{{ createAt }}</div>
          <div>{{ updateAt }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "../../utils/ApiUtils";
import * as DateUtils from "../../utils/DateUtils";
import * as StrUtils from "../../utils/StringUtils";
/** @typedef {import("../../utils/JsonModel").UserJson} UserJson */

export default {
  data() {
    return {
      /** @type {UserJson} */
      user: null,
    };
  },
  computed: {
    /** @returns {string} */
    username() {
      return this.$route.params.username;
    },
    /** @returns {string?} */
    nickname() {
      return this.user?.nickname;
    },
    /** @returns {number?} */
    userId() {
      return this.user?.id;
    },
    /** @returns {string?} */
    projectCount() {
      return this.user?.projectCount;
    },
    /** @returns {string?} */
    createAt() {
      return this.user != null ? DateUtils.beautify(this.user.createAt) : null;
    },
    /** @returns {string?} */
    updateAt() {
      return this.user != null ? DateUtils.beautify(this.user.updateAt) : null;
    },
    usernameFirstChar() {
      return StrUtils.firstCharOfName(this.username);
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
        this.user = await api.getUserByNameAsync(this.username);
      } catch (error) {
        this.$message({ message: "获取用户信息失败", type: "error" });
        console.log("get user by name failed: " + error);
        return;
      }
    },
  },
};
</script>

<style scoped>
.main-page {
  padding: 20px;
}

.username-left {
  font-size: 30px;
  font-weight: bold;
  text-align: center;
}

.nickname-left {
  font-size: 23px;
  font-weight: lighter;
  text-align: center;
}

.avatar-container {
  display: flex;
  justify-content: center;
  margin: 30px 0 0 0;
}

.detail-container {
  display: flex;
  justify-content: center;
}

.detail-card {
  padding: 20px 40px;
  margin-top: 20px;
  border-style: solid;
  border-radius: 10px;
  border-width: 1px;
  border-color: #dcdfe6;
  color: #303133;
  display: grid;
  grid-template-columns: auto auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-left-col {
  font-weight: bold;
  margin: 0 10px 0 0;
  line-height: 40px;
}

.card-right-col {
  line-height: 40px;
}

@media screen and (max-width: 400px) {
  .main-page {
    padding: 20px 10px 20px 10px;
  }

  .detail-card {
    padding: 10px 20px;
  }
}
</style>
