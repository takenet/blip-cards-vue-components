<template>
  <div :class="'blip-container unsuported-content ' + position">
    <bds-grid :direction="position === 'left' ? 'row' : 'row-reverse'" justifyContent="space-between" gap="1" align-items="center">
      <div :class="'bubble ' + position">
        <bds-grid direction="row" justifyContent="space-between" gap="1" align-items="center">
          <bds-icon v-if="fromMessageTemplate == true" size="small" alt="Alert" name="megaphone"></bds-icon>
          <bds-icon v-else-if="position === 'right'" size="small" alt="Alert" name="warning"></bds-icon>
          <bds-icon v-else size="small" alt="Alert" name="warning"></bds-icon>
          <span>
            {{ unsupportedContentMsg }}
          </span>
        </bds-grid>
      </div>

      <blip-card-reply
        :document="fullDocument"
        :reply-callback="replyCallback"
        :reply-tooltip-text="replyTooltipText"
      />
    </bds-grid>
    <bds-icon
      v-if="this.position === 'right' && this.status === 'failed' && this.onFailedClickIcon"
      name="info"
      theme="solid"
      aria-label="Active message failed reason"
      class="icon-active-message-failed"
      @click="onFailedClickIcon(fullDocument)"
    />
    <blip-card-date
      :status="status"
      :position="position"
      :date="date"
      :failed-to-send-msg="failedToSendMsg"
      :is-external-message="isExternalMessage"
      :external-message-text="externalMessageText"
    />
  </div>
</template>

<script>

import { default as base } from '../mixins/baseComponent.js'
import alertSvg from '../assets/img/alert.svg'
import alertWhiteSvg from '../assets/img/alertWhite.svg'
import megaphoneSvg from '../assets/img/megaphone.svg'

export default {
  name: 'unsuported-content',
  mixins: [
    base
  ],
  props: {
    document: {},
    status: {
      type: String,
      default: ''
    },
    fromMessageTemplate: {
      type: Boolean,
      default: false
    },
    onFailedClickIcon: {
      type: Function
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
  data: function () {
    return {
      alertSvg,
      alertWhiteSvg,
      megaphoneSvg,
      unsupportedContentMsg: 'Unsuported Content',
      failedToSendMsg: 'Falha ao enviar a mensagem',
      replyTooltipText: 'Responder'
    }
  },
  mounted() {
    this.unsupportedContentMsg = this.translations.unsupportedContent
    this.failedToSendMsg = this.translations.failedToSend
    this.replyTooltipText = this.translations.replyTooltipText
  }
}
</script>

<style lang="scss">
@import '../styles/variables.scss';

.icon-active-message-failed {
  position: relative;
  margin-left: 5px;
  margin-right: -1px;
  margin-top: -5px;
  color: $color-extended-red;
  cursor: pointer;
}

.unsuported-content .bubble {
  padding: $bubble-padding;
  word-wrap: break-word;
  min-width: auto !important;
  text-align: left;
}

.blip-container.unsuported-content .bubble.left {
  background-color: $color-surface-1;
  color: $color-content-default;
}

.blip-container.unsuported-content .bubble.right {
  background-color: $color-surface-3;
  color: $color-content-default;
}

.blip-container.unsuported-content.blip-card .bubble {
  padding: 4px 16px;
  word-wrap: break-word;
  border-radius: 15px;
  white-space: normal;
}
</style>
