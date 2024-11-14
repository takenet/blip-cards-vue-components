<template>
  <div class="blip-container blip-external">
    <h1>Soy yo!</h1>
    <blip-card class="blip-card"
      :document="this.document"
      :editing="editing"
      :hide-options="hideOptions"
      :on-save="onSave"
      :on-deleted="onDeleted"
      :on-cancel="onCancel"
      :editable="editable"
      :deletable="deletable"
      :length="length"
      :on-selected="onSelected"
      :on-media-selected="onMediaSelected"
      :on-open-link="onOpenLink"
      :on-unsupported-type="onUnsupportedType"
      :on-location-error="onLocationError"
      :translations="translations"
      :disable-link="disableLink"
      :on-audio-validate-uri="onAudioValidateUri"
      :readonly="readonly"
      :async-fetch-media="asyncFetchMedia"
      :on-async-fetch-session="onAsyncFetchSession"
      :transcription="transcription"
      :reply-callback="replyCallback"
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
  },
  computed: {
    Test() {
      return console.log(this.$props.fullDocument)
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables.scss';

.blip-external .bubble {
  padding: $bubble-padding;
  word-wrap: break-word;
  min-width: auto !important;
  text-align: left;
}
</style>
