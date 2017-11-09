import BlipCard from './components/BlipCard'
import PlainText from './components/PlainText'
import BlipSelect from './components/BlipSelect'
import DocumentSelect from './components/DocumentSelect'
import MediaLink from './components/MediaLink'
import Collection from './components/Collection'

function install (Vue) {
  let components = []

  components.push(Vue.component('blip-card', BlipCard))
  components.push(Vue.component('plain-text', PlainText))
  components.push(Vue.component('blip-select', BlipSelect))
  components.push(Vue.component('media-link', MediaLink))
  components.push(Vue.component('document-select', DocumentSelect))
  components.push(Vue.component('collection', Collection))

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
