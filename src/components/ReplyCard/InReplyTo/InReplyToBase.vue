<template>
  <div
    class="in-reply-to-message-container"
  >
    <template v-if="!hasFailedToLoad">
      <span
        class="in-reply-to-message-bar"
        :class="{ 'own-message': isOwnMessage }"
      ></span>
      <in-reply-to-text
        id="text"
        v-if="isTextPlain"
        :in-reply-to="inReplyTo"
        class="in-reply-to-message-text"
      />
      <in-reply-to-media-link
        class="in-reply-to-message-others"
        id="media-link"
        v-else-if="isMediaLink"
        :in-reply-to="inReplyTo.value"
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
      <web-link
        class="blip-card in-reply-to-padding"
        v-else-if="inReplyTo.type === 'application/vnd.lime.web-link+json'"
        :page-url-msg="translations.pageUrl"
        :title-msg="translations.title"
        :description-msg="translations.description"
        :failed-to-send-msg="translations.failedToSend"
        :position="position"
        :document="inReplyTovalue"
        :full-document="inReplyTo.value"
        :date="date"
        :on-save="onSave"
        :editable="editable"
        :on-open-link="onOpenLink"
        :on-deleted="onDeleted"
        :on-metadata-edit="isMetadataReady"
        :deletable="deletable"
        :editing="editing"
        :on-cancel="cancel"
        :simplified="true"
      />
      
      <location
        class="blip-card in-reply-to-message-others"
        v-else-if="inReplyTo.type === 'application/vnd.lime.location+json'"
        :failed-to-send-msg="translations.failedToSend"
        :latitude-msg="translations.latitude"
        :longitude-msg="translations.longitude"
        :text-msg="translations.text"
        :position="position"
        :document="inReplyTovalue"
        :full-document="inReplyTo.Value"
        :date="date"
        :on-save="onSave"
        :editable="editable"
        :on-deleted="onDeleted"
        :on-metadata-edit="isMetadataReady"
        :deletable="deletable"
        :editing="editing"
        :on-cancel="cancel"
        :simplified="true"
      />
    </template>
    <div class="failed-message" v-else-if="hasFailedToLoad">
      <bds-icon name="warning" theme="outline" aria-label="Warning"></bds-icon>
      <bds-typo
        tag="p"
        variant="fs-16"
        bold="regular"
        margin="false"
        italic="true"
        class="typo"
        >{{ failedMessage }}
      </bds-typo>
    </div>
  </div>
</template>

<script>
import { default as base } from '../../../mixins/baseComponent.js'

export default {
  name: 'in-reply-to-base',
  mixins: [base],
  props: {
    inReplyTo: {
      type: Object,
      default: () => ({})
    },
    isOwnMessage: {
      type: Boolean,
      default: false
    },
    failedMessage: {
      type: String,
      default: 'Falha ao carregar mensagem'
    },
    onMediaSelected: {
      type: Function
    },
    asyncFetchMedia: {
      type: Function
    },
    onOpenLink: {
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
    isInteractiveTypeButtonWithTextHeader() {
      return (
        this.inReplyTo.value.interactive.type === 'button' &&
        this.inReplyTo.value.interactive.header &&
        this.inReplyTo.value.interactive.header.type === 'text'
      )
    },
    isInteractiveTypeButtonWithoutTextHeader() {
      return (
        this.inReplyTo.value.interactive.type === 'button' &&
        !this.inReplyTo.value.interactive.header &&
        Boolean(this.inReplyTo.value.interactive.body.text)
      )
    },
    isInteractiveTypeListWithTextHeader() {
      return (
        this.inReplyTo.value.interactive.type === 'list' &&
        this.inReplyTo.value.interactive.header.type === 'text'
      )
    },
    isTextPlain() {
      console.log('inReplyTovalue')
      console.log(this.inReplyTo.value)
      console.log(this.inReplyTo)
      console.log(this.inReplyTo.value.value)
      return this.inReplyTo.type === 'text/plain'
    },
    inReplyTovalue() {
      console.log('inReplyTovalue')
      console.log(this.inReplyTo.value)
      console.log(this.inReplyTo)
      console.log(this.inReplyTo.value.value)
      return this.inReplyTo.value
    },
    isMediaLink() {
      console.log('isMediaLink ', this.inReplyTo.type)
      return this.inReplyTo.type === 'application/vnd.lime.media-link+json'
    },
    isSelectType() {
      return this.inReplyTo.type === 'application/vnd.lime.select+json'
    },
    isAcceptableInteractiveType() {
      return (
        this.inReplyTo.type === 'application/json' &&
        (this.isInteractiveTypeListWithTextHeader ||
          this.isInteractiveTypeButtonWithTextHeader ||
          this.isInteractiveTypeButtonWithoutTextHeader)
      )
    },

    hasFailedToLoad() {
      return Boolean(
        this.inReplyTo.type === undefined || this.inReplyTo.value === undefined
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/variables.scss';

.in-reply-to-message-text {
  padding: 0.5rem;
}

.in-reply-to-message-others {
  padding-left: 0.5rem;
}
.in-reply-to-padding {
    padding-top: 1rem;
    padding-bottom: 1rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

.in-reply-to-message-bar {
  flex: none;
  width: 4px;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  background-color: $color-primary;

  &.own-message {
    background-color: $color-content-ghost;
  }
}

.in-reply-to-message-container {
  display: flex;
  overflow: hidden;
  background-color: $color-surface-3;
  border: 1px solid $color-content-ghost;
  border-radius: 0.5rem;
  margin-bottom: 1rem;

  .skeleton {
    height: 2.5rem;
  }
}

.failed-message {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
}
</style>
