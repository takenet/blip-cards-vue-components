import VeeValidate, { Validator } from 'vee-validate'
import Vue2TouchEvents from 'vue2-touch-events'

// Components
import BlipCard from './components/BlipCard'
import BlipGroupCard from './components/BlipGroupCard'
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

// Mixins
import Sanitize from './mixins/sanitizeHtml'

function install(Vue) {
  let components = []

  Vue.config.productionTip = false

  components.push(Vue.component(BlipCard.name, BlipCard))
  components.push(Vue.component(BlipGroupCard.name, BlipGroupCard))
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

  Vue.component(Editable.name, Editable)

  Validator.extend('json', JsonValidator)
  Validator.extend('mime', MimeValidator)

  Vue.filter('sizeInBytesFilter', SizeInBytesFilter.filter)
  Vue.filter('limitContentFilter', LimitContentFilter.filter)
  Vue.filter('fileIconFilter', FileIconFilter.filter)

  Vue.directive('autoExpand', AutoExpandDirective)
  Vue.directive('chat-scroll', vChatScroll)

  Vue.mixin({
    methods: {
      sanitize: Sanitize.mixin
    }
  })

  Vue.use(VeeValidate)
  Vue.use(Vue2TouchEvents)
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
