

<template>
 <div></div>
</template>

<script>

import { default as base } from '../mixins/baseComponent.js'

export default {
  name: 'blip-raw',
  mixins: [
    base
  ],
  data: function () {
    return {
      json: JSON.stringify(this.document)
    }
  },
  methods: {
    cancel: function () {
      this.json = JSON.stringify(this.document)
      this.isEditing = false
    },
    saveRaw: function () {
      this.save(JSON.parse(this.json))
    }
  },
  mounted () {
    this.$emit('unsupportedType', this.document)
    if (this.onDeleted) {
      this.onDeleted(this.document)
    }
  }
}
</script>


<style lang="scss">
   @import '../styles/variables.scss';

   .raw .bubble {
     padding: $bubble-padding;
     word-wrap: break-word;
   }
</style>
