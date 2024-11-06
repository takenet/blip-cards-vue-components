<template>
  <div class="in-reply-to-message-container" :class="{ 'in-reply-to-message-container-margin': !isReplyingOnInput }">
    <template>
      <span class="in-reply-to-message-bar" :class="{ 'own-message': isOwnMessage }"></span>   
      <in-reply-to-text
        :in-reply-to="inReplyTo"
        v-if="isTextPlain"
        :replying-to-text="replyingToText"
      />

      <in-reply-to-image
        v-if="isImageReply"
        :in-reply-to="inReplyTo"
        :replying-to-text="replyingToText"
        :async-fetch-media="asyncFetchMedia"
        :is-replying-on-input="isReplyingOnInput"
        :translations="translations"
      />

      <in-reply-to-video
        v-if="isVideoReply"
        :in-reply-to="inReplyTo"
        :replying-to-text="replyingToText"
        :async-fetch-media="asyncFetchMedia"
        :translations="translations"
      />

      <in-reply-to-document
        v-if="isDocumentReply"
        :in-reply-to="inReplyTo"
        :replying-to-text="replyingToText"
        :translations="translations"
      />

      <in-reply-to-audio
        v-if="isAudioReply"
        :in-reply-to="inReplyTo"
        :translations="translations"
        :document="document"
        :async-fetch-media="asyncFetchMedia"
        :replying-to-text="replyingToText"
      />

      <in-reply-to-location
        v-if="isLocationReply"
        :in-reply-to="inReplyTo"
        :translations="translations"
        :replying-to-text="replyingToText"
      />

      <in-reply-to-active-message
        v-if="isActiveMessageReply"
        :in-reply-to="inReplyTo"
        :translations="translations"
        :replying-to-text="replyingToText"
      />
      
      <in-reply-to-unsupported-content
        v-if="isUnsupportedContentReply"
        :in-reply-to="inReplyTo"
        :translations="translations"
        :replying-to-text="replyingToText"
      />
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
        >{{ translations.failedMessage }}
      </bds-typo>
    </div>
  </div>
</template>

<script>
import { MediaLinkTypesConstants } from '../../../utils/MediaLinkTypesConstants'

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
    },
    document: {
      type: Object
    },
    asyncFetchMedia: {
      type: Function
    },
    replyingToText: {
      type: String,
      default: null
    },
    isReplyingOnInput: {
      type: Boolean,
      default: false
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
      return this.inReplyTo.type === 'application/vnd.lime.media-link+json' && this.isMediaTypeDocument(this.inReplyTo.value.type)
    },
    isAudioReply() {
      return this.inReplyTo.value.type && this.inReplyTo.value.type.includes('audio')
    },
    isLocationReply() {
      return this.inReplyTo.type && this.inReplyTo.type.includes('location')
    },
    isActiveMessageReply() {
      return this.inReplyTo.type === 'application/json' && this.inReplyTo.value.type === 'template'
    },
    isUnsupportedContentReply() {
      return !this.isAcceptableTextType
    },
    isAcceptableInteractiveType() {
      return (
        this.inReplyTo.type === 'application/json' &&
        this.inReplyTo.value.interactive &&
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
        this.isLocationReply ||
        this.isActiveMessageReply
      )
    },
    hasFailedToLoad() {
      return Boolean(!this.inReplyTo || this.inReplyTo.type === undefined || this.inReplyTo.value === undefined)
    }
  },
  methods: {
    isMediaTypeDocument(type) {
      return Object
        .values(MediaLinkTypesConstants)
        .filter(mediaLinkType => type.includes(mediaLinkType))
        .length === 0
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
    display: block;
    overflow: hidden;
    background-color: $color-surface-3;
    border: 1px solid $color-content-ghost;
    border-radius: 0.5rem;
    padding-bottom: -10px;

    .skeleton {
      height: 2.5rem;
    }
  } 

  .container-reply-item {
    max-height: 110px;
    justify-content: space-between; 
  }

  .in-reply-to-message-container-margin {
    margin-bottom: 1rem;
  }

  .failed-message {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
  }
</style>
