<template>
  <div class="executor-card">
    <el-avatar :size="25">{{ firstChar }}</el-avatar>
    <span class="username">{{ user.username }}</span>
    <el-button
      icon="el-icon-close"
      size="mini"
      class="remove-btn"
      @click="removeBtnClick"
      type="text"
    />
  </div>
</template>

<script>
import { UserJson } from "../../utils/JsonModel";

export default {
  props: {
    user: {
      type: UserJson,
      required: true,
    },
  },
  computed: {
    firstChar() {
      if (!this.user.username) {
        return " ";
      }
      const name = this.user.username.trim();
      return name.length > 0 ? name[0] : " ";
    },
  },
  methods: {
    removeBtnClick() {
      this.$emit("remove-executor", this.user);
    },
  },
};
</script>

<style scoped>
.executor-card {
  border-radius: 6px;
  padding: 5px 5px;
  margin: 5px 0;
  display: flex;
  align-items: center;
}

.executor-card:hover {
  background: #f6f8fa;
}

.username {
  flex-grow: 1;
  font-weight: bold;
  font-size: 14px;
  margin-left: 10px;
}

.remove-btn {
  margin: 0;
  padding: 0;
  color: #0366d6;
}
</style>
