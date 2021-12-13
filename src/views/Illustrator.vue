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
      <el-collapse v-model="activeIllustrator" v-loading="loadingList">
        <el-collapse-item v-for="item in list" v-loading="loadingInfo">
          <template slot='title'>
              <span class="header-title flex-between" @click="getIllustratorInfo(item)">
                <span class="flex flex-center">
                  <img :src="baseUrl+'/'+item.head">
                  <span class="ml10 fs18">{{item.name}}</span>
                  <el-tag class="ml10" type="success"><awesome-icon name="thumbs-up"></awesome-icon> {{item.wconts}}</el-tag>
                </span>
                <span class="header-title-right"
                      @click.stop="addIllustratorImageItem = item;addIllustratorImageShow = true">
                  <awesome-icon title="为ta新增展示作品" name="file-image-o"></awesome-icon>
                </span>
              </span>
          </template>
          <div v-if="item.info">
            <el-divider content-position="left">点赞的人</el-divider>
            <div class="wb100 tac"> {{
                item.info.wants.length > 0 ? `${item.info.wants.map(x => x.name.trim()).join(',')}` : '还没有人给他点过赞'
              }}
            </div>
            <el-divider content-position="left">部分作品预览</el-divider>
            <div class="image-list-area" v-if="item.info.arts&&item.info.arts.length>0">
              <div v-for="image in item.info.arts">
                <el-card class="margin5">
                  <div class="arts-area tac margin10">
                    <el-image class="arts" :src="baseUrl+'/'+image.file" fit="contain"></el-image>
                    <div class="arts-info">{{ image.src ? image.src : "未填写来源" }}</div>
                  </div>
                </el-card>
              </div>
            </div>
            <div v-else class="wb100 tac">还没有人为ta上传作品，点击右侧图标上传图片吧！</div>
            <div class="flex flex-end mt10">
              <el-button @click="ToLink('https://'+item.info.home)" :block="true">画师主页</el-button>
              <el-button @click="ToLink('https://'+item.sponser.sponsor)" :block="true">捐助页面</el-button>
              <el-button type="primary" v-if="item.isLike" :disabled="true" class="wb33" @click="like(item)"
                         :block="true">你已经给他投票了
              </el-button>
              <el-button type="primary" v-else class="wb33" @click="like(item)" :block="true">投他一票</el-button>

            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <el-dialog
        title="添加捐助对象"
        :visible.sync="addIllustratorShow"
        @close="getAllIllustrator()"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
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
          <upload-image loadUpBtnText="选择头像" @selectedImage="selectedImageHeadList" :max="1"></upload-image>
          <input type="text" v-show="false" v-model="illustratorForm.head">
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addIllustratorShow = false">取消</el-button>
    <el-button type="primary" :loading="loadingAdd" @click="addIllustrator">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :title="'为'+  addIllustratorImageItem.name +'新增展示作品'"
        :visible.sync="addIllustratorImageShow"
        @close="getAllIllustrator(addIllustratorImageItem)"
        width="30%">
      <div class="tac" v-loading="">
        <upload-image ref="uploadImage" loadUpBtnText="为ta推荐这些图片" @selectedImage="selectedImageList"></upload-image>
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
  PostIllustratorNew, ImageUploads, PostIllustrator
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
      userInfo: JSON.parse(localStorage.userInfo),
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
      addIllustratorImageItem: {},
      addIllustratorImageShow: false,
      loadingInfo: false,
      illustratorInfo: {},
    }
  },
  mounted() {
    this.getAllIllustrator();
  },
  methods: {
    getIllustratorInfo(item) {
      let that = this;
      if (!item.info) {
        this.loadingInfo = true;
        GetIllustrator(item.iid).then(data => {
          if (data.code) {
            let index = this.list.findIndex(x => x.iid == item.iid);
            that.list[index].info = data.data.data;
            that.list[index].isLike = that.list[index].info.wants.findIndex(x => x.qq == that.userInfo.qq) >= 0 ? true : false
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

    // 投票
    like(item) {
      PostIllustrator(item.iid).then(data => {
        if (data.code) {
          this.$set(item, 'isLike', true);
          this.msgSuccess("Like成功!");
        } else {
          this.msgError(data.text);
        }
      })
    },

    // 绑定头像
    selectedImageHeadList(data) {
      this.illustratorForm.head = data[0].file;
    },
    // 绑定展示作品
    selectedImageList(list) {
      this.addIllustratorImageShow = false;
      this.msgInfo("图片后台上传中，请勿刷新页面")
      // 上传图片
      ImageUploads(list).then(data => {
        if (data.code) {
          this.msgSuccess("图片上传成功，开始绑定画师")
          // 上传绑定
          PostIllustratorAddArts(this.addIllustratorImageItem.iid,
              JSON.stringify(data.data.map(x => x.data))).then(addImageData => {
            if (addImageData.code) {
              this.msgSuccess("为" + this.addIllustratorImageItem.name + "新增展示作品成功")
            } else {
              this.msgError("画师绑定失败");
            }
          })
        } else {
          this.msgError("图片上传失败");
        }
      })


    }
  },
}
</script>

<style lang="less">
.Illustrator-panel {
  width: 1000px;
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

    .header-title-right {
      font-size: 20px;
    }

    img {
      width: 40px;
      border-radius: 50%;
    }
  }

  .image-list-area {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;

    .arts-area {
      .arts {
        width: 200px;
        height: 200px;
      }
    }
  }
}


</style>
