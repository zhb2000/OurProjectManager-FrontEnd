<template>
  <div>
    <member-item
      v-for="member in members"
      :key="member.userId"
      :member="member"
      :currentRole="currentRole"
      :currentUsername="currentUsername"
      @role-change="changeMemberRoleAsync"
      @remove-member="removeMemberAsync"
    />
  </div>
</template>

<script>
import {
  getCurrentRoleAsync,
  getCurrentUsernameAsync,
  getMembersAsync,
  updateMemberAsync,
} from "../utils/ApiUtils";
import { MemberJson } from "../utils/jsonmodel";
import ProjectMemberItem from "../components/ProjectMemberItem.vue";

export default {
  data() {
    return {
      /** @type {string} */
      currentUsername: null,
      /** @type {string} */
      currentRole: MemberJson.ROLE_MEMBER,
      /** @type {MemberJson[]} */
      members: [],
    };
  },
  computed: {
    /** @returns {string} */
    projectId() {
      return this.$route.params.projectId;
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
        this.currentUsername = await getCurrentUsernameAsync();
        this.currentRole = await getCurrentRoleAsync(this.projectId);
      } catch (error) {
        this.$message({ message: "获取当前角色失败", type: "error" });
        console.log("Get role failed: " + error);
        return;
      }
    },
    async setMembersAsync() {
      try {
        this.members = await getMembersAsync(this.projectId);
      } catch (error) {
        this.$message({ message: "获取成员列表失败", type: "error" });
        console.log("Get members failed: " + error);
        return;
      }
    },
    async changeMemberRoleAsync(member, newRole) {
      try {
        member.role = newRole;
        console.log("new role: " + member.role);
        await updateMemberAsync(this.projectId, member);
      } catch (error) {
        this.$message({ message: "成员角色更新失败", type: "error" });
        console.log("Update role failed: " + error);
        await this.setMembersAsync();
        return;
      }
      this.$message({ message: "成员权限更新成功", type: "success" });
    },
    async removeMemberAsync(member) {
      //TODO 移除项目成员
      alert("remove member");
    },
  },
  components: {
    "member-item": ProjectMemberItem,
  },
};
</script>

<style scoped>
</style>
