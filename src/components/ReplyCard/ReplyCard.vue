<template>
  <div class="blip-container reply-card"
    id="blip-container">
    <div :class="'bubble ' + position">
      <div class="reply-container">
        <bds-grid direction="row" align-items="flex-start" gap="half" margin="b-half">
          <bds-icon class="typo" name="redo" size="small" type="icon"></bds-icon>
          <bds-typo class="typo" variant="fs-14" italic="true">{{ replyText }}</bds-typo>
        </bds-grid>
        <in-reply-to-base :in-reply-to="inReplyTo" :is-own-message="isOwnMessage" :failed-message="translations.failedToLoad" />
        <replied-base v-if="replied" 
          :replied="replied" 
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
          :on-save="saveCard"
          :editable="editable"
          :on-deleted="deleteCard"
          :on-metadata-edit="isMetadataReady"
          :deletable="deletable"
          :editing="isCardEditing"
          :on-cancel="cancel"
          :on-audio-validate-uri="onAudioValidateUri" />
      </div>
    </div>
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
  import { default as base } from '../../mixins/baseComponent.js'

  export default {
    name: 'reply-card',
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
      replyText: {
        type: String,
        default: 'Resposta'
      }
    },
    computed: {
      isOwnMessage() {
        return this.fullDocument.direction === this.fullDocument.content.inReplyTo.direction
      },
      replied() {
        return this.document.replied
      },
      inReplyTo() {
        return this.document.inReplyTo
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/variables.scss';

  .reply-container {
    text-align: left;
    padding: 1rem;
  }
</style>
