<template>
  <div :class="'container media-link ' + document.type.split('/')[0]">
    <div :class="'bubble ' + position">
      <blip-image :document="document" :position="position" :date="date" v-if="document.type.indexOf('image') != -1" :editable="editable" />
      <blip-audio :document="document" :position="position" :date="date" v-if="document.type.indexOf('audio') != -1" :editable="editable" />
      <blip-video :document="document" :position="position" :date="date" v-if="document.type.indexOf('video') != -1" :editable="editable" />
    </div>

    <div v-if="editable && !isEditing" class="editIco" @click="toggleEdit">
      <img :src="editSvg" />
    </div>

    <div v-if="isEditing"  class="saveIco" @click="save(text)">
      <img :src="approveSvg" />
    </div>

    <div :class="'notification ' + position" v-if="date">
      {{ date }}
    </div>
  </div>
</template>

<script>

import BlipImage from './MediaLink/Image'
import BlipAudio from './MediaLink/Audio'
import BlipVideo from './MediaLink/Video'
import { default as base } from '../mixins/baseComponent.js'

export default {
  name: 'media-link',
  mixins: [
    base
  ],
  components: {
    BlipImage,
    BlipAudio,
    BlipVideo
  }
}
</script>

<style lang="scss">
   @import '../styles/variables.scss';

</style>
