<template>
  <div>
    <h2>Project Invitation</h2>
    <div>
      <div>
        <input placeholder="接收者的用户名" v-model="receiverUsername" />
      </div>
      <div><button @click="sendInvitationBtnClick">发送邀请</button></div>
    </div>
    <invitation-item
      v-for="invitation in invitations"
      :key="invitation.id"
      :invitation="invitation"
      @cancel-invitation="cancelInvitationClick"
    />
  </div>
</template>

<script>
import {
  cancelInvitationAsync,
  createInvitationAsync,
  getInvitationsAsync,
  getUserByNameAsync,
} from "../utils/ApiUtils";
import { InvitationJson } from "../utils/jsonmodel";
import {
  responseErrorTest as errorTest,
  BusinessErrorType as BusErrorType,
} from "../utils/ResponseErrorUtils";
import ProjectInvitationItem from "../components/ProjectInvitationItem.vue";

export default {
  data() {
    return {
      /** @type {InvitationJson[]} */
      invitations: [],
      receiverUsername: "",
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
    async sendInvitationBtnClick() {
      let receiver;
      try {
        receiver = await getUserByNameAsync(this.receiverUsername);
      } catch (error) {
        if (errorTest(error, BusErrorType.USER_NOT_FOUND)) {
          alert("用户 " + this.receiverUsername + " 不存在");
        } else {
          console.log("Find receiver failed: " + error);
        }
        return;
      }
      try {
        await createInvitationAsync(this.projectId, receiver);
      } catch (error) {
        if (errorTest(error, BusErrorType.RECEIVER_ALREADY_IN_PROJECT)) {
          alert("用户 " + this.receiverUsername + " 已在项目中");
        } else {
          console.log("Send invitation failed: " + error);
        }
        return;
      }
      alert("邀请发送成功");
      this.invitations = await getInvitationsAsync(this.projectId);
    },
  },
  components: {
    "invitation-item": ProjectInvitationItem,
  },
};
</script>
