<template>
  <div class="blip-container thread-divider">
    <span class="thread-divider__line" aria-hidden="true"></span>
    <span class="thread-divider__text">{{ text }}</span>
    <span class="thread-divider__line" aria-hidden="true"></span>
  </div>
</template>

<script>
import { default as base } from '../mixins/baseComponent.js'
import { THREAD_DIVIDER_VARIATION, getThreadDividerVariation } from '../utils/threadDivider.js'

export default {
  name: 'thread-divider',
  mixins: [base],
  props: {
    controlTakenText: {
      type: String,
      default: 'Conversa transferida para provedor externo'
    },
    controlPassedText: {
      type: String,
      default: 'Conversa recebida de provedor externo'
    },
    controlTakenMetaAgentText: {
      type: String,
      default: 'Conversa transferida para Meta Business Agent'
    },
    controlPassedMetaAgentText: {
      type: String,
      default: 'Conversa recebida de Meta Business Agent'
    }
  },
  computed: {
    variation() {
      return getThreadDividerVariation(this.fullDocument)
    },
    text() {
      const texts = {
        [THREAD_DIVIDER_VARIATION.CONTROL_TAKEN]: this.controlTakenText,
        [THREAD_DIVIDER_VARIATION.CONTROL_PASSED]: this.controlPassedText,
        [THREAD_DIVIDER_VARIATION.CONTROL_TAKEN_META_AGENT]: this.controlTakenMetaAgentText,
        [THREAD_DIVIDER_VARIATION.CONTROL_PASSED_META_AGENT]: this.controlPassedMetaAgentText
      }

      return texts[this.variation] || ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';

.thread-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 8px 0;
}

.thread-divider__line {
  flex: 0 0 36px;
  height: 1px;
  background-color: $color-border-2;
}

.thread-divider__text {
  font-size: 10px;
  line-height: 16px;
  font-weight: 400;
  text-align: center;
  color: $color-content-disable;
}
</style>
