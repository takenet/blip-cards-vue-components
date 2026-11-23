import { MessageTypesConstants } from './MessageTypesConstants.js'

// The container comes in documentContainer or in content, depending on the envelope
function getContainer(content) {
  return content && (content.documentContainer || content.content)
}

function textOf(value) {
  if (typeof value === 'string') return value
  if (value && typeof value.text === 'string') return value.text
  if (value && value.summary && typeof value.summary.text === 'string') return value.summary.text

  return undefined
}

// The summary is in value.summary.text, or in conversation_context when it arrives inside a control_passed
function getAiContextText(content) {
  const container = getContainer(content)
  const value = container && container.value

  if (!value) return undefined

  if (container.type === MessageTypesConstants.MULTI_PARTNER_CONVERSATION_CONTROL_PASSED) {
    return textOf(value.conversation_context || value.conversationContext)
  }

  return textOf(value.summary)
}

// document: Lime envelope with the multi-partner-conversation type
// Both containers are specific enough with a summary text, so the IsContextIA metadata is not required
function isAiContextMessage(document) {
  const container = getContainer(document && document.content)

  if (!document || document.type !== MessageTypesConstants.MULTI_PARTNER_CONVERSATION || !container) {
    return false
  }

  const isContainerWithContext =
    container.type === MessageTypesConstants.MULTI_PARTNER_CONVERSATION_CONTEXT ||
    container.type === MessageTypesConstants.MULTI_PARTNER_CONVERSATION_CONTROL_PASSED

  return Boolean(isContainerWithContext && getAiContextText(document.content))
}

export {
  isAiContextMessage,
  getAiContextText
}
