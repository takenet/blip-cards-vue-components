// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import blipCards from './index'
import { applyPolyfills, defineCustomElements } from 'blip-ds/loader'

blipCards.install(Vue)

Vue.config.productionTip = false

Vue.config.ignoredElements = [/bds-\w*/]

applyPolyfills().then(() => {
  defineCustomElements(window)
})
Vue.component('App', App)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
