<template>
  <div :class="'media-link ' + replied.type.split('/')[0]">
    <div :class="'replied ' + position" id="replied">
      <blip-image
        :image-uri-msg="titleMsg"
        :title-msg="titleMsg"
        :text-msg="textMsg"
        :aspect-ratio-msg="aspectRatioMsg"
        :supported-formats-msg="supportedFormatsMsg"
        :document="replied"
        :full-document="replied"
        :date="date"
        v-if="replied.type.indexOf('image') != -1"
        :editable="editable"
        :on-media-selected="onMediaSelected"
        :on-save="save"
        :on-deleted="onDeleted"
        :on-metadata-edit="isMetadataReady"
        :deletable="deletable"
        :on-cancel="onCancel"
        :editing="editing"
        :async-fetch-media="asyncFetchMedia"
      />
      <blip-audio
        :file-url-msg="fileUrlMsg"
        :document="replied"
        :full-document="replied"
        :date="date"
        v-else-if="replied.type.indexOf('audio') != -1"
        :editable="editable"
        :on-save="save"
        :on-deleted="onDeleted"
        :on-metadata-edit="isMetadataReady"
        :deletable="deletable"
        :on-cancel="onCancel"
        :editing="editing"
        :on-audio-validate-uri="onAudioValidateUri"
        :async-fetch-media="asyncFetchMedia"
      />
      <blip-video
        :video-uri-msg="videoUriMsg"
        :document="replied"
        :full-document="replied"
        :date="date"
        @updated="emitUpdate"
        v-else-if="replied.type.indexOf('video') != -1"
        :editable="editable"
        :on-save="save"
        :on-deleted="onDeleted"
        :on-metadata-edit="isMetadataReady"
        :deletable="deletable"
        :on-cancel="onCancel"
        :editing="editing"
        :async-fetch-media="asyncFetchMedia"
      />
      <blip-file
        :title-msg="titleMsg"
        :document="replied"
        :full-document="replied"
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
import { isFailedMessage } from '../../../utils/misc'

export default {
  name: 'replied-with-media-link',
  props: {
    replied: {
      type: Object,
      default: {}
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
  data: function() {
    return {
      isFailedMessage
    }
  },
  mixins: [base],
  components: {
    BlipImage,
    BlipAudio,
    BlipVideo,
    BlipFile
  },
  methods: {
    emitUpdate() {
      this.$emit('updated')
    }
  }
}
</script>
