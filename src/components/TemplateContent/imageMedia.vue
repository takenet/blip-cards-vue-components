<template>
  <div :class="'blip-container media-link ' + document.type.split('/')[0] + isFailedMessage(status, position)"
    id="blip-container">
    <div :class="'bubble ' + position" id='media-link'>
      <blip-image
         :document="document"
         :position="position"
         v-if="document.type.indexOf('image') != -1"/>
     </div>
  </div>
</template>
  
  <script>
  
  import BlipImage from './MediaLink/Image'
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
  