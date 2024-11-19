<template>
  <div :class="'blip-container media-link ' + document.type.split('/')[0] + isFailedMessage(status, position)"
    id="blip-container">
    <blip-card-member
      v-if="memberInfo"
      :document="document"
      :position="position"
      :member-info="memberInfo"
      :is-group="false"
    />     
    <bds-grid direction="row" justifyContent="space-between" gap="1" align-items="center" :direction="position === 'left' ? 'row' : 'row-reverse'">
      <div :class="'bubble ' + position" id='media-link'>
        <blip-image
          :image-uri-msg="titleMsg"
          :title-msg="titleMsg"
          :text-msg="textMsg"
          :aspect-ratio-msg="aspectRatioMsg"
          :supported-formats-msg="supportedFormatsMsg"
          :document="document"
          :full-document="fullDocument"
          :position="position"
          :date="date"
          v-if="document.type.indexOf('image') != -1"
          :editable="editable"
          :on-media-selected="onMediaSelected"
          :on-save="save"
          :on-deleted="onDeleted"
          :on-metadata-edit="isMetadataReady"
          :deletable="deletable"
          :on-cancel="onCancel"
          :editing="editing"
          :async-fetch-media="asyncFetchMedia"/>

        <blip-sticker
          :supported-formats-msg="supportedFormatsMsg"
          :document="document"
          :full-document="fullDocument"
          :position="position"
          :date="date"
          v-else-if="document.type.indexOf('sticker') != -1"
          :editable="editable"
          :on-save="save"
          :on-deleted="onDeleted"
          :on-metadata-edit="isMetadataReady"
          :deletable="deletable"
          :on-cancel="onCancel"
          :editing="editing"
          :async-fetch-media="asyncFetchMedia"/>

        <blip-audio
          :file-url-msg="fileUrlMsg"
          :document="document"
          :full-document="fullDocument"
          :position="position"
          :date="date"
          v-else-if="document.type.indexOf('audio') != -1 || document.type.indexOf('voice') != -1"
          :editable="editable"
          :on-save="save"
          :on-deleted="onDeleted"
          :on-metadata-edit="isMetadataReady"
          :deletable="deletable"
          :on-cancel="onCancel"
          :editing="editing"
          :on-audio-validate-uri="onAudioValidateUri"
          :async-fetch-media="asyncFetchMedia"
          :translations="translations"
          :transcription="transcription"/>

        <blip-video
          :video-uri-msg="videoUriMsg"
          :document="document"
          :full-document="fullDocument"
          :position="position"
          :date="date"
          @updated="emitUpdate"
          v-else-if="document.type.indexOf('video') != -1"
          :editable="editable"
          :on-save="save"
          :on-deleted="onDeleted"
          :on-metadata-edit="isMetadataReady"
          :deletable="deletable"
          :on-cancel="onCancel"
          :editing="editing"
          :on-video-validate-uri="onAudioValidateUri"
          :async-fetch-media="asyncFetchMedia"/>

        <blip-file
          :title-msg="titleMsg"
          :document="document"
          :full-document="fullDocument"
          :position="position"
          :date="date"
          v-else
          :editable="editable"
          :on-media-selected="onMediaSelected"
          :on-save="save"
          :on-deleted="onDeleted"
          :on-metadata-edit="isMetadataReady"
          :deletable="deletable"
          :on-cancel="onCancel"
          :editing="editing"
          :async-fetch-media="asyncFetchMedia"/>

      </div>

      <blip-card-reply
        :document="fullDocument"
        :reply-callback="replyCallback"
        :reply-tooltip-text="translations.replyTooltipText"
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
</template>

<script>

import BlipImage from './MediaLink/Image'
import BlipAudio from './MediaLink/Audio'
import BlipVideo from './MediaLink/Video'
import BlipFile from './MediaLink/BlipFile'
import BlipSticker from './MediaLink/Sticker'
import { default as base } from '../mixins/baseComponent.js'
import { isFailedMessage } from '../utils/misc'

export default {
  name: 'media-link',
  props: {
    status: {
      type: String,
      default: ''
    },
    onMediaSelected: {
      type: Function
    },
    failedToSendMsg: {
      type: String,
      default: 'Falha ao enviar a mensagem'
    },
    aspectRatioMsg: String,
    supportedFormatsMsg: String,
    fileUrlMsg: String,
    imageUriMsg: String,
    videoUriMsg: String,
    titleMsg: String,
    textMsg: String,
    onAudioValidateUri: {
      type: Function
    },
    asyncFetchMedia: {
      type: Function
    },
    translations: {
      type: Object,
      default: () => ({})
    },
    transcription: {
      type: Object
    },
    memberInfo: {
      type: String,
      default: ''
    },
    replyCallback: {
      type: Function,
      default: undefined
    }
  },
  data: function() {
    return {
      isFailedMessage
    }
  },
  mixins: [
    base
  ],
  components: {
    BlipImage,
    BlipAudio,
    BlipVideo,
    BlipFile,
    BlipSticker
  },
  methods: {
    emitUpdate () {
      this.$emit('updated')
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables.scss';
</style>
