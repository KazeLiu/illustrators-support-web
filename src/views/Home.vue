<template>
      <div id="nav">
        <router-link to="/illustrator">添加</router-link> |
        <router-link to="/vote">投票</router-link> |
        <router-link to="/result">结果</router-link>
        <router-view></router-view>
      </div>
</template>

<script>

export default {
  name: "Vote",
  mounted() {
    this.test();
  },
  methods: {
    test() {
    }
  }
}
</script>

<style scoped>

</style>
