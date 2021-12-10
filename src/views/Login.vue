<template>
  <div style="width: 400px;margin: auto;margin-top:25vh;">

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>欢迎使用</span>
        <span class="fr">
         <el-button-group>
            <el-button size="mini" :type="index == loginType?'success':'primary'" v-for="(item,index) in loginTypeValue"
                       @click="checkValidInRegister(index)">{{ item }}</el-button>
          </el-button-group>
       </span>
      </div>
      <el-form
          ref="form"
          label-width="70px"
          :model="model"
          label-position="right"
          :rules="userRules"
      >
        <el-form-item label="用户名" v-if="loginType != 0" prop="name">
          <el-input type="text" v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="QQ" v-if="loginType != 2" prop="qq">
          <el-input type="text" v-model.number="model.qq"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="model.password"></el-input>
        </el-form-item>
        <el-form-item label="邀请码" v-if="loginType == 1" prop="invite_code">
          <el-input type="text" v-model="model.invite_code"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button color="primary" v-if="loginType == 0" :loading="isLoading" @click="loginUser">用户登录</el-button>
          <el-button color="primary" v-if="loginType == 1" :loading="isLoading" @click="submit">注册</el-button>
          <el-button color="primary" v-if="loginType == 2" :loading="isLoading" @click="loginAdmin">管理员登录</el-button>
        </el-form-item>

      </el-form>
    </el-card>
  </div>
</template>

<script>
import {PostUserNew, PostAdminLogin, PostUserLogin} from "../assets/js/RequestAll"
import AwesomeIcon from "@/components/AwesomeIcon";

export default {
  name: "Home",
  components: {AwesomeIcon},
  mounted() {
    this.checkValidInRegister(0);
  },
  data() {
    return {
      model: {
        qq: 123456,
        password: "123456",
      },
      isLogin: false,
      loginType: 0,
      loginTypeValue: ['登录', '注册', '管理员登录'],
      isLoading: false,
      userRules: {}
    }
  },
  methods: {
    async submit() {
      this.isLoading = true;
      let data = await PostUserNew(this.model);
      this.ProcessingResult(data, "注册成功");
    },
    async loginUser() {
      this.isLoading = true;
      let data = await PostUserLogin(this.model);
      this.ProcessingResult(data, "用户登录成功");
    },

    async loginAdmin() {
      this.isLoading = true;
      let data = await PostAdminLogin(this.model);
      this.ProcessingResult(data, "管理员登录成功");
    },

    ProcessingResult(data, name) {
      this.isLoading = false;
      if (!data.code) {
        this.msgError(data.text);
      } else {
        if (this.loginType == 1) {
          this.msgSuccess("注册成功。请重新登录一次");
        } else {
          this.msgSuccess(name);
          this.$router.push("Home");
        }
      }
    },

    checkValidInRegister(type) {
      if (type != undefined) {
        this.loginType = type;
        this.$refs.form.resetFields();
      }
      this.model = {};
      if (this.loginType == 0) {
        this.userRules = {
          qq: [
            {required: true, message: '请输入QQ号', trigger: 'blur'},
            {type: 'integer',min: 0, max: 999999999999, message: 'QQ必须为数字', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 3, max: 256, message: '长度在 3 到 256 个字', trigger: 'blur'}
          ]
        }
      } else if (this.loginType == 1) {
        this.userRules = {
          name: [
            {required: true, message: '请输入昵称', trigger: 'blur'},
            {min: 3, max: 32, message: '长度在 3 到 10 个字', trigger: 'blur'}
          ],
          qq: [
            {required: true, message: '请输入QQ号', trigger: 'blur'},
            {type: 'integer',min: 0, max: 999999999999, message: 'QQ必须为数字', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 3, max: 256, message: '长度在 3 到 256 个字', trigger: 'blur'}
          ],
          invite_code: [
            {required: true, message: '请输入邀请码', trigger: 'blur'}
          ],
        }
      } else if (this.loginType == 2) {
        this.userRules = {
          name: [
            {required: true, message: '请输入昵称', trigger: 'blur'},
            {min: 3, max: 32, message: '长度在 3 到 10 个字', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 3, max: 256, message: '长度在 3 到 256 个字', trigger: 'blur'}
          ],
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-card__header {
  .clearfix {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
