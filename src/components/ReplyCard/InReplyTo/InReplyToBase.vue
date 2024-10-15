<template>
  <div class="in-reply-to-message-container">
    <template>
      <span class="in-reply-to-message-bar" :class="{ 'own-message': isOwnMessage }"></span>
      <div>
        <in-reply-to-text
          :in-reply-to="inReplyTo"
          v-if="isTextPlain"
        />

        <in-reply-to-image
          :in-reply-to="inReplyTo"
          v-if="isImageReply"
        />

        <in-reply-to-video
          :in-reply-to="inReplyTo"
          v-if="isVideoReply"
        />

        <in-reply-to-document
          :in-reply-to="inReplyTo"
          v-if="isDocumentReply"
        />

        <in-reply-to-audio
          v-if="isAudioReply"
          :in-reply-to="inReplyTo"
          :translations="translations"
        />

        <in-reply-to-location
          v-if="isLocationReply"
          :in-reply-to="inReplyTo"
          :translations="translations"
        />
        
        <in-reply-to-unsupported-content
          :in-reply-to="inReplyTo"
          :translations="translations"
          v-if="isUnsupportedContentReply"
        />
      </div>
    </template>
    <div class="failed-message" v-if="hasFailedToLoad">
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
    name: 'in-reply-to-base',
    props: {
      inReplyTo: {
        type: Object,
        default: () => ({})
      },
      isOwnMessage: {
        type: Boolean,
        default: false
      },
      translations: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      isInteractiveTypeButtonWithTextHeader() {
        return this.inReplyTo.value.interactive.type === 'button' &&
          this.inReplyTo.value.interactive.header &&
          this.inReplyTo.value.interactive.header.type === 'text'
      },
      isInteractiveTypeButtonWithoutTextHeader() {
        return this.inReplyTo.value.interactive.type === 'button' &&
          !this.inReplyTo.value.interactive.header &&
          Boolean(this.inReplyTo.value.interactive.body.text)
      },
      isInteractiveTypeListWithTextHeader() {
        return this.inReplyTo.value.interactive.type === 'list' &&
          this.inReplyTo.value.interactive.header.type === 'text'
      },
      isTextPlain() {
        return this.inReplyTo.type === 'text/plain'
      },
      isSelectType() {
        return this.inReplyTo.type === 'application/vnd.lime.select+json'
      },
      isImageReply() {
        return this.inReplyTo.value.type && this.inReplyTo.value.type.includes('image')
      },
      isVideoReply() {
        return this.inReplyTo.value.type && this.inReplyTo.value.type.includes('video')
      },
      isDocumentReply() {
        return this.inReplyTo.value.type === 'application/pdf'
      },
      isAudioReply() {
        return this.inReplyTo.value.type && this.inReplyTo.value.type.includes('audio')
      },
      isLocationReply() {
        return this.inReplyTo.type.includes('location')
      },
      isUnsupportedContentReply() {
        return !this.isAcceptableTextType
      },
      isAcceptableInteractiveType() {
        return (
          this.inReplyTo.type === 'application/json' &&
          (this.isInteractiveTypeListWithTextHeader ||
            this.isInteractiveTypeButtonWithTextHeader ||
            this.isInteractiveTypeButtonWithoutTextHeader)
        )
      },
      isAcceptableTextType() {
        return (
          this.isTextPlain ||
          this.isSelectType ||
          this.isAcceptableInteractiveType ||
          this.isImageReply ||
          this.isVideoReply ||
          this.isDocumentReply ||
          this.isAudioReply ||
          this.isLocationReply
        )
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/variables.scss';

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
    padding-bottom: -10px;

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
