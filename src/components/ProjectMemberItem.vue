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
    <div style="flex-grow: 1" />
    <div>
      <el-select
        v-if="showRoleSelect"
        v-model="roleValue"
        @change="roleSelectChange"
        class="role-select"
      >
        <el-option
          v-for="option in roleOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
      <span v-if="!showRoleSelect" class="role-label">{{ roleStr }}</span>
    </div>
    <el-button
      v-if="showRemoveBtn"
      type="danger"
      class="remove-btn"
      @click="removeBtnClick"
    >
      移出项目
    </el-button>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { MemberJson, UserJson } from "../utils/JsonModel";

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
    currentUsername: {
      type: String,
      required: true,
    },
  },
  computed: {
    currentIsAdmin() {
      return (
        this.currentRole === MemberJson.ROLE_ADMIN ||
        this.currentRole === MemberJson.ROLE_SUPER_ADMIN
      );
    },
    currentIsSuperAdmin() {
      return this.currentRole === MemberJson.ROLE_SUPER_ADMIN;
    },
    /** 该成员角色是否低于当前用户角色 */
    isLowerThanCurrent() {
      function roleToInt(role) {
        if (role === MemberJson.ROLE_MEMBER) {
          return 1;
        } else if (role === MemberJson.ROLE_ADMIN) {
          return 2;
        } else if (role === MemberJson.ROLE_SUPER_ADMIN) {
          return 3;
        } else {
          return 0;
        }
      }
      const itemInt = roleToInt(this.member.role);
      const currentInt = roleToInt(this.currentRole);
      return itemInt < currentInt;
    },
    /** 显示修改成员角色 */
    showRoleSelect() {
      return this.currentIsSuperAdmin && this.currentUsername !== this.username;
    },
    /** 显示“移除成员”按钮 */
    showRemoveBtn() {
      return (
        this.currentIsAdmin &&
        this.isLowerThanCurrent &&
        this.currentUsername !== this.username
      );
    },
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
    roleStr() {
      const role = this.member.role;
      if (role === MemberJson.ROLE_SUPER_ADMIN) {
        return "项目主管";
      } else if (role === MemberJson.ROLE_ADMIN) {
        return "项目管理员";
      } else if (role === MemberJson.ROLE_MEMBER) {
        return "普通成员";
      } else {
        return "未知";
      }
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
  methods: {
    roleSelectChange() {
      this.$emit("role-change", this.member, this.roleValue);
    },
    removeBtnClick() {
      this.$emit("remove-member", this.member);
    },
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

.role-label {
  padding: 8px;
  border-radius: 10px;
  color: white;
  background-color: #909399;
  font-size: 14px;
}

.role-select {
  width: 150px;
}

.remove-btn {
  margin-left: 15px;
}
</style>
