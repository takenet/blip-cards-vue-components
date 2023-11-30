<template>
  <div v-if="isAcceptableTextType || hasFailedToLoad" class="in-reaction-to-message-container">
    <template v-if="isAcceptableTextType">
      <span class="in-reaction-to-message-bar" :class="{ 'own-message': isOwnMessage }"></span>
      <div class="in-reaction-to-message">
        <in-reaction-to-text
          :in-reaction-to="inReactionTo"
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
    name: 'in-reaction-to-base',
    mixins: [],
    props: {
      inReactionTo: {
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
        return this.inReactionTo.value.interactive.type === 'button' &&
          this.inReactionTo.value.interactive.header &&
          this.inReactionTo.value.interactive.header.type === 'text'
      },
      isInteractiveTypeButtonWithoutTextHeader() {
        return this.inReactionTo.value.interactive.type === 'button' &&
          !this.inReactionTo.value.interactive.header &&
          Boolean(this.inReactionTo.value.interactive.body.text)
      },
      isInteractiveTypeListWithTextHeader() {
        return this.inReactionTo.value.interactive.type === 'list' &&
          this.inReactionTo.value.interactive.header.type === 'text'
      },
      isTextPlain() {
        return this.inReactionTo.type === 'text/plain'
      },
      isSelectType() {
        return this.inReactionTo.type === 'application/vnd.lime.select+json'
      },
      isAcceptableInteractiveType() {
        return (
          this.inReactionTo.type === 'application/json' &&
          (this.isInteractiveTypeListWithTextHeader ||
            this.isInteractiveTypeButtonWithTextHeader ||
            this.isInteractiveTypeButtonWithoutTextHeader)
        )
      },
      isAcceptableTextType() {
        return this.isTextPlain || this.isSelectType || this.isAcceptableInteractiveType
      },
      hasFailedToLoad() {
        return Boolean(this.inReactionTo.type === undefined || this.inReactionTo.value === undefined)
      }
    }
  }
</script>
  
<style lang="scss" scoped>
  @import '../../../styles/variables.scss';

  .in-reaction-to-message-bar {
    flex: none;
    width: 4px;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    background-color: $color-primary;

    &.own-message {
      background-color: $color-content-ghost;
    }
  }

  .in-reaction-to-message-container {
    display: flex;
    overflow: hidden;
    background-color: $color-surface-3;
    border: 1px solid $color-content-ghost;
    border-radius: 0.5rem;

    .skeleton {
      height: 2.5rem;
    }
  }

  .in-reaction-to-message {
    padding: 0.5rem;
  }

  .failed-message {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
  }
</style>