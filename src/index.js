import VeeValidate from 'vee-validate'

import BlipCard from './components/BlipCard'
import PlainText from './components/PlainText'
import BlipSelect from './components/BlipSelect'
import DocumentSelect from './components/DocumentSelect'
import MediaLink from './components/MediaLink'
import Collection from './components/Collection'
import WebLink from './components/WebLink'

function install (Vue) {
  let components = []

  components.push(Vue.component(BlipCard.name, BlipCard))
  components.push(Vue.component(PlainText.name, PlainText))
  components.push(Vue.component(MediaLink.name, MediaLink))
  components.push(Vue.component(BlipSelect.name, BlipSelect))
  components.push(Vue.component(DocumentSelect.name, DocumentSelect))
  components.push(Vue.component(Collection.name, Collection))
  components.push(Vue.component(WebLink.name, WebLink))

  Vue.use(VeeValidate)

  return components
}

export {
  BlipCard,
  PlainText,
  BlipSelect,
  DocumentSelect,
  MediaLink,
  Collection,
  install
}

export default install
