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
          <div class="form-group" v-for="field in formFields" :key="field.id">
            <label :for="fieldInputId(field.id)" v-html="sanitize(field.label)"></label>

            <select v-if="field.type === 'select'"
              :id="fieldInputId(field.id)"
              :required="field.required"
              v-model="formValues[field.id]"
              class="form-control"
            >
              <option value="" disabled>{{ field.label }}</option>
              <option v-for="option in field.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>

            <input v-else
              :id="fieldInputId(field.id)"
              :type="inputType(field.type)"
              :required="field.required"
              v-model="formValues[field.id]"
              class="form-control"
            >
          </div>

          <button type="submit" class="native-form-submit">{{ submitLabelText }}</button>
        </form>

        <div v-else class="native-form-summary">
          <span v-for="field in formFields" :key="field.id" class="native-form-summary-item">
            {{ field.label }}: {{ formattedFieldValue(field) }}
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
    formFields: function() {
      return (this.document.validation && this.document.validation.fields) || []
    },
    submitLabelText: function() {
      return (this.document.validation && this.document.validation.submitLabel) || this.submitLabelMsg
    }
  },
  data: function() {
    return {
      formValues: {},
      submitted: false,
      instanceId: Math.random().toString(36).slice(2),
      isFailedMessage
    }
  },
  methods: {
    init: function() {
      this.formValues = this.formFields.reduce((values, field) => {
        values[field.id] = ''
        return values
      }, {})
      this.submitted = false
    },
    inputType: function(fieldType) {
      return ['text', 'number', 'date'].indexOf(fieldType) !== -1 ? fieldType : 'text'
    },
    fieldInputId: function(fieldId) {
      return `native-form-${this.instanceId}-${fieldId}`
    },
    formattedFieldValue: function(field) {
      if (field.type !== 'select') {
        return this.formValues[field.id]
      }

      const selectedOption = (field.options || []).find(
        (option) => option.value === this.formValues[field.id]
      )
      return selectedOption ? selectedOption.label : this.formValues[field.id]
    },
    submit: function() {
      if (this.submitted || !this.$refs.form) {
        return
      }

      if (!this.$refs.form.checkValidity()) {
        this.$refs.form.reportValidity()
        return
      }

      this.submitted = true

      if (this.onSelected) {
        const summary = this.formFields
          .map((field) => `${field.label}: ${this.formattedFieldValue(field)}`)
          .join(', ')

        this.onSelected(summary, {
          type: 'application/json',
          content: { ...this.formValues }
        })
      }
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables.scss';

.native-form {
  .bubble {
    padding: $bubble-padding;
    text-align: left;
  }

  .native-form-fields {
    .form-group {
      margin-bottom: 10px;

      label {
        display: block;
        margin-bottom: 4px;
        font-size: 14px;
        font-weight: 500;
      }

      .form-control {
        width: 100%;
        box-sizing: border-box;
        padding: 6px 8px;
        border: 1px solid $color-content-ghost;
        border-radius: $soft-round;
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
  }

  .native-form-summary {
    display: flex;
    flex-direction: column;

    .native-form-summary-item {
      margin-bottom: 4px;
    }
  }
}
</style>
