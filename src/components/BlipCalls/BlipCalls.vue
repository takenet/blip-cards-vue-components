<template>
  <div class="blip-container calls">
    <blip-calls-end-card
      v-if="document.status !== 'started'"
      :document="document"
      :full-document="fullDocument"
      :status="status"
      :position="position"
      :date="date"
      :video-call-msg="videoCallMsg"
      :voice-call-msg="voiceCallMsg"
      :success-status-msg="successStatusMsg"
      :failed-status-msg="failedStatusMsg"
      :cancel-status-msg="cancelStatusMsg"
      :not-answered-status-msg="notAnsweredStatusMsg"
      :preparing-recording-msg="preparingRecordingMsg"
      :load-recording-msg="loadRecordingMsg"
      :failed-to-send-msg="failedToSendMsg"
      :download-recording-label="downloadRecordingLabel"
      :transcribe-recording-label="transcribeRecordingLabel"
      :on-media-validate-uri="onMediaValidateUri"
      :async-fetch-media="asyncFetchMedia"
      :on-async-fetch-session="onAsyncFetchSession"
      :transcription="transcription"
    />
  </div>
</template>

<script>
import { default as base } from '../../mixins/baseComponent.js'

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
    videoCallMsg: {
      type: String,
      default: 'Chamada de vídeo'
    },
    voiceCallMsg: {
      type: String,
      default: 'Ligação'
    },
    successStatusMsg: {
      type: String,
      default: 'Finalizada'
    },
    cancelStatusMsg: {
      type: String,
      default: 'Cancelada'
    },
    notAnsweredStatusMsg: {
      type: String,
      default: 'Não atendida'
    },
    preparingRecordingMsg: {
      type: String,
      default: 'Preparando Gravação'
    },
    loadRecordingMsg: {
      type: String,
      default: 'Carregar Gravação'
    },
    failedStatusMsg: {
      type: String,
      default: 'Falha'
    },
    downloadRecordingLabel: {
      type: String,
      default: 'Baixar gravação'
    },
    transcribeRecordingLabel: {
      type: String,
      default: 'Ver transcrição'
    },
    onMediaValidateUri: {
      type: Function
    },
    asyncFetchMedia: {
      type: Function
    },
    onAsyncFetchSession: {
      type: Function
    },
    transcription: {
      type: Object
    }
  },
  computed: {
    formattedMessage() {
      return (this.document.status === 'started'
        ? this.startCallMsg
        : this.endCallMsg
      )
        .replace(/\{callType\}/g, this.callTypeText)
        .replace(/\{callTime\}/g, this.callTimeText)
    },
    callTypeText() {
      return this.document.type === 'video' ? this.videoMsg : this.audioMsg
    },
    callTimeText() {
      return this.date
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/variables.scss';

.calls {
  color: $color-content-disable;
  text-align: center;
  overflow: hidden;
  padding-top: 5px;
  width: auto;
}
</style>
