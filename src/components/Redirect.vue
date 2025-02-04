<template>
  <blip-card
    :position="position"
    :date="date"
    :on-selected="onSelected"
    :document="{ type: document.context.type, content: document.context.value }"
    :editable="editable"
  />
</template>

<script>
import { default as base } from '../mixins/baseComponent.js'

export default {
  name: 'blip-redirect',
  mixins: [base],
  props: {
    onSelected: {
      type: Function
    }
  }
}
</script>


<style lang="scss">
@import '../styles/variables.scss';
</style>
