<template>
    <div class="blip-container reaction-card" id="reaction-container" :class="isGrouped && hasEmoji ? 'reaction-grouped' : ''">
      <div :class="'bubble ' + position">
        <div class="reaction-container">
          <bds-grid direction="row" align-items="flex-start" gap="half" margin="b-half">
            <bds-icon class="typo" name="like" size="small" type="icon"></bds-icon>
            <bds-typo class="typo" variant="fs-14" italic="true">{{ hasEmoji ? reactionText : removedReactionText }}</bds-typo>
          </bds-grid>
          <in-reaction-to-base 
            :in-reaction-to="inReactionTo" 
            :is-own-message="isOwnMessage" 
            :updatedPhotoMargin="updatedPhotoMargin"
            :on-media-selected="onMediaSelected" 
            :translations="translations"
            :async-fetch-media="asyncFetchMedia"
            :failed-to-send-msg="translations.failedToSend"
            :aspect-ratio-msg="translations.aspectRatio"
            :supported-formats-msg="translations.supportedFormats"
            :file-url-msg="translations.fileUrl"
            :title-msg="translations.title"
            :image-uri-msg="translations.imageUri"
            :text-msg="translations.text"
            :video-uri-msg="translations.videoUri"
            :status="status"
            :position="position"
            :date="date"
            :failed-message="translations.failedToLoad" />
          <reaction-base v-if="hasEmoji" :emoji="emoji" :position="position" />
        </div>
      </div>
      <blip-card-date
        :status="status"
        :position="position"
        :date="date"
        :failed-to-send-msg="failedToSendMsg" />
    </div>
  </template>
  
  <script>
    import { default as base } from '../../mixins/baseComponent.js'
    export default {
      name: 'reaction-card',
      mixins: [base],
      props: {
        translations: {
          type: Object,
          default: () => ({})
        },
        failedToSendMsg: {
          type: String,
          default: 'Falha ao enviar a mensagem'
        },
        asyncFetchMedia: {
          type: Function
        },
        status: {
          type: String,
          default: ''
        },
        onMediaSelected: {
          type: Function
        },
        updatedPhotoMargin: {
          type: Function
        },
        onAudioValidateUri: {
          type: Function
        },
        position: {
          type: String,
          default: 'left'
        },
        reactionText: {
          type: String,
          default: 'Reação'
        },
        removedReactionText: {
          type: String,
          default: 'Reação removida'
        },
        isGrouped: {
          type: Boolean,
          default: false
        }
      },
      computed: {
        isOwnMessage() {
          return this.fullDocument.direction === this.fullDocument.content.inReactionTo.direction
        },
        emoji() {
          return this.document.emoji.values
        },
        inReactionTo() {
          return this.document.inReactionTo
        },
        hasEmoji() {
          return this.document.emoji && this.document.emoji.values && this.document.emoji.values.length > 0
        }
      }
    }
  </script>
  
  <style lang="scss" scoped>
    @import '../../styles/variables.scss';
  
    .reaction-container {
      text-align: left;
      padding: 1rem;
    }

    .reaction-grouped {
      padding-bottom: 12px;
    }
  </style>
  