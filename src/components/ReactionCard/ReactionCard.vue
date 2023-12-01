<template>
    <div class="blip-container reaction-card"
      id="reaction-container">
      <div :class="'bubble ' + position">
        <div class="reaction-container">
          <bds-grid direction="row" align-items="flex-start" gap="half" margin="b-half">
            <bds-icon name="like" size="small" type="icon"></bds-icon>
            <bds-typo v-if="hasEmoji" variant="fs-14" italic="true">{{ reactionText }}</bds-typo>
            <bds-typo v-if="!hasEmoji" variant="fs-14" italic="true">{{ removedReactionText }}</bds-typo>
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
          <reaction-base v-if="hasEmoji" :emoji="emoji" />
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
        }
      },
      computed: {
        isOwnMessage() {
          return this.fullDocument.direction === this.fullDocument.content.inReactionTo.direction
        },
        emoji() {
          console.info('emoji', this.document.emoji.values)
          return this.document.emoji.values
        },
        inReactionTo() {
          console.info('in reaction to', this.document.inReactionTo)
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
  </style>
  