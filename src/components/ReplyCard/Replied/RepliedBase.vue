<template>
  <div>
    <replied-with-text 
      v-if="replied.type === MessageTypesConstants.TEXT_MESSAGE"
      :text="repliedValue"
    />
    <replied-with-media-link
      v-if="replied.type === MessageTypesConstants.MEDIALINK_MESSAGE"
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
      :on-save="saveCard"
      :editable="editable"
      :on-deleted="deleteCard"
      :on-metadata-edit="isMetadataReady"
      :deletable="deletable"
      :editing="isCardEditing"
      :on-cancel="cancel"
      :on-audio-validate-uri="onAudioValidateUri"
    />
    <location
      v-if="replied.type === MessageTypesConstants.LOCATION"
      class="blip-card"   
      :document="repliedValue"
    />
  </div>
</template>
  
<script>
import { MessageTypesConstants } from '../../../utils/MessageTypesConstants.js'

export default {
  name: 'replied-base',
  mixins: [],
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
    MessageTypesConstants() {
      return MessageTypesConstants
    },
    repliedValue() {
      return this.replied.value
    }
  }
}
</script>
  