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

      if (this.replyCallback) {
        this.replyCallback({
          data: {
            type: 'setIsReplying',
            value: true,
            inReplyTo,
            direction: this.document.direction
          }
        })
      } else {
        throw new Error('Reply callback is not defined')
      }
    },

    formatMessage(message) {
      const formats = {
        'text/plain': this.formatText,
        'application/vnd.lime.media-link+json': this.formatMedia,
        'application/vnd.lime.location+json': this.formatLocation,
        'application/json': this.formatTemplate
      }

      let type = message.type || message.content.type

      if (formats[type]) {
        return formats[type](message)
      }

      console.log('formatMessage', message)

      return {
        type,
        value: message.content
      }
    },

    formatTemplate(message) {
      let type = 'template'

      return {
        type: 'application/json',
        value: {...message.content, type}
      }
    },

    formatImage(message) {
      return {
        type: 'image',
        value: message.content.value || message.content
      }
    },
    formatText(message) {
      return {
        type: 'text/plain',
        value: message.content.value || message.content
      }
    },
    formatMedia(message) {
      if (message.content.type.includes('image') || (message.content.value && message.content.value.type.includes('image'))) {
        return this.formatImage(message)
      }

      return {
        type: message.type,
        value: message.content
      }
    },
    formatLocation (message) {
      return {
        type: 'application/vnd.lime.location+json',
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
