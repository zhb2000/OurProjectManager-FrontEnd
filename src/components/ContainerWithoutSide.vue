<template>
  <el-container class="app-container">
    <el-header class="app-header" height="48px">
      <header-bar />
    </el-header>
    <el-main class="app-main">
      <slot><!-- main --></slot>
    </el-main>
  </el-container>
</template>

<script>
import AppHeaderBar from "./AppHeaderBar.vue";

export default {
  components: { "header-bar": AppHeaderBar },
};
</script>

<style>
.app-container {
  height: 100%;
}

.app-header {
  padding: 0px;
}

.app-main {
  padding: 0px;
}
</style>
