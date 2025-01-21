import VeeValidate, { Validator } from 'vee-validate'
import VeeValidateMessagesEN from 'vee-validate/dist/locale/en'
import VeeValidateMessagesBR from 'vee-validate/dist/locale/pt_BR'
import Vue2TouchEvents from 'vue2-touch-events'

// Components
import ApplicationJSon from './components/ApplicationJSon'
import MenuList from './components/ApplicationJSon/MenuList'
import MenuListPrompt from './components/ApplicationJSon/MenuListPrompt'
import BlipCalls from './components/BlipCalls/BlipCalls'
import BlipCallsEndCard from './components/BlipCalls/BlipCallsEndCard'
import BlipCallsVoiceRequest from './components/BlipCalls/BlipCallsVoiceRequest'
import BlipCallsPermissionRequest from './components/BlipCalls/BlipCallsPermissionRequest'
import BlipCallsPermissionReply from './components/BlipCalls/BlipCallsPermissionReply'
import BlipCard from './components/BlipCard'
import BlipCardDate from './components/BlipCardDate'
import BlipCardMember from './components/BlipCardMember'
import BlipCardReply from './components/BlipCardReply'
import BlipGroupCard from './components/BlipGroupCard'
import BlipListCard from './components/BlipListCard'
import BlipSelect from './components/BlipSelect'
import ChatState from './components/ChatState'
import Collection from './components/Collection'
import Contact from './components/Contact'
import CopyAndPaste from './components/CopyAndPaste.vue'
import DocumentSelect from './components/DocumentSelect'
import Editable from './components/Editable'
import InteractiveButton from './components/InteractiveButton'
import LimeInput from './components/LimeInput'
import Location from './components/Location'
import MediaLink from './components/MediaLink'
import PlainText from './components/PlainText'
import Redirect from './components/Redirect'
import RequestLocation from './components/RequestLocation'
import Survey from './components/Survey'
import ThreadSummary from './components/ThreadSummary.vue'
import Ticket from './components/Ticket'
import UnsuportedContent from './components/UnsuportedContent'
import WebLink from './components/WebLink'

// Reply components
import InReplyToBase from './components/ReplyCard/InReplyTo/InReplyToBase'
import InReplyToText from './components/ReplyCard/InReplyTo/InReplyToText'
import InReplyToImage from './components/ReplyCard/InReplyTo/InReplyToImage.vue'
import InReplyToSticker from './components/ReplyCard/InReplyTo/InReplyToSticker.vue'
import InReplyToVideo from './components/ReplyCard/InReplyTo/InReplyToVideo.vue'
import InReplyToDocument from './components/ReplyCard/InReplyTo/InReplyToDocument.vue'
import InReplyToAudio from './components/ReplyCard/InReplyTo/InReplyToAudio.vue'
import InReplyToLocation from './components/ReplyCard/InReplyTo/InReplyToLocation.vue'
import InReplyToUnsupportedContent from './components/ReplyCard/InReplyTo/InReplyToUnsupportedContent.vue'
import RepliedBase from './components/ReplyCard/Replied/RepliedBase'
import RepliedWithMediaLink from './components/ReplyCard/Replied/RepliedWithMediaLink'
import RepliedWithText from './components/ReplyCard/Replied/RepliedWithText'
import ReplyCard from './components/ReplyCard/ReplyCard'
import InReplyToActiveMessage from './components/ReplyCard/InReplyTo/InReplyToActiveMessage.vue'

// Reaction components
import InReactionToBase from './components/ReactionCard/InReactionTo/InReactionToBase'
import InReactionToMediaLink from './components/ReactionCard/InReactionTo/InReactionToMediaLink'
import InReactionToText from './components/ReactionCard/InReactionTo/InReactionToText'
import ReactionBase from './components/ReactionCard/Reaction/ReactionBase'
import ReactionCard from './components/ReactionCard/ReactionCard'

// External components
import BlipExternal from './components/BlipExternal'

// Validators
import JsonValidator from './validators/jsonValidator'
import MimeValidator from './validators/mimeValidator'

// Filters
import FileIconFilter from './filters/FileIconFilter'
import LimitContentFilter from './filters/LimitContentFilter'
import SizeInBytesFilter from './filters/SizeInBytesFilter'

// Directives
import AutoExpandDirective from './directives/AutoExpandDirective'
import vChatScroll from './directives/vChatScroll'

// Mixins
import Sanitize from './mixins/sanitizeHtml'

// TemplateContent components
import PhoneNumberButton from './components/TemplateContent/Buttons/PhoneNumberButton'
import WebsiteButton from './components/TemplateContent/Buttons/WebsiteButton'
import MediaContent from './components/TemplateContent/MediaContent/MediaContent'
import TemplateContent from './components/TemplateContent/TemplateContent'

function install(Vue) {
  let components = []

  Vue.config.productionTip = false

  components.push(Vue.component(BlipCard.name, BlipCard))
  components.push(Vue.component(BlipGroupCard.name, BlipGroupCard))
  components.push(Vue.component(BlipListCard.name, BlipListCard))
  components.push(Vue.component(BlipCardReply.name, BlipCardReply))
  components.push(Vue.component(Ticket.name, Ticket))
  components.push(Vue.component(BlipCalls.name, BlipCalls))
  components.push(Vue.component(BlipCallsEndCard.name, BlipCallsEndCard))
  components.push(Vue.component(BlipCallsVoiceRequest.name, BlipCallsVoiceRequest))
  components.push(Vue.component(BlipCallsPermissionRequest.name, BlipCallsPermissionRequest))
  components.push(Vue.component(BlipCallsPermissionReply.name, BlipCallsPermissionReply))
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
  components.push(Vue.component(BlipCardMember.name, BlipCardMember))
  components.push(Vue.component(ApplicationJSon.name, ApplicationJSon))
  components.push(Vue.component(MenuListPrompt.name, MenuListPrompt))
  components.push(Vue.component(MenuList.name, MenuList))
  components.push(Vue.component(ThreadSummary.name, ThreadSummary))
  components.push(Vue.component(CopyAndPaste.name, CopyAndPaste))

  // Reply components
  components.push(Vue.component(ReplyCard.name, ReplyCard))

  // Replied
  components.push(Vue.component(RepliedBase.name, RepliedBase))
  components.push(Vue.component(RepliedWithText.name, RepliedWithText))
  components.push(Vue.component(RepliedWithMediaLink.name, RepliedWithMediaLink))

  // In Reply To
  components.push(Vue.component(InReplyToBase.name, InReplyToBase))
  components.push(Vue.component(InReplyToText.name, InReplyToText))
  components.push(Vue.component(InReplyToImage.name, InReplyToImage))
  components.push(Vue.component(InReplyToSticker.name, InReplyToSticker))
  components.push(Vue.component(InReplyToVideo.name, InReplyToVideo))
  components.push(Vue.component(InReplyToDocument.name, InReplyToDocument))
  components.push(Vue.component(InReplyToAudio.name, InReplyToAudio))
  components.push(Vue.component(InReplyToLocation.name, InReplyToLocation))
  components.push(Vue.component(InReplyToUnsupportedContent.name, InReplyToUnsupportedContent))
  components.push(Vue.component(InReplyToActiveMessage.name, InReplyToActiveMessage))

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
  components.push(Vue.component(MediaContent.name, MediaContent))

  // External component
  components.push(Vue.component(BlipExternal.name, BlipExternal))

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
  BlipExternal,
  install
}
