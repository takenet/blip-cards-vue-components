export const TranslationStates = {
  NONE: 'none',
  TRANSLATE: 'translate',
  PENDING: 'pending',
  ERROR: 'error',
  DONE: 'done'
}

export const defaultMessageTranslationLabels = {
  translatedFrom: 'Traduzido do {language}',
  translated: 'Traduzido',
  showOriginal: 'Ver original',
  showTranslation: 'Ver tradução',
  translate: 'Traduzir',
  translating: 'Traduzindo...',
  failed: 'Não foi possível traduzir',
  retry: 'Tentar novamente'
}

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0

const hasTranslatedContent = (result) =>
  isNonEmptyString(result.text) ||
  isNonEmptyString(result.title) ||
  (Array.isArray(result.options) && result.options.some(isNonEmptyString))

const isTranslationEnabled = (translation) =>
  !!translation &&
  typeof translation === 'object' &&
  translation.enabled === true

const canTranslateDocument = (translation, fullDocument, position) => {
  if (typeof translation.canTranslate !== 'function') {
    return position === 'left'
  }

  try {
    return !!translation.canTranslate(fullDocument)
  } catch (e) {
    return false
  }
}

const readTranslation = (translation, fullDocument) => {
  if (typeof translation.getTranslation !== 'function') {
    return { result: null, failed: false }
  }

  try {
    const result = translation.getTranslation(fullDocument)
    return {
      result: result && typeof result === 'object' ? result : null,
      failed: false
    }
  } catch (e) {
    return { result: null, failed: true }
  }
}

const stateFromResult = (translation, result) => {
  const canRequest = typeof translation.onTranslate === 'function'
  const fallback = canRequest
    ? TranslationStates.TRANSLATE
    : TranslationStates.NONE

  if (!result) {
    return fallback
  }

  switch (result.status) {
    case 'pending':
      return TranslationStates.PENDING
    case 'error':
      return TranslationStates.ERROR
    case 'done':
      return hasTranslatedContent(result) ? TranslationStates.DONE : fallback
    default:
      return fallback
  }
}

export function resolveTranslationState(
  translation,
  fullDocument,
  position,
  isEditing
) {
  if (!isTranslationEnabled(translation) || isEditing) {
    return TranslationStates.NONE
  }

  if (!canTranslateDocument(translation, fullDocument, position)) {
    return TranslationStates.NONE
  }

  const { result, failed } = readTranslation(translation, fullDocument)

  return failed ? TranslationStates.NONE : stateFromResult(translation, result)
}

export function formatTranslatedFromLabel(template, language, fallback) {
  if (
    !isNonEmptyString(language) ||
    !isNonEmptyString(template) ||
    template.indexOf('{language}') === -1
  ) {
    return fallback
  }

  return template.split('{language}').join(language.trim())
}

export default {
  props: {
    translation: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      translationShowOriginalOverride: null
    }
  },
  computed: {
    // Cards may override this to opt out when they have nothing translatable (e.g. audio).
    hasTranslatableContent() {
      return true
    },
    translationResult() {
      if (!isTranslationEnabled(this.translation)) {
        return null
      }

      return readTranslation(this.translation, this.fullDocument).result
    },
    translationState() {
      if (!this.hasTranslatableContent) {
        return TranslationStates.NONE
      }

      return resolveTranslationState(
        this.translation,
        this.fullDocument,
        this.position,
        this.isEditing
      )
    },
    isTranslationActive() {
      return this.translationState !== TranslationStates.NONE
    },
    translationGlobalShowOriginal() {
      return !!(this.translation && this.translation.showOriginal)
    },
    translationShowOriginal() {
      return this.translationShowOriginalOverride !== null
        ? this.translationShowOriginalOverride
        : this.translationGlobalShowOriginal
    },
    isShowingTranslation() {
      return (
        this.translationState === TranslationStates.DONE &&
        !this.translationShowOriginal
      )
    },
    translationLabels() {
      // Some cards (e.g. blip-select) receive `translations` as a non-declared attribute.
      const translations = this.translations || this.$attrs.translations || {}
      return {
        ...defaultMessageTranslationLabels,
        ...(translations.messageTranslation || {})
      }
    },
    translationFooterLabel() {
      const labels = this.translationLabels

      switch (this.translationState) {
        case TranslationStates.PENDING:
          return labels.translating
        case TranslationStates.ERROR:
          return labels.failed
        case TranslationStates.DONE:
          return this.isShowingTranslation
            ? formatTranslatedFromLabel(
                labels.translatedFrom,
                this.translationResult && this.translationResult.sourceLanguage,
                labels.translated
              )
            : ''
        default:
          return ''
      }
    },
    translationFooterActionLabel() {
      const labels = this.translationLabels
      const canRequest =
        !!this.translation && typeof this.translation.onTranslate === 'function'

      switch (this.translationState) {
        case TranslationStates.TRANSLATE:
          return labels.translate
        case TranslationStates.ERROR:
          return canRequest ? labels.retry : ''
        case TranslationStates.DONE:
          return this.isShowingTranslation
            ? labels.showOriginal
            : labels.showTranslation
        default:
          return ''
      }
    }
  },
  watch: {
    translationGlobalShowOriginal() {
      this.translationShowOriginalOverride = null
    }
  },
  methods: {
    toggleTranslationOriginal() {
      this.translationShowOriginalOverride = !this.translationShowOriginal
    },
    requestTranslation() {
      if (
        !this.translation ||
        typeof this.translation.onTranslate !== 'function'
      ) {
        return
      }

      try {
        const pending = this.translation.onTranslate(this.fullDocument)
        if (pending && typeof pending.catch === 'function') {
          pending.catch(() => {})
        }
      } catch (e) {
        // The host reports failures through getTranslation (status 'error').
      }
    },
    onTranslationAction() {
      if (this.translationState === TranslationStates.DONE) {
        this.toggleTranslationOriginal()
      } else if (
        this.translationState === TranslationStates.TRANSLATE ||
        this.translationState === TranslationStates.ERROR
      ) {
        this.requestTranslation()
      }
    },
    translatedField(name, original) {
      if (!this.isShowingTranslation || !this.translationResult) {
        return original
      }

      const value = this.translationResult[name]
      return isNonEmptyString(value) ? value : original
    }
  }
}
