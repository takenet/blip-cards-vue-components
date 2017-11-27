import VeeValidate, { Validator } from 'vee-validate'

import BlipCard from './components/BlipCard'
import PlainText from './components/PlainText'
import BlipSelect from './components/BlipSelect'
import DocumentSelect from './components/DocumentSelect'
import MediaLink from './components/MediaLink'
import Collection from './components/Collection'
import WebLink from './components/WebLink'
import Raw from './components/Raw'

import Editable from './components/Editable'

import JsonValidator from './validators/jsonValidator'
import MimeValidator from './validators/mimeValidator'

import Bluebird from 'bluebird'

global.Promise = Bluebird
window.Promise = Bluebird

function install (Vue) {
  let components = []

  components.push(Vue.component(BlipCard.name, BlipCard))
  components.push(Vue.component(PlainText.name, PlainText))
  components.push(Vue.component(MediaLink.name, MediaLink))
  components.push(Vue.component(BlipSelect.name, BlipSelect))
  components.push(Vue.component(DocumentSelect.name, DocumentSelect))
  components.push(Vue.component(Collection.name, Collection))
  components.push(Vue.component(WebLink.name, WebLink))
  components.push(Vue.component(Raw.name, Raw))

  Vue.component(Editable.name, Editable)

  Validator.extend('json', JsonValidator)
  Validator.extend('mime', MimeValidator)

  Vue.use(VeeValidate)
  return components
}

export default {
  BlipCard,
  PlainText,
  BlipSelect,
  DocumentSelect,
  MediaLink,
  Collection,
  Raw,
  install
}
