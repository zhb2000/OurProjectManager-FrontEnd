<!-- 项目内成员条目 -->
<template>
  <div class="member-card">
    <!-- 头像 -->
    <el-avatar :size="50" class="avatar">
      <span style="font-size: 25px">{{ nameFirstChar }}</span>
    </el-avatar>

    <!-- 用户名、加入时间 -->
    <div>
      <router-link :to="userPath" class="username">{{ username }}</router-link>
      <div>
        <span class="nickname">{{ nickname }}</span>
        <span class="join-at">加入时间：{{ joinAt }}</span>
      </div>
    </div>

    <!-- 占位用 -->
    <div style="flex-grow: 1" />

    <div style="display: flex; align-items: center">
      <!-- 成员角色：选择器或标签二选一显示 -->
      <div>
        <el-select
          v-if="showRoleSelect"
          :value="roleValue"
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
        <div v-if="!showRoleSelect" class="role-label">{{ roleStr }}</div>
      </div>

      <!-- 移出项目按钮 -->
      <el-button
        v-if="showRemoveBtn"
        type="danger"
        class="remove-btn"
        @click="removeBtnClick"
      >
        移出项目
      </el-button>
    </div>
  </div>
</template>

<script>
import * as DateUtils from "../../utils/DateUtils";
import { MemberJson } from "../../utils/JsonModel";
import * as StrUtils from "../../utils/StringUtils";
/** @typedef {import("../../utils/JsonModel").UserJson} UserJson */

export default {
  props: {
    member: { type: MemberJson, required: true },
    currentRole: { type: String, required: true },
    currentUsername: { type: String, required: true },
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
      return `/users/${encodeURIComponent(this.username)}`;
    },
    /** @returns {string} */
    nameFirstChar() {
      return StrUtils.firstCharOfName(this.username);
    },
    joinAt() {
      return DateUtils.beautify(this.member.joinAt);
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
    roleValue() {
      return this.member.role;
    },
  },
  data() {
    return {
      // roleValue: this.member.role,
      roleOptions: [
        { value: MemberJson.ROLE_SUPER_ADMIN, label: "项目主管" },
        { value: MemberJson.ROLE_ADMIN, label: "项目管理员" },
        { value: MemberJson.ROLE_MEMBER, label: "普通成员" },
      ],
    };
  },
  methods: {
    roleSelectChange(newRole) {
      this.$emit("role-change", this.member, newRole);
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
  margin-bottom: 15px;
  border-style: solid;
  border-width: 1px;
  border-color: #dcdfe6;
  border-radius: 10px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  row-gap: 5px;
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
}

.join-at {
  color: #909399;
  font-size: 14px;
  white-space: nowrap;
}

.role-label {
  padding: 8px;
  border-radius: 10px;
  color: white;
  background-color: #909399;
  font-size: 14px;
}

.role-select {
  width: 120px;
  margin-right: 15px;
}

.remove-btn {
  padding-left: 10px;
  padding-right: 10px;
}

@media screen and (max-width: 400px) {
  .member-card {
    padding: 15px;
  }
}
</style>
