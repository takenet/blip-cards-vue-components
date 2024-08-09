<template>
  <div class="blip-container">

    <call-to-action
      v-if="document.type === 'interactive' && document.interactive.type === 'cta_url'"
      class="blip-card"
      :postback-value-msg="translations.postbackValue"
      :status="status"
      :position="position"
      :document="fullDocument.content"
      :editable="editable"
      :on-deleted="onDeleted"
      :deletable="deletable"
      :readonly="readonly"
      @updated="emitUpdate"
    />

    <menu-list-prompt
      v-if="document.type === 'interactive' && document.interactive.type === 'list'"
      class="blip-card"
      :postback-value-msg="translations.postbackValue"
      :status="status"
      :position="position"
      :document="fullDocument.content"
      :editable="editable"
      :on-deleted="onDeleted"
      :deletable="deletable"
      :readonly="readonly"
      @updated="emitUpdate"
    />

    <menu-list
      v-if="document.type === 'interactive' && document.interactive.type === 'list'"
      class="blip-card"
      :add-button-msg="translations.addButton"
      :not-enough-options-msg="translations.notEnoughOptions"
      :text-msg="translations.text"
      :apply-msg="translations.apply"
      :cancel-msg="translations.cancel"
      :postback-value-msg="translations.postbackValue"
      :status="status"
      :position="position"
      :document="fullDocument.content"
      :editable="editable"
      :on-deleted="onDeleted"
      :deletable="deletable"
      :readonly="readonly"
      @updated="emitUpdate"
    />

    <interactive-button
      v-if="document.type === 'interactive' && document.interactive.type === 'button'"
      class="blip-card"
      :document="document"
      :full-document="fullDocument"
      :position="position"
      :date="date"
      :on-save="onSave"
      :on-deleted="onDeleted"
      :on-metadata-edit="onMetadataEdit"
      :on-cancel="onCancel"
      :editable="editable"
      :deletable="deletable"
      :editing="editing"
    />

    <blip-calls-voice-request
      v-if="document.type === 'interactive' && document.interactive.type === 'voice_call'"
      class="blip-card"
      :position="position"
      :body-text="document.interactive.body.text"
      :action-text="document.interactive.action.parameters.display_text"
    />

    <unsuported-content
      v-else
      class="blip-card"
      style="margin-bottom: 0px"
      :failed-to-send-msg="translations.failedToSend"
      :unsupported-content-msg="translations.unsupportedContent"
      :position="position"
      :document="document"
      :on-save="saveCard"
      :editable="editable"
      :on-deleted="deleteCard"
      :deletable="deletable"
      :editing="isCardEditing"
      :on-cancel="cancel"
    />

    <blip-card-date
      :status="status"
      :position="position"
      :date="date"
      :failed-to-send-msg="failedToSendMsg"
    ></blip-card-date>
  </div>
</template>

<script>
import MenuList from './ApplicationJSon/MenuList'
import { default as base } from '../mixins/baseComponent.js'
import { isFailedMessage } from '../utils/misc'
import MenuListPrompt from './ApplicationJSon/MenuListPrompt.vue'
import CallToAction from './ApplicationJSon/CallToAction.vue'

export default {
  name: 'application-json',
  props: {
    status: {
      type: String,
      default: ''
    },
    failedToSendMsg: {
      type: String,
      default: 'Falha ao enviar a mensagem'
    },
    translations: {
      type: Object,
      default: () => ({})
    },
    onDeleted: {
      type: Function
    },
    readonly: {
      type: Boolean,
      default: false
    },
    deletable: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      isFailedMessage
    }
  },
  mixins: [base],
  components: {
    MenuList,
    MenuListPrompt,
    CallToAction
  },
  methods: {
    emitUpdate() {
      this.$emit('updated')
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables.scss';
</style>
