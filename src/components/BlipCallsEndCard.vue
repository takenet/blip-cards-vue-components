<template>
  <div>
    <div v-if="previewDocument.content != null && previewDocument.content.length > 0" :class="`blip-container calls-card ${isFailedMessage(status, position)} ${document.photo ? 'with-photo' : ''}`.trim()">
      <div :class="`bubble ${position}`">
        <div class="content">
          <div class="content__details">
            <div :class="`content__details__icon ${document.status}`">
              <bds-icon :name="iconName" color="var(--color-content-default, #454545)" />
            </div>
            <div class="content__details__text">
              <div class="content__details__text__container">
                <bds-typo class="typo title" variant="fs-16" bold="bold" :margin="false">{{ titleText }}</bds-typo>
                <bds-typo v-if="this.document.identification" class="typo" variant="fs-12" bold="regular" :margin="false">{{ identificationText }}</bds-typo>
              </div>
              <div class="content__details__text__status">
                <bds-typo class="typo" variant="fs-14" bold="semi-bold" :margin="false">{{ statusText }}</bds-typo>
              </div>
            </div>
          </div>
          <div v-if="document.status === 'success'" :class="`content__record ${document.type}`">
            <blip-video
              v-if="document.type === 'video'"
              video-uri-msg="videoUriMsg"
              :document="document.media.content"
              :full-document="fullDocument.media"
              :position="position"
              :date="date"
              @updated="emitUpdate"
              :editable="editable"
              :on-save="save"
              :on-deleted="onDeleted"
              :on-metadata-edit="isMetadataReady"
              :deletable="deletable"
              :on-cancel="onCancel"
              :editing="editing"
              :async-fetch-media="asyncFetchMedia"
            />
            <blip-audio
              v-else
              file-url-msg="fileUrlMsg"
              :document="document.media.content"
              :full-document="fullDocument.media"
              :position="position"
              :date="date"
              :editable="editable"
              :on-save="save"
              :on-deleted="onDeleted"
              :on-metadata-edit="isMetadataReady"
              :deletable="deletable"
              :on-cancel="onCancel"
              :editing="editing"
              :on-audio-validate-uri="onAudioValidateUri"
              :async-fetch-media="asyncFetchMedia"
            />
          </div>
        </div>
      </div>
      <div
        v-if="document.photo"
        :class="'blip-card-photo ' + position"
        :style="{ bottom: '25px', right: '0%', width: '25px', height: '25px', 'background-image': 'url(&quot;' + document.photo + '&quot;)' }">
      </div>
      <blip-card-date :status="status" :position="position" :date="date" :failed-to-send-msg="failedToSendMsg" />
    </div>    
  </div>
</template>

<script>
import { linkify, isFailedMessage } from '../utils/misc'
import { default as base } from '../mixins/baseComponent.js'
import BlipAudio from './MediaLink/Audio'
import BlipVideo from './MediaLink/Video'

