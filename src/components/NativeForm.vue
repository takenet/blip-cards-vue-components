<template>
  <div class="blip-container native-form" :class="isFailedMessage(status, position)">
    <bds-grid :direction="position === 'left' ? 'row' : 'row-reverse'" justifyContent="space-between" gap="1" align-items="center">
      <div :class="`bubble ${position}`">
        <bds-button-icon v-if="deletable"
          class="editIco trashIco icon-button-margin icon-button-top"
          icon="trash"
          variant="delete"
          size="short"
          v-on:click="trash(document)"
        ></bds-button-icon>

        <div class="label-wrappper" v-if="document.label && document.label.value">
          <span v-html="sanitize(document.label.value)"></span>
        </div>

        <form v-if="!submitted" novalidate ref="form" v-on:submit.prevent="submit" class="native-form-fields">
          <fieldset :disabled="hideOptions" class="native-form-fieldset">
            <div v-if="isMultiStep" class="native-form-progress" aria-live="polite">
              <span class="native-form-step-count">Etapa {{ currentStepIndex + 1 }} de {{ formSteps.length }}</span>
              <span v-if="currentStepTitle" class="native-form-step-title">{{ currentStepTitle }}</span>
              <div class="native-form-progress-bar">
                <div class="native-form-progress-fill" :style="{ width: progressWidth }"></div>
              </div>
            </div>

            <div class="form-group" v-for="field in currentFields" :key="field.id" :class="{ 'has-error': showError(field), 'is-valid': showValid(field) }">
              <fieldset v-if="isOptionGroup(field)"
                class="native-form-group-fieldset"
                :role="field.type === 'radio' ? 'radiogroup' : undefined"
                :aria-required="ariaRequired(field)"
                :aria-describedby="describedBy(field)"
              >
                <legend>{{ field.label }}</legend>
                <label v-for="(option, index) in field.options"
                  :key="option.value"
                  :for="optionInputId(field.id, index)"
                  class="native-form-option"
                >
                  <input v-if="field.type === 'radio'"
                    type="radio"
                    :id="optionInputId(field.id, index)"
                    :name="fieldInputId(field.id)"
                    :value="option.value"
                    :required="!!field.required"
                    :aria-invalid="showError(field) ? 'true' : 'false'"
                    v-model="formValues[field.id]"
                    v-on:change="touch(field)"
                  >
                  <input v-else
                    type="checkbox"
                    :id="optionInputId(field.id, index)"
                    :name="fieldInputId(field.id)"
                    :value="option.value"
                    :aria-invalid="showError(field) ? 'true' : 'false'"
                    v-model="formValues[field.id]"
                    v-on:change="touch(field)"
                  >
                  <span class="native-form-option-text">{{ option.label }}</span>
                </label>
              </fieldset>

              <template v-else>
                <label :for="fieldInputId(field.id)">{{ field.label }}</label>

                <select v-if="field.type === 'select'"
                  :id="fieldInputId(field.id)"
                  :required="!!field.required"
                  :aria-required="ariaRequired(field)"
                  :aria-invalid="showError(field) ? 'true' : 'false'"
                  :aria-describedby="describedBy(field)"
                  v-model="formValues[field.id]"
                  v-on:change="touch(field)"
                  v-on:blur="touch(field)"
                  class="form-control"
                >
                  <option value="" disabled>{{ field.label }}</option>
                  <option v-for="option in field.options" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>

                <textarea v-else-if="field.type === 'textarea'"
                  :id="fieldInputId(field.id)"
                  :required="!!field.required"
                  :aria-required="ariaRequired(field)"
                  rows="3"
                  :placeholder="field.placeholder"
                  :maxlength="maxLengthAttr(field)"
                  :aria-invalid="showError(field) ? 'true' : 'false'"
                  :aria-describedby="describedBy(field)"
                  v-model="formValues[field.id]"
                  v-on:blur="touch(field)"
                  class="form-control"
                ></textarea>

                <div v-else-if="isFileList(field)" class="native-form-file">
                  <input
                    type="file"
                    multiple
                    class="native-form-file-input"
                    :id="fieldInputId(field.id)"
                    :accept="field.accept"
                    :required="!!field.required"
                    :disabled="isFileLimitReached(field)"
                    :aria-required="ariaRequired(field)"
                    :aria-invalid="showError(field) ? 'true' : 'false'"
                    :aria-describedby="describedBy(field)"
                    v-on:change="onFilesChange(field, $event)"
                  >
                  <label v-if="!isFileLimitReached(field)" :for="fieldInputId(field.id)" class="native-form-file-button" aria-hidden="true">
                    {{ fileItems(field).length > 0 ? 'Adicionar arquivo' : 'Escolher arquivos' }}
                  </label>
                  <span class="native-form-file-count">{{ fileItems(field).length }} de {{ maxFilesOf(field) }} arquivos</span>
                  <ul class="native-form-file-list" aria-live="polite">
                    <li v-for="item in fileItems(field)" :key="item.key" class="native-form-file-item">
                      <span class="native-form-file-status" :class="'is-' + item.status">
                        <span v-if="item.status === 'uploading'" class="native-form-spinner" aria-hidden="true"></span>
                        <template v-if="item.status === 'uploading'">Enviando… {{ item.fileName }}</template>
                        <template v-else-if="item.status === 'done'">✓ {{ item.fileName }}</template>
                        <template v-else>{{ item.fileName }}</template>
                      </span>
                      <button type="button"
                        class="native-form-file-remove"
                        :id="fileRemoveId(field.id, item.key)"
                        :aria-label="`Remover ${item.fileName}`"
                        v-on:click="removeFile(field, item)"
                      >Remover</button>
                    </li>
                  </ul>
                </div>

                <div v-else-if="field.type === 'file'" class="native-form-file">
                  <input
                    type="file"
                    class="native-form-file-input"
                    :id="fieldInputId(field.id)"
                    :accept="field.accept"
                    :required="!!field.required"
                    :aria-required="ariaRequired(field)"
                    :aria-invalid="showError(field) ? 'true' : 'false'"
                    :aria-describedby="describedBy(field)"
                    v-on:change="onFileChange(field, $event)"
                  >
                  <label :for="fieldInputId(field.id)" class="native-form-file-button" aria-hidden="true">
                    {{ uploads[field.id] && uploads[field.id].fileName ? 'Trocar arquivo' : 'Escolher arquivo' }}
                  </label>
                  <span class="native-form-live" aria-live="polite">
                    <span v-if="uploads[field.id] && uploads[field.id].fileName"
                      class="native-form-file-status"
                      :class="'is-' + uploads[field.id].status"
                    >
                      <span v-if="uploads[field.id].status === 'uploading'" class="native-form-spinner" aria-hidden="true"></span>
                      <template v-if="uploads[field.id].status === 'uploading'">Enviando… {{ uploads[field.id].fileName }}</template>
                      <template v-else-if="uploads[field.id].status === 'done'">✓ {{ uploads[field.id].fileName }}</template>
                      <template v-else>{{ uploads[field.id].fileName }}</template>
                    </span>
                  </span>
                </div>

                <input v-else
                  :id="fieldInputId(field.id)"
                  :required="!!field.required"
                  :aria-required="ariaRequired(field)"
                  :type="inputType(field.type)"
                  :inputmode="inputMode(field)"
                  :autocomplete="autocompleteAttr(field)"
                  :placeholder="field.placeholder"
                  :maxlength="maxLengthAttr(field)"
                  :min="rangeAttr(field, 'min')"
                  :max="rangeAttr(field, 'max')"
                  :aria-invalid="showError(field) ? 'true' : 'false'"
                  :aria-describedby="describedBy(field)"
                  :value="formValues[field.id]"
                  v-on:input="onTextInput(field, $event)"
                  v-on:compositionstart="onCompositionStart"
                  v-on:compositionend="onCompositionEnd(field, $event)"
                  v-on:change="onTextInput(field, $event); touch(field)"
                  v-on:blur="touch(field)"
                  class="form-control"
                >
              </template>

              <small v-if="field.helpText" :id="helpId(field.id)" class="native-form-help">{{ field.helpText }}</small>
              <span class="native-form-live" aria-live="polite">
                <span v-if="showError(field)" :id="errorId(field.id)" class="native-form-error">
                  {{ fieldErrors[field.id].message }}
                </span>
                <span v-if="fileNotice(field)" class="native-form-error native-form-file-notice">{{ fileNotice(field) }}</span>
              </span>
            </div>

            <div class="native-form-actions" :class="{ 'is-multi-step': isMultiStep }">
              <button v-if="currentStepIndex > 0" type="button" class="native-form-back" v-on:click="back">{{ backLabelText }}</button>
              <!-- Distinct keys: a step change never reuses the element that received the previous click -->
              <button v-if="isLastStep" key="native-form-submit" type="submit" class="native-form-submit">{{ submitLabelText }}</button>
              <button v-else key="native-form-next" type="submit" class="native-form-submit native-form-next">{{ nextLabelText }}</button>
            </div>
          </fieldset>
        </form>

        <div v-else class="native-form-summary">
          <span v-for="field in formFields" :key="field.id" class="native-form-summary-item">
            {{ field.label }}:
            <template v-if="isFileList(field)">
              <span v-for="(item, index) in doneFileItems(field)" :key="item.key">{{ index > 0 ? ', ' : '' }}<a
                  v-if="linkableUri(item.uri)"
                  class="native-form-file-link"
                  :href="linkableUri(item.uri)"
                  target="_blank"
                  rel="noopener noreferrer"
                  v-on:click.prevent="openFile(linkableUri(item.uri))"
                >{{ item.fileName }}</a><template v-else>{{ item.fileName }}</template></span>
            </template>
            <a
              v-else-if="fileLinkUri(field)"
              class="native-form-file-link"
              :href="fileLinkUri(field)"
              target="_blank"
              rel="noopener noreferrer"
              v-on:click.prevent="openFile(fileLinkUri(field))"
            >{{ formattedFieldValue(field) }}</a>
            <template v-else>{{ formattedFieldValue(field) }}</template>
          </span>
        </div>
      </div>
      <blip-card-reply
        :document="fullDocument"
        :reply-callback="replyCallback"
      />
    </bds-grid>

    <div class="flex" v-if="date" :class="'notification ' + position">
      <img v-if="this.status === 'waiting' && this.position === 'right'" :src="clockSvg">
      <img v-else-if="status === 'accepted' && this.position === 'right'" :src="checkSentSvg"/>
      <img v-else-if="status === 'received' && this.position === 'right'" :src="doubleCheckReceivedSvg"/>
      <img v-else-if="status === 'consumed' && this.position === 'right'" :src="doubleCheckReadSvg"/>
      <div class="failure" v-else-if="this.status === 'failed' && this.position === 'right'">
        {{ failedToSendMsg }}
      </div>
      <blip-card-date
        :status="status"
        :position="position"
        :date="date"
        :failed-to-send-msg="failedToSendMsg"
        :is-external-message="isExternalMessage"
        :external-message-text="externalMessageText"
      />
    </div>
  </div>
