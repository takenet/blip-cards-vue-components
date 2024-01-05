<template>
  <blip-audio
    :document="componentAudio"
    :full-document="fullDocument"
    :position="position"
    :date="date"
    v-if="componentAudio !== undefined"
    :on-audio-validate-uri="onAudioValidateUri"
    :async-fetch-media="asyncFetchMedia"/>
</template>

<script>
import BlipAudio from '../../MediaLink/Audio'
import { default as base } from '../../../mixins/baseComponent.js'

export default {
  name: 'media-audio',
  props: {
    componentAudio: {},
    onAudioValidateUri: {
      type: Function
    },
    asyncFetchMedia: {
      type: Function
    }
  },
  mixins: [
    base
  ],
  components: {
    BlipAudio
  }
}
</script>

<style lang="scss">
@import '../../../styles/variables.scss';

.left,
.middle {

  .slider {
    background-color: $color-surface-3;
  }

  .progress .pin {
    background-color: $color-content-default;
  }

  .audio-player-button {
    fill: $color-content-default;
  }

  .blip-change-playback-rate {
    border-color: $color-content-ghost;
    color: $color-content-default;
  }

  .video-player-time {
    color: $color-content-default;
  }
}

.right {

  .slider {
    background-color: $color-content-ghost;
  }

  .progress .pin {
    background-color: $color-surface-1;
  }

  .audio-player-button {
    fill: $color-surface-1;
  }

  .video-player-time {
    color: $color-surface-1;
  }

  .blip-change-playback-rate {
    border-color: $color-content-ghost;
    color: $color-surface-1;
  }
}
</style>
