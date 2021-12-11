<template>
  <div>
    <el-card class="Illustrator-panel">
      <div slot="header" class="flex flex-between">
        <span class="h-panel-title">列表</span>
        <span class="h-panel-right" @click="addIllustratorShow = true">
          <awesome-icon
              class="pointer"
              fontSize="24px"
              title="添加画师"
              name="address-card"></awesome-icon></span>
      </div>
      <el-collapse v-model="activeIllustrator" :loading="loadingList">
        <el-collapse-item v-for="item in list" :loading="loadingInfo">
          <template slot='title'>
              <span class="header-title flex-between" @click="getIllustratorInfo(item)">
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
          <div v-if="item.info">
            <el-divider content-position="left">点赞的人</el-divider>
            {{ item.info.wants.length > 0 ? item.info.wants.join(',') : '还没有人给他点过赞' }}
            <el-divider content-position="left">部分图片预览</el-divider>
            <el-carousel height="300px">
              <el-carousel-item v-for="image in item.info.arts" :key="image.file">
                <div class="tac wb100">来源：{{ image.src ? image.src : "未填写来源" }}</div>
                <div class="tac margin10">
                  <el-image style="height: 200px;" :src="baseUrl+'/'+image.file" fit="scale-down"></el-image>
                </div>
              </el-carousel-item>
            </el-carousel>
            <div class="flex flex-end mt10">
              <el-button class="wb33" @click="ToLink('https://'+item.info.home)" :block="true">画师主页</el-button>
              <el-button class="wb33" @click="ToLink('https://'+item.sponser.sponsor)" :block="true">捐助页面</el-button>
              <el-button type="primary" class="wb33" @click="" :block="true">投他一票</el-button>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <el-dialog
        title="添加捐助对象"
        :visible.sync="addIllustratorShow"
        @close="getAllIllustrator()"
        width="30%">
      <el-form
          ref="form"
          label-width="90px"
          label-position="right"
          :model="illustratorForm"
          :rules="illustratorFormRules"
      >
        <el-form-item label="画师名称" prop="name">
          <el-input type="text" v-model="illustratorForm.name"></el-input>
        </el-form-item>
        <el-form-item label="赞助地址" prop="sponsor">
          <el-input type="text" v-model="illustratorForm.sponsor"></el-input>
        </el-form-item>
        <el-form-item label="社交地址">
          <el-input type="text" v-model="illustratorForm.home"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <upload-image @selectedImage="selectedImage"></upload-image>
          <input type="text" v-show="false" v-model="illustratorForm.head">
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addIllustratorShow = false">取消</el-button>
    <el-button type="primary" :loading="loadingAdd" @click="addIllustrator">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
        :title="'为'+  addIllustratorImageItem.name +'新增展示作品'"
        :visible.sync="addIllustratorImageShow"
        @close="getAllIllustrator(addIllustratorImageItem)"
        width="30%">
      <div class="tac">
        <div class="mb10">弹出上传成功后你可以点击图片继续选择新图片上传</div>
        <div class="mb10">不绑定画师无法保存图片</div>
        <el-divider>已上传图片列表</el-divider>
        <div class="mt5 mb5" v-if="addIllustratorImageFileList.length<=0">暂未上传任何图片</div>
        <el-image class="mt5 mb5" style="height: 100px;" v-for="image in addIllustratorImageFileList" :src="image"
                  fit="scale-down"></el-image>
        <el-divider>上传区域</el-divider>
        <upload-image ref="uploadImage" @selectedImage="selectedImage"></upload-image>
      </div>
      <div slot="footer">
        <el-button type="success" @click="saveIllustratorImage">将图片绑定画师</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetIllustratorAll,
  GetIllustrator,
  ImageUpload,
  PostIllustratorAddArts,
  PostIllustratorNew
} from "../assets/js/RequestAll"
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
      activeIllustrator: [],
      activeIllustratorSave: [],
      addIllustratorShow: false,
      illustratorForm: {},
      illustratorFormRules: {
        name: [
          {required: true, message: '请输入画师名称', trigger: 'blur'},
          {min: 0, max: 32, message: '长度在 3 到 10 个字', trigger: 'blur'}
        ],
        sponsor: [
          {required: true, message: '请输入捐助地址', trigger: 'blur'},
          {min: 3, max: 256, message: '长度在 3 到 10 个字', trigger: 'blur'}
        ]
      },
      addIllustratorImageShow: false,
      addIllustratorImageItem: {},
      addIllustratorImageList: [],
      addIllustratorImageFileList: [],
      loadingInfo: false,
      illustratorInfo: {},
    }
  },
  mounted() {
    this.getAllIllustrator();
  },
  methods: {
    getIllustratorInfo(item) {
      this.loadingInfo = true;
      let that = this;
      if (!item.info) {
        GetIllustrator(item.iid).then(data => {
          if (data.code) {
            let index = this.list.findIndex(x => x.iid == item.iid);
            that.list[index].info = data.data.data;
            this.loadingInfo = false
          } else {
            this.msgError(`详情获取失败：${data.text}`);
          }
        })
      }
    },
    getAllIllustrator() {
      this.loadingList = true;
      this.activeIllustrator = [];
      this.activeIllustratorSave = [];
      GetIllustratorAll().then(data => {
        this.loadingList = false;
        if (data.code) {
          this.list = data.data.data;
        }
      })
    },
    addIllustrator() {
      this.loadingAdd = true;
      this.$refs.form.validate(validResult => {
        if (validResult) {
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
      })
    },
    selectedImage(file) {
      ImageUpload(file).then(data => {
        if (data.code) {
          this.msgSuccess("图片上传成功")
          if (this.addIllustratorShow) {
            this.illustratorForm.head = data.data.data;
          }
          if (this.addIllustratorImageShow) {
            this.addIllustratorImageFileList.push(URL.createObjectURL(file.file));
            this.addIllustratorImageList.push(data.data.data);
            this.$refs.uploadImage.hasImg = false;
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
    font-size: 30px;
  }

  .el-card__body {
    padding: 0;
    margin-top: -1px;

    .el-collapse-item__header {
      padding: 0px 10px;
    }

    .el-collapse-item__content {
      padding: 20px;
    }
  }


  .header-title {
    user-select: none;
    width: 95%;
    display: inline-flex;

    img {
      width: 40px;
      border-radius: 50%;
    }
  }
}


</style>
