<template>
  <div v-if="!componentVideo || !componentVideo.uri || componentVideo.uri === ''"
    class="default-video-div">
    <div class="default-video">
      <bds-icon name="video" color="var(--$color-content-ghost, #8C8C8C)" />
    </div>
    <bds-typo class="typo" tag="p" variant="fs-12" bold="regular">
      {{ emptyMediaMessage }}
    </bds-typo>
  </div>
  <blip-video v-else
    :document="componentVideo"
    :position="position"
    :date="date"
    :on-video-validate-uri="onVideoValidateUri"
    :async-fetch-media="asyncFetchMedia"/>
</template>

<script>

import BlipVideo from '../../MediaLink/Video'
import { default as base } from '../../../mixins/baseComponent.js'

export default {
  name: 'media-video',
  props: {
    componentVideo: {},
    onVideoValidateUri: {
      type: Function
    },
    asyncFetchMedia: {
      type: Function
    },
    emptyMediaMessage: {
      type: String,
      default: 'Insira um vídeo em “Mídia“'
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

.default-video-div {
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $color-surface-2;
  flex-direction: column;
}

.default-video {
  margin-bottom: 8px;
}
</style>
