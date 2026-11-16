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
              <span class="native-form-step-count">Etapa {{ stepPosition + 1 }} de {{ stepCount }}</span>
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
                <label v-for="(option, index) in optionsOf(field)"
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

                <div v-if="isSearchable(field)" class="native-form-combobox">
                  <input
                    type="text"
                    role="combobox"
                    autocomplete="off"
                    spellcheck="false"
                    aria-autocomplete="list"
                    :id="fieldInputId(field.id)"
                    :required="!!field.required"
                    :disabled="!hasOptionsToChoose(field)"
                    :placeholder="field.placeholder || 'Digite para buscar'"
                    :aria-expanded="isListOpen(field) ? 'true' : 'false'"
                    :aria-controls="listboxId(field.id)"
                    :aria-activedescendant="activeOptionId(field)"
                    :aria-required="ariaRequired(field)"
                    :aria-invalid="showError(field) ? 'true' : 'false'"
                    :aria-describedby="describedBy(field)"
                    :value="comboboxText(field)"
                    v-on:input="onSearchInput(field, $event)"
                    v-on:focus="onComboboxFocus(field, $event)"
                    v-on:click="openList(field)"
                    v-on:keydown="onComboboxKeydown(field, $event)"
                    v-on:blur="onComboboxBlur(field)"
                    class="form-control native-form-combobox-input"
                  >
                  <!-- mousedown is prevented so choosing an option (or scrolling the list) keeps the focus in the input.
                       tabindex -1: browsers put scrollable areas in the Tab order, and this one is removed on blur -->
                  <ul v-if="isListOpen(field)"
                    role="listbox"
                    tabindex="-1"
                    class="native-form-combobox-list"
                    :id="listboxId(field.id)"
                    :aria-label="field.label"
                    v-on:mousedown.prevent
                  >
                    <li v-for="(option, index) in listState.visible"
                      :key="option.value"
                      role="option"
                      class="native-form-combobox-option"
                      :class="{ 'is-active': index === listState.activeIndex, 'is-selected': option.value === listState.selectedValue }"
                      :id="comboboxOptionId(field.id, index)"
                      :aria-selected="index === listState.activeIndex ? 'true' : undefined"
                      v-on:click="chooseOption(field, option)"
                    >{{ option.label }}</li>
                  </ul>
                  <span v-if="isListOpen(field)" class="native-form-combobox-status" aria-live="polite">{{ comboboxStatus(field) }}</span>
                </div>

                <select v-else-if="field.type === 'select'"
                  :id="fieldInputId(field.id)"
                  :required="!!field.required"
                  :disabled="!hasOptionsToChoose(field)"
                  :aria-required="ariaRequired(field)"
                  :aria-invalid="showError(field) ? 'true' : 'false'"
                  :aria-describedby="describedBy(field)"
                  v-model="formValues[field.id]"
                  v-on:change="touch(field)"
                  v-on:blur="touch(field)"
                  class="form-control"
                >
                  <option value="" disabled>{{ field.label }}</option>
                  <option v-for="option in optionsOf(field)" :key="option.value" :value="option.value">
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
                  <span :id="fileCountId(field.id)" class="native-form-file-count">{{ fileItems(field).length }} de {{ maxFilesOf(field) }} arquivos</span>
                  <ul class="native-form-file-list" aria-live="polite">
                    <li v-for="item in fileItems(field)" :key="item.key" class="native-form-file-item">
                      <!-- The reason is written for every failed file, not only shown by the colour -->
                      <span class="native-form-file-status" :class="'is-' + item.status">
                        <span v-if="item.status === 'uploading'" class="native-form-spinner" aria-hidden="true"></span>
                        <template v-if="item.status === 'uploading'">Enviando… {{ item.fileName }}</template>
                        <template v-else-if="item.status === 'done'">✓ {{ item.fileName }}</template>
                        <template v-else>✕ {{ item.fileName }} — {{ item.message }}</template>
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
              <small v-if="optionsNotice(field)" :id="optionsNoticeId(field.id)" class="native-form-help native-form-options-notice">{{ optionsNotice(field) }}</small>
              <span class="native-form-live" aria-live="polite">
                <span v-if="showError(field)"
                  :id="errorId(field.id)"
                  :tabindex="isFileList(field) ? -1 : undefined"
                  class="native-form-error"
                >
                  {{ fieldErrors[field.id].message }}
                </span>
                <span v-if="fileNotice(field)" :id="fileNoticeId(field.id)" class="native-form-error native-form-file-notice">{{ fileNotice(field) }}</span>
              </span>
            </div>

            <div class="native-form-actions" :class="{ 'is-multi-step': isMultiStep }">
              <button v-if="stepPosition > 0" type="button" class="native-form-back" v-on:click="back">{{ backLabelText }}</button>
              <!-- Distinct keys: a step change never reuses the element that received the previous click -->
              <button v-if="isLastStep" key="native-form-submit" type="submit" class="native-form-submit">{{ submitLabelText }}</button>
              <button v-else key="native-form-next" type="submit" class="native-form-submit native-form-next">{{ nextLabelText }}</button>
            </div>
          </fieldset>
        </form>

        <div v-else class="native-form-summary">
          <span v-for="field in visibleFields" :key="field.id" class="native-form-summary-item">
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
// Uploads of lists of files running at the same time per form; the others wait in line. Hosts may
// process each file before uploading it (blip-chat compresses camera photos), which is heavy on low-end phones
const MAX_PARALLEL_UPLOADS = 3
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
  maxFiles: 'Você pode enviar no máximo {max} arquivos.',
  option: 'Escolha uma opção da lista.',
  dependsOn: 'Escolha primeiro: {field}.',
  noOptions: 'Nenhuma opção disponível.',
  noResults: 'Nenhuma opção encontrada.'
}