</template>

<script>
import { isFailedMessage } from '../utils/misc'
import { default as base } from '../mixins/baseComponent.js'

const FIELD_TYPES = ['text', 'number', 'email', 'tel', 'date', 'textarea', 'select', 'radio', 'checkbox', 'file']
const OPTION_TYPES = ['select', 'radio', 'checkbox']
const LENGTH_TYPES = ['text', 'email', 'tel', 'textarea']
const MASK_TYPES = ['text', 'tel']
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const DEFAULT_MAX_SIZE_MB = 20
const DEFAULT_MAX_FILES = 10
// Primary button actions right after a step change are ignored (double click on "Continuar")
const STEP_CHANGE_GUARD_MS = 400

const DEFAULT_MESSAGES = {
  required: 'Preencha este campo.',
  email: 'Informe um e-mail válido.',
  tel: 'Informe um telefone válido.',
  minLength: 'Informe pelo menos {min} caracteres.',
  maxLength: 'Informe no máximo {max} caracteres.',
  min: 'O valor mínimo é {min}.',
  max: 'O valor máximo é {max}.',
  pattern: 'Formato inválido.',
  mask: 'Preencha no formato {mask}.',
  fileType: 'Tipo de arquivo não permitido.',
  fileSize: 'O arquivo deve ter no máximo {max} MB.',
  uploadFailed: 'Não foi possível enviar o arquivo. Tente novamente.',
  uploading: 'Aguarde o envio do arquivo.',
  maxFiles: 'Você pode enviar no máximo {max} arquivos.'
}

