export const TranslationStates = {
  NONE: 'none',
  TRANSLATE: 'translate',
  PENDING: 'pending',
  ERROR: 'error',
  DONE: 'done'
}

export const TranslationDirections = {
  RECEIVED: 'received',
  SENT: 'sent'
}

export const TranslationFooterPlacements = {
  NONE: 'none',
  DATE: 'date',
  ROW: 'row',
  HOST: 'host'
}

export const defaultMessageTranslationLabels = {
  viewOriginal: 'Ver original em {language}',
  viewTranslation: 'Ver em {language}',
  viewSent: 'Ver envio em {language}',
  viewOriginalNoLanguage: 'Ver original',
  viewTranslationNoLanguage: 'Ver tradução',
  viewSentNoLanguage: 'Ver envio',
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

const NO_TRANSLATION = Object.freeze({
  state: TranslationStates.NONE,
  result: null
})

export function resolveTranslation(
  translation,
  fullDocument,
  position,
  isEditing
) {
  if (!isTranslationEnabled(translation) || isEditing) {
    return NO_TRANSLATION
  }

  if (!canTranslateDocument(translation, fullDocument, position)) {
    return NO_TRANSLATION
  }

  const { result, failed } = readTranslation(translation, fullDocument)

  return failed
    ? NO_TRANSLATION
    : { state: stateFromResult(translation, result), result }
}

export function resolveTranslationState(
  translation,
  fullDocument,
  position,
  isEditing
) {
  return resolveTranslation(translation, fullDocument, position, isEditing)
    .state
}

export function formatLanguageLabel(template, language) {
  if (typeof template !== 'string') {
    return ''
  }

  if (!isNonEmptyString(language)) {
    return template.replace(/\s*\{language\}/g, '').trim()
  }

  return template.split('{language}').join(language.trim())
}

// Uses the `<key>NoLanguage` label when the language is missing; falls back to dropping the placeholder.
const resolveLanguageLabel = (labels, key, language) => {
  const noLanguage = labels[`${key}NoLanguage`]
  if (!isNonEmptyString(language) && isNonEmptyString(noLanguage)) {
    return noLanguage.trim()
  }

  return formatLanguageLabel(labels[key], language)
}

const isDirection = (value) =>
  value === TranslationDirections.RECEIVED || value === TranslationDirections.SENT

export function resolveTranslationDirection(result, fullDocument, position) {
  if (result && isDirection(result.direction)) {
    return result.direction
  }

  if (fullDocument && isDirection(fullDocument.direction)) {
    return fullDocument.direction
  }

  return position === 'right'
    ? TranslationDirections.SENT
    : TranslationDirections.RECEIVED
}

// Returns the footer texts: `label` is plain text, `actionLabel` is the clickable part.
export function resolveTranslationFooterLabels({
  state,
  direction,
  showingTranslation,
  result,
  labels,
  canRequest
}) {
  switch (state) {
    case TranslationStates.TRANSLATE:
      return { label: '', actionLabel: labels.translate }
    case TranslationStates.PENDING:
      return { label: '', actionLabel: labels.translating }
    case TranslationStates.ERROR:
      return { label: labels.failed, actionLabel: canRequest ? labels.retry : '' }
    case TranslationStates.DONE: {
      const source = result && result.sourceLanguage
      const target = result && result.targetLanguage

      if (!showingTranslation) {
        return { label: '', actionLabel: resolveLanguageLabel(labels, 'viewTranslation', target) }
      }

      const key =
        direction === TranslationDirections.SENT ? 'viewSent' : 'viewOriginal'
      return { label: '', actionLabel: resolveLanguageLabel(labels, key, source) }
    }
    default:
      return { label: '', actionLabel: '' }
  }
}

export default {
  props: {
    translation: {
      type: Object,
      default: undefined
    }
  },
  // Provided by blip-group-card so the last bubble of a group renders its footer in the group date row.
  inject: {
    blipTranslationFooterHost: { default: null }
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
    translationRead() {
      if (
        !isTranslationEnabled(this.translation) ||
        !this.hasTranslatableContent
      ) {
        return NO_TRANSLATION
      }

      return resolveTranslation(
        this.translation,
        this.fullDocument,
        this.position,
        this.isEditing
      )
    },
    translationResult() {
      return this.translationRead.result
    },
    translationState() {
      return this.translationRead.state
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
      // Not declared as a mixin prop: blip-select gets it as an attr, and declaring it would change its root DOM attrs.
      const translations = this.translations || this.$attrs.translations || {}
      return {
        ...defaultMessageTranslationLabels,
        ...(translations.messageTranslation || {})
      }
    },
    translationDirection() {
      return resolveTranslationDirection(
        this.translationResult,
        this.fullDocument,
        this.position
      )
    },
    translationFooterLabels() {
      return resolveTranslationFooterLabels({
        state: this.translationState,
        direction: this.translationDirection,
        showingTranslation: this.isShowingTranslation,
        result: this.translationResult,
        labels: this.translationLabels,
        canRequest:
          !!this.translation &&
          typeof this.translation.onTranslate === 'function'
      })
    },
    translationFooterLabel() {
      return this.translationFooterLabels.label
    },
    translationFooterActionLabel() {
      return this.translationFooterLabels.actionLabel
    },
    // Cards without their own date row (e.g. list selects) override this to render the footer on its own row.
    hasTranslationDateRow() {
      return true
    },
    translationFooterHostId() {
      const host = this.blipTranslationFooterHost
      const id = this.fullDocument && this.fullDocument.id
      return host && id && host.isLifted(id) ? id : null
    },
    translationFooterPlacement() {
      if (!this.isTranslationActive) {
        return TranslationFooterPlacements.NONE
      }

      if (this.translationFooterHostId) {
        return TranslationFooterPlacements.HOST
      }

      // Inside a group the per-card date row is hidden, so the footer gets its own row.
      return this.blipTranslationFooterHost || !this.hasTranslationDateRow
        ? TranslationFooterPlacements.ROW
        : TranslationFooterPlacements.DATE
    },
    translationHostFooter() {
      if (this.translationFooterPlacement !== TranslationFooterPlacements.HOST) {
        return null
      }

      return {
        id: this.translationFooterHostId,
        state: this.translationState,
        label: this.translationFooterLabel,
        actionLabel: this.translationFooterActionLabel,
        position: this.position,
        onAction: this.onTranslationAction
      }
    }
  },
  watch: {
    translationGlobalShowOriginal() {
      this.translationShowOriginalOverride = null
    },
    translationHostFooter: {
      immediate: true,
      handler(footer) {
        this.syncTranslationHostFooter(footer)
      }
    }
  },
  beforeDestroy() {
    this.syncTranslationHostFooter(null)
  },
  methods: {
    syncTranslationHostFooter(footer) {
      const host = this.blipTranslationFooterHost
      if (!host) {
        return
      }

      if (this.translationHostFooterId && (!footer || footer.id !== this.translationHostFooterId)) {
        host.removeFooter(this.translationHostFooterId, this)
      }

      this.translationHostFooterId = footer ? footer.id : null
      if (footer) {
        host.setFooter(footer.id, footer, this)
      }
    },
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

      this.translationShowOriginalOverride = false

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
