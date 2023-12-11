<template>
    <div :class="'media-link ' + inReactionTo.type.split('/')[0]">
      <div :class="'inReactionTo ' + position" id="inReactionTo">
          <blip-image
            :image-uri-msg="titleMsg"
            :title-msg="titleMsg"
            :text-msg="textMsg"
            :aspect-ratio-msg="aspectRatioMsg"
            :supported-formats-msg="supportedFormatsMsg"
            :document="inReactionTo"
            :full-document="inReactionTo"
            :date="date"
            v-if="inReactionTo.type.indexOf('image') != -1"
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
            class="in-reaction-to-with-preview"
          />
          <blip-sticker
            :supported-formats-msg="supportedFormatsMsg"
            :document="inReactionTo"
            :full-document="inReactionTo"
            :date="date"
            v-else-if="inReactionTo.type.indexOf('sticker') != -1"
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
            class="in-reaction-to-with-preview"
          />
          <blip-audio
            :file-url-msg="fileUrlMsg"
            :document="inReactionTo"
            :full-document="inReactionTo"
            :date="date"
            v-else-if="inReactionTo.type.indexOf('audio') != -1"
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
            class="in-reaction-to-audio"
          />
          <blip-video
            :video-uri-msg="videoUriMsg"
            :document="inReactionTo"
            :full-document="inReactionTo"
            :date="date"
            @updated="emitUpdate"
            v-else-if="inReactionTo.type.indexOf('video') != -1"
            :editable="editable"
            :on-save="save"
            :on-deleted="onDeleted"
            :on-metadata-edit="isMetadataReady"
            :deletable="deletable"
            :on-cancel="onCancel"
            :editing="editing"
            :async-fetch-media="asyncFetchMedia"
            :simplified="true"
            class="in-reaction-to-with-preview"
          />
          <blip-file
            :title-msg="titleMsg"
            :document="inReactionTo"
            :full-document="inReactionTo"
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
            class="in-reaction-to-with-preview"
          />
      </div>
    </div>
  </template>
  
  <script>
    import BlipImage from '../../MediaLink/Image'
    import BlipAudio from '../../MediaLink/Audio'
    import BlipVideo from '../../MediaLink/Video'
    import BlipFile from '../../MediaLink/BlipFile'
    import BlipSticker from '../../MediaLink/Sticker'
    import { default as base } from '../../../mixins/baseComponent.js'

    export default {
      name: 'in-reaction-to-media-link',
      mixins: [base],
      components: {
        BlipImage,
        BlipAudio,
        BlipVideo,
        BlipFile,
        BlipSticker
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
  
    #inReactionTo {
      border-radius: $hard-round;
    }

    .in-reaction-to-audio {
      padding-top: 1rem;
      padding-bottom: 1rem;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
    }

    .in-reaction-to-with-preview {
      padding-left: 0.5rem;
    }
  </style>
  