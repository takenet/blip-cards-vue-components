<template>
  <div class="container">
    <div :class="'bubble max-width ' + position">
      <div class="audio-player-wrapper">
        <div class="row middle-xs audio-player-controls">
          <span class="audio-player-button-wrappers">
            <a v-if="isPlaying" @click="togglePlay"><img class="audio-player-button" :src="pauseImg" alt="Pause"></a>
            <a v-else @click="togglePlay"><img class="audio-player-button" :src="playImg" alt="Play"></a>
          </span>
          <input class="audio-player-range" type="range" :value="this.currentTime" :max="this.totalTime" @input="setAudioPosition($event)">
        </div>
        <span>{{getTimeFromSeconds(this.currentTime)}}</span>
        <span>{{getTimeFromSeconds(this.totalTime)}}</span>
      </div>
    </div>

    <div :class="'notification ' + position" v-if="date">
      {{ date }}
    </div>
  </div>
</template>

<script>
import PlayImg from '../assets/img/play.png'
import PauseImg from '../assets/img/pause.png'
export default {
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
  },
  data: function () {
    return {
      isPlaying: false,
      audio: Audio,
      currentTime: 0,
      totalTime: 0,
      playImg: PlayImg,
      pauseImg: PauseImg
    }
  },
  mounted: function () {
    this.audio = new Audio(this.document.content.uri)
    this.audio.addEventListener('timeupdate', this.audioTimeUpdated)
    this.audio.addEventListener('loadedmetadata', this.audioLoaded)
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
    audioTimeUpdated: function () {
      this.currentTime = this.audio.currentTime
    },
    audioLoaded: function () {
      this.totalTime = this.audio.duration
    },
    setAudioPosition: function (event) {
      this.audio.currentTime = event.srcElement.value
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
   @import '../styles/common.scss';
   .audio-player-wrapper {
      width: 100%;

      .audio-player-button {
        width: 24px;
        height: 30px;
      }

      input[type=range] {
        -webkit-appearance: none;
        border: 1px solid white;
        width: 85%;
        position: relative;
        bottom: 11px;
      }
      input[type=range]::-webkit-slider-runnable-track {
        width: 300px;
        height: 5px;
        background: #ddd;
        border: none;
        overflow: hidden;
        border-radius: 3px;
      }
      input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        border: none;
        height: 16px;
        width: 2px;
        border-radius: 50%;
        background: $vue-blue;
        margin-top: -4px;
        box-shadow: -325px 0 0 325px $vue-blue;
      }
      input[type=range]:focus {
        outline: none;
      }
      input[type=range]:focus::-webkit-slider-runnable-track {
        background: #ccc;
      }

      input[type=range]::-moz-range-track {
        width: 300px;
        height: 5px;
        background: #ddd;
        border: none;
        border-radius: 3px;
      }
      input[type=range]::-moz-range-thumb {
        border: none;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: $vue-blue;
      }

      /*hide the outline behind the border*/
      input[type=range]:-moz-focusring{
        outline: 1px solid white;
        outline-offset: -1px;
      }

      input[type=range]::-ms-track {
        width: 300px;
        height: 5px;

        /*remove bg colour from the track, we'll use ms-fill-lower and ms-fill-upper instead */
        background: transparent;

        /*leave room for the larger thumb to overflow with a transparent border */
        border-color: transparent;
        border-width: 6px 0;

        /*remove default tick marks*/
        color: transparent;
      }
      input[type=range]::-ms-fill-lower {
        background: #777;
        border-radius: 10px;
      }
      input[type=range]::-ms-fill-upper {
        background: #ddd;
        border-radius: 10px;
      }
      input[type=range]::-ms-thumb {
        border: none;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: $vue-blue;
      }
      input[type=range]:focus::-ms-fill-lower {
        background: #888;
      }
      input[type=range]:focus::-ms-fill-upper {
        background: #ccc;
      }
    }
</style>
