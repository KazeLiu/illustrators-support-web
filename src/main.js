import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import HeyUI from 'heyui';
import "heyui/themes/index.less";
import "./assets/style/common.css"
import "font-awesome/css/font-awesome.min.css"

Vue.config.productionTip = false

Vue.use(HeyUI);

Vue.prototype.msgSuccess = function (msg) {
  this.$Message({ showClose: true, text: msg, type: "success" });
}

Vue.prototype.msgError = function (msg) {
  this.$Message({ showClose: true, text: msg, type: "error" });
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
