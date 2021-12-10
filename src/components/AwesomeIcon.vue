<template>
  <i class="fa" :class="'fa-'+ name" :style="{color,'font-size':fontSize}"></i>
</template>

<script>
export default {
  name: "AwesomeIcon",
  props: ["name", "fontSize", "color"]
}
</script>

<style scoped>

</style>
