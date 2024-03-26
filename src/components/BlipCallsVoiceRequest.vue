<template>
  <div :class="'blip-container calls-voice-request ' + position">
    <div :class="'bubble ' + position">
      <bds-typo
        class="typo"
        variant="fs-16"
        bold="regular"
        >{{ bodyText }}
      </bds-typo>
      <div class="action">
        <bds-grid margin="y-1" direction="row" justify-content="center" padding="x-2">
          <bds-icon v-if="position === 'right'" color="white" name="voip-call"/>
          <bds-icon v-else name="voip-call"/>
          <bds-typo
            class="typo title-action"
            variant="fs-16"
            bold="regular">{{ actionText }}
          </bds-typo>
        </bds-grid>
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
    text-align: left;
    overflow: hidden;
    padding: 10px 20px;
    max-width: 368px !important;
  }

  .action {
    text-align: center;
    border-top: 1px solid $color-content-ghost;
    margin-top: 10px;
    padding-top: 12px;

    .title-action {
      margin-left: 8px;
    }
  }
}
</style>
