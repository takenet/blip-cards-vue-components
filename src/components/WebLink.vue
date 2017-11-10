<template>
  <div class="container web-link">
    <div :class="'bubble ' + position">

    </div>

    <div :class="'notification ' + position" v-if="date">
      {{ date }}
    </div>
  </div>
</template>

<script>

import { default as base } from '../mixins/baseComponent.js'

export default {
  name: 'web-link',
  mixins: [
    base
  ],
  created: function () {

  }
}
</script>


<style lang="scss">
   @import '../styles/variables.scss';

   .web-link .bubble {
     padding: $bubble-padding
   }
</style>
