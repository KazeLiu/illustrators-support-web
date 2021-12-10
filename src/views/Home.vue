<template>
  <div>
    <div id="nav">
      <router-link to="/illustrator">列表</router-link>
      |
      <router-link to="/vote">投票</router-link>
      |
      <router-link to="/result">结果</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import AwesomeIcon from "../components/AwesomeIcon"

export default {
  name: "Vote",
  mounted() {

  },
  components: {
    AwesomeIcon
  },
  methods: {

  }
}
</script>

<style scoped>
#nav {
  text-align: center;
}
</style>
