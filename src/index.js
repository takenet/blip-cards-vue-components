import VeeValidate, { Validator } from 'vee-validate'

// Components
import BlipCard from './components/BlipCard'
import PlainText from './components/PlainText'
import BlipSelect from './components/BlipSelect'
import DocumentSelect from './components/DocumentSelect'
import MediaLink from './components/MediaLink'
import Collection from './components/Collection'
import WebLink from './components/WebLink'
import Location from './components/Location'
import RequestLocation from './components/RequestLocation'
import Raw from './components/Raw'
import ChatState from './components/ChatState'
import Redirect from './components/Redirect'
import Ticket from './components/Ticket'
import BlipBubble from './components/BlipBubble'
import Editable from './components/Editable'

// Validators
import JsonValidator from './validators/jsonValidator'
import MimeValidator from './validators/mimeValidator'

// Filters
import SizeInBytesFilter from './filters/SizeInBytesFilter'
import LimitContentFilter from './filters/LimitContentFilter'
import FileIconFilter from './filters/FileIconFilter'

// Directives
import AutoExpandDirective from './directives/AutoExpandDirective'
import vChatScroll from './directives/vChatScroll'

function install(Vue) {
  let components = []

  Vue.config.productionTip = false

  components.push(Vue.component(BlipCard.name, BlipCard))
  components.push(Vue.component(Ticket.name, Ticket))
  components.push(Vue.component(Redirect.name, Redirect))
  components.push(Vue.component(PlainText.name, PlainText))
  components.push(Vue.component(MediaLink.name, MediaLink))
  components.push(Vue.component(BlipSelect.name, BlipSelect))
  components.push(Vue.component(DocumentSelect.name, DocumentSelect))
  components.push(Vue.component(Collection.name, Collection))
  components.push(Vue.component(WebLink.name, WebLink))
  components.push(Vue.component(Location.name, Location))
  components.push(Vue.component(RequestLocation.name, RequestLocation))
  components.push(Vue.component(Raw.name, Raw))
  components.push(Vue.component(ChatState.name, ChatState))
  components.push(Vue.component(BlipBubble.name, BlipBubble))

  Vue.component(Editable.name, Editable)

  Validator.extend('json', JsonValidator)
  Validator.extend('mime', MimeValidator)

  Vue.filter('sizeInBytesFilter', SizeInBytesFilter.filter)
  Vue.filter('limitContentFilter', LimitContentFilter.filter)
  Vue.filter('fileIconFilter', FileIconFilter.filter)

  Vue.directive('autoExpand', AutoExpandDirective)
  Vue.directive('chat-scroll', vChatScroll)

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
  WebLink,
  Location,
  RequestLocation,
  Raw,
  install
}
