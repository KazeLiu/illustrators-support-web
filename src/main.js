import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import HeyUI from 'heyui';
import "heyui/themes/index.less";

Vue.config.productionTip = false
Vue.use(HeyUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
