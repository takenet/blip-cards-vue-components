<template>
  <div class="in-reply-to-message-container">
    <span class="in-reply-to-message-bar" :class="{ 'own-message': isOwnMessage }"></span>
    <div class="in-reply-to-message">
      <in-reply-to-text 
        v-if="inReplyTo.type === 'text/plain'"
        :text="inReplyToValue"
      />

      <in-reply-to-text 
        v-else-if="inReplyTo.type === 'application/vnd.lime.select+json'"
        :text="menuValue"
      />
    </div>
  </div>
</template>
  
<script>
  export default {
    name: 'in-reply-to-base',
    mixins: [],
    props: {
      inReplyTo: {
        type: Object,
        default: {}
      },
      isOwnMessage: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      inReplyToValue() {
        return this.inReplyTo.value
      },
      menuValue() {
        return this.inReplyTo.value.text
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
    margin: 1rem 0;
  }

  .in-reply-to-message {
    padding: 0.5rem;
  }
</style>
  