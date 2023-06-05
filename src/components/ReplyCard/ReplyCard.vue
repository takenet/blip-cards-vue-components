<template>
  <div class="blip-container reply-card">
    <div :class="'bubble ' + position">
      <div class="reply-container">
        <div class="reply-header">
          <bds-icon name="undo" theme="outline" aria-label="Reply icon"></bds-icon>
          <bds-typo tag="p" variant="fs-14" bold="regular" italic="true">Resposta</bds-typo>
        </div>

        <div class="message-replied-container">
          <span class="message-replied-bar" :class="{ 'own-message': isOwnMessage }"></span>
          <div class="message-replied">
            <bds-typo tag="p" variant="fs-16" bold="regular" margin="false" class="message-replied-text">{{ messageRepliedText }}</bds-typo>
          </div>
        </div>

        <div>
          <bds-typo tag="span" variant="fs-16" margin="false">{{ reply }}</bds-typo>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { default as base } from '../../mixins/baseComponent.js'

export default {
  name: 'reply-card',
  mixins: [base],
  computed: {
    isOwnMessage() {
      return this.fullDocument.direction === this.fullDocument.content.inReplyTo.direction
    },
    reply() {
      return this.document.replied.value
    },
    messageRepliedText() {
      return this.document.inReplyTo.value
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

.message-replied-bar {
  flex: none;
  width: 4px;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  background-color: $color-primary;


  &.own-message {
    background-color: $color-content-ghost;
  }
}

.message-replied-container {
  display: flex;
  overflow: hidden;
  background-color: #E0E0E0;
  border: 1px solid #949494;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.message-replied {
  padding: 0.5rem;
}

.message-replied-text {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  margin: 0;
  text-align: left;
}
</style>
