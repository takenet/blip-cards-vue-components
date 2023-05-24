<template>
  <div class="blip-container">
    <menu-list
        v-if="document.type === 'interactive' && document.interactive.type === 'list'"
        class="blip-card"
        :failed-to-send-msg="translations.failedToSend"
        :add-option-msg="translations.addOption"
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
        @updated="emitUpdate"/>

    <div class="flex" :class="'notification ' + position" v-if="date">
      <img v-if="this.status === 'waiting' && this.position === 'right'" :src="clockSvg">
      <img v-else-if="status === 'accepted' && this.position === 'right'" :src="checkSentSvg"/>
      <img v-else-if="status === 'received' && this.position === 'right'" :src="doubleCheckReceivedSvg"/>
      <img v-else-if="status === 'consumed' && this.position === 'right'" :src="doubleCheckReadSvg"/>
      <div v-else-if="this.status === 'failed' && this.position === 'right'" class="failure">
          {{ failedToSendMsg }}
        </div>
      {{ date }}
    </div>
  </div>
</template>

<script>

import MenuList from './ApplicationJSon/MenuList'
import { default as base } from '../mixins/baseComponent.js'
import { isFailedMessage } from '../utils/misc'

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
  mixins: [
    base
  ],
  components: {
    MenuList
  },
  methods: {
    emitUpdate () {
      this.$emit('updated')
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables.scss';
</style>