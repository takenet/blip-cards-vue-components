<template>
  <div :class="'blip-container media-link ' + document.type.split('/')[0] + isFailedMessage(status, position)"
    id="blip-container">
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
      v-if="document.type.indexOf('image')
      !=
      -1"
      :editable="editable"
      :on-media-selected="onMediaSelected"
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
      v-else-if="document.type.indexOf('audio')
      !=
      -1"
      :editable="editable"
      :on-save="save"
      :on-deleted="onDeleted"
      :on-metadata-edit="isMetadataReady"
      :deletable="deletable"
      :on-cancel="onCancel"
      :editing="editing"
      :on-audio-validate-uri="onAudioValidateUri"
        :async-fetch-media="asyncFetchMedia"/>
      <blip-video
      :video-uri-msg="videoUriMsg"
      :document="document"
      :full-document="fullDocument"
      :position="position"
      :date="date"
      @updated="emitUpdate"
      v-else-if="document.type.indexOf('video')
      !=
      -1"
      :editable="editable"
      :on-save="save"
      :on-deleted="onDeleted"
      :on-metadata-edit="isMetadataReady"
      :deletable="deletable"
      :on-cancel="onCancel"
      :editing="editing"
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
    <div class="flex" :class="'notification ' + position" v-if="date">
      <img v-if="this.status === 'waiting' && this.position === 'right'" :src="clockSvg">
      <img v-else-if="status === 'accepted' && this.position === 'right'" :src="checkSentSvg"/>
      <img v-else-if="status === 'received' && this.position === 'right'" :src="doubleCheckReceivedSvg"/>
      <img v-else-if="status === 'consumed' && this.position === 'right'" :src="doubleCheckReadSvg"/>
      <div v-else-if="this.status === 'failed' && this.position === 'right'" class="failure">
          {{ failedToSendMsg }}
        </div>
      {{ date }}
      </div>
  </div>
</template>

<script>

import BlipImage from './MediaLink/Image'
import BlipAudio from './MediaLink/Audio'
import BlipVideo from './MediaLink/Video'
import BlipFile from './MediaLink/BlipFile'
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
    BlipFile
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
