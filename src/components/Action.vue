<template>
  <div class="blip-container action-flow" v-if="isActionStatus">
    <p class="subtitle fancy">
      <span>{{ actionMessage }}</span>
    </p>
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
      default: 'Início do fluxo do action {actionName}'
    },
    endActionMsg: {
      type: String,
      default: 'Fim do fluxo do action {actionName}'
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
  color: $color-content-disable;
  text-align: center;
  overflow: hidden;
  padding-top: 5px;

  .subtitle {
    margin: 0;
  }
  .fancy {
    line-height: 1;
    text-align: center;
  }
  .fancy span {
    display: inline-block;
    position: relative;
  }
  .fancy span:before,
  .fancy span:after {
    content: '';
    position: absolute;
    height: 5px;
    border-bottom: 1px solid $color-surface-3;
    top: 0;
    width: 600px;
  }
  .fancy span:before {
    right: 100%;
    margin-right: 15px;
  }
  .fancy span:after {
    left: 100%;
    margin-left: 15px;
  }
}
</style>
