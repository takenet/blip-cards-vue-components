<template>
  <div>
    <replied-with-text 
      v-if="replied.type === 'text/plain'"
      :text="repliedValue"
    />
    <replied-with-media-link
      v-if="replied.type === 'application/vnd.lime.media-link+json'"
      :replied="repliedValue"
      :on-media-selected="onMediaSelected"
      :video-uri-msg="translations.videoUri"
      :async-fetch-media="asyncFetchMedia"
      @updated="updatedPhotoMargin"
      :failed-to-send-msg="translations.failedToSend"
      :aspect-ratio-msg="translations.aspectRatio"
      :supported-formats-msg="translations.supportedFormats"
      :file-url-msg="translations.fileUrl"
      :title-msg="translations.title"
      :image-uri-msg="translations.imageUri"
      :text-msg="translations.text"
      :position="position"
      :on-save="onSave"
      :editable="editable"
      :on-deleted="onDeleted"
      :on-metadata-edit="isMetadataReady"
      :deletable="deletable"
      :editing="editing"
      :on-cancel="cancel"
      :on-audio-validate-uri="onAudioValidateUri"
    />

  </div>
</template>
  
<script>
  import { default as base } from '../../../mixins/baseComponent.js'
  
  export default {
    name: 'replied-base',
    mixins: [base],
    props: {
      replied: {
        type: Object,
        default: {}
      },
      onMediaSelected: {
        type: Function
      },
      asyncFetchMedia: {
        type: Function
      },
      updatedPhotoMargin: {
        type: Function
      },
      onAudioValidateUri: {
        type: Function
      },
      translations: {
        type: Object,
        default: () => ({})
      },
      position: {
        type: String,
        default: 'left'
      }
    },
    computed: {
      repliedValue() {
        return this.replied.value
      }
    }
  }
</script>
  