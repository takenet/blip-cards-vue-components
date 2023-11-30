<template>
    <div class="blip-container reaction-card"
      id="reaction-container">
      <div :class="'bubble ' + position">
        <div class="reaction-container">
          <bds-grid direction="row" align-items="flex-start" gap="half" margin="b-half">
            <bds-icon name="like" size="small" type="icon"></bds-icon>
            <bds-typo variant="fs-14" italic="true">{{ reactionText }}</bds-typo>
          </bds-grid>
          <in-reaction-to-base :in-reaction-to="inReactionTo" :is-own-message="isOwnMessage" :failed-message="translations.failedToLoad" />
          <reaction-base :emoji="emoji" />
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
  