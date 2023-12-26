<template>
  <div :class="'blip-container media-link ' + document.type.split('/')[0] + isFailedMessage(status, position)"
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

      <blip-audio
        :file-url-msg="fileUrlMsg"
        :document="componentAudio"
        :full-document="fullDocument"
        :position="position"
        :date="date"
        v-else-if="componentAudio !== undefined"
        :on-audio-validate-uri="onAudioValidateUri"
        :async-fetch-media="asyncFetchMedia"/>

      <!-- <blip-video
        :video-uri-msg="videoUriMsg"
        :document="componentVideo"
        :full-document="fullDocument"
        :position="position"
        :date="date"
        v-else-if="componentVideo !== undefined"
        :on-metadata-edit="isMetadataReady"
        :on-video-validate-uri="onAudioValidateUri"
        :async-fetch-media="asyncFetchMedia"/>

      <div class="bubble">
        <blip-file
          :title-msg="titleMsg"
          :document="componentDocument"
          :full-document="fullDocument"
          :position="position"
          :date="date"
          v-if="componentDocument !== undefined"
          :editable="editable"
          :on-media-selected="onMediaSelected"
          :on-save="save"
          :on-deleted="onDeleted"
          :on-metadata-edit="isMetadataReady"
          :deletable="deletable"
          :on-cancel="onCancel"
          :editing="editing"
          :async-fetch-media="asyncFetchMedia"/>--->
      </div>
    </div>
  </div>
</template>
  
<script>

import BlipImage from '../MediaLink/Image'
import BlipAudio from '../MediaLink/Audio'
import BlipVideo from '../MediaLink/Video'
import BlipFile from '../MediaLink/BlipFile'
import { default as base } from '../../mixins/baseComponent.js'
import { parseComponentImage, parseComponentAudio, parseComponentVideo, parseComponentDocument } from '@/utils/TemplateContent'
import { isFailedMessage } from '../../utils/misc'

export default {
  name: 'media-content',
  props: {
    status: {
      type: String,
      default: ''
    },
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
  data: function() {
    return {
      isFailedMessage,
      componentImage: {},
      componentVideo: {},
      componentDocument: {},
      componentAudio: {}
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
    console.log('this.documen', this.document)
    console.log('componentDocument', this.componentDocument)
  },
  components: {
    BlipImage,
    BlipAudio,
    BlipVideo,
    BlipFile
  }
}
</script>
<style lang="scss">
@import '../../styles/variables.scss';

// .bubble {
//   &.right {
//     margin-right: 0px;
//   }

//   &.left {
//     margin-left: 0px;
//   }
// }
</style>
