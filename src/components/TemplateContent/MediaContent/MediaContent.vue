<template>
  <div :class="'blip-container media-link ' + mediaComponent.type.split('/')[0] + isFailedMessage(status, position)"
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

      <blip-video
        :video-uri-msg="videoUriMsg"
        :document="componentVideo"
        :full-document="fullDocument"
        :position="position"
        :date="date"
        v-else-if="componentVideo !== undefined"
        :on-metadata-edit="isMetadataReady"
        :on-video-validate-uri="onAudioValidateUri"
        :async-fetch-media="asyncFetchMedia"/>

      <media-audio
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
import BlipVideo from '../../MediaLink/Video'
import MediaFile from './MediaFile'
import MediaAudio from './MediaAudio'
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
    fileUrlMsg: String,
    imageUriMsg: String,
    videoUriMsg: String,
    titleMsg: String,
    textMsg: String,
    document: {},
    onAudioValidateUri: {
      type: Function
    },
    onMediaSelected: {
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
    BlipVideo,
    MediaFile,
    MediaAudio
  }
}
</script>
