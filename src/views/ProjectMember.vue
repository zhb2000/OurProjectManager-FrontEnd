<template>
  <div>
    <h2>project member</h2>
    <member-item
      v-for="member in members"
      :key="member.userId"
      :member="member"
      :currentRole="currentRole"
    />
  </div>
</template>

<script>
import { getCurrentRoleAsync, getMembersAsync } from "../utils/ApiUtils";
import { MemberJson } from "../utils/jsonmodel";
import ProjectMemberItem from "../components/ProjectMemberItem.vue";

export default {
  data() {
    return {
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
      try {
        this.currentRole = MemberJson.ROLE_MEMBER;
        this.members = [];
        const promises = [
          getCurrentRoleAsync(this.projectId),
          getMembersAsync(this.projectId),
        ];
        const results = await Promise.all(promises);
        this.currentRole = results[0];
        this.members = results[1];
      } catch (error) {
        console.log("get role or members failed: " + error);
        return;
      }
    },
  },
  components: {
    "member-item": ProjectMemberItem,
  },
};
</script>
