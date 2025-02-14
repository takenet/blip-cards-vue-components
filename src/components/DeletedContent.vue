<template>
  <div>
    <div
      v-if="text != undefined && text.length > 0"
      class="blip-container deleted-content-container"
      :class="isFailedMessage(status, position)"
    >
      <blip-card-member
        v-if="memberInfo"
        :position="position"
        :member-info="memberInfo"
        :is-group="false"
      />

      <bds-grid :direction="position === 'left' ? 'row' : 'row-reverse'" justifyContent="space-between" gap="1" align-items="center">
        <div :class="'bubble ' + position + ' deleted-content'">
          <div v-if="text" v-html="text"></div>
        </div>

        <blip-card-reply
          :document="fullDocument"
          :reply-callback="replyCallback"
          :reply-tooltip-text="replyTooltipText"
        />
      </bds-grid>
      
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
  name: 'deleted-content',
  mixins: [base],
  props: {
    document: {
      type: String,
      required: false
    },
    status: {
      type: String,
      default: ''
    },
    length: {
      type: Number,
      default: 532
    },
    memberInfo: {
      type: String,
      default: ''
    },
    replyCallback: {
      type: Function,
      default: undefined
    },
    deletedContentText: {
      type: String,
      default: 'Esta mensagem foi excluída.'
    },
    translations: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    text: undefined,
    isFailedMessage,
    failedToSendMsg: 'Falha ao enviar a mensagem.',
    showMoreMsg: 'Ver mais',
    replyTooltipText: 'Responder'
  }),
  mounted() {
    this.failedToSendMsg = this.translations.failedToSend
    this.showMoreMsg = this.translations.showMore
    this.replyTooltipText = this.translations.replyTooltipText
  },
  methods: {
    init: function() {
      this.text = this.deletedContentText
    }
  }
}
</script>


<style lang="scss">
@import '../styles/variables.scss';

.deleted-content-container .bubble {
  padding: 16px 16px;
  word-wrap: break-word;
  min-width: auto !important;
  text-align: left;
}

.blip-deleted-content-metadata {
  margin-top: -20px;
  padding: 0 10px 10px 0;
}

.deleted-content {
  font-style: italic;
  background-color: $color-surface-3 !important;
  border: 1px solid $color-border-1 !important;
  color: $color-content-disable !important;
}
</style>