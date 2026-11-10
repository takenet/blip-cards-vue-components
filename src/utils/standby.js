import { MessageTypesConstants } from './MessageTypesConstants.js'

const STANDBY_SOURCE = 'standby'

// document: envelope Lime com type multi-partner-conversation
function isStandbyMessage(document) {
  const content = document && document.content

  return Boolean(
    document &&
    document.type === MessageTypesConstants.MULTI_PARTNER_CONVERSATION &&
    content &&
    content.source === STANDBY_SOURCE &&
    content.documentContainer &&
    content.documentContainer.type === MessageTypesConstants.MULTI_PARTNER_CONVERSATION_STANDBY
  )
}

// A direção vem de content.direction (o from/to do envelope é sempre cliente > caller)
function getStandbyDirection(content) {
  const direction = content && content.direction

  return direction === 'inbound' || direction === 'outbound' ? direction : undefined
}

// Converte o DocumentContainer (type/value) para o formato type/content usado pelo BlipCard
function getStandbyInnerDocument(content) {
  const container = content && content.documentContainer
  const inner = container && container.value && container.value.content

  if (!inner || !inner.type) return undefined

  return { type: inner.type, content: inner.value }
}

export {
  isStandbyMessage,
  getStandbyDirection,
  getStandbyInnerDocument
}
