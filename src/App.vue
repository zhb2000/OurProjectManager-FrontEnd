<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
/**把网页的边界去掉 */
body {
  margin: 0;
}

/**改变盒子模型 */
* {
  box-sizing: border-box;
}

#app {
  font-family: sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 0;
  width: 100;
}
</style>
