import { isAiContextMessage, getAiContextText } from '../../../src/utils/aiContext'

const CONTEXT_TYPE = 'application/vnd.iris.multi-partner-conversation-context+json'
const CONTROL_PASSED_TYPE = 'application/vnd.iris.multi-partner-conversation-control-passed+json'

const buildContext = (overrides = {}) => ({
  type: 'application/vnd.iris.multi-partner-conversation+json',
  content: {
    direction: 'outbound',
    sender: 'bot',
    recipient: '5531999998888',
    source: 'messages',
    documentContainer: {
      type: CONTEXT_TYPE,
      value: { type: 'summary', summary: { text: 'The customer wants to negotiate a debt.' } }
    }
  },
  metadata: {
    '#wa.multiPartner.IsContextIA': 'true',
    '#wa.multiPartner.IsReadOnly': 'true'
  },
  ...overrides
})

const buildControlPassed = (conversationContext, metadata) => buildContext({
  ...(metadata ? { metadata } : {}),
  content: {
    direction: 'outbound',
    source: 'messages',
    content: {
      type: CONTROL_PASSED_TYPE,
      value: { conversation_context: conversationContext }
    }
  }
})

describe('aiContext utils', () => {
  describe('isAiContextMessage', () => {
    it('identifies a context envelope', () => {
      expect(isAiContextMessage(buildContext())).to.equal(true)
    })

    it('identifies a context that came from standby', () => {
      const doc = buildContext()
      doc.content.source = 'standby'
      expect(isAiContextMessage(doc)).to.equal(true)
    })

    it('identifies a context inside a control_passed', () => {
      expect(isAiContextMessage(buildControlPassed('Summary'))).to.equal(true)
    })

    it('does not require the IsContextIA metadata', () => {
      expect(isAiContextMessage(buildContext({ metadata: {} }))).to.equal(true)
      expect(isAiContextMessage(buildContext({ metadata: undefined }))).to.equal(true)
      expect(isAiContextMessage(buildControlPassed('Summary', {}))).to.equal(true)
    })

    it('ignores a control_passed without conversation_context', () => {
      expect(isAiContextMessage(buildControlPassed(undefined))).to.equal(false)
    })

    it('rejects other container types', () => {
      const doc = buildContext()
      doc.content.documentContainer.type = 'text/plain'
      expect(isAiContextMessage(doc)).to.equal(false)
    })

    it('rejects other envelope types', () => {
      expect(isAiContextMessage(buildContext({ type: 'text/plain' }))).to.equal(false)
    })

    it('rejects a context without text', () => {
      const doc = buildContext()
      doc.content.documentContainer.value = { type: 'summary', summary: {} }
      expect(isAiContextMessage(doc)).to.equal(false)
    })

    it('handles empty values', () => {
      expect(isAiContextMessage(undefined)).to.equal(false)
      expect(isAiContextMessage({})).to.equal(false)
    })
  })

  describe('getAiContextText', () => {
    it('reads value.summary.text', () => {
      expect(getAiContextText(buildContext().content)).to.equal('The customer wants to negotiate a debt.')
    })

    it('reads conversation_context as a string', () => {
      expect(getAiContextText(buildControlPassed('Plain summary').content)).to.equal('Plain summary')
    })

    it('reads conversation_context as an object with text', () => {
      expect(getAiContextText(buildControlPassed({ text: 'Object summary' }).content)).to.equal('Object summary')
    })

    it('reads conversation_context as a summary object', () => {
      const context = { type: 'summary', summary: { text: 'Nested summary' } }
      expect(getAiContextText(buildControlPassed(context).content)).to.equal('Nested summary')
    })

    it('returns undefined when there is no text', () => {
      expect(getAiContextText(undefined)).to.equal(undefined)
      expect(getAiContextText({ documentContainer: { type: CONTEXT_TYPE } })).to.equal(undefined)
    })
  })
})
