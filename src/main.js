// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import blipCards from './index'

import Vue2TouchEvents from 'vue2-touch-events'
Vue.use(Vue2TouchEvents)

blipCards.install(Vue)

Vue.config.productionTip = false

Vue.component('App', App)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
