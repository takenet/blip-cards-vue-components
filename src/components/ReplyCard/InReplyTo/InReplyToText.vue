<template>
  <div>
    <bds-typo
      tag="p"
      variant="fs-16"
      :bold="hasDescription ? 'bold' : 'regular'"
      margin="false"
      class="message-replied-text"
      :class="{ 'single': !hasDescription, 'title': hasDescription }">{{ inReplyToText }}</bds-typo>
    <bds-typo 
      v-if="hasDescription"
      tag="p"
      variant="fs-16"
      bold="regular"
      margin="false"
      class="message-replied-text description">{{ inReplyToDescription }}</bds-typo>
  </div>
</template>
  
<script>
  export default {
    name: 'in-reply-to-text',
    mixins: [],
    props: {
      text: {
        type: String,
        default: ''
      },
      description: {
        type: String,
        default: ''
      }
    },
    computed: {
      inReplyToText() {
        return this.text
      },
      inReplyToDescription() {
        return this.description
      },
      hasDescription() {
        return Boolean(this.description)
      }
    }
  }
</script>
  
<style lang="scss" scoped>
  @import '../../../styles/variables.scss';

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
  