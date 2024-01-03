<template>
  <div>
    <div
      v-if="
        previewDocument.content != null && previewDocument.content.length > 0
      "
      :class="
        `blip-container calls-card ${isFailedMessage(status, position)} ${
          document.photo ? 'with-photo' : ''
        }`.trim()
      "
    >
      <div :class="`bubble ${position}`">
        <div class="content">
          <div class="content__details">
            <div :class="`content__details__icon ${document.status}`">
              <bds-icon
                :name="iconName"
                color="var(--color-content-default, #454545)"
              />
            </div>
            <div class="content__details__text">
              <div class="content__details__text__container">
                <bds-typo
                  class="typo title"
                  variant="fs-16"
                  bold="bold"
                  :margin="false"
                  >{{ titleText }}
                </bds-typo>
                <bds-typo
                  v-if="this.document.identification"
                  class="typo"
                  variant="fs-12"
                  bold="regular"
                  :margin="false"
                  >{{ identificationText }}
                </bds-typo>
              </div>
              <div class="content__details__text__status">
                <bds-typo
                  class="typo"
                  variant="fs-14"
                  bold="semi-bold"
                  :margin="false"
                  >{{ statusText }}
                </bds-typo>
              </div>
            </div>
          </div>
          <div
            v-if="isSuccess"
            :class="
              `content__record ${document.type} ${
                hasMediaUri ? 'has-media' : ''
              }`
            "
          >
            <template v-if="hasMediaUri && document.type === 'video'">
              <blip-video
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
                :on-video-validate-uri="onMediaValidateUri"
                :async-fetch-media="asyncFetchMedia"
              />
            </template>
            <template v-else-if="document.type === 'voice' && hasMediaUri">
              <blip-audio
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
                :on-audio-validate-uri="onMediaValidateUri"
                :async-fetch-media="asyncFetchMedia"
              />
            </template>
            <div v-else-if="!hasMediaUri" class="loading-media-content">
              <bds-typo variant="fs-14" bold="semi-bold" line-height="plus"
                >{{ preparingRecordingMsg }}
              </bds-typo>
              <button
                class="btn-refresh"
                :disabled="refreshingMediaUri"
                @click="refreshMediaUrl"
              >
                <bds-loading-spinner
                  v-if="refreshingMediaUri"
                  color="light"
                  size="small"
                />
                <bds-icon
                  v-else
                  name="refresh"
                  size="x-large"
                  color="var(--color-surface-1, #F6F6F6)"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="document.photo"
        :class="'blip-card-photo ' + position"
        :style="{
          bottom: '25px',
          right: '0%',
          width: '25px',
          height: '25px',
          'background-image': 'url(&quot;' + document.photo + '&quot;)'
        }"
      ></div>
      <blip-card-date
        :status="status"
        :position="position"
        :date="date"
        :failed-to-send-msg="failedToSendMsg"
      />
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
    preparingRecordingMsg: {
      type: String,
      default: 'Preparando Graveção'
    },
    failedToSendMsg: {
      type: String,
      default: 'Falha ao enviar a mensagem.'
    },
    onMediaValidateUri: {
      type: Function
    },
    asyncFetchMedia: {
      type: Function
    },
    onAsyncFetchSession: {
      type: Function
    }
  },
  data() {
    return {
      refreshingMediaUri: false,
      hasMediaUri: false,
      isFailedMessage
    }
  },
  mounted() {
    this.refreshMediaUrl()
  },
  computed: {
    previewDocument: function() {
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
    iconName: function() {
      const failedVideoIconName = 'video-ended'
      const failedVoiceIconName = 'voip-ended'

      const icons = {
        video: {
          success: 'video-calling',
          failed: failedVideoIconName,
          canceled: failedVideoIconName,
          notAnswered: failedVideoIconName,
          none: failedVideoIconName
        },
        voice: {
          success: 'voip-calling',
          failed: failedVoiceIconName,
          canceled: failedVoiceIconName,
          notAnswered: failedVoiceIconName,
          none: failedVoiceIconName
        }
      }

      return icons[this.document.type][this.document.status]
    },
    titleText: function() {
      const msgs = {
        video: this.videoCallMsg,
        voice: this.voiceCallMsg
      }

      return this.sanitize(msgs[this.document.type])
    },
    identificationText: function() {
      return this.sanitize(this.document.identification)
    },
    statusText: function() {
      const statusMessage = {
        success: this.successStatusMsg,
        failed: this.failedStatusMsg,
        canceled: this.cancelStatusMsg,
        notAnswered: this.notAnsweredStatusMsg,
        none: this.notAnsweredStatusMsg
      }

      return this.sanitize(statusMessage[this.document.status])
    },
    isSuccess: function() {
      return this.document.status === 'success'
    }
  },
  methods: {
    async refreshMediaUrl() {
      try {
        if (this.isSuccess && this.onAsyncFetchSession) {
          this.refreshingMediaUri = true

          const session = await this.onAsyncFetchSession(
            this.document.sessionId
          )

          if (session && session.recordedFileUrl) {
            this.document.media.content.uri = session.recordedFileUrl
            this.hasMediaUri = true
          }
        }
      } finally {
        this.refreshingMediaUri = false
      }
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
$space-05: var(--space-05, 0.25rem);
$space-1: var(--space-1, 0.5rem);
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
          background-color: var(--color-error, #f99f9f);

          &.success {
            background-color: var(--color-success, #84ebbc);
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

          &__status {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            align-self: stretch;
            gap: $space-1;
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
          &.has-media {
            padding: 0;
            background-color: transparent;
          }

          > div {
            display: flex;
            flex: 1;
            align-self: stretch;

            > div {
              display: flex;
              flex: 1;
              align-self: stretch;

              div.video-player-wrapper {
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
          }
        }

        &.voice {
          > div {
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

        .loading-media-content {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          align-self: stretch;
          gap: $space-1;

          bds-loading-spinner {
            display: flex;
          }

          bds-typo {
            flex: 1;
            color: $color-surface-1;
          }

          button {
            &.btn-refresh {
              position: relative;
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 0;
              padding: $space-05 $space-1;
              background-color: transparent;
              border-radius: $space-1;
              border: 1px solid $color-border-1;
              cursor: pointer;

              &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: transparent;
                z-index: 0;
                border-radius: $space-1;
              }

              &:hover {
                &::before {
                  background-color: $color-hover;
                }
              }

              &:active {
                &::before {
                  background-color: $color-pressed;
                }
              }

              &:disabled {
                cursor: default;
                border: 1px solid $color-content-ghost;

                &::before {
                  background-color: transparent;
                }
              }
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
