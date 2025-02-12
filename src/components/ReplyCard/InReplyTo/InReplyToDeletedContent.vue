<template>
  <div class="message-replied-deleted-container">
    <bds-grid direction="column"  gap="1">
      <bds-typo variant="fs-14" bold="bold" :margin="false" v-if="replyingToText" class="typo text-replying">{{replyingToText}}</bds-typo>
      <bds-typo
        v-if="getText().text"
        tag="p"
        variant="fs-16"
        :bold="'regular'"
        margin="false"
        italic="true"
        class="message-replied-deleted typo"
      >{{ getText().text }}</bds-typo>
    </bds-grid>
  </div>
</template>

<script>
  export default {
    name: 'in-reply-to-deleted-content',
    mixins: [],
    props: {
      inReplyTo: {
        type: Object,
        default: () => ({})
      },
      replyingToText: {
        type: String,
        default: null
      },
      deletedContentText: {
        type: String,
        default: 'Esta mensagem foi excluída.'
      }
    },
    methods: {
      getText() {
        return {text: this.deletedContentText}
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/variables.scss';

  .message-replied-deleted-container {
    padding: $bubble-padding;
    width: 240px;
    height: 56px;
    min-width: auto !important;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .message-replied-deleted {
    color: #636363 !important;
  }
</style>