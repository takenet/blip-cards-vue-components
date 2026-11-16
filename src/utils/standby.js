import { MessageTypesConstants } from './MessageTypesConstants.js'

const STANDBY_SOURCE = 'standby'

// Inbound sends the container in documentContainer; outbound sends it in content
function getStandbyContainer(content) {
  return content && (content.documentContainer || content.content)
}

// document: Lime envelope with the multi-partner-conversation type
function isStandbyMessage(document) {
  const content = document && document.content
  const container = getStandbyContainer(content)

  return Boolean(
    document &&
    document.type === MessageTypesConstants.MULTI_PARTNER_CONVERSATION &&
    content &&
    content.source === STANDBY_SOURCE &&
    container &&
    container.type === MessageTypesConstants.MULTI_PARTNER_CONVERSATION_STANDBY
  )
}

// The direction comes from content.direction (the envelope from/to is always customer > caller)
function getStandbyDirection(content) {
  const direction = content && content.direction

  return direction === 'inbound' || direction === 'outbound' ? direction : undefined
}

// Converts the DocumentContainer (type/value) to the type/content format used by BlipCard
function getStandbyInnerDocument(content) {
  const container = getStandbyContainer(content)
  const inner = container && container.value && container.value.content

  if (!inner || !inner.type) return undefined

  if (inner.type === MessageTypesConstants.MULTI_PARTNER_CONVERSATION_TEMPLATE) {
    return toTemplateDocument(inner.value)
  }

  return { type: inner.type, content: inner.value }
}

// message.template holds the sent parameters; template holds the definition (BODY, BUTTONS...)
function toTemplateDocument(value) {
  const { message, template } = value || {}

  if (!message || !message.template || !template) return undefined

  return {
    type: 'template',
    content: {
      type: 'template-content',
      template: message.template,
      templateContent: template
    }
  }
}

export {
  isStandbyMessage,
  getStandbyDirection,
  getStandbyInnerDocument
}
