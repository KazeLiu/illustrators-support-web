import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import "./assets/style/common.css"
import "font-awesome/css/font-awesome.min.css"

Vue.config.productionTip = false

Vue.use(ElementUI);


Vue.prototype.msgInfo = function (msg) {
  this.$message({  message: msg, type: "info" });
}

Vue.prototype.msgSuccess = function (msg) {
  this.$message({  message: msg, type: "success" });
}

Vue.prototype.msgError = function (msg) {
  this.$message({  message: msg, type: "error" });
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
