<template>
  <div :class="'container media-link ' + document.content.type.split('/')[0]">
    <div :class="'bubble max-width ' + position">

      <blip-image :document="document" :position="position" :date="date" v-if="document.content.type.includes('image')" />
      <blip-audio :document="document" :position="position" :date="date" v-if="document.content.type.includes('audio')" />


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
