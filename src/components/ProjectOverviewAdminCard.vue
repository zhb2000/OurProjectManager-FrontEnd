<template>
  <div class="admin-card">
    <el-avatar :size="50" class="avatar">
      <span style="font-size: 25px">{{ nameFirstChar }}</span>
    </el-avatar>
    <div>
      <router-link :to="userPath" class="username">{{ username }}</router-link>
      <div>
        <span class="nickname">{{ nickname }}</span>
        <span class="user-id">用户 ID：{{ userId }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      required: true,
    },
  },
  computed: {
    /** @returns {string} */
    username() {
      return this.user ? this.user.username : null;
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
    userPath() {
      return "/users/" + this.username;
    },
    /** @returns {string} */
    nameFirstChar() {
      if (!this.username) {
        return " ";
      }
      const name = this.username.trim();
      return name.length > 0 ? name[0] : " ";
    },
  },
};
</script>

<style scoped>
.admin-card {
  padding: 20px;
  margin: 20px;
  border-style: solid;
  border-width: 1px;
  border-color: #dcdfe6;
  border-radius: 10px;
  display: flex;
  align-items: center;
}

.avatar {
  margin-right: 20px;
}

.username {
  font-weight: bold;
  display: block;
  text-decoration: none;
  color: #0366d6;
  font-size: 20px;
  margin-bottom: 5px;
}

.username:hover {
  text-decoration: underline;
}

.username:active {
  color: #0366d6;
}

.nickname {
  color: #303133;
  margin-right: 20px;
}

.user-id{
  color: #909399;
  font-size: 14px;

}
</style>
