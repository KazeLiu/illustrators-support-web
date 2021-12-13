<template>
  <div>
    <el-image :title="file.name" class="mt5 mb5 image-upload-area" :src="file.url" fit="contain"
              v-for="(file) in upImageFileList" :key="file.id"></el-image>
    <br v-show="upImageFileList.length>0" />
    <el-button type="info" @click="openUploadImage">选择图片</el-button>
    <el-dialog
        append-to-body
        title="上传图片"
        :visible.sync="dialogVisible"
        width="60%">
      <el-divider>已选择图片列表</el-divider>
      <div v-if="upImageFileList.length==0" class="mt5 mb5 tac wb100">列表中没有图片</div>
      <div v-else class="up-image-area">
        <div class="up-image" v-for="(file) in upImageFileList" :key="file.id">
          <el-image class="mt5 mb5" :src="file.url" fit="contain"></el-image>
          <el-input v-model="file.source" placeholder="为这张图片填上来源或网址吧"></el-input>
          <el-button type="danger" @click="removeUpImageFileList(file)">删除</el-button>
        </div>
      </div>
      <el-divider>上传区域</el-divider>
      <div class="box-area" v-loading="loadMinImage" :element-loading-text="loadMinImageText">
        <div class="box-title"></div>
        <input ref="addUpImageFileListBtn" type="file" :multiple="max==1?false:true"
               accept="image/png, image/jpeg, image/jpg"
               @change="addUpImageFileList"/>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="closeUploadImage">取消</el-button>
          <el-button type="primary" @click="uploadImage" :loading="loadUpBtn">{{ loadUpBtnText }}</el-button>
        </span>
    </el-dialog>
    <!--    <div class="box-link-area" v-loading="loadMinImage" element-loading-text="">-->
    <!--      <el-input type="text" v-model="loadUrl" placeholder="粘贴图片地址自动解析" @input="loadImageUrl"></el-input>-->
    <!--      <img ref="loadUrlImageBox" v-show="loadUrlShow" class="box-title"/>-->
    <!--    </div>-->
  </div>
</template>

<script>

import {MyImagemin} from "@/assets/js/Common";
import {ImageUpload} from "@/assets/js/RequestAll";

export default {
  name: "UploadImage",
  computed: {},
  props: {
    max: {
      default: 10
    },
    loadUpBtnText: {
      default: "确定"
    }
  },
  data() {
    return {
      dialogVisible: false,
      src: "",
      blob: null,
      loadMinImage: false,
      loadMinImageText: "",
      loadUpBtn: false,
      loadUrl: "",
      loadUrlLoadText: "图片下载中……",
      loadUrlShow: true,
      upImageFileList: [],
    }
  },
  methods: {
    // loadImageUrl() {
    //   if(!/^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/.test(this.loadUrl)){
    //     this.msgError("网址验证失败，请继续输入");
    //   }
    //   let img = this.$refs.loadUrlImageBox;
    //   img.src = this.loadUrl;
    //   img.onload = function (data) {
    //
    //   }
    // },

    removeUpImageFileList(item) {
      this.upImageFileList = this.upImageFileList.filter(x => x.id != item.id);
    },

    async addUpImageFileList(el) {
      let files = el.target.files
      let forLength = 0;
      if (this.upImageFileList.length >= this.max) {
        this.msgError(`图片最多选择${this.max}项`);
        return;
      }
      if (this.max >= files.length) {
        forLength = files.length;
      } else {
        forLength = this.max;
        this.msgError(`图片最多选择${this.max}项`);
      }
      for (let i = 0; i < files.length; i++) {
        let file = el.target.files[i];
        this.loadMinImage = true;
        this.loadUpBtn = true;
        this.loadMinImageText = `正在压缩第${i + 1}张图`
        let minImage = await MyImagemin(file);
        if (minImage.code) {
          file = minImage.file
        }
        this.loadMinImage = false;
        this.loadUpBtn = false;
        this.upImageFileList.push({file, url: URL.createObjectURL(file), source: file.name, id: new Date().getTime()});
      }
    },

    uploadImage() {
      if (this.upImageFileList.length > 0) {
        this.$emit("selectedImage", this.upImageFileList);
        this.closeUploadImage();
        return;
      }
      this.msgError("没有选择图片，请按取消按钮");
    },

    closeUploadImage() {
      this.$refs.addUpImageFileListBtn.value = null;
      this.dialogVisible = false;
    },

    openUploadImage() {
      this.dialogVisible = true;
    }
  }
}
</script>

<style lang="less">
.upload-image {

  display: flex;
}

.up-image-area {
  height: 35vh;
  overflow: auto;
  padding-right: 10px;

  .up-image {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-input {
      width: 50%;
    }

    img {
      width: 200px;
      height: 100px;
    }
  }
}

.image-upload-area {
  width: 100px;
  height: 100px;
}

.box-area {
  position: relative;
  width: 100px;
  height: 100px;
  margin: auto;

  .box-title, input[type='file'], img {
    position: absolute;
    width: 100%;
    height: 100px;
    left: 0;
    top: 0;
  }

  .box-title {
    border: 1px solid #DCDFE6;
    box-sizing: border-box;
    text-align: center;
    line-height: 100px;

    &::before {
      content: '+';
      color: #DCDFE6;
      font-size: 50px;
    }
  }

  input[type='file'] {
    opacity: 0;
  }
}
</style>
