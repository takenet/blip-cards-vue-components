import {
  THREAD_DIVIDER_VARIATION,
  getThreadDividerVariation,
  isThreadDividerMessage
} from '../../../src/utils/threadDivider'

const TAKEN_TYPE = 'application/vnd.iris.multi-partner-conversation-control-taken+json'
const PASSED_TYPE = 'application/vnd.iris.multi-partner-conversation-control-passed+json'

const build = (containerType, value, overrides = {}) => ({
  type: 'application/vnd.iris.multi-partner-conversation+json',
  content: {
    direction: 'outbound',
    sender: 'bot',
    recipient: '5531999998888',
    source: 'messaging_handovers',
    documentContainer: { type: containerType, value }
  },
  ...overrides
})

describe('threadDivider utils', () => {
  describe('getThreadDividerVariation', () => {
    it('returns controlTaken for an external provider', () => {
      const doc = build(TAKEN_TYPE, { new_owner_role: 'external_provider' })
      expect(getThreadDividerVariation(doc)).to.equal(THREAD_DIVIDER_VARIATION.CONTROL_TAKEN)
    })

    it('returns controlTaken when the new owner role is missing', () => {
      expect(getThreadDividerVariation(build(TAKEN_TYPE, {}))).to.equal(THREAD_DIVIDER_VARIATION.CONTROL_TAKEN)
      expect(getThreadDividerVariation(build(TAKEN_TYPE, undefined))).to.equal(THREAD_DIVIDER_VARIATION.CONTROL_TAKEN)
    })

    it('returns controlTakenMetaAgent when the new owner is the AI agent', () => {
      const doc = build(TAKEN_TYPE, { new_owner_role: 'ai_agent' })
      expect(getThreadDividerVariation(doc)).to.equal(THREAD_DIVIDER_VARIATION.CONTROL_TAKEN_META_AGENT)
    })

    it('returns controlPassed for an external provider', () => {
      const doc = build(PASSED_TYPE, { previous_owner_role: 'external_provider', previous_owner_app_role: 'other' })
      expect(getThreadDividerVariation(doc)).to.equal(THREAD_DIVIDER_VARIATION.CONTROL_PASSED)
    })

    it('returns controlPassedMetaAgent by the previous app role or owner role', () => {
      const byAppRole = build(PASSED_TYPE, { previous_owner_app_role: 'meta_business_agent' })
      const byOwnerRole = build(PASSED_TYPE, { previous_owner_role: 'ai_agent' })
      expect(getThreadDividerVariation(byAppRole)).to.equal(THREAD_DIVIDER_VARIATION.CONTROL_PASSED_META_AGENT)
      expect(getThreadDividerVariation(byOwnerRole)).to.equal(THREAD_DIVIDER_VARIATION.CONTROL_PASSED_META_AGENT)
    })

    it('reads the container under content.content as well', () => {
      const doc = build(TAKEN_TYPE, { new_owner_role: 'ai_agent' })
      doc.content = { source: 'messaging_handovers', content: doc.content.documentContainer }
      expect(getThreadDividerVariation(doc)).to.equal(THREAD_DIVIDER_VARIATION.CONTROL_TAKEN_META_AGENT)
    })

    it('keeps the divider variation when the control passed carries conversation_context', () => {
      const doc = build(PASSED_TYPE, {
        previous_owner_app_role: 'meta_business_agent',
        conversation_context: { type: 'summary', summary: { text: 'Summary' } }
      })
      expect(getThreadDividerVariation(doc)).to.equal(THREAD_DIVIDER_VARIATION.CONTROL_PASSED_META_AGENT)
    })

    it('does not require the control metadata', () => {
      expect(getThreadDividerVariation(build(TAKEN_TYPE, {}, { metadata: {} }))).to.equal(THREAD_DIVIDER_VARIATION.CONTROL_TAKEN)
    })

    it('requires the messaging_handovers source', () => {
      const doc = build(TAKEN_TYPE, {})
      doc.content.source = 'messages'
      expect(getThreadDividerVariation(doc)).to.equal(undefined)
    })

    it('rejects other container and envelope types', () => {
      expect(getThreadDividerVariation(build('text/plain', {}))).to.equal(undefined)
      expect(getThreadDividerVariation(build(TAKEN_TYPE, {}, { type: 'text/plain' }))).to.equal(undefined)
    })

    it('handles empty values', () => {
      expect(getThreadDividerVariation(undefined)).to.equal(undefined)
      expect(getThreadDividerVariation({})).to.equal(undefined)
    })
  })

  describe('isThreadDividerMessage', () => {
    it('is true only when a variation exists', () => {
      expect(isThreadDividerMessage(build(TAKEN_TYPE, {}))).to.equal(true)
      expect(isThreadDividerMessage(build('text/plain', {}))).to.equal(false)
    })
  })
})
