<template>
  <blip-video
    :document="componentVideo"
    :position="position"
    :date="date"
    v-if="componentVideo !== undefined"
    :on-video-validate-uri="onVideoValidateUri"
    :async-fetch-media="asyncFetchMedia"/>
</template>

<script>

import BlipVideo from '../../MediaLink/Video'
import { default as base } from '../../../mixins/baseComponent.js'

export default {
  name: 'media-content',
  props: {
    componentVideo: {},
    onVideoValidateUri: {
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
    BlipVideo
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

  .blip-change-playback-rate {
    border-color: $color-content-ghost;
    color: $color-content-default;
  }

  .video-player-button {
    fill: $color-content-default;
  }

  .video-player-time {
    color: $color-content-default;
  }

  .video-player-controls {
  padding: $bubble-padding !important;
  }
}

.right {

  .slider {
    background-color: $color-content-ghost;
  }

  .progress .pin {
    background-color: $color-surface-1;
  }

  .video-player-button {
    fill: $color-surface-1;
  }

  .video-player-time {
    color: $color-surface-1;
  }
  
  .video-player-controls {
  padding: $bubble-padding !important;
  }

  .blip-change-playback-rate {
    border-color: $color-content-ghost;
    color: $color-surface-1;
  }
}
</style>
