// 项目统计-成员贡献
<template>
  <div class="member-grid">
    <member-contribute
      v-for="member in members"
      :key="member.id"
      :user="member.user"
    />
  </div>
</template>

<script>
import * as api from "../../utils/ApiUtils";
import MemberContribute from "../../components/project/MemberContribute.vue";

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
        this.members = await api.getMembersAsync(this.projectId);
      } catch (error) {
        this.$message({ message: "获取成员列表失败", type: "error" });
        console.log("Get members failed: " + error);
        return;
      }
    },
  },
  components: {
    MemberContribute,
  },
};
</script>

<style scoped>
.member-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-left: 10px;
  margin-right: 10px;
  row-gap: 20px;
  column-gap: 20px;
}

@media screen and (max-width: 700px) {
  .member-grid {
    grid-template-columns: 1fr;
    margin-left: 0px;
    margin-right: 0px;
    row-gap: 20px;
  }
}
</style>