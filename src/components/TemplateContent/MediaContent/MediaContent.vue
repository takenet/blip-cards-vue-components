<template>
  <div :class="'blip-container media-link ' + mediaType + isFailedMessage(status, position)"
    id="blip-container">
    <div id='media-content' class="media-content">
      <media-image v-if="docType.includes('image')"
        :componentImage="componentImage"
        :emptyMediaMessage="defaultMediaMessage" />

      <media-video v-else-if="docType.includes('video')"
        :componentVideo="componentVideo"
        :onVideoValidateUri="onAudioValidateUri"
        :async-fetch-media="asyncFetchMedia"
        :emptyMediaMessage="defaultMediaMessage"></media-video>

      <media-audio v-else-if="docType.includes('audio')"
        :class="'padding-control'"
        :componentAudio="componentAudio"
        :onAudioValidateUri="onAudioValidateUri"
        :async-fetch-media="asyncFetchMedia"></media-audio>

      <media-file v-else-if="docType.includes('document')"
        :componentDocument="componentDocument"
        :position="position"
        :async-fetch-media="asyncFetchMedia"
        :emptyMediaMessage="defaultMediaMessage"></media-file>
    </div>
  </div>
</template>

<script>

import MediaImage from './MediaImage'
import MediaFile from './MediaFile'
import MediaAudio from './MediaAudio'
import MediaVideo from './MediaVideo'
import { default as base } from '../../../mixins/baseComponent.js'
import { validateTextHasValue, parseComponentImage, parseComponentAudio, parseComponentVideo, parseComponentDocument } from '@/utils/TemplateContent'
import { isFailedMessage } from '../../../utils/misc'

export default {
  name: 'media-content',
  props: {
    status: {
      type: String,
      default: ''
    },
    aspectRatioMsg: String,
    supportedFormatsMsg: String,
    titleMsg: String,
    textMsg: String,
    document: {},
    onAudioValidateUri: {
      type: Function
    },
    asyncFetchMedia: {
      type: Function
    }
  },
  computed: {
    mediaType() {
      const mediaComponent = this.componentImage ||
        this.componentAudio ||
        this.componentDocument ||
        this.componentVideo ||
        { type: '' }

      const media = this.getMediaTypeFromText(mediaComponent.type)
      return media === 'video' ? 'media-video' : media
    }
  },
  data: function() {
    return {
      isFailedMessage,
      componentImage: undefined,
      componentVideo: undefined,
      componentDocument: undefined,
      componentAudio: undefined,
      docType: '',
      defaultMediaMessage: ''
    }
  },
  mixins: [
    base
  ],
  created() {
    this.docType = (this.document &&
      this.document.template &&
      this.document.template.components &&
      this.document.template.components[0] &&
      validateTextHasValue(this.document.template.components[0].type, 'header') &&
      this.document.template.components[0].format)
      ? this.document.template.components[0].format
      : (this.document &&
      this.document.template &&
      this.document.template.components &&
      this.document.template.components[0] &&
      this.document.template.components[0].parameters &&
      this.document.template.components[0].parameters[0])
      ? this.document.template.components[0].parameters[0].type
      : ''

    this.defaultMediaMessage = this.document.emptyMediaMessage
    this.docType = this.docType.toLowerCase()

    if (this.docType.includes('image')) {
      this.componentImage = parseComponentImage(this.document)
    } else if (this.docType.includes('audio')) {
      this.componentAudio = parseComponentAudio(this.document)
    } else if (this.docType.includes('document')) {
      this.componentDocument = parseComponentDocument(this.document)
    } else if (this.docType.includes('video')) {
      this.componentVideo = parseComponentVideo(this.document)
    }
  },
  components: {
    MediaImage,
    MediaFile,
    MediaAudio,
    MediaVideo
  },
  methods: {
    getMediaTypeFromText(text) {
      return (text || '').split('/')[0]
    }
  }
}
</script>

<style lang="scss">
@import '../../../styles/variables.scss';

.media-content {
  white-space: normal;
}

.padding-control {
  padding: $bubble-padding;
}
</style>
