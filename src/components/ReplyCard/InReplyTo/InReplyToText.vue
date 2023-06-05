<template>
  <bds-typo tag="p" variant="fs-16" bold="regular" margin="false" class="message-replied-text">{{ inReplyToText }}</bds-typo>
</template>
  
<script>
  export default {
    name: 'in-reply-to-text',
    mixins: [],
    props: {
      text: {
        type: String,
        default: ''
      }
    },
    computed: {
      inReplyToText() {
        return this.text
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
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    margin: 0;
    text-align: left;
  }
</style>
  