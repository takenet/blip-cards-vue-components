<template>
  <div :class="'blip-container media-link ' + mediaType + isFailedMessage(status, position)"
    id="blip-container">
    <div id='media-content'>
      <blip-image
        :image-uri-msg="titleMsg"
        :title-msg="titleMsg"
        :text-msg="textMsg"
        :aspect-ratio-msg="aspectRatioMsg"
        :supported-formats-msg="supportedFormatsMsg"
        :document="componentImage"
        :full-document="fullDocument"
        :position="position"
        :date="date"
        v-if="componentImage !== undefined"
        :useBorderRadius="false"/>

      <media-video
        :componentVideo="componentVideo"
        :onVideoValidateUri="onAudioValidateUri"
        :async-fetch-media="asyncFetchMedia"></media-video>

      <media-audio
        :class="'padding-control'"
        :componentAudio="componentAudio"
        :onAudioValidateUri="onAudioValidateUri"
        :async-fetch-media="asyncFetchMedia"></media-audio>

      <media-file
        :componentDocument="componentDocument"
        :position="position"></media-file>
    </div>
  </div>
</template>
  
<script>

import BlipImage from '../../MediaLink/Image'
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
    mediaComponent() {
      return this.componentImage ||
        this.componentAudio ||
        this.componentDocument ||
        this.componentVideo ||
        {
          type: ''
        }
    },
    mediaType() {
      const media = this.mediaComponent.type.split('/')[0]
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
      isLoading: false
    }
  },
  mixins: [
    base
  ],
  created() {
    this.componentImage = parseComponentImage(this.document)
    this.componentAudio = parseComponentAudio(this.document)
    this.componentDocument = parseComponentDocument(this.document)
    this.componentVideo = parseComponentVideo(this.document)
  },
  components: {
    BlipImage,
    MediaFile,
    MediaAudio,
    MediaVideo
  }
}
</script>

<style lang="scss">
@import '../../../styles/variables.scss';

.media-link {
    white-space: normal !important;
}

.padding-control {
  padding: $bubble-padding;
}
</style>
