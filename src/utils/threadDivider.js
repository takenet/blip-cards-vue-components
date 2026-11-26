import { MessageTypesConstants } from './MessageTypesConstants.js'

const HANDOVER_SOURCE = 'messaging_handovers'
const AI_AGENT_ROLE = 'ai_agent'
const META_BUSINESS_AGENT_ROLE = 'meta_business_agent'

const THREAD_DIVIDER_VARIATION = {
  CONTROL_TAKEN: 'controlTaken',
  CONTROL_PASSED: 'controlPassed',
  CONTROL_TAKEN_META_AGENT: 'controlTakenMetaAgent',
  CONTROL_PASSED_META_AGENT: 'controlPassedMetaAgent'
}

// The container comes in documentContainer or in content, depending on the envelope
function getContainer(content) {
  return content && (content.documentContainer || content.content)
}

// document: Lime envelope with the multi-partner-conversation type
// Taken goes to the Meta agent when the new owner is the AI agent; passed comes from it when the previous owner was
function getThreadDividerVariation(document) {
  const content = document && document.content
  const container = getContainer(content)

  if (
    !document ||
    document.type !== MessageTypesConstants.MULTI_PARTNER_CONVERSATION ||
    !content ||
    content.source !== HANDOVER_SOURCE ||
    !container
  ) {
    return undefined
  }

  const value = container.value || {}

  if (container.type === MessageTypesConstants.MULTI_PARTNER_CONVERSATION_CONTROL_TAKEN) {
    return value.new_owner_role === AI_AGENT_ROLE
      ? THREAD_DIVIDER_VARIATION.CONTROL_TAKEN_META_AGENT
      : THREAD_DIVIDER_VARIATION.CONTROL_TAKEN
  }

  if (container.type === MessageTypesConstants.MULTI_PARTNER_CONVERSATION_CONTROL_PASSED) {
    const fromMetaAgent =
      value.previous_owner_app_role === META_BUSINESS_AGENT_ROLE || value.previous_owner_role === AI_AGENT_ROLE

    return fromMetaAgent
      ? THREAD_DIVIDER_VARIATION.CONTROL_PASSED_META_AGENT
      : THREAD_DIVIDER_VARIATION.CONTROL_PASSED
  }

  return undefined
}

function isThreadDividerMessage(document) {
  return Boolean(getThreadDividerVariation(document))
}

export {
  THREAD_DIVIDER_VARIATION,
  getThreadDividerVariation,
  isThreadDividerMessage
}
