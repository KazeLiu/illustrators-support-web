<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">登录</router-link> |
      <router-link to="/illustrator">添加</router-link> |
      <router-link to="/vote">投票</router-link> |
      <router-link to="/result">结果</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
