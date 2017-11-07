<template>
  <div v-if="document.type === 'text/plain'">
    <plain-text :position="position" :document="document.content" :date="date" />
  </div>

  <div v-else-if="document.type === 'application/vnd.lime.media-link+json'">
    <media-link :position="position" :document="document.content" :date="date" />
  </div>

  <div v-else-if="document.type === 'application/vnd.lime.document-select+json'">
    <document-select :length="length" :position="position" :document="document.content" :date="date" :on-selected="onSelected" />
  </div>

  <div v-else-if="document.type === 'application/vnd.lime.collection+json'">
    <collection :length="length" :position="position" :document="document.content" :date="date" :on-selected="onSelected" />
  </div>

  <div v-else-if="document.type === 'application/vnd.lime.select+json'">
    <blip-select :length="length" :position="position" :document="document.content" :date="date" :on-selected="onSelected" />
  </div>
</template>

<script>

export default {
  props: {
    length: {
      type: Number
    },
    document: {
      type: Object,
      required: true
    },
    position: {
      type: String,
      default: 'left'
    },
    date: {
      type: String
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
