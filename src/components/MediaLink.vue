<template>
  <div :class="'blip-container media-link ' + document.type.split('/')[0] + isFailedMessage(status, position)">

    <blip-image
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
      :editing="editing"/>
    <blip-audio
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
      :editing="editing"/>
    <blip-video
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
      :editing="editing"/>
    <blip-file
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
      :editing="editing"/>

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
    aspectRatioMsg: {
      type: String,
      default: 'Aspect Ratio'
    },
    supportedFormatsMsg: {
      type: String,
      default: 'Supported formats'
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
