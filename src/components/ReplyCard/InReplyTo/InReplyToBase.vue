<template>
  <div 
  :class="{ 'in-reply-to-message-container-margin': !isReplyingOnInput, 'cursor-pointer': !!this.document,
            'in-reply-to-message-deleted-container': isDeletedContentReply, 'in-reply-to-message-container': !isDeletedContentReply
     }"
    @click="goToMessageReplyed"
  >
    <template>
      <span class="in-reply-to-message-bar" :class="{ 'own-message': isOwnMessage }"></span>
      <in-reply-to-deleted-content
        :in-reply-to="inReplyTo"
        v-if="isDeletedContentReply"
        :replying-to-text="replyingToText"
        :deleted-content-text = "translations.messageDeleted"
      />   
      <in-reply-to-text
        :in-reply-to="inReplyTo"
        v-else-if="isTextPlain"
        :replying-to-text="replyingToText"
      />

      <in-reply-to-image
        v-else-if="isImageReply"
        :in-reply-to="inReplyTo"
        :replying-to-text="replyingToText"
        :async-fetch-media="asyncFetchMedia"
        :is-replying-on-input="isReplyingOnInput"
        :translations="translations"
      />

      <in-reply-to-video
        v-else-if="isVideoReply"
        :in-reply-to="inReplyTo"
        :replying-to-text="replyingToText"
        :async-fetch-media="asyncFetchMedia"
        :translations="translations"
      />

      <in-reply-to-document
        v-else-if="isDocumentReply"
        :in-reply-to="inReplyTo"
        :replying-to-text="replyingToText"
        :translations="translations"
      />

      <in-reply-to-audio
        v-else-if="isAudioReply"
        :in-reply-to="inReplyTo"
        :translations="translations"
        :document="document"
        :async-fetch-media="asyncFetchMedia"
        :replying-to-text="replyingToText"
      />

      <in-reply-to-location
        v-else-if="isLocationReply"
        :in-reply-to="inReplyTo"
        :translations="translations"
        :replying-to-text="replyingToText"
      />
      
      <in-reply-to-sticker
        v-else-if="isStickerReply"
        :in-reply-to="inReplyTo"
        :replying-to-text="replyingToText"
        :async-fetch-media="asyncFetchMedia"
        :is-replying-on-input="isReplyingOnInput"
        :translations="translations"
      />

      <in-reply-to-active-message
        v-else-if="isActiveMessageReply"
        :in-reply-to="inReplyTo"
        :translations="translations"
        :replying-to-text="replyingToText"
      />
      
      <in-reply-to-unsupported-content
        v-else
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
    },
    scrollToMessageById: {
      type: Function
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
    isDeletedContentReply() {
      return this.inReplyTo.type === 'application/vnd.lime.deleted-content+json'
    },
    isTextPlain() {
      return this.inReplyTo.type === 'text/plain'
    },
    isSelectType() {
      return this.inReplyTo.type === 'application/vnd.lime.select+json'
    },
    isImageReply() {
      return this.inReplyTo.value && this.inReplyTo.value.type && this.inReplyTo.value.type.includes('image')
    },
    isVideoReply() {
      return this.inReplyTo.value && this.inReplyTo.value.type && this.inReplyTo.value.type.includes('video')
    },
    isDocumentReply() {
      return this.inReplyTo.type === 'application/vnd.lime.media-link+json' && this.isMediaTypeDocument(this.inReplyTo.value.type)
    },
    isAudioReply() {
      return this.inReplyTo.value.type && this.inReplyTo.value.type.includes('audio')
    },
    isStickerReply() {
      return this.inReplyTo.value && this.inReplyTo.value.type && this.inReplyTo.value.type.includes('sticker')
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
    },
    goToMessageReplyed() {
      if (this.document) {
        this.scrollToMessageById(this.document.inReplyTo.id)
      }
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

  .skeleton {
    height: 2.5rem;
  }
} 

.in-reply-to-message-deleted-container {
  border-radius: 13px 13px 13px 2px;
  border: 1px solid #a7a3a3 !important;
  background-color: $color-surface-3 !important;
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

.cursor-pointer {
  cursor: pointer;
}
</style>
