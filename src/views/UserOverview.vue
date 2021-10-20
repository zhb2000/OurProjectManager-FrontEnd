// 用户概览页面
<template>
  <div>
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
// eslint-disable-next-line no-unused-vars
import { UserJson } from "../utils/jsonmodel";
import { getUserByNameAsync } from "../utils/ApiUtils";

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
    /** @returns {string} */
    nickname() {
      return this.user ? this.user.nickname : null;
    },
    /** @returns {number} */
    userId() {
      return this.user ? this.user.id : null;
    },
    /** @returns {string} */
    projectCount() {
      return this.user ? this.user.projectCount : null;
    },
    /** @returns {string} */
    createAt() {
      return this.user ? this.user.createAt : null;
    },
    /** @returns {string} */
    updateAt() {
      return this.user ? this.user.updateAt : null;
    },
    usernameFirstChar() {
      const name = this.username.trim();
      return name.length > 0 ? name[0] : " ";
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
        //console.log("user overview changed, page name: " + this.username);
        this.user = await getUserByNameAsync(this.username);
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
  margin: 20px;
  border-style: solid;
  border-radius: 10px;
  border-width: 1px;
  border-color: #dcdfe6;
  color: #303133;
  display: grid;
  grid-template-columns: auto auto;
}

.card-left-col {
  font-weight: bold;
  margin: 0 10px 0 0;
  line-height: 40px;
}

.card-right-col {
  line-height: 40px;
}
</style>
