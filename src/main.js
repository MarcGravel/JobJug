import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import 'material-icons/iconfont/material-icons.css'
import Vuetify from 'vuetify/lib'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

Vue.use(vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'md',
  },
})
