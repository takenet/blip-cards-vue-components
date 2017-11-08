<template>
  <div class="audio-player-wrapper">
    <div class="audio-player-controls">
      <span v-if="isPlaying" @click="togglePlay">
        <svg  class="audio-player-button" width="12px" height="18px" viewBox="0 0 12 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="Pause" stroke="none" stroke-width="1" fill-rule="nonzero">
                <path d="M4.61538462,17.351355 C4.61538462,17.7095549 4.33986449,18 4,18 L0.615384615,18 C0.275520128,18 0,17.7095885 0,17.351355 L0,0.648645015 C0,0.290411481 0.275520128,0 0.615384615,0 L4,0 C4.33986449,0 4.61538462,0.290411481 4.61538462,0.648645015 L4.61538462,17.351355 Z" id="Shape"></path>
                <path d="M12,17.351355 C12,17.7095549 11.7244799,18 11.3846154,18 L8,18 C7.66013551,18 7.38461538,17.7095885 7.38461538,17.351355 L7.38461538,0.648645015 C7.38461538,0.290411481 7.66013551,0 8,0 L11.3846154,0 C11.7244799,0 12,0.290411481 12,0.648645015 L12,17.351355 Z" id="Shape"></path>
            </g>
        </svg>
      </span>
      <span v-else @click="togglePlay">
        <svg class="audio-player-button" width="14px" height="18px" viewBox="0 0 14 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="Play" stroke="none" stroke-width="1" fill-rule="evenodd">
            <path d="M13.3805199,7.82862117 C14.2064934,8.35374536 14.2064934,9.64760806 13.3805199,10.1700254 L1.21459333,17.8790651 C0.677273234,18.2201251 0,17.7992137 0,17.1238607 L0,0.876139285 C0,0.200786266 0.677273234,-0.220125134 1.21459333,0.120934907 L13.3805199,7.82862117 Z" id="play-copy-3"></path>
          </g>
        </svg>
      </span>
      <div class="audio-player-bar">
        <div class="slider" data-direction="horizontal" ref="audioSlider">
          <div class="progress" ref="audioProgress">
            <div class="pin" id="progress-pin" data-method="rewind"></div>
          </div>
        </div>
        <input class="audio-player-range" type="range" :value="this.currentTime" :max="this.totalTime" @input="setAudioPosition($event)" @change="setAudioPosition($event)">
        <div class="audio-player-time">
          <span>{{getTimeFromSeconds(this.currentTime)}}</span>
          <span>{{getTimeFromSeconds(this.totalTime)}}</span>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { default as base } from '../../mixins/baseComponent.js'

export default {
  mixins: [
    base
  ],
  data: function () {
    return {
      isPlaying: false,
      audio: Audio,
      currentTime: 0,
      totalTime: 0,
      progress: null,
      slider: null
    }
  },
  mounted: function () {
    this.audio = new Audio(this.document.uri)
    this.audio.addEventListener('timeupdate', this.audioTimeUpdated)
    this.audio.addEventListener('loadedmetadata', this.audioLoaded)
    this.audio.addEventListener('ended', this.resetPlay)

    this.progress = this.$refs.audioProgress
  },
  methods: {
    togglePlay: function () {
      this.isPlaying = !this.isPlaying
      if (this.isPlaying) {
        this.audio.play()
      } else {
        this.audio.pause()
      }
    },
    resetPlay: function () {
      if (this.isPlaying && (this.audio.currentTime = this.totalTime)) {
        this.isPlaying = false
        this.audio.pause()
        this.audio.currentTime = 0
      }
    },
    audioTimeUpdated: function () {
      var current = this.audio.currentTime
      var percent = (current / this.totalTime) * 100
      this.progress.style.width = percent + '%'

      this.currentTime = this.audio.currentTime
    },
    audioLoaded: function () {
      this.totalTime = this.audio.duration
    },
    setAudioPosition: function (event) {
      // srcElement is no supported in FF, but needed if working with IE6-8
      this.audio.currentTime = (event.target || event.srcElement).value
    },
    getTimeFromSeconds: function (seconds) {
      var timeMin = Math.floor(seconds / 60)
      var timeSec = Math.floor(seconds % 60)
      return (timeMin < 10 ? '0' + timeMin : timeMin) + ':' + (timeSec < 10 ? '0' + timeSec : timeSec)
    }
  }
}
</script>


<style lang="scss">
   @import '../../styles/variables.scss';

  .media-link {

    &.audio {
      .bubble {
        width: 100%;
      }
    }

    .bubble {
      padding: $bubble-padding;
      color: $vue-london;
    }

    .left {
      .progress .pin {
        background-color: $vue-neon-blip;
      }
      .audio-player-button {
        fill: $vue-london;
      }
    }
    .right {
      color: $vue-cotton;
      .progress .pin{
        background-color: $vue-white;
      }
      .audio-player-button {
        fill: $vue-white;
      }
    }

    .notification {
      color: $vue-london;
    }
  }

  .audio-player-wrapper {
    .audio-player-controls {
      display: flex;
      justify-content: space-around;
      margin-top:5px;
    }

    .audio-player-button {
      flex-grow: 0;

      margin-right: 15px;
      color: inherit;
    }

    .audio-player-bar {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      margin-top: 8px;
    }

    .audio-player-time {
      display: flex;
      justify-content: space-between;
      font-family: "Avenir Next";
      font-size: x-small;
      line-height: 10px;
      color: inherit;
    }
    .audio-player-range{
      position: relative;
      bottom: 10px;
      opacity: 1;
      margin: 0 0 -9px 0;
      width: 100%;
      padding: 0;
      height: 16px;
    }
    .slider {
      border-radius: 1.5px;
      height: 3px;
      flex-grow: 1;
      background-color: $vue-cotton;
      cursor: pointer;
      position: relative;

      .progress {
        width: 0;
        height: 100%;
        background-color: $vue-neon-blip;
        border-radius: inherit;
        position: absolute;
        pointer-events: none;

        .pin {
          right: -8px;
          top: -6px;
          height: 14px;
          width: 14px;
          border-radius: 8px;
          position: absolute;
          pointer-events: all;
          box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.32);
        }
      }
    }
  }
</style>
