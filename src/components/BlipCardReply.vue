<template>
  <bds-tooltip
    position="top-center"
    :tooltip-text="replyTooltipText"
  >
    <bds-button-icon
      icon="reply"
      variant="ghost"
      size="short"
      @click="replyMessage"
      v-if="isButtonVisible"
      class="blip-card-reply-button"
    />
  </bds-tooltip>
</template>

<script>
import { MessageTypesConstants } from '../utils/MessageTypesConstants'

export default {
  name: 'blip-card-reply',
  props: {
    document: {
      type: Object,
      required: true
    },
    replyCallback: {
      type: Function | undefined,
      required: true
    },
    replyTooltipText: {
      type: String,
      default: 'Responder'
    }
  },
  computed: {
    isButtonVisible() {
      return this.replyCallback !== undefined
    }
  },
  methods: {
    replyMessage() {
      let inReplyTo = this.formatMessage(this.document)

      inReplyTo.id = this.document.id
      inReplyTo.metadata = this.document.metadata
      inReplyTo.direction = this.document.direction

      if (this.replyCallback) {
        this.replyCallback({
          data: {
            show: true,
            inReplyTo
          }
        })
      } else {
        throw new Error('Reply callback is not defined')
      }
    },
    formatMessage(message) {
      const messageType = message.type || message.content.type
      if (MessageTypesConstants.REPLY_MESSAGE === messageType) {
        return this.formatMessage(message.content.replied)
      }

      const formats = {
        [MessageTypesConstants.TEXT_MESSAGE]: this.formatText,
        [MessageTypesConstants.MEDIALINK_MESSAGE]: this.formatMedia,
        [MessageTypesConstants.LOCATION]: this.formatLocation,
        [MessageTypesConstants.APPLICATION_JSON]: this.formatTemplate
      }
      const format = formats[messageType]

      if (format) {
        return format(message)
      }

      return {
        type: messageType,
        value: message.content
      }
    },
    formatTemplate(message) {
      let type = 'template'

      return {
        type: MessageTypesConstants.APPLICATION_JSON,
        value: {...message.content, type}
      }
    },
    formatImage(message) {
      const content = message.value || message.content
      return {
        type: 'image',
        value: content.value || content
      }
    },
    formatText(message) {
      let value
      if (message.content && message.content.value) {
        value = message.content.value
      } else if (message.content) {
        value = message.content
      } else if (message.value) {
        value = message.value
      }

      return {
        type: MessageTypesConstants.TEXT_MESSAGE,
        value
      }
    },
    formatMedia(message) {
      const content = message.value || message.content
      if (content.type.includes('image') || (content.value && content.value.type.includes('image'))) {
        return this.formatImage(message)
      }

      return {
        type: message.type,
        value: content
      }
    },
    formatLocation(message) {
      return {
        type: MessageTypesConstants.LOCATION,
        value: message.content
      }
    }
  }
}
</script>

<style scoped lang="scss">
.blip-card {
  .blip-card-reply-button {
    display: none;
    margin-bottom: 5px;
  }

  &:hover {
    .blip-card-reply-button {
      display: block;
    }
  }
}
</style>
