<template>
  <div>
    <h2>Project Invitation</h2>
    <invitation-item
      v-for="invitation in invitations"
      :key="invitation.id"
      :invitation="invitation"
      @cancel-invitation="cancelInvitationClick"
    />
  </div>
</template>

<script>
import { cancelInvitationAsync, getInvitationsAsync } from "../utils/ApiUtils";
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
    async cancelInvitationClick(invitaionId) {
      try {
        await cancelInvitationAsync(this.projectId, invitaionId);
      } catch (error) {
        console.log("Cancel invitation failed: " + error);
        console.log(error.response);
        return;
      }
      for (let invitaion of this.invitations) {
        if (invitaion.id === invitaionId) {
          invitaion.status = InvitationJson.STATUS_CANCELED;
          break;
        }
      }
      alert("取消邀请成功");
    },
  },
  components: {
    "invitation-item": ProjectInvitationItem,
  },
};
</script>
