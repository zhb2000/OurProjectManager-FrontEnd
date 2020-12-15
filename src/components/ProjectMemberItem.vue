// 项目内成员条目
<template>
  <div class="member-card">
    <el-avatar :size="50" class="avatar">
      <span style="font-size: 25px">{{ nameFirstChar }}</span>
    </el-avatar>
    <div>
      <router-link :to="userPath" class="username">{{ username }}</router-link>
      <div>
        <span class="nickname">{{ nickname }}</span>
        <span class="join-at">加入时间：{{ joinAt }}</span>
      </div>
    </div>
    <el-select v-model="roleValue">
      <el-option
        v-for="option in roleOptions"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </el-select>
    <el-button type="danger">移出项目</el-button>
  </div>
</template>

<script>
import { MemberJson, UserJson } from "../utils/jsonmodel";

export default {
  props: {
    member: {
      type: MemberJson,
      required: true,
    },
    currentRole: {
      type: String,
      required: true,
    },
  },
  computed: {
    /** @returns {UserJson} */
    user() {
      return this.member.user;
    },
    /** @returns {string} */
    username() {
      return this.user.username;
    },
    /** @returns {string} */
    nickname() {
      return this.user.nickname;
    },
    userPath() {
      return "/users/" + this.username;
    },
    /** @returns {string} */
    nameFirstChar() {
      const name = this.username.trim();
      return name.length > 0 ? name[0] : " ";
    },
    joinAt() {
      return this.member.joinAt;
    },
  },
  data() {
    return {
      roleValue: this.member.role,
      roleOptions: [
        { value: MemberJson.ROLE_SUPER_ADMIN, label: "项目主管" },
        { value: MemberJson.ROLE_ADMIN, label: "项目管理员" },
        { value: MemberJson.ROLE_MEMBER, label: "普通成员" },
      ],
    };
  },
};
</script>

<style scoped>
.member-card {
  padding: 20px;
  margin: 16px 0;
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

.join-at {
  color: #909399;
  font-size: 14px;
}
</style>
