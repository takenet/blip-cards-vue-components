<template>
  <div class="blip-container reply-card">
    <div :class="'bubble ' + position">
      <div class="reply-container">
        <div class="reply-header">
          <bds-icon name="undo" theme="outline" aria-label="Reply icon"></bds-icon>
          <bds-typo tag="p" variant="fs-14" bold="regular" italic="true">{{ translations.reply || 'Resposta' }}</bds-typo>
        </div>
        <in-reply-to-base :in-reply-to="inReplyTo" :is-own-message="isOwnMessage" />
        <replied-base :replied="replied" />
      </div>
    </div>
  </div>
</template>

<script>
import { default as base } from '../../mixins/baseComponent.js'

export default {
  name: 'reply-card',
  mixins: [base],
  props: {
    translations: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    isOwnMessage() {
      return this.fullDocument.direction === this.fullDocument.content.inReplyTo.direction
    },
    replied() {
      return this.document.replied
    },
    inReplyTo() {
      return this.document.inReplyTo
    }
  },
  created() {
    console.log(this.document)
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/variables.scss';

.reply-container {
  text-align: left;
  padding: 1rem;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
