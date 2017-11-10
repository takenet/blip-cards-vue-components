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
import WebLink from './components/WebLink'

Vue.config.productionTip = false

Vue.component('App', App)
Vue.component(BlipCard.name, BlipCard)
Vue.component(PlainText.name, PlainText)
Vue.component(MediaLink.name, MediaLink)
Vue.component(BlipSelect.name, BlipSelect)
Vue.component(DocumentSelect.name, DocumentSelect)
Vue.component(Collection.name, Collection)
Vue.component(WebLink.name, WebLink)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
