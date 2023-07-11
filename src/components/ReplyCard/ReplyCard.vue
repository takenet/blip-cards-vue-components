<template>
  <div class="blip-container reply-card">
    <div :class="'bubble ' + position">
      <div class="reply-container">
        <in-reply-to-base :in-reply-to="inReplyTo" :is-own-message="isOwnMessage" :failed-message="translations.failedToLoad" />
        <replied-base v-if="replied" 
          :replied="replied" 
          :on-media-selected="onMediaSelected" 
          :translations="translations"
          :async-fetch-media="asyncFetchMedia"  />
      </div>
    </div>
    <blip-card-date
      :status="status"
      :position="position"
      :date="date"
      :failed-to-send-msg="failedToSendMsg" />
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
      },
      failedToSendMsg: {
        type: String,
        default: 'Falha ao enviar a mensagem'
      },
      asyncFetchMedia: {
        type: Function
      },
      status: {
        type: String,
        default: ''
      },
      onMediaSelected: {
        type: Function
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
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/variables.scss';

  .reply-container {
    text-align: left;
    padding: 1rem;
  }
</style>