// Notices that `field.errorMessage` does not replace
const NOTICE_KEYS = ['uploading', 'maxFiles']

const isMaskSlot = (char) => char === '0' || char === 'A' || char === '*'

const fitsMaskSlot = (char, slot) => {
  if (slot === '0') {
    return /[0-9]/.test(char)
  }
  if (slot === 'A') {
    return /[a-zA-Z\u00C0-\u00FF]/.test(char)
  }
  return /[0-9a-zA-Z\u00C0-\u00FF]/.test(char)
}

// Re-formats a typed value against a mask: keeps only the characters that fit each slot,
// inserts the literal characters automatically and truncates at the mask length.
const applyMask = (rawValue, mask) => {
  const raw = String(rawValue || '')
  let result = ''
  // Literals are only written once the next slot is filled, so the value never ends with them
  let pendingLiterals = ''
  let rawIndex = 0

  for (let maskIndex = 0; maskIndex < mask.length && rawIndex < raw.length; maskIndex++) {
    const maskChar = mask[maskIndex]

    if (isMaskSlot(maskChar)) {
      while (rawIndex < raw.length && !fitsMaskSlot(raw[rawIndex], maskChar)) {
        rawIndex++
      }
      if (rawIndex >= raw.length) {
        break
      }
      result += pendingLiterals + raw[rawIndex]
      pendingLiterals = ''
      rawIndex++
    } else {
      pendingLiterals += maskChar
      if (raw[rawIndex] === maskChar) {
        rawIndex++
      }
    }
  }

  // Completes trailing literals (e.g. a mask ending with a suffix) once every slot is filled
  const remaining = mask.slice(result.length)
  if (result && !remaining.split('').some(isMaskSlot)) {
    return result + remaining
  }

  return result
}

const isFiniteNumber = (value) => value !== undefined && value !== null && value !== '' && isFinite(Number(value))

// A pre-fill value that still contains a variable the bot flow did not resolve
// (e.g. "{{contact.extras.cpf}}" or "Rua {{contact.street}}") is treated as empty
const UNRESOLVED_PLACEHOLDER = /\{\{.*?\}\}/
// Number grammar accepted by <input type="number"> (rejects "+5", "0x10", "1.")
const HTML_NUMBER = /^-?(\d+(\.\d+)?|\.\d+)([eE][-+]?\d+)?$/

const isRealIsoDate = (value) => {
  const match = ISO_DATE.exec(value)
  if (!match) {
    return false
  }
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  return date.getFullYear() === Number(match[1]) &&
    date.getMonth() === Number(match[2]) - 1 &&
    date.getDate() === Number(match[3])
}

// Pre-fill scalar: trimmed strings (unless with an unresolved placeholder) and finite numbers, as a string
const prefillText = (value) => {
  if (typeof value === 'number') {
    return isFinite(value) ? String(value) : ''
  }
  if (typeof value !== 'string' || UNRESOLVED_PLACEHOLDER.test(value)) {
    return ''
  }
  return value.trim()
}

const sameValue = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const formatIsoDate = (value) => {
  const match = ISO_DATE.exec(value || '')
  return match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])).toLocaleDateString()
    : value
}

const WILDCARD_EXTENSIONS = {
  'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.heif', '.bmp'],
  'video/*': ['.mp4', '.mov', '.webm', '.3gp', '.m4v'],
  'audio/*': ['.mp3', '.ogg', '.oga', '.opus', '.wav', '.m4a', '.aac'],
  'application/pdf': ['.pdf']
}

const hasExtension = (fileName, extension) =>
  fileName.length >= extension.length && fileName.slice(-extension.length) === extension

const emptyUpload = () => ({ status: 'idle', fileName: '', message: '', token: 0, items: [], notice: '' })

// `file` fields with `multiple: true` (list of files) have their own kind, so toggling it resets the field
const isFileKind = (kind) => kind === 'file' || kind === 'file[]'

const fileMaxSizeMb = (field) => isFiniteNumber(field.maxSizeMb) && Number(field.maxSizeMb) > 0
  ? Number(field.maxSizeMb)
  : DEFAULT_MAX_SIZE_MB

