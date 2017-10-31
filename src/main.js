// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import PlainText from './components/PlainText'

Vue.config.productionTip = false

Vue.component('App', App)
var teste = Vue.component('plain-text', PlainText)

console.log(teste)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
