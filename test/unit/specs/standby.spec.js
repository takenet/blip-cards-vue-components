import {
  isStandbyMessage,
  getStandbyDirection,
  getStandbyInnerDocument
} from '../../../src/utils/standby'

const buildStandby = (overrides = {}) => ({
  type: 'application/vnd.iris.multi-partner-conversation+json',
  content: {
    direction: 'inbound',
    sender: '5531999998888',
    recipient: 'bot',
    source: 'standby',
    documentContainer: {
      type: 'application/vnd.iris.multi-partner-conversation-standby+json',
      value: { content: { type: 'text/plain', value: 'Oi' } }
    },
    ...overrides
  }
})

describe('standby utils', () => {
  describe('isStandbyMessage', () => {
    it('identifies a standby envelope', () => {
      expect(isStandbyMessage(buildStandby())).to.equal(true)
    })

    it('rejects other source values', () => {
      expect(isStandbyMessage(buildStandby({ source: 'other' }))).to.equal(false)
    })

    it('rejects other container types', () => {
      const doc = buildStandby()
      doc.content.documentContainer.type = 'text/plain'
      expect(isStandbyMessage(doc)).to.equal(false)
    })

    it('rejects other envelope types', () => {
      const doc = buildStandby()
      doc.type = 'text/plain'
      expect(isStandbyMessage(doc)).to.equal(false)
    })

    it('handles empty values', () => {
      expect(isStandbyMessage(undefined)).to.equal(false)
      expect(isStandbyMessage({ type: 'text/plain' })).to.equal(false)
    })
  })

  describe('getStandbyDirection', () => {
    it('returns inbound and outbound', () => {
      expect(getStandbyDirection({ direction: 'inbound' })).to.equal('inbound')
      expect(getStandbyDirection({ direction: 'outbound' })).to.equal('outbound')
    })

    it('returns undefined for unknown directions', () => {
      expect(getStandbyDirection({ direction: 'sent' })).to.equal(undefined)
      expect(getStandbyDirection(undefined)).to.equal(undefined)
    })
  })

  describe('getStandbyInnerDocument', () => {
    it('maps the container value to a type/content document', () => {
      expect(getStandbyInnerDocument(buildStandby().content)).to.deep.equal({
        type: 'text/plain',
        content: 'Oi'
      })
    })

    it('returns undefined when the inner content is missing', () => {
      const content = buildStandby().content
      content.documentContainer.value = {}
      expect(getStandbyInnerDocument(content)).to.equal(undefined)
      expect(getStandbyInnerDocument(undefined)).to.equal(undefined)
    })
  })
})
