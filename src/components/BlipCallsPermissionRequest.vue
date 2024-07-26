<template>
  <div :class="'blip-container calls-permission-request ' + position">
    <div :class="'bubble ' + position">
      <bds-typo class="typo" variant="fs-16" bold="regular">{{ bodyTitle }}</bds-typo>
      <bds-typo class="typo" variant="fs-16" bold="regular">{{ bodyText }}</bds-typo>
      <div class="divider" />
      <div class="action">
        <div class="radio">
          <span :class="'circle ' + position" />
          <bds-typo class="typo label" variant="fs-16" bold="regular">{{ leftActionLabel }}</bds-typo>
        </div>
        <div class="radio">
          <span :class="'circle ' + position" />
          <bds-typo class="typo label" variant="fs-16" bold="regular">{{ rightActionLabel }}</bds-typo>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'blip-calls-permission-request',
  props: {
    position: {
      type: String,
      default: 'right'
    },
    bodyTitle: {
      type: String
    },
    bodyText: {
      type: String
    },
    leftActionLabel: {
      type: String
    },
    rightActionLabel: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';

.blip-container.calls-permission-request {
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
    justify-content: space-evenly;
    padding-top: 8px;
    margin-bottom: 8px;

    .radio {
      display: flex;

      .circle {
        height: 24px;
        width: 24px;

        border-width: 2px;
        border-style: solid;
        border-radius: 50%;
        border-color: $color-content-default;

        &.right {
          border-color: $color-surface-1;
        }
      }

      .label {
        margin-left: 8px;
      }
    }
  }
}
</style>
