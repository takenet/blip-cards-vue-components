<template>
  <div class="blip-container action-flow" v-if="isActionStatus">
    <p class="action-title">{{ actionMessage }}</p>
    <div class="action-separator">
      <span class="action-line"></span>
      <span class="action-subtitle">{{ date }}</span>
      <span class="action-line"></span>
    </div>
  </div>
</template>

<script>
import { default as base } from '../mixins/baseComponent.js'

export default {
  name: 'action-flow',
  mixins: [base],
  props: {
    startActionMsg: {
      type: String,
      default: 'Action iniciada: {actionName}'
    },
    endActionMsg: {
      type: String,
      default: 'Action finalizada: {actionName}'
    }
  },
  computed: {
    isActionStatus() {
      return Boolean(this.document)
    },
    isStartAction() {
      return !this.document.endDate
    },
    actionName() {
      return this.document.subflowTitle
        ? this.document.subflowTitle
        : ''
    },
    actionMessage() {
      const message = this.isStartAction ? this.startActionMsg : this.endActionMsg

      return message.replace(/\{actionName\}/g, this.actionName)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';

.action-flow {
  overflow: hidden;
  padding-top: 5px;
  text-align: center;

  .action-title {
    color: $color-extended-blue;
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
    margin: 0 0 8px;
    overflow-wrap: anywhere;
  }

  .action-separator {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    gap: 10px;
    justify-content: center;
    max-width: 100%;
    width: 100%;
  }

  .action-line {
    border-bottom: 1px solid $color-surface-3;
    flex: 1 1 36px;
    min-width: 12px;
  }

  .action-subtitle {
    color: $color-content-disable;
    flex: 0 1 auto;
    font-size: 14px;
    line-height: 20px;
    max-width: calc(100% - 44px);
    overflow-wrap: anywhere;
    text-align: center;
  }
}

@media (max-width: 420px) {
  .action-flow {
    .action-separator {
      gap: 8px;
    }
  }
}
</style>
