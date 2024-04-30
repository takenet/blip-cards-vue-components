<template>
  <div :class="'blip-container media-link ' + mediaType + isFailedMessage(status, position)"
    id="blip-container">
    <div id='media-content' class="media-content">
      <media-image
        v-if="docType === 'image'"
        :image-uri-msg="titleMsg"
        :title-msg="titleMsg"
        :text-msg="textMsg"
        :aspect-ratio-msg="aspectRatioMsg"
        :supported-formats-msg="supportedFormatsMsg"
        :document="componentImage"
        :full-document="fullDocument"
        :position="position"
        :date="date"
        :useBorderRadius="false"/>

      <media-video
        v-else-if="docType.indexOf('video') !== -1"
        :componentVideo="componentVideo"
        :onVideoValidateUri="onAudioValidateUri"
        :async-fetch-media="asyncFetchMedia"></media-video>

      <media-audio
        v-else-if="docType === 'audio'"
        :class="'padding-control'"
        :componentAudio="componentAudio"
        :onAudioValidateUri="onAudioValidateUri"
        :async-fetch-media="asyncFetchMedia"></media-audio>

      <media-file
        v-else-if="docType === 'document'"
        :componentDocument="componentDocument"
        :position="position"
        :async-fetch-media="asyncFetchMedia"></media-file>
    </div>
  </div>
</template>
  
<script>

import MediaImage from './MediaImage'
import MediaFile from './MediaFile'
import MediaAudio from './MediaAudio'
import MediaVideo from './MediaVideo'
import { default as base } from '../../../mixins/baseComponent.js'
import { parseComponentImage, parseComponentAudio, parseComponentVideo, parseComponentDocument } from '@/utils/TemplateContent'
import { isFailedMessage } from '../../../utils/misc'
import mime from 'mime-types'

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

      const media = mediaComponent.type.split('/')[0]
      return media === 'video' ? 'media-video' : media
    },
    mimeType: function() {
      let extension = mime.extension(this.componentDocument.type)
      if (extension) {
        return this.componentDocument.type
      }
      return mime.lookup(this.componentDocument.uri)
    }
  },
  data: function() {
    return {
      isFailedMessage,
      componentImage: {},
      componentVideo: {},
      componentDocument: {},
      componentAudio: {},
      docType: ''
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
      this.document.template.components[0].parameters &&
      this.document.template.components[0].parameters[0])
      ? this.document.template.components[0].parameters[0].type
      : ''

    this.componentImage = parseComponentImage(this.document)
    this.componentAudio = parseComponentAudio(this.document)
    this.componentDocument = parseComponentDocument(this.document)
    this.componentVideo = parseComponentVideo(this.document)
  },
  components: {
    MediaImage,
    MediaFile,
    MediaAudio,
    MediaVideo
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
