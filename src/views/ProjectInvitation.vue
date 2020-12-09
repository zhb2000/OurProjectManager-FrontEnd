<template>
  <div>
    <h2>Project Invitation</h2>
    <invitation-item
      v-for="invitation in invitations"
      :key="invitation.id"
      :invitaion="invitaion"
    />
  </div>
</template>

<script>
import { getInvitationsAsync } from "../utils/ApiUtils";
import { InvitationJson } from "../utils/jsonmodel";
import ProjectInvitationItem from "../components/ProjectInvitationItem.vue";

export default {
  data() {
    return {
      /** @type {InvitationJson[]} */
      invitations: [],
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
    async pageChangedAsync() {
      try {
        this.invitations = [];
        this.invitations = await getInvitationsAsync(this.projectId);
      } catch (error) {
        console.log("Get invitations failed: " + error);
        return;
      }
    },
  },
  components: {
    "invitation-item": ProjectInvitationItem,
  },
};
</script>
