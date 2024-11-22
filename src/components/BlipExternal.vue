<template> 
  <div class="blip-container">
    <blip-card
      :document="document"
      :full-document="fullDocument"
      :position="position"
      :date="date"
      :editable="editable"
      :on-media-selected="onMediaSelected"
      :on-save="save"
      :on-deleted="onDeleted"
      :on-metadata-edit="isMetadataReady"
      :deletable="deletable"
      :on-cancel="onCancel"
      :editing="editing"
      :async-fetch-media="asyncFetchMedia"
      :is-external-message="true"
      :external-message-text="externalMessageText"
      :translations="translations"
    />
  </div>
</template>

<script>
import { default as base } from '../mixins/baseComponent.js'

export default {
  name: 'blip-external',
  mixins: [base],
  props: {
    status: {
      type: String,
      default: ''
    },
    length: {
      type: Number
    },
    hideOptions: {
      type: Boolean,
      default: false
    },
    onSelected: {
      type: Function
    },
    onMediaSelected: {
      type: Function
    },
    onOpenLink: {
      type: Function
    },
    photo: {},
    onUnsupportedType: {
      type: Function
    },
    onLocationError: {
      type: Function
    },
    disableLink: {
      type: Boolean,
      default: false
    },
    translations: {
      type: Object,
      default: () => ({})
    },
    onAudioValidateUri: {
      type: Function
    },
    readonly: {
      type: Boolean,
      default: false
    },
    onFailedClickIcon: {
      type: Function
    },
    asyncFetchMedia: {
      type: Function
    },
    onAsyncFetchSession: {
      type: Function
    },
    transcription: {
      type: Object
    },
    replyCallback: {
      type: Function
    }
  }
}
</script>