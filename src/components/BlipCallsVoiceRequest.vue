<template>
  <div :class="'blip-container calls-voice-request ' + position">
    <div :class="'bubble ' + position">
      <bds-typo
        class="typo"
        variant="fs-16"
        bold="regular"
        >{{ bodyText }}
      </bds-typo>
      <div class="divider" />
      <div class="action">
        <bds-icon v-if="position === 'right'" color="white" name="voip-call"/>
        <bds-icon v-else name="voip-call"/>
        <bds-typo
          class="typo title-action"
          variant="fs-16"
          bold="regular">{{ actionText }}
        </bds-typo>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'blip-calls-voice-request',
  props: {
    position: {
      type: String,
      default: 'right'
    },
    bodyText: {
      type: String
    },
    actionText: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';

.blip-container.calls-voice-request {
  .bubble {
    text-align: start;
    overflow: hidden;
    padding: 8px 16px;
    max-width: 368px !important;
  }

  .divider {
    border: 1px solid $color-content-ghost;
    margin-top: 8px;
    margin-bottom: 8px;
  }

  .action {
    display: flex;
    justify-content: center;
    padding-top: 8px;
    margin-bottom: 8px;

    .title-action {
      margin-left: 8px;
    }
  }
}
</style>
