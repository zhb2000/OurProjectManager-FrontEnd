// 查看邀请页面
<template>
  <div>
    <h1>Invitation View</h1>
    <div>{{ invitation }}</div>
    <p><router-link :to="projectPath">前往项目</router-link></p>
    <div v-if="isReceiver && isCreated">
      <button>接受邀请</button>
      <button>拒绝邀请</button>
    </div>
  </div>
</template>

<script>
import {
  acceptInvitationAsync,
  rejectInvitationAsync,
  getCurrentUserIdAsync,
  getInvitationAsync,
} from "../utils/ApiUtils";
import { InvitationJson } from "../utils/jsonmodel";

export default {
  data() {
    return {
      /** @type {number} */
      currentUserId: null,
      /** @type {InvitationJson} */
      invitation: null,
    };
  },
  computed: {
    /** @returns {string} */
    invitationId() {
      return this.$route.params.invitationId;
    },
    /** @returns {string} */
    projectId() {
      return this.$route.params.projectId;
    },
    projectPath() {
      return "/projects/" + this.projectId;
    },
    isReceiver() {
      return (
        this.invitation && this.currentUserId === this.invitation.receiver.id
      );
    },
    isCreated() {
      return this.isInvitationAtStatus(InvitationJson.STATUS_CREATED);
    },
    isAccepted() {
      return this.isInvitationAtStatus(InvitationJson.STATUS_ACCEPTED);
    },
    isRejected() {
      return this.isInvitationAtStatus(InvitationJson.STATUS_REJECTED);
    },
    isCanceled() {
      return this.isInvitationAtStatus(InvitationJson.STATUS_CANCELED);
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
        const setCurrentUserIdAsync = async () => {
          this.currentUserId = null;
          this.currentUserId = await getCurrentUserIdAsync();
        };
        const setInvitationAsync = async () => {
          this.invitation = null;
          this.invitation = await getInvitationAsync(
            this.projectId,
            this.invitationId
          );
        };
        await Promise.all([setCurrentUserIdAsync(), setInvitationAsync()]);
      } catch (error) {
        console.log("Get uid or invitation failed: " + error);
        return;
      }
    },
    async acceptBtnClick() {
      try {
        await acceptInvitationAsync(this.projectId, this.invitationId);
      } catch (error) {
        console.log("Accept invitation failed: " + error);
        return;
      }
      this.invitation.status = InvitationJson.STATUS_ACCEPTED;
      alert("接受邀请成功");
    },
    async rejectBtnClick() {
      try {
        await rejectInvitationAsync(this.projectId, this.invitationId);
      } catch (error) {
        console.log("Reject invitation failed: " + error);
        return;
      }
      this.invitation.status = InvitationJson.STATUS_REJECTED;
      alert("拒绝邀请成功");
    },
    /**
     * @param {string} status
     */
    isInvitationAtStatus(status) {
      return this.invitation && this.invitation.status === status;
    },
  },
};
</script>