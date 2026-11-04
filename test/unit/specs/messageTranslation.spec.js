import messageTranslation, {
  resolveTranslation,
  resolveTranslationState,
  resolveTranslationDirection,
  resolveTranslationFooterLabels,
  formatLanguageLabel,
  defaultMessageTranslationLabels
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

  describe('resolveTranslation', () => {
    it('returns state and result from a single getTranslation call', () => {
      let calls = 0
      const result = { status: 'done', sourceLanguage: 'espanhol', text: 'Olá' }
      const translation = buildTranslation({
        getTranslation: () => {
          calls++
          return result
        }
      })

      const read = resolveTranslation(translation, fullDocument, 'left', false)

      expect(read.state).to.equal('done')
      expect(read.result).to.equal(result)
      expect(calls).to.equal(1)
    })

    it('returns none and a null result without calling getTranslation when not applicable', () => {
      let calls = 0
      const getTranslation = () => {
        calls++
        return { status: 'done', text: 'Olá' }
      }

      const reads = [
        resolveTranslation(undefined, fullDocument, 'left', false),
        resolveTranslation(
          buildTranslation({ enabled: false, getTranslation }),
          fullDocument,
          'left',
          false
        ),
        resolveTranslation(
          buildTranslation({ getTranslation }),
          fullDocument,
          'left',
          true
        ),
        resolveTranslation(
          buildTranslation({ getTranslation }),
          fullDocument,
          'right',
          false
        )
      ]

      reads.forEach((read) => {
        expect(read.state).to.equal('none')
        expect(read.result).to.equal(null)
      })
      expect(calls).to.equal(0)
    })
  })

  describe('mixin', () => {
    const { computed, methods } = messageTranslation

    it('does not evaluate card overrides when the translation prop is absent', () => {
      const vm = {
        translation: undefined,
        get hasTranslatableContent() {
          throw new Error('hasTranslatableContent must not run')
        }
      }

      expect(computed.translationRead.call(vm).state).to.equal('none')
    })

    it('does not read the translation when the card has nothing translatable', () => {
      let calls = 0
      const vm = {
        translation: buildTranslation({
          getTranslation: () => {
            calls++
            return { status: 'done', text: 'Olá' }
          }
        }),
        hasTranslatableContent: false,
        fullDocument,
        position: 'left',
        isEditing: false
      }

      const read = computed.translationRead.call(vm)

      expect(read.state).to.equal('none')
      expect(read.result).to.equal(null)
      expect(calls).to.equal(0)
    })

    it('shows the requested translation even when showOriginal is global', () => {
      let received
      const vm = {
        translation: buildTranslation({
          showOriginal: true,
          onTranslate: (doc) => {
            received = doc
          }
        }),
        fullDocument,
        translationShowOriginalOverride: null
      }

      methods.requestTranslation.call(vm)

      expect(vm.translationShowOriginalOverride).to.equal(false)
      expect(received).to.equal(fullDocument)
    })

    it('keeps the override untouched when onTranslate is not provided', () => {
      const vm = {
        translation: buildTranslation({ onTranslate: undefined }),
        fullDocument,
        translationShowOriginalOverride: null
      }

      methods.requestTranslation.call(vm)

      expect(vm.translationShowOriginalOverride).to.equal(null)
    })

    it('renders the pending label as the (disabled) action', () => {
      const vm = {
        translation: buildTranslation(),
        translationState: 'pending',
        translationDirection: 'received',
        isShowingTranslation: false,
        translationResult: { status: 'pending' },
        translationLabels: defaultMessageTranslationLabels
      }
      vm.translationFooterLabels = computed.translationFooterLabels.call(vm)

      expect(computed.translationFooterLabel.call(vm)).to.equal('')
      expect(computed.translationFooterActionLabel.call(vm)).to.equal(
        defaultMessageTranslationLabels.translating
      )
    })

    describe('translationFooterPlacement', () => {
      const host = (liftedId) => ({ isLifted: (id) => id === liftedId })
      const placement = (overrides) =>
        computed.translationFooterPlacement.call({
          isTranslationActive: true,
          translationFooterHostId: null,
          blipTranslationFooterHost: null,
          hasTranslationDateRow: true,
          ...overrides
        })

      it('is none when the footer is not active', () => {
        expect(placement({ isTranslationActive: false })).to.equal('none')
      })

      it('uses the card date row when standalone', () => {
        expect(placement({})).to.equal('date')
      })

      it('uses its own row when the card has no date row', () => {
        expect(placement({ hasTranslationDateRow: false })).to.equal('row')
      })

      it('uses its own row inside a group when not lifted', () => {
        expect(placement({ blipTranslationFooterHost: host('other') })).to.equal('row')
      })

      it('is lifted to the group date row for the last message of the group', () => {
        expect(placement({ blipTranslationFooterHost: host('msg-1'), translationFooterHostId: 'msg-1' })).to.equal('host')
      })
    })

    it('lifts only messages with an id that the group marks as lifted', () => {
      const hostId = (blipTranslationFooterHost, doc) =>
        computed.translationFooterHostId.call({ blipTranslationFooterHost, fullDocument: doc })
      const host = { isLifted: (id) => id === 'msg-1' }

      expect(hostId(host, fullDocument)).to.equal('msg-1')
      expect(hostId(host, { ...fullDocument, id: 'msg-2' })).to.equal(null)
      expect(hostId(host, { type: 'text/plain', content: 'Hola' })).to.equal(null)
      expect(hostId(null, fullDocument)).to.equal(null)
    })

    it('registers the lifted footer in the group and removes it when it is no longer lifted', () => {
      const calls = []
      const vm = {
        blipTranslationFooterHost: {
          setFooter: (id) => calls.push(['set', id]),
          removeFooter: (id) => calls.push(['remove', id])
        }
      }

      methods.syncTranslationHostFooter.call(vm, { id: 'msg-1' })
      methods.syncTranslationHostFooter.call(vm, { id: 'msg-1' })
      methods.syncTranslationHostFooter.call(vm, null)

      expect(calls).to.deep.equal([['set', 'msg-1'], ['set', 'msg-1'], ['remove', 'msg-1']])
      expect(vm.translationHostFooterId).to.equal(null)
    })
  })

  describe('resolveTranslationDirection', () => {
    it('prefers the direction returned by getTranslation', () => {
      expect(resolveTranslationDirection({ direction: 'sent' }, { direction: 'received' }, 'left')).to.equal('sent')
    })

    it('falls back to the document direction, then to the position', () => {
      expect(resolveTranslationDirection({ direction: 'other' }, { direction: 'received' }, 'right')).to.equal('received')
      expect(resolveTranslationDirection(null, fullDocument, 'right')).to.equal('sent')
      expect(resolveTranslationDirection(null, fullDocument, 'left')).to.equal('received')
      expect(resolveTranslationDirection(null, undefined, undefined)).to.equal('received')
    })
  })

  describe('resolveTranslationFooterLabels', () => {
    const done = {
      status: 'done',
      sourceLanguage: 'espanhol',
      targetLanguage: 'português',
      text: 'Olá'
    }
    const labels = (overrides) => ({
      state: 'done',
      direction: 'received',
      showingTranslation: true,
      result: done,
      labels: defaultMessageTranslationLabels,
      canRequest: true,
      ...overrides
    })

    it('offers the original of a received translated message in the source language', () => {
      expect(resolveTranslationFooterLabels(labels())).to.deep.equal({
        label: '',
        actionLabel: 'Ver original em espanhol'
      })
    })

    it('offers the attendant text of a sent message in the customer language', () => {
      expect(resolveTranslationFooterLabels(labels({ direction: 'sent' })).actionLabel).to.equal(
        'Ver envio em espanhol'
      )
    })

    it('offers the translation in the target language when showing the original', () => {
      expect(resolveTranslationFooterLabels(labels({ showingTranslation: false })).actionLabel).to.equal(
        'Ver em português'
      )
      expect(
        resolveTranslationFooterLabels(labels({ direction: 'sent', showingTranslation: false })).actionLabel
      ).to.equal('Ver em português')
    })

    it('renders translate, pending and error states', () => {
      expect(resolveTranslationFooterLabels(labels({ state: 'translate' }))).to.deep.equal({
        label: '',
        actionLabel: 'Traduzir'
      })
      expect(resolveTranslationFooterLabels(labels({ state: 'pending' }))).to.deep.equal({
        label: '',
        actionLabel: 'Traduzindo...'
      })
      expect(resolveTranslationFooterLabels(labels({ state: 'error' }))).to.deep.equal({
        label: 'Não foi possível traduzir',
        actionLabel: 'Tentar novamente'
      })
      expect(resolveTranslationFooterLabels(labels({ state: 'error', canRequest: false }))).to.deep.equal({
        label: 'Não foi possível traduzir',
        actionLabel: ''
      })
      expect(resolveTranslationFooterLabels(labels({ state: 'none' }))).to.deep.equal({
        label: '',
        actionLabel: ''
      })
    })

    it('uses host labels', () => {
      const custom = {
        ...defaultMessageTranslationLabels,
        viewOriginal: 'See original in {language}',
        viewSent: 'See sent in {language}'
      }
      const result = { ...done, sourceLanguage: 'Spanish' }

      expect(resolveTranslationFooterLabels(labels({ labels: custom, result })).actionLabel).to.equal(
        'See original in Spanish'
      )
      expect(
        resolveTranslationFooterLabels(labels({ labels: custom, result, direction: 'sent' })).actionLabel
      ).to.equal('See sent in Spanish')
    })

    it('uses the language-less labels when the language is missing', () => {
      const noLanguage = { ...done, sourceLanguage: '', targetLanguage: undefined }

      expect(resolveTranslationFooterLabels(labels({ result: noLanguage })).actionLabel).to.equal('Ver original')
      expect(
        resolveTranslationFooterLabels(labels({ result: noLanguage, direction: 'sent' })).actionLabel
      ).to.equal('Ver envio')
      expect(
        resolveTranslationFooterLabels(labels({ result: noLanguage, showingTranslation: false })).actionLabel
      ).to.equal('Ver tradução')
    })

    it('uses host language-less labels and drops the placeholder when they are missing', () => {
      const noLanguage = { ...done, sourceLanguage: '  ', targetLanguage: null }
      const custom = {
        ...defaultMessageTranslationLabels,
        viewOriginalNoLanguage: 'See original'
      }
      const withoutKeys = {
        viewOriginal: 'See original in {language}',
        viewTranslation: 'See in {language}'
      }

      expect(
        resolveTranslationFooterLabels(labels({ labels: custom, result: noLanguage })).actionLabel
      ).to.equal('See original')
      expect(
        resolveTranslationFooterLabels(labels({ labels: withoutKeys, result: noLanguage })).actionLabel
      ).to.equal('See original in')
      expect(
        resolveTranslationFooterLabels(labels({ labels: withoutKeys, result: noLanguage, showingTranslation: false }))
          .actionLabel
      ).to.equal('See in')
    })
  })

  describe('defaultMessageTranslationLabels', () => {
    it('exposes only the current keys', () => {
      expect(Object.keys(defaultMessageTranslationLabels).sort()).to.deep.equal([
        'failed',
        'retry',
        'translate',
        'translating',
        'viewOriginal',
        'viewOriginalNoLanguage',
        'viewSent',
        'viewSentNoLanguage',
        'viewTranslation',
        'viewTranslationNoLanguage'
      ])
    })
  })

  describe('formatLanguageLabel', () => {
    it('interpolates the language without changing its case', () => {
      expect(formatLanguageLabel('Ver original em {language}', 'espanhol')).to.equal(
        'Ver original em espanhol'
      )
      expect(formatLanguageLabel('Ver em {language}', 'Português')).to.equal('Ver em Português')
    })

    it('replaces every placeholder occurrence', () => {
      expect(formatLanguageLabel('{language} / {language}', 'en')).to.equal('en / en')
    })

    it('drops the placeholder when the language is missing or empty', () => {
      expect(formatLanguageLabel('Ver original em {language}', undefined)).to.equal('Ver original em')
      expect(formatLanguageLabel('Ver em {language}', '  ')).to.equal('Ver em')
    })

    it('keeps templates without placeholder and ignores invalid templates', () => {
      expect(formatLanguageLabel('Ver original', 'espanhol')).to.equal('Ver original')
      expect(formatLanguageLabel(undefined, 'espanhol')).to.equal('')
    })
  })
})
