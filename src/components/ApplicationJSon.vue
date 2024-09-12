<template>
  <div class="blip-container">
    <json-text
      v-if="document.type === 'interactive' && document.interactive.type === 'flow'"
      class="blip-card"
      :failed-to-send-msg="translations.failedToSend"
      :show-more-msg="translations.showMore"
      :status="status"
      :position="position"
      :document="fullDocument.content"
      :editable="editable"
      :on-deleted="onDeleted"
      :deletable="deletable"
      :readonly="readonly"
      :date="date"
      :on-metadata-edit="isMetadataReady"
      :on-cancel="cancel"
      :external-message-text="translations.externalMessageText"
    />

     <call-to-action
      v-else-if="document.type === 'interactive' && document.interactive.type === 'cta_url'"
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

    <div v-else-if="document.type === 'interactive' && document.interactive.type === 'list'">
      <menu-list-prompt
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
    </div>

    <interactive-button
      v-else-if="document.type === 'interactive' && document.interactive.type === 'button'"
      class="blip-card"
      :document="document"
      :full-document="fullDocument"
      :position="position"
      :date="date"
      :on-save="onSave"
      :on-deleted="onDeleted"
      :on-`ta-edit="onMetadataEdit"
      :on-cancel="onCancel"
      :editable="editable"
      :deletable="deletable"
      :editing="editing"
    />

    <blip-calls-voice-request
      v-else-if="document.type === 'interactive' && document.interactive.type === 'voice_call'"
      class="blip-card"
      :document="document"
      :position="position"
      :on-save="onSave"
      :on-deleted="onDeleted"
      :on-cancel="onCancel"
      :editable="editable"
      :deletable="deletable"
      :editing="editing"
      :body-text="document.interactive.body.text"
      :action-text="document.interactive.action.parameters.display_text"
    />

    <blip-calls-permission-request
      v-else-if="document.type === 'interactive' && document.interactive.type === 'call_permission_request'"
      class="blip-card"
      :position="position"
      :document="document"
      :body-title="translations.callsPermissionRequestBodyTitle"
      :body-text="translations.callsPermissionRequestBodyText"
      :left-action-label="translations.callsPermissionRequestLeftActionLabel"
      :right-action-label="translations.callsPermissionRequestRightActionLabel"
    />

    <unsuported-content
      v-else
      class="blip-card"
      style="margin-bottom: 0px"
      :failed-to-send-msg="translations.failedToSend"
      :unsupported-content-msg="translations.unsupportedContent"
      :position="position"
      :document="document"
      :editable="editable"
      :deletable="deletable"
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
import JsonText from './ApplicationJSon/JsonText.vue'

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
    },
    whatappComponent: {
      type: String,
      default: 'This message is a WhatsApp Flows component'
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
    CallToAction,
    JsonText
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
