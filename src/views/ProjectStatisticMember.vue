// 项目统计-成员贡献
<template>
  <div class="member-grid">
    <member-contribute-card
      v-for="member in members"
      :key="member.id"
      :user="member.user"
    />
  </div>
</template>

<script>
import { getMembersAsync } from "../utils/ApiUtils";
import MemberContributeCard from "../components/MemberContributeCard.vue";

export default {
  data() {
    return {
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
        this.members = await getMembersAsync(this.projectId);
      } catch (error) {
        this.$message({ message: "获取成员列表失败", type: "error" });
        console.log("Get members failed: " + error);
        return;
      }
    },
  },
  components: {
    MemberContributeCard,
  },
};
</script>

<style>
.member-grid {
  display: grid;
  grid-template-columns: 50% 50%;
  margin-left: 10px;
  margin-right: 10px;
}
</style>