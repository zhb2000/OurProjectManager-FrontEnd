<!-- 项目概览页的管理员卡片 -->
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
import { UserJson } from "../../utils/JsonModel";
import * as StrUtils from "../../utils/StringUtils";

export default {
  props: {
    user: { type: UserJson, required: true },
  },
  computed: {
    /** @returns {string} */
    username() {
      return this.user.username;
    },
    /** @returns {string} */
    nickname() {
      return this.user.nickname;
    },
    /** @returns {number} */
    userId() {
      return this.user.id;
    },
    /** @returns {string} */
    userPath() {
      return `/users/${encodeURIComponent(this.username)}`;
    },
    /** @returns {string} */
    nameFirstChar() {
      return StrUtils.firstCharOfName(this.username);
    },
  },
};
</script>

<style scoped>
.admin-card {
  padding: 20px 15px;
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
  display: inline-block;
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
  white-space: nowrap;
}

.user-id {
  color: #909399;
  font-size: 14px;
  white-space: nowrap;
}
</style>
