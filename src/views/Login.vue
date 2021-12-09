<template>
  <div style="width: 400px;margin: auto;margin-top:25vh;">
    <div class="h-panel">
      <div class="h-panel-bar">
        <span class="h-panel-title">欢迎使用</span>
        <span class="h-panel-right">
          <h-switchlist :datas="loginTypeValue" @change="model = {}" v-model="loginType"></h-switchlist>
        </span>
      </div>
      <div class="h-panel-body">
        <h-form
            ref="form"
            :labelWidth="110"
            labelPosition="right"
            :model="model"
        >
          <h-formitem label="用户名" prop="name">
            <template v-slot:label><i class="h-icon-user"></i> 用户名</template>
            <input type="text" v-model="model.name">
          </h-formitem>
          <h-formitem label="QQ" v-if="loginType == 1" prop="name">
            <template v-slot:label><i class="h-icon-link"></i> QQ</template>
            <input type="number" v-model="model.qq">
          </h-formitem>
          <h-formitem label="密码" icon="h-icon-complete" prop="password">
            <input type="password" v-model="model.password">
          </h-formitem>
          <h-button color="primary" v-if="loginType == 0" :loading="isLoading" @click="submit">用户登录</h-button>
          <h-button color="primary" v-if="loginType == 1" :loading="isLoading" @click="submit">注册</h-button>
          <h-button color="primary" v-if="loginType == 2" :loading="isLoading" @click="loginAdmin">管理员登录</h-button>
        </h-form>
      </div>
    </div>
  </div>
</template>

<script>
import {PostUserNew, PostAdminLogin} from "../assets/js/RequestAll"

export default {
  name: "Home",
  mounted() {
  },
  data() {
    return {
      model: {
        name: "Admin",
        password: "wyq020222"
      },
      isLogin: false,
      loginType: 2,
      loginTypeValue: {0: '登录', 1: '注册', 2: '管理员登录'},
      isLoading: false,
    }
  },
  methods: {
    submit() {
      this.isLoading = true;
      let data = PostUserNew(this.model);
      if (data.code) {
        data.data.then(data => {
          this.$Message({
            type: 'success',
            text: '成功'
          });
        }).catch(data => {
          this.$Message({
            type: 'error',
            text: '未知错误'
          });
        }).finally(_ => {
          this.isLoading = false;
        })
      }
    },
    loginUser() {

    },
    loginAdmin() {
      let data = PostAdminLogin(this.model);
      if (data.code) {
        data.data.then(data => {
          if (!data.err) {
            this.$Message({
              type: 'success',
              text: '管理员登录成功'
            });
            this.$router.push("Home");
          }
        }).catch(data => {
          this.$Message({
            type: 'error',
            text: '未知错误'
          });
        }).finally(_ => {
          this.isLoading = false;
        })
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
