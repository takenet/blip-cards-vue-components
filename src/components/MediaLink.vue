<template>
  <div :class="'container media-link ' + document.type.split('/')[0]">
    <div :class="'bubble ' + position">
      <blip-image :document="document" :position="position" :date="date" v-if="document.type.indexOf('image') != -1" />
      <blip-audio :document="document" :position="position" :date="date" v-if="document.type.indexOf('audio') != -1" />
    </div>

    <div :class="'notification ' + position" v-if="date">
      {{ date }}
    </div>
  </div>
</template>

<script>

import BlipImage from './MediaLink/Image'
import BlipAudio from './MediaLink/Audio'

export default {
  components: {
    BlipImage,
    BlipAudio
  },
  props: {
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
    }
  }
}
</script>

<style lang="scss">
   @import '../styles/variables.scss';

</style>
