<template>
  <div>
    <div class="box-area">
      <div class="box-title" v-show="!hasImg"></div>
      <img ref="imageBox" class="box-title" v-show="hasImg" />
      <input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="fileClick"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "UploadImage",
  computed: {},
  data() {
    return {
      hasImg: false,
    }
  },
  methods: {
    fileClick(el) {
      let that= this;
      let file = el.target.files[0];
      let img = this.$refs.imageBox;
      img.src = URL.createObjectURL(file);
      img.onload = function () {
        that.hasImg = true;
        const blob = new Blob([file], {type: file.type});
        that.$emit('selectedImage',blob);
      }
    }
  }
}
</script>

<style lang="less" scoped>
.box-area {
  position: relative;
  width: 100px;
  height: 100px;
  margin: auto;

  .box-title, input, img {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }

  .box-title {
    border: 1px solid #eeeeee;
    text-align: center;
    line-height: 100px;

    &::before {
      content: '+';
      color: #eeeeee;
      font-size: 50px;
    }
  }

  input {
    opacity: 0;
  }
}
</style>
