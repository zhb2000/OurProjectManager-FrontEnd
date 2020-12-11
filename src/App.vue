<template>
  <div id="app">
    <el-container id="app-container">
      <el-header id="app-header">
        <div>header here</div>
        <div><router-link to="/">go to root</router-link></div>
      </el-header>
      <el-main id="app-main">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<style>
/**把网页的边界去掉 */
body {
  margin: 0;
  height: 100%;
}

/**改变盒子模型 */
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

#app-header {
  background: lightblue;
}

#app-container {
  height: 100%;
}

#app-main {
  padding: 0px;
}
</style>
