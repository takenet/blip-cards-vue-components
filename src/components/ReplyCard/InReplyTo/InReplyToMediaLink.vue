<template>
  <div id="reply">
    <blip-image
      :image-uri-msg="titleMsg"
      :title-msg="titleMsg"
      :text-msg="textMsg"
      :aspect-ratio-msg="aspectRatioMsg"
      :supported-formats-msg="supportedFormatsMsg"
      :document="inReplyTo"
      :full-document="inReplyTo"
      :date="date"
      v-if="inReplyTo.type.indexOf('image') != -1"
      :editable="editable"
      :on-media-selected="onMediaSelected"
      :on-save="save"
      :on-deleted="onDeleted"
      :on-metadata-edit="isMetadataReady"
      :deletable="deletable"
      :on-cancel="onCancel"
      :editing="editing"
      :async-fetch-media="asyncFetchMedia"
      :simplified="true"      
    />
    <blip-sticker
      :supported-formats-msg="supportedFormatsMsg"
      :document="inReplyTo"
      :full-document="inReplyTo"
      :date="date"
      v-else-if="inReplyTo.type.indexOf('sticker') != -1"
      :editable="editable"
      :on-media-selected="onMediaSelected"
      :on-save="save"
      :on-deleted="onDeleted"
      :on-metadata-edit="isMetadataReady"
      :deletable="deletable"
      :on-cancel="onCancel"
      :editing="editing"
      :async-fetch-media="asyncFetchMedia"
      :simplified="true"
    />
    <blip-audio
      :file-url-msg="fileUrlMsg"
      :document="inReplyTo"
      :full-document="inReplyTo"
      :date="date"
      v-else-if="
        inReplyTo.type.indexOf('audio') != -1 ||
          inReplyTo.type.indexOf('voice') != -1
      "
      :editable="editable"
      :on-save="save"
      :on-deleted="onDeleted"
      :on-metadata-edit="isMetadataReady"
      :deletable="deletable"
      :on-cancel="onCancel"
      :editing="editing"
      :on-audio-validate-uri="onAudioValidateUri"
      :async-fetch-media="asyncFetchMedia"
      :simplified="true"
      class="in-reply-to-message-audio"
    />
    <blip-video
      :video-uri-msg="videoUriMsg"
      :document="inReplyTo"
      :full-document="inReplyTo"
      :date="date"
      @updated="emitUpdate"
      v-else-if="inReplyTo.type.indexOf('video') != -1"
      :editable="editable"
      :on-save="save"
      :on-deleted="onDeleted"
      :on-metadata-edit="isMetadataReady"
      :deletable="deletable"
      :on-cancel="onCancel"
      :editing="editing"
      :async-fetch-media="asyncFetchMedia"
      :simplified="true"
    />
    <blip-file
      :title-msg="titleMsg"
      :document="inReplyTo"
      :full-document="inReplyTo"
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
      :simplified="true"
    />
  </div>
</template>

<script>
import BlipImage from '../../MediaLink/Image'
import BlipAudio from '../../MediaLink/Audio'
import BlipVideo from '../../MediaLink/Video'
import BlipFile from '../../MediaLink/BlipFile'
import { default as base } from '../../../mixins/baseComponent.js'

export default {
  name: 'in-reply-to-media-link',
  mixins: [base],
  props: {
    inReplyTo: {
      type: Object,
      default: {}
    },
    asyncFetchMedia: {
      type: Function
    },
    onMediaSelected: {
      type: Function
    },
    translations: {
      type: Object,
      default: () => ({})
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
    position: {
      type: String,
      default: 'left'
    }
  },
  components: {
    BlipImage,
    BlipAudio,
    BlipVideo,
    BlipFile
  },
  computed: {
    isApplicationJsonType() {
      return this.inReplyTo.type === 'application/json'
    },
    interactiveHeader() {
      return this.inReplyTo.value.interactive.header
    },
    interactiveHeaderText() {
      return this.inReplyTo.value.interactive.header.text
    },
    interactiveBodyText() {
      return this.inReplyTo.value.interactive.body.text
    },
    inReplyToText() {
      switch (this.inReplyTo.type) {
        case 'text/plain':
          return this.inReplyTo.value
        case 'application/vnd.lime.select+json':
          return this.inReplyTo.value.text
        case 'application/json':
          return this.interactiveHeader
            ? this.interactiveHeaderText
            : this.interactiveBodyText
        default:
          return ''
      }
    },
    inReplyToDescription() {
      return this.isApplicationJsonType && this.interactiveHeader
        ? this.interactiveBodyText
        : ''
    },
    hasDescription() {
      return Boolean(this.inReplyToDescription)
    }
  },
  methods: {
    emitUpdate() {
      this.$emit('updated')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/variables.scss';

.in-reply-to-message-audio{
    padding-top: 1rem;
    padding-bottom: 1rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
}
</style>
