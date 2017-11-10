<template>
  <div v-if="document.type === 'text/plain'">
    <plain-text :length="length" :position="position" :document="document.content" :date="date" :on-save="save" />
  </div>

  <div v-else-if="document.type === 'application/vnd.lime.media-link+json'">
    <media-link :position="position" :document="document.content" :date="date" :on-save="save" />
  </div>

  <div v-else-if="document.type === 'application/vnd.lime.document-select+json'">
    <document-select :length="length" :position="position" :document="document.content" :date="date" :on-selected="onSelected" :on-save="save" />
  </div>

  <div v-else-if="document.type === 'application/vnd.lime.collection+json'">
    <collection :length="length" :position="position" :document="document.content" :date="date" :on-selected="onSelected" :on-save="save" />
  </div>

  <div v-else-if="document.type === 'application/vnd.lime.select+json'">
    <blip-select :position="position" :document="document.content" :date="date" :on-selected="onSelected" :on-save="save" />
  </div>

  <div v-else-if="document.type === 'application/vnd.lime.web-link+json'">
    <web-link :position="position" :document="document.content" :date="date" :on-save="save" />
  </div>
</template>

<script>

import { default as base } from '../mixins/baseComponent.js'

export default {
  name: 'blip-card',
  mixins: [
    base
  ],
  props: {
    length: {
      type: Number
    },
    hideOptions: {
      type: Boolean,
      default: false
    },
    onSelected: {
      type: Function
    }
  }
}
</script>

<style lang="scss">
   @import '../styles/common.scss';
   @import '../styles/variables.scss';

</style>
