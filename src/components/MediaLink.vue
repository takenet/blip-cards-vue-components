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
          :async-fetch-media="asyncFetchMedia"
          :on-image-selected="onImageSelected"
          :translated-title="translatedMediaTitle"
          :translated-text="translatedMediaText"/>

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
          :async-fetch-media="asyncFetchMedia"
          :translated-text="translatedMediaText"/>

      </div>

      <blip-card-reply
        :document="fullDocument"
        :reply-callback="replyCallback"
        :reply-tooltip-text="translations.replyTooltipText"
      />
    </bds-grid><blip-card-translation
      v-for="n in translationRowFooter"
      :key="n"
      :state="translationState"
      :label="translationFooterLabel"
      :action-label="translationFooterActionLabel"
      :position="position"
      @action="onTranslationAction"
    />
    <blip-card-date
      :status="status"
      :position="position"
      :date="date"
      :failed-to-send-msg="failedToSendMsg"
      :is-external-message="isExternalMessage"
      :external-message-text="externalMessageText"
    >
      <blip-card-translation
        v-for="n in translationDateFooter"
        :key="n"
        inline
        :separator="!!date"
        :state="translationState"
        :label="translationFooterLabel"
        :action-label="translationFooterActionLabel"
        :position="position"
        @action="onTranslationAction"
      />
    </blip-card-date>
  </div>
</template>

<script>

import BlipImage from './MediaLink/Image'
import BlipAudio from './MediaLink/Audio'
import BlipVideo from './MediaLink/Video'
import BlipFile from './MediaLink/BlipFile'
import BlipSticker from './MediaLink/Sticker'
import { default as base } from '../mixins/baseComponent.js'
import messageTranslation from '../mixins/messageTranslation.js'
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
    },
    onImageSelected: {
      type: Function
    }
  },
  data: function() {
    return {
      isFailedMessage
    }
  },
  computed: {
    mediaKind() {
      const type = this.document.type
      if (type.indexOf('image') !== -1) return 'image'
      if (type.indexOf('sticker') !== -1 || type.indexOf('audio') !== -1 || type.indexOf('voice') !== -1 || type.indexOf('video') !== -1) return 'other'
      return 'file'
    },
    hasTranslatableContent() {
      if (this.mediaKind === 'image') return !!(this.document.title || this.document.text)
      return this.mediaKind === 'file' && !!this.document.text
    },
    translatedMediaTitle() {
      return this.mediaKind === 'image' && this.document.title ? this.translatedField('title', undefined) : undefined
    },
    translatedMediaText() {
      return this.document.text ? this.translatedField('text', undefined) : undefined
    }
  },
  mixins: [
    base,
    messageTranslation
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
