<template>
  <div>
    <div class="h-panel Illustrator-panel">
      <div class="h-panel-bar">
        <span class="h-panel-title">列表</span>
        <span class="h-panel-right" @click="addIllustratorShow = true">
          <awesome-icon
              class="pointer"
              fontSize="24px"
              title="添加画师"
              name="address-card"></awesome-icon></span>
      </div>
      <div class="h-panel-body">
        <h-collapse v-model="activeIllustrator" @change="getIllustratorInfo">
          <h-collapse-item v-for="item in list">
            <template slot='title'>
              <span class="header-title flex-between">
                <span class="flex flex-center"><img :src="baseUrl+'/'+item.head">
                  <span class="ml10 fs18">{{
                      item.name
                    }}</span>
                </span>
                <span class="header-title-right"
                      @click.stop="addIllustratorImageItem = item;addIllustratorImageShow = true">
                  <awesome-icon title="为ta新增展示作品" name="file-image-o"></awesome-icon>
                </span>
              </span>
            </template>
            <div>{{ item }}</div>
            <div class="flex">
              <h-button class="wb33" @click="ToLink('https://'+item.home)" :block="true">画师主页</h-button>
              <h-button class="wb33" @click="ToLink('https://'+item.sponsor)" :block="true">捐助页面</h-button>
            </div>
          </h-collapse-item>
        </h-collapse>
        <Loading text="加载列表中……" :loading="loadingList"></Loading>
      </div>
    </div>

    <Modal :closeOnMask="false" :hasCloseIcon="true" v-model="addIllustratorShow">
      <div slot="header">添加捐助对象</div>
      <div>
        <h-form
            ref="form"
            :labelWidth="110"
            labelPosition="right"
            :model="illustratorForm"
            :rules="illustratorFormRules"
        >
          <h-formitem label="画师名称" prop="name">
            <template v-slot:label>
              <awesome-icon name="user"></awesome-icon>
              画师名称
            </template>
            <input type="text" v-model="illustratorForm.name">
          </h-formitem>
          <h-formitem label="赞助地址" prop="sponsor">
            <template v-slot:label>
              <awesome-icon name="cny"></awesome-icon>
              赞助地址
            </template>
            <input type="text" v-model="illustratorForm.sponsor">
          </h-formitem>
          <h-formitem label="社交地址">
            <template v-slot:label>
              <awesome-icon name="external-link-square"></awesome-icon>
              社交地址
            </template>
            <input type="text" v-model="illustratorForm.home">
          </h-formitem>
          <h-formitem label="头像">
            <template v-slot:label>
              <awesome-icon name="user"></awesome-icon>
              ta的头像
            </template>
            <upload-image @selectedImage="selectedImage"></upload-image>
            <input type="text" v-show="false" v-model="illustratorForm.head">
          </h-formitem>
        </h-form>
      </div>
      <div slot="footer">
        <h-button color="primary" :loading="loadingAdd" @click="addIllustrator">添加</h-button>
        <button class="h-btn" @click="addIllustratorShow=false">取消</button>
      </div>
    </Modal>

    <Modal :closeOnMask="false" :hasCloseIcon="true" v-model="addIllustratorImageShow">
      <div slot="header">为 {{ addIllustratorImageItem.name }} 新增展示作品</div>
      <div class="tac">
        <div class="mb10">弹出上传成功后你可以点击图片继续选择新图片上传</div>
        <div class="mb10">不绑定画师无法保存图片</div>
        <upload-image @selectedImage="selectedImage"></upload-image>
      </div>
      <div slot="footer">
        <button class="h-btn" @click="saveIllustratorImage">将图片绑定画师</button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {GetIllustratorAll, ImageUpload, PostIllustratorAddArts, PostIllustratorNew} from "../assets/js/RequestAll"
import {ToLink} from "../assets/js/Common"
import {baseUrl} from "../assets/js/ConstList"
import AwesomeIcon from "@/components/AwesomeIcon";
import UploadImage from "@/components/UploadImage";

export default {
  name: "AddIllustrator",
  components: {UploadImage, AwesomeIcon},
  data() {
    return {
      baseUrl: baseUrl + '/images',
      list: [],
      loadingList: false,
      loadingAdd: false,
      data: {},
      imgFile: null,
      activeIllustrator: [0],
      activeIllustratorSave: null,
      addIllustratorShow: false,
      illustratorForm: {},
      illustratorFormRules: {
        rules: {
          name: {
            required: true,
            maxLen: 32
          },
          sponsor: {
            required: true,
            maxLen: 256
          }
        }
      },
      addIllustratorImageShow: false,
      addIllustratorImageItem: {},
      addIllustratorImageList: [],
      loadingInfo: false,
      illustratorInfo: {},
    }
  },
  mounted() {
    this.getAllIllustrator();
  },
  methods: {
    getIllustratorInfo(id) {
      // this.loadingInfo = true;
      // GetIllustrator().then(data => {
      //   debugger;
      //   if (data.code) {
      //     this.list.find(x => x.idd == id).info = data.data.data;
      //   } else {
      //     this.msgError(`详情获取失败：${data.text}`);
      //   }
      // })
    },
    getAllIllustrator() {
      this.loadingList = true;
      GetIllustratorAll().then(data => {
        this.loadingList = false;
        if (data.code) {
          this.list = data.data.data;
        }
      })
    },
    addIllustrator() {
      this.loadingAdd = true;
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        PostIllustratorNew(this.illustratorForm).then(data => {
          this.loadingAdd = false;
          if (data.code) {
            this.msgSuccess("成功");
            this.addIllustratorShow = false;
          } else {
            this.msgError(data.text);
          }
        })
      }
    },
    selectedImage(file) {
      ImageUpload(file).then(data => {
        if (data.code) {
          this.msgSuccess("图片上传成功")
          if (this.addIllustratorShow) {
            this.illustratorForm.head = data.data.data;
          }
          if (this.addIllustratorImageShow) {
            this.addIllustratorImageList.push(data.data.data);
          }
        } else {
          this.msgError("图片上传失败");
        }
      })
    },
    saveIllustratorImage() {
      PostIllustratorAddArts(this.addIllustratorImageItem.iid, JSON.stringify(this.addIllustratorImageList)).then(addImageData => {
        if (addImageData.code) {
          this.msgSuccess("为" + this.addIllustratorImageItem.name + "新增展示作品成功")
          this.addIllustratorImageList = [];
        }
        this.addIllustratorImageShow = false;
      })
    }
  },
}
</script>

<style lang="less">
.Illustrator-panel {
  width: 800px;
  margin: 20px auto;

  .h-panel-title {
    font-size: 30px !important;
  }

  .h-panel-body {
    padding: 0;
    margin-top: -1px;

    .h-collapse-item {
      .h-collapse-item-header {
        height: 60px;
        line-height: 60px;
        display: flex;
        align-items: center;

        .header-title-right {
          font-size: 20px;
        }

        i {
          margin-top: 0;
        }
      }

      &:last-of-type {
        border-bottom: 0;
      }
    }
  }


  .header-title {
    user-select: none;
    width: 95%;
    margin-left: 1%;
    display: inline-flex;

    img {
      width: 40px;
      border-radius: 50%;
    }
  }
}


</style>
