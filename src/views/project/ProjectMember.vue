<!-- 项目成员页 -->
<template>
  <div class="main-page">
    <!-- search, filter and sort -->
    <div class="input-container">
      <!-- 搜索框 -->
      <input
        v-model="searchWord"
        placeholder="搜索成员"
        class="search-input input-item-base"
      />
      <!-- 排序选项 -->
      <el-select
        v-model="sortValue"
        size="medium"
        class="input-select input-item-base"
        style="width: 150px"
      >
        <el-option
          v-for="option in sortOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </div>

    <!-- member list -->
    <member-item
      v-for="member in showedMembers"
      :key="member.userId"
      :member="member"
      :currentRole="currentRole"
      :currentUsername="currentUsername"
      @role-change="changeMemberRoleAsync"
      @remove-member="removeBtnClick"
    />
  </div>
</template>

<script>
import * as api from "../../utils/ApiUtils";
import { MemberJson } from "../../utils/JsonModel";
import MemberItem from "../../components/project/MemberItem.vue";
import { confirmAsync } from "../../utils/UiUtils";
import * as StrUtils from "../../utils/StringUtils";

export default {
  data() {
    return {
      /** @type {string} */
      currentUsername: null,
      /** @type {string} */
      currentRole: MemberJson.ROLE_MEMBER,
      /** @type {MemberJson[]} */
      members: [],
      searchWord: "",
      sortOptions: [
        { value: "Role", label: "按角色排序" },
        { value: "Name", label: "按用户名排序" },
        { value: "JoinAt", label: "按加入时间排序" },
      ],
      /** @type {'Role' | 'Name' | 'JoinAt'} */
      sortValue: "Role",
    };
  },
  computed: {
    /** @returns {number} */
    projectId() {
      return parseInt(this.$route.params.projectId);
    },
    /** @returns {MemberJson[]} */
    showedMembers() {
      /** @type {(member: MemberJson) => boolean} */
      let searcher; //过滤搜索词
      if (StrUtils.notEmpty(this.searchWord)) {
        searcher = (member) =>
          StrUtils.includeIgnoreCase(member.user.username, this.searchWord);
      } else {
        searcher = () => true;
      }

      /** @type {(a: MemberJson, b: MemberJson) => number} */
      let comparator; //排序
      if (this.sortValue === "Role") {
        const roleMap = new Map([
          [MemberJson.ROLE_SUPER_ADMIN, 3],
          [MemberJson.ROLE_ADMIN, 2],
          [MemberJson.ROLE_MEMBER, 1],
        ]);
        comparator = (a, b) => roleMap.get(b.role) - roleMap.get(a.role);
      } else if (this.sortValue === "Name") {
        comparator = (a, b) => a.user.username.localeCompare(b.user.username);
      } else {
        comparator = (a, b) => a.joinAt.localeCompare(b.joinAt);
      }

      return this.members.filter(searcher).sort(comparator);
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
    /** fetch members data */
    async pageChangedAsync() {
      await Promise.all([this.setCurrentRoleAsync(), this.setMembersAsync()]);
    },
    async setCurrentRoleAsync() {
      try {
        this.currentUsername = await api.getCurrentUsernameAsync();
        this.currentRole = await api.getCurrentRoleAsync(this.projectId);
      } catch (error) {
        this.$message({ message: "获取当前角色失败", type: "error" });
        console.log("Get role failed: " + error);
        return;
      }
    },
    async setMembersAsync() {
      try {
        this.members = await api.getMembersAsync(this.projectId);
      } catch (error) {
        this.$message({ message: "获取成员列表失败", type: "error" });
        console.log("Get members failed: " + error);
        return;
      }
    },
    /**
     * @param {MemberJson} member
     * @param {string} newRole
     */
    async changeMemberRoleAsync(member, newRole) {
      if (newRole === MemberJson.ROLE_SUPER_ADMIN) {
        const clickConfirm = await confirmAsync(
          this,
          "是否转让该项目？转让后您将会成为本项目的管理员",
          "转让项目",
          {
            type: "warning",
            confirmButtonText: "确认转让",
            cancelButtonText: "取消",
          }
        );
        if (!clickConfirm) {
          return;
        }
      }
      try {
        member.role = newRole;
        await api.updateMemberAsync(this.projectId, member);
      } catch (error) {
        this.$message({ message: "成员角色更新失败", type: "error" });
        console.log("Update role failed: " + error);
        await this.setMembersAsync();
        return;
      }
      this.$message({ message: "成员权限更新成功", type: "success" });
    },
    /** @param {MemberJson} member */
    async removeBtnClick(member) {
      const clickConfirm = await confirmAsync(
        this,
        `是否将${member.user.username}移出项目？`,
        "移除成员",
        {
          type: "warning",
          confirmButtonText: "确认移除",
          cancelButtonText: "取消",
        }
      );
      if (clickConfirm) {
        await this.doRemoveMemberAsync(member);
      }
    },
    /** @param {MemberJson} member */
    async doRemoveMemberAsync(member) {
      try {
        await api.deleteMemberAsync(this.projectId, member.user.id);
      } catch (error) {
        this.$message({ message: "移除成员失败", type: "error" });
        console.log("Remove member failed: " + error);
        return;
      }
      this.$message({ message: "移除成员成功", type: "success" });
      await this.setMembersAsync();
    },
  },
  components: { MemberItem },
};
</script>

<style scoped>
.main-page {
  padding: 20px;
}

.search-input {
  width: 400px;
  background: #fafbfc;
  border-color: #dcdfe6;
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  padding: 8px 12px;
  font-size: 16px;
  transition: 0.3s;
}

.search-input::placeholder {
  color: #909399;
}

.search-input:hover {
  border-color: #409eff;
}

.search-input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 5px #409eff;
  background: white;
}

.input-container {
  display: flex;
  align-content: center;
  flex-wrap: wrap;
  row-gap: 10px;
  column-gap: 10px;
  margin-bottom: 15px;
}

.input-item-base {
  height: 36px;
}

@media screen and (max-width: 600px) {
  .main-page {
    padding: 15px;
  }
}
</style>
