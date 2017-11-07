<template>
  <div class="video-player-wrapper">
    <div class="video-player">
      <video :src="this.document.uri" ref="blipVideo"></video>
    </div>
    <div class="video-player-controls">
      <span v-if="isPlaying" @click="togglePlay"><img class="video-player-button player-button-right" :src="pauseImg" alt="Pause"></span>
      <span v-else @click="togglePlay"><img class="video-player-button player-button-right" :src="playImg" alt="Play"></span>
      <div class="video-player-bar">
        <input class="video-player-range" type="range" :value="this.currentTime" :max="this.totalTime" @input="setVideoPosition($event)" @change="setVideoPosition($event)">
        <div class="video-player-time">
          <span>{{getTimeFromSeconds(this.currentTime)}}</span>
          <span>{{getTimeFromSeconds(this.totalTime)}}</span>
        </div>
      </div>
      <span @click="setVolume(event)"><img class="video-player-button player-button-left" :src="playImg" alt="Play"></span>
      <span @click="setVolume(event)"><img class="video-player-button player-button-left" :src="playImg" alt="Play"></span>
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
      video: null,
      currentTime: 0,
      totalTime: 0,
      playImg: PlayImg,
      pauseImg: PauseImg
    }
  },
  mounted: function () {
    this.video = this.$refs.blipVideo
    this.video.addEventListener('timeupdate', this.videoTimeUpdated)
    this.video.addEventListener('loadedmetadata', this.videoLoaded)
    this.video.addEventListener('canplay', this.readyToPlay)
    this.video.addEventListener('ended', this.resetPlay)
  },
  methods: {
    togglePlay: function () {
      this.isPlaying = !this.isPlaying
      if (this.isPlaying) {
        this.video.play()
      } else {
        this.video.pause()
      }
    },
    resetPlay: function () {
      if (this.isPlaying && (this.video.currentTime = this.totalTime)) {
        this.isPlaying = false
        this.video.pause()
        this.video.currentTime = 0
      }
    },
    videoTimeUpdated: function () {
      this.currentTime = this.video.currentTime
    },
    videoLoaded: function () {
      this.totalTime = this.video.duration
    },
    setvideoPosition: function (event) {
      // srcElement is no supported in FF, but needed if working with IE6-8
      this.video.currentTime = (event.target || event.srcElement).value
    },
    setVolume: function (event) {
      console.log('change volume')
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

    &.video {
      .bubble {
        width: 100%;
        padding: 0;
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

   .video-player-wrapper {
      .video-player {
        display: flex;
        align-self: top;
      }

      video {
        height: 100%;
        width: 100%;
      }

      .video-player-controls {
        padding: $bubble-padding;
        display: flex;
        justify-content: space-around;
        align-items: center;
      }

      .video-player-button {
        width: 15px;
        height: 20px;
        flex-grow: 0;
        fill: inherit;
      }

      .player-button-right {
        margin-right: 15px;  
      }

      .player-button-left {
        margin-left: 15px;  
      }

      .video-player-bar {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        margin-top: 15px;
      }

      .video-player-time {
        display: flex;
        justify-content: space-between;
        font-family: "Avenir Next";
        font-size: x-small;
        color: inherit;
      }

      input[type=range] {
        -webkit-appearance: none;
        width: auto;
        height: 3px;
        overflow: hidden;
        margin: 0;
        border-radius: 1.5px;
        padding: 0;
      }

      input[type=range]:focus {
        outline: none;
      }

      input[type=range]::-webkit-slider-runnable-track {
        height: 3px;
        background: $vue-cotton;
        border-radius: 1.5px;
      }

      input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        border: none;
        height: 3px;
        width: 2px;
        border-radius: 1.5px;
        background: $vue-neon-blip;
        box-shadow: -1000px 0 0 1000px $vue-neon-blip;
      }

      input[type=range]::-moz-range-track {
        height: 3px;
        background: $vue-cotton;
        border-radius: 1.5px;
      }

      input[type=range]::-moz-range-thumb {
        border: none;
        height: 3px;
        width: 2px;
        border-radius: 1.5px;
        background: $vue-neon-blip;
        box-shadow: -1000px 0 0 1000px $vue-neon-blip;
      }

      input[type=range]:-moz-focus-outer{
        border: 0;
      }

      input[type=range]::-ms-track {
        height: 3px;
        background: $vue-cotton;
        border-radius: 1.5px;
        overflow: hidden;
        border-color: transparent;
        color: transparent;
      }
      
      input[type=range]::-ms-thumb {
        border: none;
        height: 3px;
        width: 2px;
        border-radius: 1.5px;
        background: $vue-neon-blip;
        box-shadow: -1000px 0 0 1000px $vue-neon-blip;
      }
    }
</style>