export default {
  name: 'blip-calls-end-card',
  mixins: [base],
  components: {
    BlipAudio,
    BlipVideo
  },
  props: {
    status: {
      type: String,
      default: ''
    },
    length: {
      type: Number,
      default: 532
    },
    disableLink: {
      type: Boolean,
      default: false
    },
    showMoreMsg: {
      type: String,
      default: 'Ver mais'
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
    failedStatusMsg: {
      type: String,
      default: 'Não atendida'
    },
    cancelStatusMsg: {
      type: String,
      default: 'Cancelada'
    },
    notAnsweredStatusMsg: {
      type: String,
      default: 'Não atendida'
    },
    failedToSendMsg: {
      type: String,
      default: 'Falha ao enviar a mensagem.'
    },
    asyncFetchMedia: {
      type: Function
    }
  },
  computed: {
    previewDocument: function () {
      console.log('document: ', this.document)
      const sanitizedDocument = this.sanitize(this.document)

      return {
        hasPreview: sanitizedDocument.length > this.length,
        previewContent: linkify(
          sanitizedDocument.substring(0, this.length - 3) + '...',
          this.disableLink
        ),
        content: linkify(sanitizedDocument, this.disableLink)
      }
    },
    iconName: function () {
      return this.document.type === 'video' ? 'video' : 'voip'
    },
    titleText: function () {
      return this.sanitize(this.document.type === 'video' ? this.videoCallMsg : this.voiceCallMsg)
    },
    identificationText: function () {
      return this.sanitize(this.document.identification)
    },
    statusText: function () {
      const statusMessage = {
        success: this.successStatusMsg,
        failed: this.failedStatusMsg,
        canceled: this.cancelStatusMsg,
        notAnswered: this.notAnsweredStatusMsg
      }

      return this.sanitize(statusMessage[this.document.status])
    }
  },
  data: function () {
    return {
      text: undefined,
      showContent: undefined,
      isFailedMessage
    }
  },
  methods: {
    init: function () {
      this.text = this.document
      this.showContent = false
    },
    saveText: function ($event) {
      if (this.errors.any() || ($event && $event.shiftKey)) {
        return
      }

      if ($event) {
        $event.stopPropagation()
        $event.preventDefault()
        $event.returnValue = false
      }

      this.showContent = false
      this.save(this.text)
    },
    sanitizeText: function (text) {
      return this.sanitize(text)
    },
    async onAudioValidateUri(uri) {
      console.log(uri)

      return uri
    },
    emitUpdate() {
      this.$emit('updated')
    }
  }
}
</script>


<style lang="scss">
@import '../styles/variables.scss';

$space-0: var(--space-0, 0);
$space-05: var(--space-05, .25rem);
$space-1: var(--space-1, .5rem);
$space-2: var(--space-2, 1rem);
$space-4: var(--space-4, 2rem);

.blip-message-group {
  .blip-card-group {
    .calls-card {
      &.with-photo {
        .bubble {
          &.right {
            margin-right: 32px;
          }

          &.left {
            margin-left: 32px;
          }
        }

        div.notification {
          &.right {
            margin-right: 32px;
          }

          &.left {
            margin-left: 32px;
          }
        }
      }

      div.notification {
        display: flex !important;
      }
    }
  }
}

.calls-card {
  margin-bottom: $space-4 !important;

  .bubble {
    padding: 12px;
    word-wrap: break-word;
    min-width: auto !important;
    text-align: left;
    min-width: 340px !important;

    .content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-center;
      gap: $space-1;

      &__details {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        padding: $space-1;

        min-height: 60px;

        &__icon {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          padding: $space-1;
          border-radius: $space-1;
          background-color: var(--color-error, #F99F9F);

          &.success {
            background-color: var(--color-success, #84EBBC);
          }
        }

        &__text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          flex: 1;

          &__container {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            gap: $space-1;
            align-self: stretch;

            bds-typo.title {
              flex: 1;
            }
          }
        }
      }

      &__record {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: start;
        gap: $space-05;
        align-self: stretch;
        padding: $space-05 12px;
        background-color: var(--color-content-disabled, #636363);
        border-radius: 6px 6px $space-0 6px;

        min-height: 60px;

        &.video {
          padding: 0;
          background-color: transparent;

          .video-player-wrapper {
            flex: 1;

            #blipVideo {
              border-radius: $space-1 !important;
            }

            .video-player-controls {
              margin-top: $space-2;
              padding: $space-05 $space-2;
            }
          }
        }

        >div {
          display: flex;
          align-self: stretch;

          div.audio-player-wrapper {
            flex: 1;

            .audio-play-pause {
              margin-top: 3px;
            }
          }
        }
      }
    }

    &.left,
    &.middle {
      .content {
        &__record {
          border-radius: 6px 6px 6px $space-0;

          .audio-player-wrapper {
            .slider {
              background-color: $color-content-ghost;
            }

            .progress .pin {
              background-color: $color-surface-1;
            }

            .audio-player-button {
              fill: $color-surface-1;
            }

            .audio-player-time {
              color: $color-surface-1;
            }

            .blip-change-playback-rate {
              border-color: $color-content-ghost;
              color: $color-surface-1;
            }
          }
        }
      }
    }

    &.middle {
      .content {
        &__record {
          border-radius: 6px;
        }
      }
    }
  }
}

.blip-plain-text-metadata {
  margin-top: -20px;
  padding: 0 10px 10px 0;
}
</style>
