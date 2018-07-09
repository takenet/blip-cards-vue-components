<template>
  <div :class="'blip-container media-link ' + document.type.split('/')[0]">

    <blip-image :document="document" :position="position" :date="date" v-if="document.type.indexOf('image') != -1" :editable="editable" :on-save="save" :on-deleted="onDeleted" :deletable="deletable" :on-cancel="onCancel" :editing="editing"/>
    <blip-audio :document="document" :position="position" :date="date" v-else-if="document.type.indexOf('audio') != -1" :editable="editable" :on-save="save" :on-deleted="onDeleted" :deletable="deletable" :on-cancel="onCancel" :editing="editing"/>
    <blip-video :document="document" :position="position" :date="date" @updated="emitUpdate" v-else-if="document.type.indexOf('video') != -1" :editable="editable" :on-save="save" :on-deleted="onDeleted" :deletable="deletable" :on-cancel="onCancel" :editing="editing"/>
    <blip-file :document="document" :position="position" :date="date" v-else :editable="editable" :on-save="save" :on-deleted="onDeleted" :deletable="deletable" :on-cancel="onCancel" :editing="editing"/>

    <div class="flex" :class="'notification ' + position" v-if="date">
      <img v-if="status === 'accepted' && this.position === 'right'" :src="checkSentSvg"/>
      <img v-else-if="status === 'received' && this.position === 'right'" :src="doubleCheckReceivedSvg"/>
      <img v-else-if="status === 'consumed' && this.position === 'right'" :src="doubleCheckReadSvg"/>
      <div v-else-if="this.status === 'failed' && this.position === 'right'" class="failure">
          Falha ao enviar a mensagem.
        </div>
      {{ date }}
    </div>
  </div>
</template>

<script>

import BlipImage from './MediaLink/Image'
import BlipAudio from './MediaLink/Audio'
import BlipVideo from './MediaLink/Video'
import BlipFile from './MediaLink/BlipFile'
import { default as base } from '../mixins/baseComponent.js'

export default {
  name: 'media-link',
  props: {
    status: {
      type: String,
      default: ''
    }
  },
  mixins: [
    base
  ],
  components: {
    BlipImage,
    BlipAudio,
    BlipVideo,
    BlipFile
  },
  methods: {
    emitUpdate () {
      this.$emit('updated')
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables.scss';
</style>
