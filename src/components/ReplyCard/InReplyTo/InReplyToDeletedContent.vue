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
    padding: 0.5rem;
  }

  .message-replied-deleted {
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