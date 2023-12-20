import VeeValidate, { Validator } from 'vee-validate'
import VeeValidateMessagesBR from 'vee-validate/dist/locale/pt_BR'
import VeeValidateMessagesEN from 'vee-validate/dist/locale/en'
import Vue2TouchEvents from 'vue2-touch-events'

// Components
import BlipCard from './components/BlipCard'
import BlipGroupCard from './components/BlipGroupCard'
import BlipListCard from './components/BlipListCard'
import PlainText from './components/PlainText'
import BlipSelect from './components/BlipSelect'
import DocumentSelect from './components/DocumentSelect'
import MediaLink from './components/MediaLink'
import Collection from './components/Collection'
import WebLink from './components/WebLink'
import Location from './components/Location'
import RequestLocation from './components/RequestLocation'
import LimeInput from './components/LimeInput'
import UnsuportedContent from './components/UnsuportedContent'
import ChatState from './components/ChatState'
import Redirect from './components/Redirect'
import Ticket from './components/Ticket'
import BlipCalls from './components/BlipCalls'
import BlipCallsEndCard from './components/BlipCallsEndCard'
import Editable from './components/Editable'
import Survey from './components/Survey'
import Contact from './components/Contact'
import InteractiveButton from './components/InteractiveButton'
import BlipCardDate from './components/BlipCardDate'
import ApplicationJSon from './components/ApplicationJSon'
import MenuListPrompt from './components/ApplicationJSon/MenuListPrompt'
import MenuList from './components/ApplicationJSon/MenuList'
import ThreadSummary from './components/ThreadSummary.vue'

// Reply components
import ReplyCard from './components/ReplyCard/ReplyCard'
import RepliedBase from './components/ReplyCard/Replied/RepliedBase'
import RepliedWithText from './components/ReplyCard/Replied/RepliedWithText'
import RepliedWithMediaLink from './components/ReplyCard/Replied/RepliedWithMediaLink'
import InReplyToBase from './components/ReplyCard/InReplyTo/InReplyToBase'
import InReplyToText from './components/ReplyCard/InReplyTo/InReplyToText'

// Reaction components
import ReactionCard from './components/ReactionCard/ReactionCard'
import ReactionBase from './components/ReactionCard/Reaction/ReactionBase'
import InReactionToBase from './components/ReactionCard/InReactionTo/InReactionToBase'
import InReactionToText from './components/ReactionCard/InReactionTo/InReactionToText'
import InReactionToMediaLink from './components/ReactionCard/InReactionTo/InReactionToMediaLink'

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

// TemplateContent components
import TemplateContent from './components/TemplateContent/TemplateContent'
import WebsiteButton from './components/TemplateContent/Buttons/WebsiteButton'
import PhoneNumberButton from './components/TemplateContent/Buttons/PhoneNumberButton'

function install(Vue) {
  let components = []

  Vue.config.productionTip = false

  components.push(Vue.component(BlipCard.name, BlipCard))
  components.push(Vue.component(BlipGroupCard.name, BlipGroupCard))
  components.push(Vue.component(BlipListCard.name, BlipListCard))
  components.push(Vue.component(Ticket.name, Ticket))
  components.push(Vue.component(BlipCalls.name, BlipCalls))
  components.push(Vue.component(BlipCallsEndCard.name, BlipCallsEndCard))
  components.push(Vue.component(Redirect.name, Redirect))
  components.push(Vue.component(PlainText.name, PlainText))
  components.push(Vue.component(MediaLink.name, MediaLink))
  components.push(Vue.component(BlipSelect.name, BlipSelect))
  components.push(Vue.component(DocumentSelect.name, DocumentSelect))
  components.push(Vue.component(Collection.name, Collection))
  components.push(Vue.component(WebLink.name, WebLink))
  components.push(Vue.component(Location.name, Location))
  components.push(Vue.component(RequestLocation.name, RequestLocation))
  components.push(Vue.component(LimeInput.name, LimeInput))
  components.push(Vue.component(UnsuportedContent.name, UnsuportedContent))
  components.push(Vue.component(ChatState.name, ChatState))
  components.push(Vue.component(Survey.name, Survey))
  components.push(Vue.component(Contact.name, Contact))
  components.push(Vue.component(InteractiveButton.name, InteractiveButton))
  components.push(Vue.component(BlipCardDate.name, BlipCardDate))
  components.push(Vue.component(ApplicationJSon.name, ApplicationJSon))
  components.push(Vue.component(MenuListPrompt.name, MenuListPrompt))
  components.push(Vue.component(MenuList.name, MenuList))
  components.push(Vue.component(ThreadSummary.name, ThreadSummary))

  // Reply components
  components.push(Vue.component(ReplyCard.name, ReplyCard))
  // Replied
  components.push(Vue.component(RepliedBase.name, RepliedBase))
  components.push(Vue.component(RepliedWithText.name, RepliedWithText))
  components.push(Vue.component(RepliedWithMediaLink.name, RepliedWithMediaLink))
  // In Reply To
  components.push(Vue.component(InReplyToBase.name, InReplyToBase))
  components.push(Vue.component(InReplyToText.name, InReplyToText))

  // Reaction components
  components.push(Vue.component(ReactionCard.name, ReactionCard))
  components.push(Vue.component(ReactionBase.name, ReactionBase))
  components.push(Vue.component(InReactionToBase.name, InReactionToBase))
  components.push(Vue.component(InReactionToText.name, InReactionToText))
  components.push(Vue.component(InReactionToMediaLink.name, InReactionToMediaLink))

  // TemplateContent components
  components.push(Vue.component(TemplateContent.name, TemplateContent))
  components.push(Vue.component(WebsiteButton.name, WebsiteButton))
  components.push(Vue.component(PhoneNumberButton.name, PhoneNumberButton))

  Vue.component(Editable.name, Editable)

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

  Validator.extend('json', JsonValidator)
  Validator.extend('mime', MimeValidator)
  Validator.localize({
    'pt_BR': VeeValidateMessagesBR,
    'en': VeeValidateMessagesEN
  })

  const getUserLanguage = () => navigator.language.startsWith('en') ? 'en' : 'pt_BR'

  Vue.use(VeeValidate, {
    locale: getUserLanguage()
  })

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
  TemplateContent,
  UnsuportedContent,
  install
}
