<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {};
</script>

<style>
/** 把网页的边界去掉 */
body {
  margin: 0;
  height: 100%;
}

/** 改变盒子模型 */
* {
  box-sizing: border-box;
}

html {
  height: 100%;
}

#app {
  font-family: sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 0;
  width: 100%;
  height: 100%;
}

/* 桌面端使用自定义滚动条 */
@media screen and (min-width: 600px) {
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: #97979fa1;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: grey;
  }
}

/* 小屏幕上收窄 Element UI 的弹框组件 */
@media screen and (max-width: 500px) {
  .el-message {
    min-width: 300px !important;
  }

  .el-message-box {
    width: 300px !important;
  }
}
</style>
