<template>
  <plain-text v-if="document.type === 'text/plain'" :length="length" :position="position" :document="document.content" :date="date" :on-save="save" :editable="editable" />

  <media-link v-else-if="document.type === 'application/vnd.lime.media-link+json'" :position="position" :document="document.content" :date="date" :on-save="save" :editable="editable" />

  <document-select v-else-if="document.type === 'application/vnd.lime.document-select+json'" :length="length" :position="position" :document="document.content" :date="date" :on-selected="onSelected" :on-save="save" :editable="editable" />

  <collection v-else-if="document.type === 'application/vnd.lime.collection+json'" :length="length" :position="position" :document="document.content" :date="date" :on-selected="onSelected" :on-save="save" :editable="editable" />

  <blip-select v-else-if="document.type === 'application/vnd.lime.select+json'" :position="position" :document="document.content" :date="date" :on-selected="onSelected" :on-save="save" :editable="editable" />

  <web-link v-else-if="document.type === 'application/vnd.lime.web-link+json'" :position="position" :document="document.content" :date="date" :on-save="save" :editable="editable" :on-click="onSelected"/>
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
