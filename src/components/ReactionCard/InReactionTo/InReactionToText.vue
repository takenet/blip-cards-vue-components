<template>
  <div class="reaction-text-container">
    <bds-typo
      tag="p"
      variant="fs-16"
      :bold="hasDescription ? 'bold' : 'regular'"
      margin="false"
      class="message-reacted-text typo"
      :class="{ 'single': !hasDescription, 'title': hasDescription }" v-html="sanitize(inReactionToText)"></bds-typo>
    <bds-typo
      v-if="hasDescription"
      tag="p"
      variant="fs-16"
      bold="regular"
      margin="false"
      class="message-reacted-text description typo-light" v-html="sanitize(inReactionToDescription)"></bds-typo>
  </div>
</template>
  
  <script>
    export default {
      name: 'in-reaction-to-text',
      mixins: [],
      props: {
        inReactionTo: {
          type: Object,
          default: () => ({})
        }
      },
      computed: {
        isApplicationJsonType() {
          return this.inReactionTo.type === 'application/json'
        },
        interactiveHeader() {
          return this.inReactionTo.value.interactive.header
        },
        interactiveHeaderText() {
          return this.inReactionTo.value.interactive.header.text
        },
        interactiveBodyText() {
          return this.inReactionTo.value.interactive.body.text
        },
        inReactionToText() {
          switch (this.inReactionTo.type) {
            case 'text/plain':
              return this.inReactionTo.value
            case 'application/vnd.lime.select+json':
              return this.inReactionTo.value.text
            case 'application/json':
              return this.interactiveHeader ? this.interactiveHeaderText : this.interactiveBodyText
            default:
              return ''
          }
        },
        inReactionToDescription() {
          return this.isApplicationJsonType && this.interactiveHeader ? this.interactiveBodyText : ''
        },
        hasDescription() {
          return Boolean(this.inReactionToDescription)
        }
      }
    }
  </script>
  
  <style lang="scss" scoped>
    @import '../../../styles/variables.scss';

    .reaction-text-container {
      padding: 0.5rem;
    }
  
    .message-reacted-text {
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
  