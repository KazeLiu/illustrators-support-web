<template>
  <div style="width: 400px;margin: auto;margin-top:25vh;">
    <div class="h-panel">
      <div class="h-panel-bar">
        <span class="h-panel-title">欢迎使用</span>
        <span class="h-panel-right">
          <h-switchlist :datas="loginTypeValue" @change="model = {};checkValidInRegister()"
                        v-model="loginType"></h-switchlist>
        </span>
      </div>
      <div class="h-panel-body">
        <h-form
            ref="form"
            :labelWidth="110"
            labelPosition="right"
            :model="model"
            :rules="UserRules"
        >
          <h-formitem label="用户名" v-if="loginType != 0" prop="name">
            <template v-slot:label>
              <awesome-icon name="user"></awesome-icon>
              用户名
            </template>
            <input type="text" v-model="model.name">
          </h-formitem>
          <h-formitem label="QQ" v-if="loginType != 2" prop="qq">
            <template v-slot:label>
              <awesome-icon name="qq"></awesome-icon>
              QQ
            </template>
            <input type="text" v-model="model.qq">
          </h-formitem>
          <h-formitem label="密码" prop="password">
            <template v-slot:label>
              <awesome-icon name="key"></awesome-icon>
              密码
            </template>
            <input type="password" v-model="model.password">
          </h-formitem>
          <h-formitem label="邀请码" v-if="loginType == 1" prop="invite_code">
            <template v-slot:label>
              <awesome-icon name="plane"></awesome-icon>
              邀请码
            </template>
            <input type="text" v-model="model.invite_code">
          </h-formitem>
          <h-button color="primary" v-if="loginType == 0" :loading="isLoading" @click="loginUser">用户登录</h-button>
          <h-button color="primary" v-if="loginType == 1" :loading="isLoading" @click="submit">注册</h-button>
          <h-button color="primary" v-if="loginType == 2" :loading="isLoading" @click="loginAdmin">管理员登录</h-button>
        </h-form>
      </div>
    </div>
  </div>
</template>

<script>
import {PostUserNew, PostAdminLogin, PostUserLogin} from "../assets/js/RequestAll"
import AwesomeIcon from "@/components/AwesomeIcon";

export default {
  name: "Home",
  components: {AwesomeIcon},
  mounted() {
    this.checkValidInRegister();
  },
  data() {
    return {
      model: {
        qq: "123456",
        password: "123456",
      },
      isLogin: false,
      loginType: 0,
      loginTypeValue: {0: '登录', 1: '注册', 2: '管理员登录'},
      isLoading: false,
      UserRules: {}
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

    checkValidInRegister() {
      if (this.loginType == 0) {
        this.UserRules = {
          rules: {
            qq: {
              required: true,
              type: 'number',
              maxLen: 12,
            },
            password: {
              required: true,
              maxLen: 256
            },
          }
        }
      } else if (this.loginType == 1) {
        this.UserRules = {
          rules: {
            name: {
              required: true,
              maxLen: 32
            },
            qq: {
              required: true,
              type: 'number',
              maxLen: 12,
            },
            password: {
              required: true,
              maxLen: 256
            },
            invite_code: {
              required: true,
              maxLen: 256,
            }
          }
        }
      } else if (this.loginType == 2) {
        this.UserRules = {
          rules: {
            name: {
              required: true,
              maxLen: 32
            },
            password: {
              required: true,
              maxLen: 256
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.h-panel-bar {
  text-align: left;
}
</style>
