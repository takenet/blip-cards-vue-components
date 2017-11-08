<template>
  <div class="audio-player-wrapper">
    <div class="audio-player-controls">
      <span v-if="isPlaying" @click="togglePlay"><img class="audio-player-button" :src="pauseImg" alt="Pause"></span>
      <span v-else @click="togglePlay"><img class="audio-player-button" :src="playImg" alt="Play"></span>
      <div class="audio-player-bar">
        <div class="slider" data-direction="horizontal" ref="audioSlider">
          <div class="progress" ref="audioProgress">
            <div class="pin" id="progress-pin" data-method="rewind" ref="audioPin"></div>
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
import PlayImg from '../../assets/img/play.png'
import PauseImg from '../../assets/img/pause.png'
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
      playImg: PlayImg,
      pauseImg: PauseImg,
      progress: null,
      slider: null,
      pin: null
    }
  },
  mounted: function () {
    this.audio = new Audio(this.document.uri)
    this.audio.addEventListener('timeupdate', this.audioTimeUpdated)
    this.audio.addEventListener('loadedmetadata', this.audioLoaded)
    this.audio.addEventListener('ended', this.resetPlay)

    this.progress = this.$refs.audioProgress
    this.slider = this.$refs.audioSlider
    this.pin = this.$refs.audioPin
    this.slider.addEventListener('click', this.movePlayer)
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

    .right {
      color: $vue-cotton;
    }

    .notification {
      color: $vue-london;
    }
  }

  .audio-player-wrapper {
    .audio-player-controls {
      display: flex;
      justify-content: space-around;
      align-items: center;
    }

    .audio-player-button {
      width: 15px;
      height: 20px;
      flex-grow: 0;
      margin-right: 15px;
      color: inherit;
    }

    .audio-player-bar {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      margin-top: 15px;
    }

    .audio-player-time {
      display: flex;
      justify-content: space-between;
      font-family: "Avenir Next";
      font-size: x-small;
      color: inherit;
    }
    .audio-player-range{
      position: relative;
      bottom: 14px;
      opacity: 0;
      margin-bottom: -9px;
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
          height: 16px;
          width: 16px;
          border-radius: 8px;
          background-color: $vue-neon-blip;
          position: absolute;
          pointer-events: all;
          box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.32);
        }
      }
    }
  }
</style>
