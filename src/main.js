// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import NewApp from './NewApp'
import App from './App'
import blipCards from './index'
import { applyPolyfills, defineCustomElements } from 'blip-ds/loader'
import VueRouter from 'vue-router'

blipCards.install(Vue)

Vue.config.productionTip = false

Vue.config.ignoredElements = [/bds-\w*/]

applyPolyfills().then(() => {
  defineCustomElements(window)
})

Vue.use(VueRouter)

const routes = [
  { path: '/', component: App },
  { path: '/new', component: NewApp }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<router-view/>',
  components: {
    App,
    NewApp
  }
})
