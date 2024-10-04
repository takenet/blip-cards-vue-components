<template>
  <div class="in-reaction-to-message-container">
    <span class="in-reaction-to-message-bar" :class="{ 'own-message': isOwnMessage }"></span>
    <div v-if="!hasFailedToLoad" class="in-reaction-to-message">
      <in-reaction-to-text
        v-if="inReactionTo.type === 'text/plain' || inReactionTo.type === 'application/json'"
        :in-reaction-to="inReactionTo"
      />
      <in-reaction-to-media-link
        v-else-if="inReactionTo.type === 'application/vnd.lime.media-link+json'"
        :in-reaction-to="inReactionToValue"
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
        class="blip-card in-reaction-to-location"
        v-else-if="inReactionTo.type === 'application/vnd.lime.location+json'"
        :failed-to-send-msg="translations.failedToSend"
        :latitude-msg="translations.latitude"
        :longitude-msg="translations.longitude"
        :text-msg="translations.text"
        :status="status"
        :position="position"
        :document="inReactionToValue"
        :full-document="inReactionTo"
        :date="date"
        :on-save="saveCard"
        :editable="editable"
        :on-deleted="deleteCard"
        :on-metadata-edit="isMetadataReady"
        :deletable="deletable"
        :editing="isCardEditing"
        :on-cancel="cancel"
        :simplified="true"
      />
      <web-link
        class="blip-card in-reaction-to-padding"
        v-else-if="inReactionTo.type === 'application/vnd.lime.web-link+json'"
        :page-url-msg="translations.pageUrl"
        :title-msg="translations.title"
        :description-msg="translations.description"
        :failed-to-send-msg="translations.failedToSend"
        :status="status"
        :position="position"
        :document="inReactionToValue"
        :full-document="inReactionTo"
        :date="date"
        :on-save="saveCard"
        :editable="editable"
        :on-open-link="onOpenLink"
        :on-deleted="deleteCard"
        :on-metadata-edit="isMetadataReady"
        :deletable="deletable"
        :editing="isCardEditing"
        :on-cancel="cancel"
        :simplified="true"
      />
      <unsuported-content
        v-else
        class="blip-card in-reaction-to-padding"
        style="margin-bottom: 0px"
        :failed-to-send-msg="translations.failedToSend"
        :unsupported-content-msg="translations.unsupportedContent"
        :position="position"
        :document="document"
        :on-save="saveCard"
        :editable="editable"
        :on-deleted="deleteCard"
        :deletable="deletable"
        :editing="isCardEditing"
        :on-cancel="cancel"
        :simplified="true"
      />
    </div>
    <div class="failed-message in-reaction-to-padding" v-if="hasFailedToLoad">
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
  export default {
    name: 'in-reaction-to-base',
    mixins: [],
    props: {
      inReactionTo: {
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
      updatedPhotoMargin: {
        type: Function
      },
      onOpenLink: {
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
        return this.inReactionTo.value.interactive.type === 'button' &&
          this.inReactionTo.value.interactive.header &&
          this.inReactionTo.value.interactive.header.type === 'text'
      },
      isInteractiveTypeButtonWithoutTextHeader() {
        return this.inReactionTo.value.interactive.type === 'button' &&
          !this.inReactionTo.value.interactive.header &&
          Boolean(this.inReactionTo.value.interactive.body.text)
      },
      isInteractiveTypeListWithTextHeader() {
        return this.inReactionTo.value.interactive.type === 'list' &&
          this.inReactionTo.value.interactive.header.type === 'text'
      },
      isTextPlain() {
        return this.inReactionTo.type === 'text/plain'
      },
      isSelectType() {
        return this.inReactionTo.type === 'application/vnd.lime.select+json'
      },
      isAcceptableInteractiveType() {
        return (
          this.inReactionTo.type === 'application/json' &&
          (this.isInteractiveTypeListWithTextHeader ||
            this.isInteractiveTypeButtonWithTextHeader ||
            this.isInteractiveTypeButtonWithoutTextHeader)
        )
      },
      isAcceptableTextType() {
        return this.isTextPlain || this.isSelectType || this.isAcceptableInteractiveType
      },
      hasFailedToLoad() {
        return Boolean(this.inReactionTo.type === undefined || this.inReactionTo.value === undefined)
      },
      inReactionToValue() {
        return this.inReactionTo.value
      }
    }
  }
</script>
  
<style lang="scss" scoped>
  @import '../../../styles/variables.scss';

  .in-reaction-to-message-bar {
    flex: none;
    width: 4px;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    background-color: $color-primary;

    &.own-message {
      background-color: $color-content-ghost;
    }
  }

  .in-reaction-to-message-container {
    display: flex;
    overflow: hidden;
    background-color: $color-surface-3;
    border: 1px solid $color-content-ghost;
    border-radius: 0.5rem;

    .skeleton {
      height: 2.5rem;
    }
  }

  .failed-message {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
  }

  .in-reaction-to-location {
    padding-left: 0.5rem;
  }

  .in-reaction-to-padding {
    padding-top: 1rem;
    padding-bottom: 1rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
</style>