// File name written as a link in the summary text; names or addresses that cannot be written safely
// keep "name - address"
const linkedFileName = (name, uri) => {
  const canBeNamed = !/[[\]<>"]|:\/\/|www\./i.test(name) && !/[\s()"'<>]/.test(uri)
  return canBeNamed ? `[${name}](${uri})` : `${name} - ${uri}`
}

const fileMatchesAccept = (file, accept) => {
  if (!accept) {
    return true
  }

  const fileName = (file.name || '').toLowerCase()
  const fileType = (file.type || '').toLowerCase()

  return accept.split(',')
    .map((rule) => rule.trim().toLowerCase())
    .filter((rule) => rule)
    .some((rule) => {
      if (rule.charAt(0) === '.') {
        return hasExtension(fileName, rule)
      }
      if (!fileType) {
        // Some platforms do not report the MIME type: fall back to the file extension
        return (WILDCARD_EXTENSIONS[rule] || []).some((extension) => hasExtension(fileName, extension))
      }
      if (rule.slice(-2) === '/*') {
        return fileType.indexOf(rule.slice(0, -1)) === 0
      }
      return fileType === rule
    })
}

export default {
  name: 'native-form',
  $__veeInject: false,
  mixins: [base],
  props: {
    hideOptions: {
      type: Boolean,
      default: false
    },
    onSelected: {
      type: Function
    },
    onUploadFile: {
      type: Function,
      default: undefined
    },
    onMediaSelected: {
      type: Function,
      default: undefined
    },
    status: {
      type: String,
      default: ''
    },
    failedToSendMsg: {
      type: String,
      default: 'Falha ao enviar a mensagem.'
    },
    submitLabelMsg: {
      type: String,
      default: 'Enviar'
    },
    replyCallback: {
      type: Function,
      default: undefined
    },
    translations: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    formValidation: function() {
      return (this.document && this.document.validation) || {}
    },
    formSteps: function() {
      const validation = this.formValidation
      const rawSteps = Array.isArray(validation.steps) && validation.steps.length > 0
        ? validation.steps
        : [{ fields: validation.fields }]

      const steps = rawSteps
        .map((step) => ({
          title: step && typeof step.title === 'string' ? step.title : '',
          fields: this.normalizeFields(step && step.fields)
        }))
        .filter((step) => step.fields.length > 0)

      return steps.length > 0 ? steps : [{ title: '', fields: [] }]
    },
    formFields: function() {
      return this.formSteps.reduce((all, step) => all.concat(step.fields), [])
    },
    fieldsSignature: function() {
      // Changes whenever a field is added/removed/retyped or file fields become (un)available
      return this.formFields.map((field) => `${field.id}:${this.fieldKind(field)}`).join('|') +
        `#${typeof this.onUploadFile === 'function'}`
    },
    currentStepIndex: function() {
      return Math.min(Math.max(this.currentStep, 0), this.formSteps.length - 1)
    },
    currentFields: function() {
      return this.formSteps[this.currentStepIndex].fields
    },
    currentStepTitle: function() {
      return this.formSteps[this.currentStepIndex].title
    },
    isMultiStep: function() {
      return this.formSteps.length > 1
    },
    isLastStep: function() {
      return this.currentStepIndex === this.formSteps.length - 1
    },
    progressWidth: function() {
      return `${((this.currentStepIndex + 1) / this.formSteps.length) * 100}%`
    },
    fieldErrors: function() {
      return this.formFields.reduce((result, field) => {
        result[field.id] = this.validateField(field)
        return result
      }, {})
    },
    submitLabelText: function() {
      return this.formValidation.submitLabel || this.submitLabelMsg
    },
    nextLabelText: function() {
      return this.formValidation.nextLabel || 'Continuar'
    },
    backLabelText: function() {
      return this.formValidation.backLabel || 'Voltar'
    }
  },
  watch: {
    fieldsSignature: function(newSignature, oldSignature) {
      const idsOf = (signature) => signature.split('#')[0].split('|').map((entry) => entry.split(':')[0]).join('|')
      this.syncFieldState(idsOf(newSignature) !== idsOf(oldSignature))
    }
  },
  data: function() {
    return {
      formValues: {},
      prefilled: {},
      touched: {},
      attempted: {},
      uploads: {},
      currentStep: 0,
      submitted: false,
      instanceId: Math.random().toString(36).slice(2),
      isFailedMessage
    }
  },
  methods: {
    init: function() {
      const formValues = {}
      const prefilled = {}
      const touched = {}
      const attempted = {}
      const uploads = {}

      this.fieldTypes = {}

      this.formFields.forEach((field) => {
        this.fieldTypes[field.id] = this.fieldKind(field)
        formValues[field.id] = this.initialValue(field)
        prefilled[field.id] = !this.isEmptyValue(field, formValues[field.id])
        touched[field.id] = false
        attempted[field.id] = false
        uploads[field.id] = emptyUpload()
      })

      this.formValues = formValues
      this.prefilled = prefilled
      this.touched = touched
      this.attempted = attempted
      this.uploads = uploads
      this.currentStep = 0
      this.submitted = false
      this.uploadSequence = 0
      this.lastStepChangeAt = 0
    },
    // Keeps the reactive state in line with the current fields when the document (or the upload
    // support) changes on a mounted instance: existing values are preserved (a new pre-fill `value` of an
    // existing field never overwrites what the user typed), missing keys are added with their pre-fill.
    // A field that keeps its id but changes type has its current value normalised with the pre-fill
    // rules of the new type (e.g. text "abc" -> select without such option = empty); an empty result,
    // or any change to/from file (including turning `multiple` on/off), falls back to the new type's pre-fill.
    // Its `prefilled` flag is then recomputed: true only while the value is the new type's pre-fill.
    syncFieldState: function(idsChanged) {
      const previousTypes = this.fieldTypes || {}
      const fieldTypes = {}

      this.formFields.forEach((field) => {
        const value = this.formValues[field.id]
        const previousType = previousTypes[field.id]
        const kind = this.fieldKind(field)
        fieldTypes[field.id] = kind

        if (value === undefined) {
          const initial = this.initialValue(field)
          this.$set(this.formValues, field.id, initial)
          this.$set(this.prefilled, field.id, !this.isEmptyValue(field, initial))
        } else if (previousType && previousType !== kind) {
          const initial = this.initialValue(field)
          const involvesFile = isFileKind(previousType) || isFileKind(kind)
          const normalized = involvesFile ? '' : this.initialValue({ ...field, value })
          const nextValue = this.isEmptyValue(field, normalized) ? initial : normalized
          if (involvesFile) {
            this.$set(this.uploads, field.id, emptyUpload())
          }
          this.$set(this.formValues, field.id, nextValue)
          this.$set(this.prefilled, field.id, !this.isEmptyValue(field, nextValue) && sameValue(nextValue, initial))
        } else if (field.type === 'checkbox' || kind === 'file[]') {
          if (!Array.isArray(value)) {
            this.$set(this.formValues, field.id, [])
          }
        } else if (value === null || Array.isArray(value)) {
          this.$set(this.formValues, field.id, '')
        }
        if (!(field.id in this.touched) || idsChanged) {
          this.$set(this.touched, field.id, false)
        }
        if (!(field.id in this.attempted) || idsChanged) {
          this.$set(this.attempted, field.id, false)
        }
        if (!this.uploads[field.id]) {
          this.$set(this.uploads, field.id, emptyUpload())
        }
      })

      this.fieldTypes = fieldTypes

      if (idsChanged) {
        this.currentStep = 0
        this.lastStepChangeAt = 0
      }
    },
    // Initial value of a field from its optional `value` (data the bot flow already knows)
    initialValue: function(field) {
      const value = field.value

      if (field.type === 'checkbox') {
        const wanted = (Array.isArray(value) ? value : [value])
          .map(prefillText)
          .filter((item) => item !== '')
        // Only existing options, in the options order
        return (field.options || [])
          .filter((option) => wanted.indexOf(String(option.value)) !== -1)
          .map((option) => option.value)
      }

      if (field.type === 'file') {
        return this.isFileList(field) ? [] : ''
      }

      const text = prefillText(value)
      if (!text) {
        return ''
      }

      if (field.type === 'select' || field.type === 'radio') {
        const option = (field.options || []).find((item) => String(item.value) === text)
        return option ? option.value : ''
      }

      if (field.type === 'number') {
        return HTML_NUMBER.test(text) ? text : ''
      }

      if (field.type === 'date') {
        return isRealIsoDate(text) ? text : ''
      }

      const mask = this.fieldMask(field)
      return mask ? applyMask(text, mask) : text
    },
    // Current value as it counts for validation/sending: select/radio values that are not options are
    // empty and checkbox arrays keep only existing options, in the options order
    effectiveValue: function(field) {
      const value = this.formValues[field.id]

      // A list of files is read from its upload state: the addresses already uploaded, in the order picked
      if (this.isFileList(field)) {
        return this.doneFileItems(field).map((item) => item.uri)
      }

      if (field.type === 'checkbox') {
        return (field.options || [])
          .filter((option) => Array.isArray(value) && value.indexOf(option.value) !== -1)
          .map((option) => option.value)
      }

      if (field.type === 'select' || field.type === 'radio') {
        return (field.options || []).some((option) => option.value === value) ? value : ''
      }

      return value === undefined || value === null ? '' : value
    },
    isEmptyValue: function(field, value) {
      return field.type === 'checkbox' || this.isFileList(field)
        ? !Array.isArray(value) || value.length === 0
        : String(value === undefined || value === null ? '' : value).trim() === ''
    },
    goToStep: function(index) {
      if (index !== this.currentStepIndex) {
        this.currentStep = index
        this.lastStepChangeAt = Date.now()
      }
    },
    ariaRequired: function(field) {
      return field.required ? 'true' : undefined
    },
    normalizeFields: function(fields) {
      if (!Array.isArray(fields)) {
        return []
      }

      return fields
        .filter((field) => field && field.id)
        .map((field) => ({
          ...field,
          type: FIELD_TYPES.indexOf(field.type) !== -1 ? field.type : 'text'
        }))
        // Skips authoring mistakes that would otherwise block the submission or mix values up
        .filter((field) => {
          if (OPTION_TYPES.indexOf(field.type) !== -1) {
            return Array.isArray(field.options) && field.options.length > 0
          }
          if (field.type === 'file') {
            return typeof this.onUploadFile === 'function'
          }
          return true
        })
    },
    isOptionGroup: function(field) {
      return field.type === 'radio' || field.type === 'checkbox'
    },
    isFileList: function(field) {
      return field.type === 'file' && field.multiple === true
    },
    fieldKind: function(field) {
      return this.isFileList(field) ? 'file[]' : field.type
    },
    maxFilesOf: function(field) {
      const max = Math.floor(Number(field.maxFiles))
      return isFiniteNumber(field.maxFiles) && max >= 1 ? max : DEFAULT_MAX_FILES
    },
    fileItems: function(field) {
      const upload = this.uploads[field.id]
      return (upload && upload.items) || []
    },
    doneFileItems: function(field) {
      return this.fileItems(field).filter((item) => item.status === 'done')
    },
    isFileLimitReached: function(field) {
      return this.fileItems(field).length >= this.maxFilesOf(field)
    },
    fileNotice: function(field) {
      const upload = this.uploads[field.id]
      return this.isFileList(field) && upload ? upload.notice : ''
    },
    fileRemoveId: function(fieldId, itemKey) {
      return `${this.fieldInputId(fieldId)}-remove-${itemKey}`
    },
    fieldMask: function(field) {
      return MASK_TYPES.indexOf(field.type) !== -1 && typeof field.mask === 'string' && field.mask
        ? field.mask
        : ''
    },
    inputType: function(fieldType) {
      return ['text', 'number', 'date', 'email', 'tel'].indexOf(fieldType) !== -1 ? fieldType : 'text'
    },
    inputMode: function(field) {
      if (field.type === 'email' || field.type === 'tel') {
        return field.type
      }
      const mask = this.fieldMask(field)
      if (mask && mask.indexOf('A') === -1 && mask.indexOf('*') === -1) {
        return 'numeric'
      }
      return undefined
    },
    autocompleteAttr: function(field) {
      return field.type === 'email' || field.type === 'tel' ? field.type : undefined
    },
    maxLengthAttr: function(field) {
      const mask = this.fieldMask(field)
      if (mask) {
        return mask.length
      }
      return LENGTH_TYPES.indexOf(field.type) !== -1 && isFiniteNumber(field.maxLength)
        ? Number(field.maxLength)
        : undefined
    },
    rangeAttr: function(field, key) {
      if (field.type === 'number' && isFiniteNumber(field[key])) {
        return field[key]
      }
      if (field.type === 'date' && ISO_DATE.test(field[key] || '')) {
        return field[key]
      }
      return undefined
    },
    fieldInputId: function(fieldId) {
      return `native-form-${this.instanceId}-${fieldId}`
    },
    optionInputId: function(fieldId, index) {
      return `${this.fieldInputId(fieldId)}-${index}`
    },
    helpId: function(fieldId) {
      return `${this.fieldInputId(fieldId)}-help`
    },
    errorId: function(fieldId) {
      return `${this.fieldInputId(fieldId)}-error`
    },
    describedBy: function(field) {
      const ids = []
      if (field.helpText) {
        ids.push(this.helpId(field.id))
      }
      if (this.showError(field)) {
        ids.push(this.errorId(field.id))
      }
      return ids.length > 0 ? ids.join(' ') : undefined
    },
    message: function(field, key, params) {
      const customMessages = this.formValidation.messages || {}
      const template = (NOTICE_KEYS.indexOf(key) === -1 && field.errorMessage) ||
        customMessages[key] ||
        DEFAULT_MESSAGES[key]

      return Object.keys(params || {}).reduce(
        (text, param) => text.split(`{${param}}`).join(params[param]),
        String(template)
      )
    },
    error: function(field, key, params) {
      return { key, message: this.message(field, key, params) }
    },
    validateField: function(field) {
      if (this.isFileList(field)) {
        const items = this.fileItems(field)
        // A failed file is reported right away (the user removes it); pending uploads only block
        const failed = items.find((item) => item.status === 'error')
        if (failed) {
          return { key: failed.errorKey, message: `${failed.fileName}: ${failed.message}` }
        }
        if (items.some((item) => item.status === 'uploading')) {
          return this.error(field, 'uploading')
        }
        return field.required && this.doneFileItems(field).length === 0 ? this.error(field, 'required') : null
      }

      const value = this.effectiveValue(field)

      if (field.type === 'file') {
        const upload = this.uploads[field.id] || {}
        if (upload.status === 'uploading') {
          return this.error(field, 'uploading')
        }
        if (upload.status === 'error') {
          return { key: upload.errorKey, message: upload.message }
        }
      }

      const isEmpty = this.isEmptyValue(field, value)

      if (isEmpty) {
        return field.required ? this.error(field, 'required') : null
      }

      if (field.type === 'checkbox' || field.type === 'file' || field.type === 'select' || field.type === 'radio') {
        return null
      }

      const text = String(value)
      const mask = this.fieldMask(field)

      if (field.type === 'email' && !EMAIL.test(text.trim())) {
        return this.error(field, 'email')
      }

      if (mask) {
        if (text.length !== mask.length) {
          return this.error(field, 'mask', { mask })
        }
      } else if (field.type === 'tel') {
        const digits = text.replace(/\D/g, '').length
        if (digits < 8 || digits > 15) {
          return this.error(field, 'tel')
        }
      }

      if (LENGTH_TYPES.indexOf(field.type) !== -1) {
        if (isFiniteNumber(field.minLength) && text.length < Number(field.minLength)) {
          return this.error(field, 'minLength', { min: field.minLength })
        }
        if (isFiniteNumber(field.maxLength) && text.length > Number(field.maxLength)) {
          return this.error(field, 'maxLength', { max: field.maxLength })
        }
      }

      if (typeof field.pattern === 'string' && field.pattern) {
        let regex = null
        try {
          regex = new RegExp(`^(?:${field.pattern})$`)
        } catch (e) {
          regex = null
        }
        if (regex && !regex.test(text)) {
          return this.error(field, 'pattern')
        }
      }

      if (field.type === 'number') {
        if (!isFiniteNumber(text)) {
          return this.error(field, 'pattern')
        }
        if (isFiniteNumber(field.min) && Number(text) < Number(field.min)) {
          return this.error(field, 'min', { min: field.min })
        }
        if (isFiniteNumber(field.max) && Number(text) > Number(field.max)) {
          return this.error(field, 'max', { max: field.max })
        }
      }

      if (field.type === 'date') {
        if (!ISO_DATE.test(text)) {
          return this.error(field, 'pattern')
        }
        if (ISO_DATE.test(field.min || '') && text < field.min) {
          return this.error(field, 'min', { min: formatIsoDate(field.min) })
        }
        if (ISO_DATE.test(field.max || '') && text > field.max) {
          return this.error(field, 'max', { max: formatIsoDate(field.max) })
        }
      }

      return null
    },
    showError: function(field) {
      const fieldError = this.fieldErrors[field.id]
      if (!fieldError || !this.touched[field.id]) {
        return false
      }
      // The "wait for the upload" message is shown only when the user tries to move on
      return fieldError.key !== 'uploading' || this.attempted[field.id]
    },
    // Success style for single-value controls (option groups stay neutral; files already show ✓):
    // a valid non-empty value once the field was left/attempted, or from the start when pre-filled
    showValid: function(field) {
      if (this.isOptionGroup(field) || field.type === 'file' || this.fieldErrors[field.id]) {
        return false
      }
      if (this.isEmptyValue(field, this.effectiveValue(field))) {
        return false
      }
      return !!(this.touched[field.id] || this.attempted[field.id] || this.prefilled[field.id])
    },
    touch: function(field) {
      this.$set(this.touched, field.id, true)
    },
    onCompositionStart: function(event) {
      event.target.composing = true
    },
    onCompositionEnd: function(field, event) {
      if (!event.target.composing) {
        return
      }
      event.target.composing = false
      this.onTextInput(field, event)
    },
    onTextInput: function(field, event) {
      const target = event.target
      // Waits for the IME composition to finish (the mask would break the composed text)
      if (event.isComposing || target.composing) {
        return
      }
      const mask = this.fieldMask(field)
      let value = target.value

      if (mask) {
        value = applyMask(value, mask)
        if (target.value !== value) {
          target.value = value
        }
      }

      this.$set(this.formValues, field.id, value)
    },
    onFileChange: function(field, event) {
      const input = event.target
      const file = input.files && input.files[0]

      if (!file || this.hideOptions || this.submitted) {
        return
      }

      // Lets the user pick the same file again after a failure
      input.value = ''

      this.uploadSequence = (this.uploadSequence || 0) + 1
      const token = this.uploadSequence
      const fileName = file.name || ''
      const maxSizeMb = fileMaxSizeMb(field)

      this.$set(this.touched, field.id, true)
      this.$set(this.attempted, field.id, false)
      this.$set(this.formValues, field.id, '')

      const setUpload = (status, errorKey, params) => {
        this.$set(this.uploads, field.id, {
          status,
          fileName,
          token,
          errorKey: errorKey || '',
          message: errorKey ? this.message(field, errorKey, params) : ''
        })
      }

      if (!fileMatchesAccept(file, field.accept)) {
        setUpload('error', 'fileType')
        return
      }

      if (file.size > maxSizeMb * 1024 * 1024) {
        setUpload('error', 'fileSize', { max: maxSizeMb })
        return
      }

      setUpload('uploading')

      const isCurrent = () => this.uploads[field.id] && this.uploads[field.id].token === token

      Promise.resolve()
        .then(() => this.onUploadFile(file))
        .then((result) => {
          const uri = typeof result === 'string' ? result : result && result.uri
          if (!uri || typeof uri !== 'string') {
            throw new Error('Upload did not return a URI')
          }
          if (isCurrent()) {
            this.$set(this.formValues, field.id, uri)
            setUpload('done')
          }
        })
        .catch(() => {
          if (isCurrent()) {
            this.$set(this.formValues, field.id, '')
            setUpload('error', 'uploadFailed')
          }
        })
    },
    // List of files: files beyond the limit are left out with a notice; the others are checked and
    // uploaded in parallel, each one keeping its place in the list
    onFilesChange: function(field, event) {
      const input = event.target
      const files = Array.prototype.slice.call(input.files || [])

      if (files.length === 0 || this.hideOptions || this.submitted) {
        return
      }

      input.value = ''

      const max = this.maxFilesOf(field)
      const maxSizeMb = fileMaxSizeMb(field)
      const currentItems = this.fileItems(field)
      const remaining = Math.max(max - currentItems.length, 0)
      const picked = files.slice(0, remaining).map((file) => {
        this.uploadSequence = (this.uploadSequence || 0) + 1
        const item = {
          key: this.uploadSequence,
          fileName: file.name || '',
          status: 'uploading',
          uri: '',
          errorKey: '',
          message: ''
        }
        if (!fileMatchesAccept(file, field.accept)) {
          Object.assign(item, { status: 'error', errorKey: 'fileType', message: this.message(field, 'fileType') })
        } else if (file.size > maxSizeMb * 1024 * 1024) {
          Object.assign(item, { status: 'error', errorKey: 'fileSize', message: this.message(field, 'fileSize', { max: maxSizeMb }) })
        }
        return { file, item }
      })

      this.$set(this.touched, field.id, true)
      this.$set(this.attempted, field.id, false)
      this.$set(this.uploads, field.id, {
        ...(this.uploads[field.id] || emptyUpload()),
        items: currentItems.concat(picked.map((entry) => entry.item)),
        notice: files.length > remaining ? this.message(field, 'maxFiles', { max }) : ''
      })

      // Results are applied only to items still in the list (not removed nor reset meanwhile)
      const update = (item, changes) => {
        if (this.fileItems(field).indexOf(item) !== -1) {
          Object.assign(item, changes)
        }
      }

      picked
        .filter((entry) => entry.item.status === 'uploading')
        .forEach(({ file, item }) => {
          Promise.resolve()
            .then(() => this.onUploadFile(file))
            .then((result) => {
              const uri = typeof result === 'string' ? result : result && result.uri
              if (!uri || typeof uri !== 'string') {
                throw new Error('Upload did not return a URI')
              }
              update(item, { status: 'done', uri })
            })
            .catch(() => {
              update(item, { status: 'error', uri: '', errorKey: 'uploadFailed', message: this.message(field, 'uploadFailed') })
            })
        })
    },
    removeFile: function(field, item) {
      if (this.hideOptions || this.submitted) {
        return
      }
      const upload = this.uploads[field.id] || emptyUpload()
      this.$set(this.uploads, field.id, {
        ...upload,
        items: this.fileItems(field).filter((current) => current !== item),
        notice: ''
      })
      // The clicked button is gone: focus goes back to the file picker
      this.$nextTick(() => this.focusField(field))
    },
    focusField: function(field) {
      let id = this.isOptionGroup(field) ? this.optionInputId(field.id, 0) : this.fieldInputId(field.id)
      // With the limit reached the picker is disabled: focus the remove button of the file to fix
      if (this.isFileList(field) && this.isFileLimitReached(field)) {
        const items = this.fileItems(field)
        const item = items.find((current) => current.status === 'error') ||
          items.find((current) => current.status === 'uploading')
        if (item) {
          id = this.fileRemoveId(field.id, item.key)
        }
      }
      const element = document.getElementById(id)
      if (element && typeof element.focus === 'function') {
        element.focus()
      }
    },
    validateCurrentStep: function() {
      let firstInvalid = null

      this.currentFields.forEach((field) => {
        this.$set(this.touched, field.id, true)
        this.$set(this.attempted, field.id, true)
        if (!firstInvalid && this.fieldErrors[field.id]) {
          firstInvalid = field
        }
      })

      if (firstInvalid) {
        this.$nextTick(() => this.focusField(firstInvalid))
        return false
      }

      return true
    },
    back: function() {
      if (this.submitted || this.hideOptions || this.currentStepIndex === 0) {
        return
      }
      this.goToStep(this.currentStepIndex - 1)
    },
    // Uploaded file address, only when it is a web link that is safe to open
    fileLinkUri: function(field) {
      if (field.type !== 'file') {
        return ''
      }
      return this.linkableUri(this.effectiveValue(field))
    },
    linkableUri: function(uri) {
      return typeof uri === 'string' && /^https?:\/\//i.test(uri) ? uri : ''
    },
    // The host (e.g. blip-chat) renews expired media links before opening them
    openFile: function(uri) {
      if (typeof this.onMediaSelected === 'function') {
        this.onMediaSelected(uri)
        return
      }
      window.open(uri, '_blank', 'noopener')
    },
    // Text of the answer shown in the conversation: the file name as a link ([name](address), rendered
    // by the plain text card) so the file can still be opened from the history. Other consumers see
    // the address in the text. Names or addresses that cannot be written safely keep "name - address".
    // A list of files has one entry per uploaded file, separated by ", ".
    summaryFieldValue: function(field) {
      if (this.isFileList(field)) {
        return this.doneFileItems(field)
          .map((item) => {
            const uri = this.linkableUri(item.uri)
            return uri && item.fileName ? linkedFileName(item.fileName, uri) : item.fileName
          })
          .join(', ')
      }
      const text = this.formattedFieldValue(field)
      const uri = this.fileLinkUri(field)
      if (!uri || !text) {
        return text
      }
      return linkedFileName(text, uri)
    },
    formattedFieldValue: function(field) {
      if (this.isFileList(field)) {
        return this.doneFileItems(field).map((item) => item.fileName).join(', ')
      }

      const value = this.effectiveValue(field)

      if (field.type === 'date') {
        return formatIsoDate(value)
      }

      if (field.type === 'file') {
        return value && this.uploads[field.id] ? this.uploads[field.id].fileName : ''
      }

      if (field.type === 'checkbox') {
        return (field.options || [])
          .filter((option) => value.indexOf(option.value) !== -1)
          .map((option) => option.label)
          .join(', ')
      }

      if (field.type !== 'select' && field.type !== 'radio') {
        return value
      }

      const selectedOption = (field.options || []).find(
        (option) => option.value === value
      )
      return selectedOption ? selectedOption.label : ''
    },
    fieldContentValue: function(field) {
      // Checkbox values keep the options order regardless of the order the user clicked them
      return this.effectiveValue(field)
    },
    submit: function() {
      if (this.submitted || this.hideOptions || !this.$refs.form) {
        return
      }

      if (this.lastStepChangeAt && Date.now() - this.lastStepChangeAt < STEP_CHANGE_GUARD_MS) {
        return
      }

      if (!this.validateCurrentStep()) {
        return
      }

      if (!this.isLastStep) {
        this.goToStep(this.currentStepIndex + 1)
        return
      }

      // Defensive: previous steps were validated when advancing, but go back if any is invalid now
      const invalidStepIndex = this.formSteps.findIndex(
        (step) => step.fields.some((field) => this.fieldErrors[field.id])
      )
      if (invalidStepIndex !== -1) {
        this.goToStep(invalidStepIndex)
        this.$nextTick(() => this.validateCurrentStep())
        return
      }

      this.submitted = true

      if (this.onSelected) {
        const summary = this.formFields
          .map((field) => `${field.label}: ${this.summaryFieldValue(field)}`)
          .join(', ')

        const content = this.formFields.reduce((values, field) => {
          values[field.id] = this.fieldContentValue(field)
          return values
        }, {})

        this.onSelected(summary, {
          type: 'application/json',
          content
        })
      }
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables.scss';

@keyframes native-form-spin {
  to {
    transform: rotate(360deg);
  }
}

.native-form {
  .bubble {
    padding: $bubble-padding;
    text-align: left;
  }

  .native-form-fields {
    // Overrides the global `form { width: 300px }` rule: same desktop size, but never wider than the bubble.
    width: 320px;
    max-width: 100%;
    box-sizing: border-box;

    .native-form-fieldset {
      border: none;
      margin: 0;
      padding: 0;
      min-width: 0;
    }

    .native-form-fieldset:disabled {
      opacity: 0.6;

      .native-form-submit,
      .native-form-back,
      .native-form-file-button,
      .native-form-file-remove {
        cursor: not-allowed;
      }
    }

    .native-form-progress {
      margin-bottom: 12px;

      .native-form-step-count {
        display: block;
        font-size: 12px;
        color: $vue-gray;
      }

      .native-form-step-title {
        display: block;
        margin-top: 2px;
        font-size: 14px;
        font-weight: 600;
      }

      .native-form-progress-bar {
        margin-top: 6px;
        height: 4px;
        border-radius: 2px;
        background-color: $vue-cotton;
        overflow: hidden;
      }

      .native-form-progress-fill {
        height: 100%;
        background-color: $vue-light-blip;
        transition: width 0.2s ease;
      }
    }

    .form-group {
      margin-bottom: 10px;
      // Option texts and the upload status use the bubble text colour; only the field labels keep the
      // pale label colour that the global `.blip-card .form-group` rule gives them
      color: inherit;

      label {
        display: block;
        margin-bottom: 4px;
        font-size: 14px;
        font-weight: 500;
        color: $vue-light-gray;
      }

      .form-control {
        width: 100%;
        box-sizing: border-box;
        padding: 6px 8px;
        border: 1px solid $color-content-ghost;
        border-radius: $soft-round;
        font-family: inherit;
      }

      textarea.form-control {
        resize: vertical;
      }

      // Error rule comes after the success one so it wins if both ever apply
      &.is-valid .form-control {
        border-color: $color-positive;
      }

      &.has-error .form-control {
        border-color: $color-negative;
      }

      .native-form-group-fieldset {
        border: none;
        margin: 0;
        padding: 0;
        min-width: 0;

        legend {
          padding: 0;
          margin-bottom: 4px;
          font-size: 14px;
          font-weight: 500;
          color: $vue-light-gray;
        }
      }

      .native-form-option {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 36px;
        margin: 0;
        font-weight: 400;
        color: inherit;
        cursor: pointer;

        input {
          margin: 0;
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          accent-color: $vue-light-blip;
        }
      }

      &.has-error .native-form-option input {
        outline: 1px solid $color-negative;
        outline-offset: 1px;
      }

      .native-form-file {
        position: relative;
        white-space: normal;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;

        .native-form-file-input {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
          overflow: hidden;
          clip: rect(0 0 0 0);
        }

        .native-form-file-button {
          display: inline-block;
          margin: 0;
          padding: 6px 14px;
          border: 1px solid $vue-light-blip;
          border-radius: 20px;
          color: $vue-light-blip;
          font-size: 14px;
          cursor: pointer;
        }

        .native-form-file-input:focus + .native-form-file-button {
          outline: 2px solid $vue-light-blip;
          outline-offset: 2px;
        }

        .native-form-file-status {
          font-size: 14px;
          word-break: break-all;
          color: inherit;
        }

        .native-form-spinner {
          display: inline-block;
          width: 10px;
          height: 10px;
          margin-right: 4px;
          border: 2px solid $vue-cotton;
          border-top-color: $vue-light-blip;
          border-radius: 50%;
          vertical-align: middle;
          animation: native-form-spin 0.8s linear infinite;
        }

        .native-form-file-count {
          font-size: 12px;
          color: $vue-gray;
        }

        .native-form-file-list {
          flex-basis: 100%;
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .native-form-file-item {
          display: flex;
          align-items: center;
          gap: 8px;

          .native-form-file-status {
            flex: 1;
            min-width: 0;
          }

          .native-form-file-status.is-error {
            color: $color-negative;
          }
        }

        .native-form-file-remove {
          flex-shrink: 0;
          padding: 0;
          border: none;
          background: transparent;
          color: $vue-light-blip;
          font-size: 14px;
          text-decoration: underline;
          cursor: pointer;
        }
      }

      &.has-error .native-form-file-button {
        border-color: $color-negative;
      }

      .native-form-help {
        display: block;
        margin-top: 4px;
        font-size: 12px;
        color: $vue-gray;
      }

      .native-form-error {
        display: block;
        white-space: normal;
        margin-top: 4px;
        font-size: 12px;
        color: $color-negative;
      }
    }

    .native-form-actions {
      display: flex;
      align-items: center;
      gap: 8px;

      &.is-multi-step .native-form-submit {
        margin-left: auto;
      }
    }

    .native-form-submit {
      cursor: pointer;
      background-color: $vue-light-blip;
      color: $vue-white;
      border: none;
      border-radius: 20px;
      padding: 7px 16px;
      font-size: 16px;
      font-weight: 500;
    }

    .native-form-back {
      cursor: pointer;
      background-color: transparent;
      color: $vue-light-blip;
      border: 1px solid $vue-light-blip;
      border-radius: 20px;
      padding: 6px 16px;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .native-form-summary {
    display: flex;
    flex-direction: column;

    .native-form-summary-item {
      margin-bottom: 4px;
    }

    .native-form-file-link {
      text-decoration: underline;
      cursor: pointer;
      word-break: break-all;
    }
  }
}
</style>
