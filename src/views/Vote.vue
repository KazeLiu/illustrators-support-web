<template>
  <div>
    <upload-image ref="uploadImage"></upload-image>
  </div>
</template>

<script>


import UploadImage from "@/components/UploadImage";
export default {
  name: "Vote",
  components: {UploadImage},
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
