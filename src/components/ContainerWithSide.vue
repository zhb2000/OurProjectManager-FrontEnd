<template>
  <el-container class="no-padding-margin" style="height: 100%">
    <el-header class="no-padding-margin" height="48px">
      <header-bar @menu-click="menuClick" />
    </el-header>
    <el-main class="no-padding-margin">
      <el-container style="height: 100%">
        <el-aside class="app-side" width="250px">
          <slot name="side"></slot>
        </el-aside>
        <el-main class="no-padding-margin">
          <slot name="main"></slot>
        </el-main>
      </el-container>
    </el-main>
    <el-drawer
      direction="ltr"
      :size="250"
      :visible.sync="drawerOpen"
      :with-header="false"
      :append-to-body="false"
      :modal-append-to-body="false"
    >
      <div style="padding-top: 10px;">
        <slot name="side"></slot>
      </div>
    </el-drawer>
  </el-container>
</template>

<script>
import AppHeaderBar from "./AppHeaderBar.vue";

export default {
  data() {
    return { drawerOpen: false };
  },
  methods: {
    menuClick() {
      this.drawerOpen = !this.drawerOpen;
    },
  },
  watch: {
    $route() {
      this.drawerOpen = false;
    },
  },
  components: { "header-bar": AppHeaderBar },
};
</script>

<style scoped>
.app-side {
  padding: 0px;
  margin: 0px;
  border-style: solid;
  background: #f3f4f5;
  border-color: #e4e6e8;
  border-width: 0 1px 0 0;
  box-shadow: 0px 0 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

.no-padding-margin {
  padding: 0px;
  margin: 0px;
}

@media screen and (max-width: 800px) {
  .app-side {
    display: none;
  }
}
</style>
