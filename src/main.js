// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import BlipCard from './components/BlipCard'
import PlainText from './components/PlainText'
import BlipSelect from './components/BlipSelect'
import DocumentSelect from './components/DocumentSelect'
import MediaLink from './components/MediaLink'
import Collection from './components/Collection'

Vue.config.productionTip = false

Vue.component('App', App)
Vue.component('blip-card', BlipCard)
Vue.component('plain-text', PlainText)
Vue.component('media-link', MediaLink)
Vue.component('blip-select', BlipSelect)
Vue.component('document-select', DocumentSelect)
Vue.component('collection', Collection)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
