<template>
  <div class="audio-player-wrapper">
    <div class="audio-player-controls">
      <span v-if="isPlaying" @click="togglePlay"><img class="audio-player-button" :src="pauseImg" alt="Pause"></span>
      <span v-else @click="togglePlay"><img class="audio-player-button" :src="playImg" alt="Play"></span>
      <div class="audio-player-bar">
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
    this.audio = new Audio(this.document.uri)
    this.audio.addEventListener('timeupdate', this.audioTimeUpdated)
    this.audio.addEventListener('loadedmetadata', this.audioLoaded)
    this.audio.addEventListener('ended', this.resetPlay)
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
      padding: $bubble-padding
    }
  }

   .right .audio-player-wrapper {
      -webkit-filter: brightness(2);
      filter: brightness(2);
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
        color: #A7BEC3;
      }

      input[type=range] {
        -webkit-appearance: none;
        width: auto;
        height: 3px;
        overflow: hidden;
        margin: 0;
        border-radius: 3px;
      }

      input[type=range]:focus {
        outline: none;
      }

      input[type=range]::-webkit-slider-runnable-track {
        height: 3px;
        background: #ddd;
        border: none;
        overflow: hidden;
        border-radius: 3px;
      }

      input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        border: none;
        height: 3px;
        width: 2px;
        border-radius: 50%;
        background: $vue-light-blip;
        margin-top: -4px;
        box-shadow: -325px 0 0 325px $vue-light-blip;
      }

      input[type=range]::-moz-range-track {
        height: 5px;
        background: #ddd;
        border: none;
        border-radius: 3px;
      }

      input[type=range]::-moz-range-thumb {
        border: none;
        height: 5px;
        width: 2px;
        background: $vue-light-blip;
        box-shadow: -1000px 0 0 1000px $vue-light-blip;
      }

      input[type=range]:-moz-focus-outer{
        border: 0;
      }

      input[type=range]::-ms-track {
        height: 100px;
        overflow: hidden;
        background-color: #ddd;
      }

      input[type=range]::-ms-thumb {
        border: none;
        height: 2px;
        width: 2px;
        background: $vue-light-blip;
      }
    }
</style>