// Notices that `field.errorMessage` does not replace
const NOTICE_KEYS = ['uploading', 'maxFiles', 'dependsOn', 'noOptions', 'noResults']

// Options rendered at a time in the list of a searchable select; typing narrows the list down
const MAX_VISIBLE_OPTIONS = 50

// Case- and accent-insensitive text used to search the options ("sao" finds "São Paulo")
const searchKey = (text) => {
  const value = String(text === undefined || text === null ? '' : text).toLowerCase().trim()
  return typeof value.normalize === 'function' ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : value
}

// Options of a field that depends on another one: `{ "<parent value>": [{ value, label }] }`
const isGroupedOptions = (options) => !!options && typeof options === 'object' && !Array.isArray(options)

// Field types whose value can choose the options of another field
const PARENT_TYPES = ['text', 'number', 'email', 'tel', 'date', 'textarea', 'select', 'radio']

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

const isConditionValue = (value) => ['string', 'number', 'boolean'].indexOf(typeof value) !== -1

// `showWhen` of a field as { source, values } (values as strings), or null when it is not usable: not an
// object, unknown/own/`file` source or no values. `fieldsById` has no prototype
const parseShowWhen = (field, fieldsById) => {
  const rule = field.showWhen
  if (Object.prototype.toString.call(rule) !== '[object Object]' || typeof rule.field !== 'string') {
    return null
  }
  const source = fieldsById[rule.field]
  if (!source || source === field || String(source.id) === String(field.id) || source.type === 'file') {
    return null
  }
  const inValues = Array.isArray(rule.in) ? rule.in.filter(isConditionValue) : []
  const values = inValues.length > 0
    ? inValues
    : (isConditionValue(rule.equals) ? [rule.equals] : [])
  return values.length > 0 ? { source, values: values.map(String) } : null
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

      // A field whose options depend on another one needs that field before it (same or earlier step,
      // holding a single value); otherwise it could never be answered and is ignored
      const parents = {}
      steps.forEach((step) => {
        step.fields = step.fields.filter((field) => {
          if (this.isDependent(field) && !parents[field.dependsOn]) {
            return false
          }
          if (PARENT_TYPES.indexOf(field.type) !== -1) {
            parents[field.id] = true
          }
          return true
        })
      })

      const validSteps = steps.filter((step) => step.fields.length > 0)

      return validSteps.length > 0 ? validSteps : [{ title: '', fields: [] }]
    },
    formFields: function() {
      return this.formSteps.reduce((all, step) => all.concat(step.fields), [])
    },
    fieldsById: function() {
      return this.formFields.reduce((result, field) => {
        result[field.id] = field
        return result
      }, {})
    },
    // Options each field shows now and, for dependent fields, the parent value that chose them. Resolved
    // once per change, in the fields order (a parent always comes before its dependents), so long lists
    // and chains (state → city → district) are not filtered again for every option rendered
    optionsState: function() {
      const options = {}
      const parents = {}
      this.formFields.forEach((field) => {
        if (!this.isDependent(field)) {
          options[field.id] = Array.isArray(field.options) ? field.options : []
          return
        }
        const parent = this.fieldsById[field.dependsOn]
        const parentValue = parent ? this.resolvedValue(parent, options) : ''
        const group = parentValue !== '' && Object.prototype.hasOwnProperty.call(field.options, parentValue)
          ? field.options[parentValue]
          : null
        parents[field.id] = parentValue
        options[field.id] = Array.isArray(group) ? group : []
      })
      return { options, parents }
    },
    // Value of the parent of each dependent field; the dependent field is cleared when it changes
    parentValues: function() {
      return this.optionsState.parents
    },
    // Options shown by the searchable select that has the focus (only one list is open at a time)
    listState: function() {
      const field = this.fieldsById[this.openListId]
      if (!field || !this.isSearchable(field)) {
        return { fieldId: '', matches: [], visible: [], activeIndex: -1, selectedValue: '' }
      }
      const matches = this.matchingOptions(field)
      const visible = matches.slice(0, MAX_VISIBLE_OPTIONS)
      return {
        fieldId: field.id,
        matches,
        visible,
        activeIndex: this.activeOptionIndex < visible.length ? this.activeOptionIndex : -1,
        selectedValue: this.effectiveValue(field)
      }
    },
    fieldsSignature: function() {
      // Changes whenever a field is added/removed/retyped or file fields become (un)available
      return this.formFields.map((field) => `${field.id}:${this.fieldKind(field)}`).join('|') +
        `#${typeof this.onUploadFile === 'function'}`
    },
    // Usable `showWhen` of each field by id. Invalid conditions, including the ones in a cycle
    // (A -> B -> A, also through `dependsOn`), are left out so the field is always shown and visibility
    // never loops
    fieldConditions: function() {
      const fieldsById = Object.create(null)
      this.formFields.forEach((field) => {
        fieldsById[field.id] = fieldsById[field.id] || field
      })

      const candidates = Object.create(null)
      this.formFields.forEach((field) => {
        // With duplicated ids, only the first field defines the condition
        const condition = fieldsById[field.id] === field && parseShowWhen(field, fieldsById)
        if (condition) {
          candidates[field.id] = condition
        }
      })

      // Fields a field needs to be shown: its `showWhen` source and the field its options depend on
      const needs = (id) => {
        const field = fieldsById[id]
        const ids = candidates[id] ? [String(candidates[id].source.id)] : []
        if (field && this.isDependent(field) && fieldsById[field.dependsOn]) {
          ids.push(String(field.dependsOn))
        }
        return ids
      }

      const inCycle = (id) => {
        const seen = Object.create(null)
        const pending = needs(id)
        while (pending.length > 0) {
          const current = pending.pop()
          if (current === String(id)) {
            return true
          }
          if (!seen[current]) {
            seen[current] = true
            pending.push.apply(pending, needs(current))
          }
        }
        return false
      }

      return Object.keys(candidates).reduce((conditions, id) => {
        if (!inCycle(id)) {
          conditions[id] = candidates[id]
        }
        return conditions
      }, Object.create(null))
    },
    // Visibility by field id: a conditional field is shown when its source is shown and holds one of the
    // values (a checkbox source when any selected value is one of them). A field whose options depend on
    // another one (`dependsOn`) is hidden with it, since it could never be answered
    fieldVisibility: function() {
      const conditions = this.fieldConditions
      const visibility = Object.create(null)
      const isVisible = (field) => {
        if (!(field.id in visibility)) {
          const condition = conditions[field.id]
          let visible = true
          if (condition) {
            const value = this.effectiveValue(condition.source)
            visible = isVisible(condition.source) &&
              (Array.isArray(value) ? value : [value]).some((item) => condition.values.indexOf(String(item)) !== -1)
          }
          const parent = this.isDependent(field) && this.fieldsById[field.dependsOn]
          if (visible && parent) {
            visible = isVisible(parent)
          }
          visibility[field.id] = visible
        }
        return visibility[field.id]
      }
      this.formFields.forEach(isVisible)
      return visibility
    },
    visibleFields: function() {
      return this.formFields.filter((field) => this.isFieldVisible(field))
    },
    // Steps with at least one visible field (the single empty step of a form without fields counts)
    visibleStepIndexes: function() {
      return this.formSteps.reduce((indexes, step, index) => {
        if (step.fields.length === 0 || step.fields.some((field) => this.isFieldVisible(field))) {
          indexes.push(index)
        }
        return indexes
      }, [])
    },
    currentStepIndex: function() {
      const index = Math.min(Math.max(this.currentStep, 0), this.formSteps.length - 1)
      const visible = this.visibleStepIndexes
      if (visible.length === 0 || visible.indexOf(index) !== -1) {
        return index
      }
      // A hidden step is never shown: the next visible one is, or the previous one when there is none after it
      const next = visible.find((visibleIndex) => visibleIndex > index)
      return next !== undefined ? next : visible[visible.length - 1]
    },
    // Position of the current step among the visible ones
    stepPosition: function() {
      return Math.max(this.visibleStepIndexes.indexOf(this.currentStepIndex), 0)
    },
    stepCount: function() {
      return Math.max(this.visibleStepIndexes.length, 1)
    },
    currentFields: function() {
      return this.formSteps[this.currentStepIndex].fields.filter((field) => this.isFieldVisible(field))
    },
    currentStepTitle: function() {
      return this.formSteps[this.currentStepIndex].title
    },
    isMultiStep: function() {
      return this.stepCount > 1
    },
    isLastStep: function() {
      return this.stepPosition === this.stepCount - 1
    },
    progressWidth: function() {
      return `${((this.stepPosition + 1) / this.stepCount) * 100}%`
    },
    fieldErrors: function() {
      // Hidden fields are never validated
      return this.formFields.reduce((result, field) => {
        result[field.id] = this.isFieldVisible(field) ? this.validateField(field) : null
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
    },
    // Keeps the stored step on the one shown (when the current step gets hidden), so a step that
    // appears or reappears before it never moves the user
    currentStepIndex: function(index) {
      if (this.currentStep !== index) {
        this.currentStep = index
      }
    },
    fieldVisibility: function(visibility) {
      // A field that gets hidden shows no error when it appears again until it is left or the user tries to continue
      this.formFields.forEach((field) => {
        if (visibility[field.id] === false && (this.touched[field.id] || this.attempted[field.id])) {
          this.$set(this.touched, field.id, false)
          this.$set(this.attempted, field.id, false)
        }
      })
    },
    parentValues: function(values) {
      const previous = this.lastParentValues || {}
      Object.keys(values).forEach((fieldId) => {
        if (fieldId in previous && !sameValue(previous[fieldId], values[fieldId])) {
          this.resetDependentField(this.fieldsById[fieldId])
        }
      })
      this.lastParentValues = values
    }
  },
  data: function() {
    return {
      formValues: {},
      prefilled: {},
      touched: {},
      attempted: {},
      uploads: {},
      // Text typed in each searchable select; null while it shows the chosen option
      searchTexts: {},
      openListId: '',
      activeOptionIndex: -1,
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
      const searchTexts = {}

      this.fieldTypes = {}

      this.formFields.forEach((field) => {
        this.fieldTypes[field.id] = this.fieldKind(field)
        formValues[field.id] = this.initialValue(field)
        prefilled[field.id] = !this.isEmptyValue(field, formValues[field.id])
        touched[field.id] = false
        attempted[field.id] = false
        uploads[field.id] = emptyUpload()
        searchTexts[field.id] = null
      })

      this.formValues = formValues
      this.prefilled = prefilled
      this.touched = touched
      this.attempted = attempted
      this.uploads = uploads
      this.searchTexts = searchTexts
      this.openListId = ''
      this.activeOptionIndex = -1
      // Pre-filled values are the starting point: only later changes of a parent clear its dependents
      this.lastParentValues = this.parentValues
      this.currentStep = this.firstVisibleStep()
      this.submitted = false
      this.uploadSequence = 0
      this.lastStepChangeAt = 0
      // Files of lists waiting for a free slot and the ones uploading ({ fieldId, field, file, item })
      this.uploadQueue = []
      this.activeUploads = []
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
        if (!(field.id in this.searchTexts) || idsChanged) {
          this.$set(this.searchTexts, field.id, null)
        }
      })

      this.fieldTypes = fieldTypes
      // Files dropped with their field (reset or removed) free their upload slot and never start
      this.releaseDroppedUploads()

      if (idsChanged) {
        this.currentStep = this.firstVisibleStep()
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
        return this.allOptionsOf(field)
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
        // A dependent field accepts an option of any group: it counts only while it belongs to the
        // group of the parent value (e.g. a pre-filled city of the pre-filled state)
        const option = this.allOptionsOf(field).find((item) => String(item.value) === text)
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
        return this.optionsOf(field)
          .filter((option) => Array.isArray(value) && value.indexOf(option.value) !== -1)
          .map((option) => option.value)
      }

      if (field.type === 'select' || field.type === 'radio') {
        return this.optionsOf(field).some((option) => option.value === value) ? value : ''
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
    // Where the form starts: the first step with a visible field
    firstVisibleStep: function() {
      return this.visibleStepIndexes.length > 0 ? this.visibleStepIndexes[0] : 0
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
            // Grouped options only make sense with the field they depend on (checked in formSteps)
            if (isGroupedOptions(field.options)) {
              return this.isDependent(field)
            }
            return Array.isArray(field.options) && field.options.length > 0
          }
          if (field.type === 'file') {
            return typeof this.onUploadFile === 'function'
          }
          return true
        })
    },
    // Option field whose `options` are grouped by the value of the field named in `dependsOn`
    isDependent: function(field) {
      return OPTION_TYPES.indexOf(field.type) !== -1 && isGroupedOptions(field.options) &&
        typeof field.dependsOn === 'string' && field.dependsOn !== '' && field.dependsOn !== field.id
    },
    isSearchable: function(field) {
      return field.type === 'select' && field.searchable === true
    },
    parentValue: function(field) {
      return this.optionsState.parents[field.id] || ''
    },
    // Value of a parent as it chooses the options of its dependents: only a valid value counts (e.g. a
    // CEP still incomplete does not). Option fields are checked against the options already resolved,
    // since reading optionsOf here would read optionsState while it is being computed
    resolvedValue: function(parent, resolvedOptions) {
      if (OPTION_TYPES.indexOf(parent.type) !== -1) {
        const value = this.formValues[parent.id]
        const isOption = (resolvedOptions[parent.id] || []).some((option) => option.value === value)
        return isOption ? String(value).trim() : ''
      }
      const value = this.effectiveValue(parent)
      return this.isEmptyValue(parent, value) || this.validateField(parent) ? '' : String(value).trim()
    },
    // Options the user can choose now: the group of the parent value for a dependent field
    optionsOf: function(field) {
      const resolved = this.optionsState.options[field.id]
      if (resolved && this.fieldsById[field.id] === field) {
        return resolved
      }
      return !this.isDependent(field) && Array.isArray(field.options) ? field.options : []
    },
    allOptionsOf: function(field) {
      if (!this.isDependent(field)) {
        return Array.isArray(field.options) ? field.options : []
      }
      return Object.keys(field.options).reduce(
        (all, key) => all.concat(Array.isArray(field.options[key]) ? field.options[key] : []),
        []
      )
    },
    isWaitingParent: function(field) {
      return this.isDependent(field) && this.parentValue(field) === ''
    },
    // Disabled while the parent has no value, or when the flow sent no option for the chosen one
    hasOptionsToChoose: function(field) {
      return this.optionsOf(field).length > 0
    },
    optionsNotice: function(field) {
      if (!this.isDependent(field) || this.hasOptionsToChoose(field)) {
        return ''
      }
      if (this.isWaitingParent(field)) {
        const parent = this.fieldsById[field.dependsOn]
        return this.message(field, 'dependsOn', { field: parent.label })
      }
      return this.message(field, 'noOptions')
    },
    optionsNoticeId: function(fieldId) {
      return `${this.fieldInputId(fieldId)}-options`
    },
    // The parent changed: the previous answer is cleared (unless it is still an option) and the field
    // starts over, without showing errors for an answer the user has not given yet
    resetDependentField: function(field) {
      if (!field) {
        return
      }
      const value = this.effectiveValue(field)
      if (!sameValue(value, this.formValues[field.id])) {
        this.$set(this.formValues, field.id, value)
        this.$set(this.touched, field.id, false)
        this.$set(this.attempted, field.id, false)
        this.$set(this.prefilled, field.id, false)
      }
      if (this.searchTexts[field.id] !== null && this.searchTexts[field.id] !== undefined) {
        this.$set(this.searchTexts, field.id, null)
      }
    },
    listboxId: function(fieldId) {
      return `${this.fieldInputId(fieldId)}-listbox`
    },
    comboboxOptionId: function(fieldId, index) {
      return `${this.fieldInputId(fieldId)}-option-${index}`
    },
    isListOpen: function(field) {
      return this.openListId === field.id && !this.hideOptions && !this.submitted && this.hasOptionsToChoose(field)
    },
    activeOptionId: function(field) {
      return this.isListOpen(field) && this.listState.activeIndex !== -1
        ? this.comboboxOptionId(field.id, this.listState.activeIndex)
        : undefined
    },
    selectedOption: function(field) {
      const value = this.effectiveValue(field)
      return this.optionsOf(field).find((option) => option.value === value) || null
    },
    comboboxText: function(field) {
      const text = this.searchTexts[field.id]
      if (text !== null && text !== undefined) {
        return text
      }
      const option = this.selectedOption(field)
      return option ? option.label : ''
    },
    // Options whose label contains the typed text: the exact label first, then the ones starting with
    // the text and then the others, each in the options order
    matchingOptions: function(field) {
      const options = this.optionsOf(field)
      const query = searchKey(this.searchTexts[field.id])
      if (!query) {
        return options
      }
      const exact = []
      const starting = []
      const containing = []
      options.forEach((option) => {
        const label = searchKey(option.label)
        const position = label.indexOf(query)
        if (label === query) {
          exact.push(option)
        } else if (position === 0) {
          starting.push(option)
        } else if (position > 0) {
          containing.push(option)
        }
      })
      return exact.concat(starting, containing)
    },
    comboboxStatus: function(field) {
      const { matches, visible } = this.listState
      if (matches.length === 0) {
        return this.message(field, 'noResults')
      }
      if (visible.length < matches.length) {
        return `Mostrando ${visible.length} de ${matches.length}. Digite para filtrar.`
      }
      return matches.length === 1 ? '1 opção' : `${matches.length} opções`
    },
    openList: function(field) {
      if (this.hideOptions || this.submitted || !this.hasOptionsToChoose(field)) {
        return
      }
      if (this.openListId !== field.id) {
        this.openListId = field.id
        this.activeOptionIndex = -1
      }
    },
    closeList: function() {
      this.openListId = ''
      this.activeOptionIndex = -1
    },
    onComboboxFocus: function(field, event) {
      this.openList(field)
      // The chosen option is selected so typing starts a new search
      if (event && event.target && typeof event.target.select === 'function' && event.target.value) {
        event.target.select()
      }
    },
    onSearchInput: function(field, event) {
      const text = event.target.value
      this.$set(this.searchTexts, field.id, text)
      // An exact label (ignoring case and accents) is chosen right away; anything else is only a search
      const query = searchKey(text)
      const exact = query ? this.optionsOf(field).filter((option) => searchKey(option.label) === query) : []
      this.$set(this.formValues, field.id, exact.length === 1 ? exact[0].value : '')
      this.openList(field)
      this.activeOptionIndex = query ? 0 : -1
    },
    chooseOption: function(field, option) {
      if (this.hideOptions || this.submitted) {
        return
      }
      this.$set(this.formValues, field.id, option.value)
      this.$set(this.searchTexts, field.id, null)
      this.touch(field)
      this.closeList()
    },
    onComboboxBlur: function(field) {
      const text = this.searchTexts[field.id]
      // An emptied search clears the answer; a chosen option shows its label again
      if (text !== null && text !== undefined && (text.trim() === '' || this.selectedOption(field))) {
        this.$set(this.searchTexts, field.id, null)
      }
      if (this.openListId === field.id) {
        this.closeList()
      }
      this.touch(field)
    },
    moveActiveOption: function(field, step) {
      const count = this.listState.visible.length
      if (count === 0) {
        return
      }
      const current = this.listState.activeIndex
      this.activeOptionIndex = current === -1
        ? (step > 0 ? 0 : count - 1)
        : (current + step + count) % count
      this.$nextTick(() => {
        const element = document.getElementById(this.comboboxOptionId(field.id, this.activeOptionIndex))
        if (element && typeof element.scrollIntoView === 'function') {
          element.scrollIntoView({ block: 'nearest' })
        }
      })
    },
    onComboboxKeydown: function(field, event) {
      const isOpen = this.isListOpen(field)

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        if (!isOpen) {
          this.openList(field)
          return
        }
        this.moveActiveOption(field, event.key === 'ArrowDown' ? 1 : -1)
      } else if (event.key === 'Enter' && isOpen) {
        const { visible, activeIndex } = this.listState
        const option = visible[activeIndex] || (visible.length === 1 ? visible[0] : null)
        // Enter chooses the highlighted option instead of sending the form
        if (option) {
          event.preventDefault()
          this.chooseOption(field, option)
        }
      } else if (event.key === 'Escape' && isOpen) {
        event.preventDefault()
        this.closeList()
      }
    },
    isOptionGroup: function(field) {
      return field.type === 'radio' || field.type === 'checkbox'
    },
    isFileList: function(field) {
      return field.type === 'file' && field.multiple === true
    },
    isFieldVisible: function(field) {
      return this.fieldVisibility[field.id] !== false
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
      if (!this.isFileList(field) || !upload) {
        return ''
      }
      // The blocking "too many files" error already says it
      const fieldError = this.fieldErrors[field.id]
      return fieldError && fieldError.key === 'maxFiles' && this.showError(field) ? '' : upload.notice
    },
    fileRemoveId: function(fieldId, itemKey) {
      return `${this.fieldInputId(fieldId)}-remove-${itemKey}`
    },
    fileCountId: function(fieldId) {
      return `${this.fieldInputId(fieldId)}-count`
    },
    fileNoticeId: function(fieldId) {
      return `${this.fieldInputId(fieldId)}-notice`
    },
    // Item still in the list of a field that is still a list of files (not removed nor reset)
    isLiveFileItem: function(fieldId, item) {
      const upload = this.uploads[fieldId]
      return !!(this.fieldTypes && this.fieldTypes[fieldId] === 'file[]' &&
        upload && Array.isArray(upload.items) && upload.items.indexOf(item) !== -1)
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
      if (this.optionsNotice(field)) {
        ids.push(this.optionsNoticeId(field.id))
      }
      if (this.showError(field)) {
        ids.push(this.errorId(field.id))
      }
      if (this.isFileList(field)) {
        ids.push(this.fileCountId(field.id))
        if (this.fileNotice(field)) {
          ids.push(this.fileNoticeId(field.id))
        }
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
        // The limit may have been lowered after the files were picked: the extra ones must be removed
        const max = this.maxFilesOf(field)
        if (items.length > max) {
          return this.error(field, 'maxFiles', { max })
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

      if (this.isSearchable(field) && isEmpty) {
        const text = this.searchTexts[field.id]
        // Typed text that is not one of the options is not an answer
        if (text !== null && text !== undefined && text.trim() !== '') {
          return this.error(field, 'option')
        }
      }

      // A dependent field without options for the chosen parent value cannot be answered: it is sent empty
      if (isEmpty && this.isDependent(field) && !this.isWaitingParent(field) && !this.hasOptionsToChoose(field)) {
        return null
      }

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
    // uploaded (at most MAX_PARALLEL_UPLOADS at a time per form), each one keeping its place in the list
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

      // Queued files keep the "uploading" status until a slot is free
      picked
        .filter((entry) => entry.item.status === 'uploading')
        .forEach(({ file, item }) => {
          this.uploadQueue.push({ fieldId: field.id, field, file, item })
        })
      this.pumpFileUploads()
    },
    pumpFileUploads: function() {
      while (this.uploadQueue.length > 0 && this.activeUploads.length < MAX_PARALLEL_UPLOADS) {
        // Files of visible fields go first: waiting files of hidden fields never take a slot ahead of them
        const visibleIndex = this.uploadQueue.findIndex((queued) => this.fieldVisibility[queued.fieldId] !== false)
        const entry = this.uploadQueue.splice(Math.max(visibleIndex, 0), 1)[0]
        // Files removed or reset while waiting are never uploaded
        if (this.isLiveFileItem(entry.fieldId, entry.item)) {
          this.startFileUpload(entry)
        }
      }
    },
    startFileUpload: function(entry) {
      const { fieldId, field, file, item } = entry
      // Results are applied only to items still in the list (not removed nor reset meanwhile)
      const update = (changes) => {
        if (this.isLiveFileItem(fieldId, item)) {
          Object.assign(item, changes)
        }
      }

      this.activeUploads.push(entry)

      Promise.resolve()
        .then(() => this.onUploadFile(file))
        .then((result) => {
          const uri = typeof result === 'string' ? result : result && result.uri
          if (!uri || typeof uri !== 'string') {
            throw new Error('Upload did not return a URI')
          }
          update({ status: 'done', uri })
        })
        .catch(() => {
          update({ status: 'error', uri: '', errorKey: 'uploadFailed', message: this.message(field, 'uploadFailed') })
        })
        .then(() => {
          // No-op when the slot was already freed (file removed or form reset)
          this.activeUploads = this.activeUploads.filter((current) => current !== entry)
          this.pumpFileUploads()
        })
    },
    // Frees the slots of uploading files that were removed/reset and forgets the waiting ones
    releaseDroppedUploads: function() {
      const isLive = (entry) => this.isLiveFileItem(entry.fieldId, entry.item)
      this.activeUploads = (this.activeUploads || []).filter(isLive)
      this.uploadQueue = (this.uploadQueue || []).filter(isLive)
      this.pumpFileUploads()
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
      this.releaseDroppedUploads()
      // The clicked button is gone: focus goes back to the file picker
      this.$nextTick(() => this.focusField(field))
    },
    focusField: function(field) {
      // A dependent field waiting for its parent cannot be filled: the parent is the one to answer first
      while (this.isDependent(field) && this.isWaitingParent(field) && this.fieldsById[field.dependsOn]) {
        field = this.fieldsById[field.dependsOn]
      }
      let id = this.isOptionGroup(field) ? this.optionInputId(field.id, 0) : this.fieldInputId(field.id)
      // With the limit reached the picker is disabled: focus the remove button of a failed file, never
      // the one of a file still uploading (a second Enter would remove it); otherwise the error message,
      // when shown (focus stays where it is when there is none)
      if (this.isFileList(field) && this.isFileLimitReached(field)) {
        const failed = this.fileItems(field).find((current) => current.status === 'error')
        id = failed ? this.fileRemoveId(field.id, failed.key) : this.errorId(field.id)
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
      if (this.submitted || this.hideOptions || this.stepPosition === 0) {
        return
      }
      this.goToStep(this.visibleStepIndexes[this.stepPosition - 1])
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
        return this.optionsOf(field)
          .filter((option) => value.indexOf(option.value) !== -1)
          .map((option) => option.label)
          .join(', ')
      }

      if (field.type !== 'select' && field.type !== 'radio') {
        return value
      }

      const selectedOption = this.optionsOf(field).find(
        (option) => option.value === value
      )
      return selectedOption ? selectedOption.label : ''
    },
    fieldContentValue: function(field) {
      // Hidden fields are sent empty, whatever was typed while they were shown
      if (!this.isFieldVisible(field)) {
        return field.type === 'checkbox' || this.isFileList(field) ? [] : ''
      }
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
        this.goToStep(this.visibleStepIndexes[this.stepPosition + 1])
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
        const summary = this.visibleFields
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

      select.form-control:disabled,
      .native-form-combobox-input:disabled {
        background-color: $vue-cotton;
        cursor: not-allowed;
      }

      .native-form-combobox {
        position: relative;
        white-space: normal;

        // Chevron that tells it is a list, drawn on the right of the input
        &::after {
          content: '';
          position: absolute;
          top: 13px;
          right: 12px;
          width: 6px;
          height: 6px;
          border-right: 2px solid $vue-gray;
          border-bottom: 2px solid $vue-gray;
          transform: rotate(45deg);
          pointer-events: none;
        }

        .native-form-combobox-input {
          padding-right: 30px;
        }

        // In the flow of the bubble (not floating), so the conversation scroll reaches every option
        .native-form-combobox-list {
          max-height: 216px;
          overflow-y: auto;
          margin: 4px 0 0;
          padding: 4px 0;
          list-style: none;
          border: 1px solid $color-content-ghost;
          border-radius: $soft-round;
          background-color: $vue-white;
          color: $vue-dark-gray;
          -webkit-overflow-scrolling: touch;
        }

        .native-form-combobox-option {
          min-height: 36px;
          padding: 8px 10px;
          box-sizing: border-box;
          font-size: 14px;
          line-height: 20px;
          cursor: pointer;

          &.is-selected {
            font-weight: 600;
          }

          &.is-active,
          &:hover {
            background-color: $vue-cotton;
          }
        }

        .native-form-combobox-status {
          display: block;
          margin-top: 4px;
          font-size: 12px;
          color: $vue-gray;
        }
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

          // Long file names still wrap, but the error reasons are not split in the middle of words
          .native-form-file-status {
            flex: 1;
            min-width: 0;
            word-break: normal;
            overflow-wrap: break-word;
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
