// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import PlainText from './components/PlainText'
import BlipSelect from './components/BlipSelect'
// import './styles/common.scss'

Vue.config.productionTip = false

Vue.component('App', App)
Vue.component('plain-text', PlainText)
Vue.component('blip-select', BlipSelect)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
