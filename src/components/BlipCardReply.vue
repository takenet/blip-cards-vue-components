<template>
  <bds-button-icon
    icon="redo"
    variant="ghost"
    size="short"
    @click="replyMessage"
    v-if="isButtonVisible"
    class="blip-card-reply-button"
  />
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
      type: Function,
      required: true
    }
  },
  computed: {
    isButtonVisible() {
      return this.replyCallback !== undefined
    }
  },
  methods: {
    replyMessage() {
      if (this.replyCallback) {
        this.replyCallback(this.document)
      } else {
        throw new Error('Reply callback is not defined')
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
