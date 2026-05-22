<template>
  <div class="blip-container action-flow" v-if="isActionStatus">
    <div class="action-separator" :class="actionStatusClass">
      <span class="action-line"></span>
      <div class="action-marker">
        <span class="action-icon">
          <bds-icon
            :name="actionIcon"
            :theme="actionIconTheme"
            size="x-small"
            color="var(--color-extended-blue, #1968f0)"
          />
        </span>
        <span class="action-message">{{ actionMessage }}</span>
      </div>
      <span class="action-line"></span>
    </div>
    <span class="action-time" v-if="date">{{ date }}</span>
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
      default: 'Início da action: {actionName}'
    },
    endActionMsg: {
      type: String,
      default: 'Fim da action: {actionName}'
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
    },
    actionIcon() {
      return this.isStartAction ? 'automation' : 'check'
    },
    actionIconTheme() {
      return this.isStartAction ? 'solid' : 'outline'
    },
    actionStatusClass() {
      return this.isStartAction ? 'action-start' : 'action-end'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';

.action-flow {
  padding-top: 5px;
  overflow: hidden;
  text-align: center;

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

  .action-marker {
    align-items: center;
    background-color: transparent;
    border: 1px solid $color-surface-3;
    border-radius: 12px;
    box-sizing: border-box;
    display: flex;
    flex: 0 1 auto;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    max-width: calc(100% - 44px);
    min-height: 38px;
    padding: 8px 14px;
  }

  .action-icon {
    align-items: center;
    border: 2px solid currentColor;
    border-radius: 50%;
    box-sizing: border-box;
    display: flex;
    flex: 0 0 24px;
    height: 24px;
    justify-content: center;
    width: 24px;
  }

  .action-message {
    flex: 0 1 auto;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    overflow-wrap: anywhere;
    text-align: left;
  }

  .action-start,
  .action-end {
    .action-icon,
    .action-message {
      color: $color-extended-blue;
    }
  }

  .action-time {
    color: $color-content-ghost;
    display: block;
    font-size: 12px;
    line-height: 16px;
    margin-top: 4px;
    text-align: center;
  }
}

@media (max-width: 420px) {
  .action-flow {
    .action-marker {
      justify-content: flex-start;
      padding: 8px 10px;
    }
  }
}
</style>
