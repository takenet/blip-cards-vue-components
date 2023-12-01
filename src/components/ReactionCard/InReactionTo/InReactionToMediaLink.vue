<template>
    <div :class="'media-link ' + inReactionTo.type.split('/')[0]">
      <div :class="'inReactionTo ' + position" id="inReactionTo">
          <blip-audio
            :file-url-msg="fileUrlMsg"
            :document="inReactionTo"
            :full-document="inReactionTo"
            :date="date"
            v-if="inReactionTo.type.indexOf('audio') != -1"
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
          />
      </div>
    </div>
  </template>
  
  <script>
    import BlipImage from '../../MediaLink/Image'
    import BlipAudio from '../../MediaLink/Audio'
    import BlipVideo from '../../MediaLink/Video'
    import BlipFile from '../../MediaLink/BlipFile'
    import { default as base } from '../../../mixins/baseComponent.js'
    // import { isFailedMessage } from '../../../utils/misc'

    export default {
      name: 'in-reaction-to-media-link',
      mixins: [base],
      components: {
        BlipImage,
        BlipAudio,
        BlipVideo,
        BlipFile
      },
      props: {
        inReactionTo: {
          type: Object,
          default: () => ({})
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
      computed: {
      }
    }
  </script>
  
  <style lang="scss" scoped>
    @import '../../../styles/variables.scss';
  
    .inReactionTo {
      border-radius: $hard-round;
    }
  </style>
  