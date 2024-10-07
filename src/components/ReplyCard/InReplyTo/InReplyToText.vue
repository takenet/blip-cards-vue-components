<template>
  <div class="message-replied-container">
    <bds-typo
      tag="p"
      variant="fs-16"
      :bold="hasDescription ? 'bold' : 'regular'"
      margin="false"
      class="message-replied-text typo"
      :class="{ 'single': !hasDescription, 'title': hasDescription }" v-html="sanitize(inReplyToText)"></bds-typo>
    <bds-typo
      v-if="hasDescription"
      tag="p"
      variant="fs-16"
      bold="regular"
      margin="false"
      class="message-replied-text description typo-light" v-html="sanitize(inReplyToDescription)"></bds-typo>
  </div>
</template>

<script>
  export default {
    name: 'in-reply-to-text',
    mixins: [],
    props: {
      inReplyTo: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      isApplicationJsonType() {
        return this.inReplyTo.type === 'application/json'
      },
      interactiveHeader() {
        return this.inReplyTo.value.interactive.header
      },
      interactiveHeaderText() {
        return this.inReplyTo.value.interactive.header.text
      },
      interactiveBodyText() {
        return this.inReplyTo.value.interactive.body.text
      },
      inReplyToText() {
        switch (this.inReplyTo.type) {
          case 'text/plain':
            return this.inReplyTo.value
          case 'application/vnd.lime.select+json':
            return this.inReplyTo.value.text
          case 'application/json':
            return this.interactiveHeader ? this.interactiveHeaderText : this.interactiveBodyText
          default:
            return ''
        }
      },
      inReplyToDescription() {
        return this.isApplicationJsonType && this.interactiveHeader ? this.interactiveBodyText : ''
      },
      hasDescription() {
        return Boolean(this.inReplyToDescription)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/variables.scss';

  .message-replied-container {
    padding: 0.5rem;
  }

  .message-replied-text {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    margin: 0;
    text-align: left;

    &.single {
      -webkit-line-clamp: 3;
    }

    &.title {
      -webkit-line-clamp: 1;
    }

    &.description {
      -webkit-line-clamp: 2;
    }
  }
</style>
