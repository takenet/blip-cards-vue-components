import {
  isStandbyMessage,
  getStandbyDirection,
  getStandbyInnerDocument,
  getExternalMessageText
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
      value: { content: { type: 'text/plain', value: 'Hi' } }
    },
    ...overrides
  }
})

const buildOutboundStandby = () => ({
  type: 'application/vnd.iris.multi-partner-conversation+json',
  content: {
    direction: 'outbound',
    sender: 'bot',
    recipient: '5531999998888',
    source: 'standby',
    content: {
      type: 'application/vnd.iris.multi-partner-conversation-standby+json',
      value: { content: { type: 'text/plain', value: 'Test' } }
    }
  }
})

describe('standby utils', () => {
  describe('isStandbyMessage', () => {
    it('identifies a standby envelope', () => {
      expect(isStandbyMessage(buildStandby())).to.equal(true)
    })

    it('identifies an outbound envelope with the container under content.content', () => {
      expect(isStandbyMessage(buildOutboundStandby())).to.equal(true)
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

  describe('getExternalMessageText', () => {
    it('returns the text for pt, en and es variants', () => {
      expect(getExternalMessageText('pt-BR')).to.equal('Mensagem externa')
      expect(getExternalMessageText('en-US')).to.equal('External message')
      expect(getExternalMessageText('es-AR')).to.equal('Mensaje externo')
    })

    it('falls back to portuguese for unknown or empty languages', () => {
      expect(getExternalMessageText('fr-FR')).to.equal('Mensagem externa')
      expect(getExternalMessageText(undefined)).to.equal('Mensagem externa')
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
        content: 'Hi'
      })
    })

    it('maps the container under content.content (outbound)', () => {
      expect(getStandbyInnerDocument(buildOutboundStandby().content)).to.deep.equal({
        type: 'text/plain',
        content: 'Test'
      })
    })

    it('maps a template container to the template-content format', () => {
      const message = { type: 'template', template: { name: 'tpl', components: [] } }
      const template = { name: 'tpl', components: [{ type: 'BODY', text: 'Hi' }] }
      const content = buildOutboundStandby().content
      content.content.value.content = {
        type: 'application/vnd.iris.multi-partner-conversation-template+json',
        value: { message, template }
      }

      expect(getStandbyInnerDocument(content)).to.deep.equal({
        type: 'template',
        content: {
          type: 'template-content',
          template: message.template,
          templateContent: template
        }
      })
    })

    it('returns undefined for an incomplete template container', () => {
      const content = buildOutboundStandby().content
      content.content.value.content = {
        type: 'application/vnd.iris.multi-partner-conversation-template+json',
        value: { template: { name: 'tpl', components: [] } }
      }

      expect(getStandbyInnerDocument(content)).to.equal(undefined)
    })

    it('returns undefined when the inner content is missing', () => {
      const content = buildStandby().content
      content.documentContainer.value = {}
      expect(getStandbyInnerDocument(content)).to.equal(undefined)
      expect(getStandbyInnerDocument(undefined)).to.equal(undefined)
    })
  })
})
