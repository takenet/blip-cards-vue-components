<template>
  <div class="in-reply-to-message-container">
    <span class="in-reply-to-message-bar" :class="{ 'own-message': isOwnMessage }"></span>
    <div class="in-reply-to-message">
      <in-reply-to-text 
        v-if="inReplyTo.type === 'text/plain'"
        :text="textValue"
      />

      <in-reply-to-text 
        v-else-if="inReplyTo.type === 'application/vnd.lime.select+json'"
        :text="menuTextValue"
      />

      <in-reply-to-text 
        v-else-if="
          inReplyTo.type === 'application/json' &&
          (
            isInteractiveTypeListWithTextHeader ||
            isInteractiveTypeButtonWithTextHeader ||
            isInteractiveTypeButtonWithoutTextHeader
          )
        "
        :text="isInteractiveTypeButtonWithoutTextHeader ? applicationJsonDescriptionTextValue : applicationJsonTitleTextValue"
        :description="isInteractiveTypeButtonWithoutTextHeader ? '' : applicationJsonDescriptionTextValue"
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
      textValue() {
        return this.inReplyTo.value
      },
      menuTextValue() {
        return this.inReplyTo.value.text
      },
      applicationJsonTitleTextValue() {
        return this.inReplyTo.value.interactive.header.text
      },
      applicationJsonDescriptionTextValue() {
        return this.inReplyTo.value.interactive.body.text
      },
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
  }

  .in-reply-to-message {
    padding: 0.5rem;
  }
</style>
  