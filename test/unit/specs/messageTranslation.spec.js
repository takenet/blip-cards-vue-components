import {
  resolveTranslationState,
  formatTranslatedFromLabel
} from '../../../src/mixins/messageTranslation'

const fullDocument = { id: 'msg-1', type: 'text/plain', content: 'Hola' }

const buildTranslation = (overrides = {}) => ({
  enabled: true,
  showOriginal: false,
  getTranslation: () => null,
  onTranslate: () => {},
  ...overrides
})

describe('messageTranslation', () => {
  describe('resolveTranslationState', () => {
    it('returns none when the translation prop is absent', () => {
      expect(
        resolveTranslationState(undefined, fullDocument, 'left', false)
      ).to.equal('none')
      expect(
        resolveTranslationState(null, fullDocument, 'left', false)
      ).to.equal('none')
    })

    it('returns none when translation is disabled', () => {
      const translation = buildTranslation({ enabled: false })
      expect(
        resolveTranslationState(translation, fullDocument, 'left', false)
      ).to.equal('none')
    })

    it('returns none when canTranslate returns false', () => {
      const translation = buildTranslation({ canTranslate: () => false })
      expect(
        resolveTranslationState(translation, fullDocument, 'left', false)
      ).to.equal('none')
    })

    it('returns none when canTranslate throws', () => {
      const translation = buildTranslation({
        canTranslate: () => {
          throw new Error('boom')
        }
      })
      expect(
        resolveTranslationState(translation, fullDocument, 'left', false)
      ).to.equal('none')
    })

    it('uses canTranslate instead of the position default when provided', () => {
      const translation = buildTranslation({ canTranslate: () => true })
      expect(
        resolveTranslationState(translation, fullDocument, 'right', false)
      ).to.equal('translate')
    })

    it('defaults canTranslate to received (left) messages', () => {
      const translation = buildTranslation()
      expect(
        resolveTranslationState(translation, fullDocument, 'left', false)
      ).to.equal('translate')
      expect(
        resolveTranslationState(translation, fullDocument, 'right', false)
      ).to.equal('none')
    })

    it('returns none while the card is being edited', () => {
      const translation = buildTranslation()
      expect(
        resolveTranslationState(translation, fullDocument, 'left', true)
      ).to.equal('none')
    })

    it('returns translate when there is no translation and onTranslate is provided', () => {
      const translation = buildTranslation({ getTranslation: () => null })
      expect(
        resolveTranslationState(translation, fullDocument, 'left', false)
      ).to.equal('translate')
    })

    it('returns none when there is no translation and no onTranslate', () => {
      const translation = buildTranslation({
        getTranslation: () => null,
        onTranslate: undefined
      })
      expect(
        resolveTranslationState(translation, fullDocument, 'left', false)
      ).to.equal('none')
    })

    it('returns pending, error and done according to the status', () => {
      const pending = buildTranslation({
        getTranslation: () => ({ status: 'pending' })
      })
      const error = buildTranslation({
        getTranslation: () => ({ status: 'error' })
      })
      const done = buildTranslation({
        getTranslation: () => ({
          status: 'done',
          sourceLanguage: 'espanhol',
          targetLanguage: 'pt-BR',
          text: 'Olá'
        })
      })

      expect(
        resolveTranslationState(pending, fullDocument, 'left', false)
      ).to.equal('pending')
      expect(
        resolveTranslationState(error, fullDocument, 'left', false)
      ).to.equal('error')
      expect(
        resolveTranslationState(done, fullDocument, 'left', false)
      ).to.equal('done')
    })

    it('returns done when only title or options are translated', () => {
      const title = buildTranslation({
        getTranslation: () => ({ status: 'done', title: 'Título' })
      })
      const options = buildTranslation({
        getTranslation: () => ({ status: 'done', options: ['', 'Sim'] })
      })

      expect(
        resolveTranslationState(title, fullDocument, 'left', false)
      ).to.equal('done')
      expect(
        resolveTranslationState(options, fullDocument, 'left', false)
      ).to.equal('done')
    })

    it('falls back to translate/none when done has no translated content', () => {
      const withAction = buildTranslation({
        getTranslation: () => ({ status: 'done', text: '' })
      })
      const withoutAction = buildTranslation({
        getTranslation: () => ({ status: 'done', text: '   ' }),
        onTranslate: undefined
      })

      expect(
        resolveTranslationState(withAction, fullDocument, 'left', false)
      ).to.equal('translate')
      expect(
        resolveTranslationState(withoutAction, fullDocument, 'left', false)
      ).to.equal('none')
    })

    it('returns none when getTranslation throws', () => {
      const translation = buildTranslation({
        getTranslation: () => {
          throw new Error('boom')
        }
      })
      expect(
        resolveTranslationState(translation, fullDocument, 'left', false)
      ).to.equal('none')
    })

    it('passes the full document to the host callbacks', () => {
      let received
      const translation = buildTranslation({
        canTranslate: (doc) => {
          received = doc
          return true
        },
        getTranslation: (doc) =>
          doc === fullDocument ? { status: 'pending' } : null
      })

      expect(
        resolveTranslationState(translation, fullDocument, 'left', false)
      ).to.equal('pending')
      expect(received).to.equal(fullDocument)
    })
  })

  describe('formatTranslatedFromLabel', () => {
    it('interpolates the language into the template', () => {
      expect(
        formatTranslatedFromLabel(
          'Traduzido do {language}',
          'espanhol',
          'Traduzido'
        )
      ).to.equal('Traduzido do espanhol')
    })

    it('replaces every placeholder occurrence', () => {
      expect(
        formatTranslatedFromLabel('{language} / {language}', 'en', 'x')
      ).to.equal('en / en')
    })

    it('returns the fallback when the language is missing or empty', () => {
      expect(
        formatTranslatedFromLabel(
          'Traduzido do {language}',
          undefined,
          'Traduzido'
        )
      ).to.equal('Traduzido')
      expect(
        formatTranslatedFromLabel('Traduzido do {language}', '  ', 'Traduzido')
      ).to.equal('Traduzido')
    })

    it('returns the fallback when the template is invalid', () => {
      expect(
        formatTranslatedFromLabel(undefined, 'espanhol', 'Traduzido')
      ).to.equal('Traduzido')
      expect(
        formatTranslatedFromLabel('Traduzido', 'espanhol', 'Traduzido')
      ).to.equal('Traduzido')
    })
  })
})
