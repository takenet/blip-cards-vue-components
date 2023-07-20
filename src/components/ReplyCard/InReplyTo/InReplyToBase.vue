<template>
  <div v-if="isLoadingMessage || isAcceptableTextType || hasFailedToLoad" class="in-reply-to-message-container">
    <div v-if="isLoadingMessage" class="skeleton"></div>
    <template v-else-if="isAcceptableTextType">
      <span class="in-reply-to-message-bar" :class="{ 'own-message': isOwnMessage }"></span>
      <div class="in-reply-to-message">
        <in-reply-to-text
          :in-reply-to="inReplyTo"
        />
      </div>
    </template>
    <div class="failed-message" v-else-if="hasFailedToLoad">
      <bds-icon name="warning" theme="outline" aria-label="Warning"></bds-icon>
      <bds-typo
        tag="p"
        variant="fs-16"
        bold="regular"
        margin="false"
        italic="true"
        class="typo"
        >{{ failedMessage }}
      </bds-typo>
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
        default: () => ({})
      },
      isOwnMessage: {
        type: Boolean,
        default: false
      },
      failedMessage: {
        type: String,
        default: 'Falha ao carregar mensagem'
      }
    },
    computed: {
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
      },
      isLoadingMessage() {
        return this.inReplyTo.type === undefined && this.inReplyTo.failedToLoad === undefined
      },
      isTextPlain() {
        return this.inReplyTo.type === 'text/plain'
      },
      isSelectType() {
        return this.inReplyTo.type === 'application/vnd.lime.select+json'
      },
      isAcceptableInteractiveType() {
        return (
          this.inReplyTo.type === 'application/json' &&
          (this.isInteractiveTypeListWithTextHeader ||
            this.isInteractiveTypeButtonWithTextHeader ||
            this.isInteractiveTypeButtonWithoutTextHeader)
        )
      },
      isAcceptableTextType() {
        return this.isTextPlain || this.isSelectType || this.isAcceptableInteractiveType
      },
      hasFailedToLoad() {
        return Boolean(this.inReplyTo.failedToLoad)
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

    .skeleton {
      height: 2.5rem;
    }
  }

  .in-reply-to-message {
    padding: 0.5rem;
  }

.failed-message {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
}
</style>
