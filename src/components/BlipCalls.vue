<template>
  <div class="blip-container calls">
    <blip-calls-end-card
      v-if="document.status !== 'started'"
      :document="document"
      :full-document="fullDocument"
      :status="status"
      :position="position"
      :date="date"
      :meet-msg="meetMsg"
      :voice-msg="voiceMsg"
      :success-status-msg="successStatusMsg"
      :failed-status-msg="failedStatusMsg"
      :cancel-status-msg="cancelStatusMsg"
      :failed-to-send-msg="failedToSendMsg"
      :async-fetch-media="asyncFetchMedia"
    />
    <p class="subtitle fancy"><span>{{ formattedMessage }}</span></p>
  </div>
</template>

<script>
import { default as base } from '../mixins/baseComponent.js'

export default {
  name: 'blip-calls',
  mixins: [base],
  props: {
    status: {
      type: String,
      default: ''
    },
    failedToSendMsg: {
      type: String,
      default: 'Falha ao enviar a mensagem.'
    },
    startCallMsg: {
      type: String,
      default: 'Início da chamada de {callType} {callTime}'
    },
    endCallMsg: {
      type: String,
      default: 'Fim da chamada de {callType} {callTime}'
    },
    videoMsg: {
      type: String,
      default: 'vídeo'
    },
    audioMsg: {
      type: String,
      default: 'áudio'
    },
    meetMsg: {
      type: String,
      default: 'Chamada de vídeo'
    },
    voiceMsg: {
      type: String,
      default: 'Ligação'
    },
    successStatusMsg: {
      type: String,
      default: 'Finalizada'
    },
    failedStatusMsg: {
      type: String,
      default: 'Não atendida'
    },
    cancelStatusMsg: {
      type: String,
      default: 'Cancelada'
    },
    asyncFetchMedia: {
      type: Function
    }
  },
  computed: {
    formattedMessage() {
      return (this.document.status === 'started' ? this.startCallMsg : this.endCallMsg).replace(/\{callType\}/g, this.callTypeText).replace(/\{callTime\}/g, this.callTimeText)
    },
    callTypeText() {
      return this.document.type === 'meet' ? this.videoMsg : this.audioMsg
    },
    callTimeText() {
      return this.date
    }
  }
}
</script>


<style lang="scss" scoped>
@import '../styles/variables.scss';

.calls {
  color: $color-content-disable;
  text-align: center;
  overflow: hidden;
  padding-top: 5px;
  width: auto;

  .subtitle {
    margin: 0;
    margin: 16px 32px;
    overflow: hidden;

    &.fancy {
      line-height: 1;
      text-align: center;

      span {
        display: inline-block;
        position: relative;

        &:before,
        &:after {
          content: '';
          position: absolute;
          height: 5px;
          border-bottom: 1px solid $color-surface-3;
          top: 2px;
          width: 100%;
        }

        &:before {
          right: 100%;
          margin-right: 15px;
        }

        &:after {
          left: 100%;
          margin-left: 15px;
        }
      }
    }
  }
}
</style>
