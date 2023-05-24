<template>
  <div>
    <div :class="'bubble ' + position">
      <bds-button-icon v-if="deletable && !isEditing"
        class="editIco trashIco icon-button-margin icon-button-top"
        icon="trash"
        variant="delete"
        size="short"
        v-on:click="trash(document)"
      ></bds-button-icon>
      <bds-button-icon v-if="editable && !isEditing" 
        class="icon-button-margin editIco icon-button-top"
        icon="edit"
        variant="primary"
        size="short"
        v-on:click="toggleEdit"
      ></bds-button-icon> 
      <div class="audio-player-wrapper" v-if="!isEditing">
        <div class="audio-player-controls">
          <div v-if="!isLoading" class="audio-play-pause">
            <span v-if="isPlaying" @click="togglePlay">
              <svg
                class="audio-player-button"
                width="12px"
                height="18px"
                viewBox="0 0 12 18"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <g
                  id="Pause"
                  stroke="none"
                  stroke-width="1"
                  fill-rule="nonzero"
                >
                  <path
                    d="M4.61538462,17.351355 C4.61538462,17.7095549 4.33986449,18 4,18 L0.615384615,18 C0.275520128,18 0,17.7095885 0,17.351355 L0,0.648645015 C0,0.290411481 0.275520128,0 0.615384615,0 L4,0 C4.33986449,0 4.61538462,0.290411481 4.61538462,0.648645015 L4.61538462,17.351355 Z"
                    id="Shape"
                  ></path>
                  <path
                    d="M12,17.351355 C12,17.7095549 11.7244799,18 11.3846154,18 L8,18 C7.66013551,18 7.38461538,17.7095885 7.38461538,17.351355 L7.38461538,0.648645015 C7.38461538,0.290411481 7.66013551,0 8,0 L11.3846154,0 C11.7244799,0 12,0.290411481 12,0.648645015 L12,17.351355 Z"
                    id="Shape"
                  ></path>
                </g>
              </svg>
            </span>
            <span v-else @click="togglePlay">
              <svg
                class="audio-player-button"
                width="14px"
                height="18px"
                viewBox="0 0 14 18"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <g id="Play" stroke="none" stroke-width="1" fill-rule="evenodd">
                  <path
                    d="M13.3805199,7.82862117 C14.2064934,8.35374536 14.2064934,9.64760806 13.3805199,10.1700254 L1.21459333,17.8790651 C0.677273234,18.2201251 0,17.7992137 0,17.1238607 L0,0.876139285 C0,0.200786266 0.677273234,-0.220125134 1.21459333,0.120934907 L13.3805199,7.82862117 Z"
                    id="play-copy-3"
                  ></path>
                </g>
              </svg>
            </span>
          </div>
          <div v-else class="audio-play-pause">
            <img
              class="audio-player-loading"
              :src="loadingGif"
              alt />
          </div>
          <div class="audio-player-bar">
            <div class="slider" data-direction="horizontal" ref="audioSlider">
              <div class="progress" ref="audioProgress">
                <div class="pin" id="progress-pin" data-method="rewind"></div>
              </div>
            </div>
            <input
              class="audio-player-range"
              type="range"
              :value="this.currentTime"
              :max="this.totalTime"
              @input="setAudioPosition($event)"
              @change="setAudioPosition($event)"
            />
            <div class="audio-player-time">
              <span>{{ getTimeFromSeconds(this.currentTime) }}</span>
              <span>{{ getTimeFromSeconds(this.totalTime) }}</span>
            </div>

          </div>

          <div>
             <button class="blip-change-playback-rate" @click="changePlaybackRate">
               x{{ this.playbackRate }}
              </button>
          </div>
        </div>
      </div>
      <div class="form" v-else>
        <form novalidate v-on:submit.prevent>
          <bds-button-icon 
            class="btn saveIco closeIco icon-button-margin icon-button-top"
            icon="close"
            variant="ghost"
            size="short"
            v-on:click="cancel()"
          ></bds-button-icon>
          <bds-button-icon 
            class="btn saveIco icon-button-margin icon-button-top"
            icon="check"
            variant="primary"
            size="short"
            :disabled="errors.any()"
            v-on:click="audioSave()"
          ></bds-button-icon>
          <div class="form-group">
            <input
              type="text"
              name="audio"
              class="form-control"
              v-model="audioUri"
              :placeholder="fileUrlMsg"
              :class="{ 'input-error': errors.has('audio') }"
              v-validate="'required|url'"
            />
            <span v-if="errors.has('audio')" class="help input-error">{{
              errors.first('audio')
            }}</span>
          </div>
          <button
            v-if="typeof onMetadataEdit === 'function'"
            class="define-metadata blip-media-link-metadata"
            @click="editMetadata(fullDocument)"
          >
            {{ metadataButtonText }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { default as base } from '../../mixins/baseComponent.js'
import mime from 'mime-types'

export default {
  mixins: [base],
  props: {
    fileUrlMsg: {
      type: String,
      default: 'File URL'
    },
    onAudioValidateUri: {
      type: Function
    }
  },
  data: function () {
    return {
      audioUri: undefined,
      isPlaying: undefined,
      isLoading: true,
      audio: undefined,
      currentTime: undefined,
      totalTime: undefined,
      progress: undefined,
      slider: undefined,
      possiblePlaybackRates: undefined,
      playbackRate: undefined
    }
  },
  mounted: function () {
    this.init()
    this.initAudio(this.audioUri)
    this.progress = this.$el.querySelector('.progress')
  },
  destroyed: function () {
    this.audio.removeEventListener('timeupdate', this.audioTimeUpdated)
    this.audio.removeEventListener('loadedmetadata', this.audioLoaded)
    this.audio.removeEventListener('ended', this.resetPlay)
    this.audio.addEventListener('canplaythrough', this.audioReadyToPlay, false)
  },
  methods: {
    init: function () {
      this.audioUri = this.document.uri
      this.isPlaying = false
      this.audio = Audio
      this.currentTime = 0
      this.totalTime = 0
      this.progress = undefined
      this.slider = undefined
      this.possiblePlaybackRates = [ 1, 1.5, 2 ]
      this.playbackRate = 1
    },
    initAudio: function (uri) {
      this.audio = new Audio(uri)
      this.isLoading = true
      this.audio.addEventListener(
        'canplaythrough',
        this.audioReadyToPlay,
        false
      )
      this.audio.addEventListener('timeupdate', this.audioTimeUpdated)
      this.audio.addEventListener('loadedmetadata', this.audioLoaded)
      this.audio.addEventListener('ended', this.resetPlay)
    },
    toggleEdit: function () {
      this.isEditing = !this.isEditing

      this.isPlaying = false
      this.audio.pause()
      this.audio.src = ''
      this.audio.load()
    },
    audioSave: function () {
      this.$validator.validateAll().then((result) => {
        if (!result) return
        this.progress = null
        this.initAudio(this.audioUri)
        this.save({
          ...this.document,
          uri: this.audioUri,
          type: mime.lookup(this.audioUri)
            ? mime.lookup(this.audioUri)
            : 'audio/mp3'
        })
      })
    },
    togglePlay: async function() {
      if (this.isPlaying) {
        this.audio.pause()
      } else {
        if (this.onAudioValidateUri) {
          const refreshedAudioUri = await this.onAudioValidateUri(this.audioUri)
          if (refreshedAudioUri !== this.audioUri) {
            this.audioUri = refreshedAudioUri
            this.initAudio(this.audioUri)
          }
        }

        this.audio.play()
      }

      this.isPlaying = !this.isPlaying
    },
    resetPlay: function () {
      if (this.isPlaying && (this.audio.currentTime = this.totalTime)) {
        this.isPlaying = false
        this.audio.pause()
        this.audio.currentTime = 0
      }
    },
    audioTimeUpdated: function () {
      if (!this.progress) {
        this.progress = this.$el.querySelector('.progress')
      }

      try {
        var current = this.audio.currentTime
        var percent = (current / this.totalTime) * 100
        this.progress.style.width = percent + '%'

        this.currentTime = this.audio.currentTime
      } catch (e) {}
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
      return (
        (timeMin < 10 ? '0' + timeMin : timeMin) +
        ':' +
        (timeSec < 10 ? '0' + timeSec : timeSec)
      )
    },
    audioReadyToPlay: function () {
      this.isLoading = false
    },
    changePlaybackRate: function() {
      let playbackRateIndex = this.possiblePlaybackRates.indexOf(this.playbackRate)

      if (++playbackRateIndex > this.possiblePlaybackRates.length - 1 || playbackRateIndex === -1) {
        playbackRateIndex = 0
      }

      this.playbackRate = this.possiblePlaybackRates[playbackRateIndex]
      this.audio.playbackRate = this.playbackRate
    }
  }
}
</script>


<style lang="scss">
@import '../../styles/variables.scss';

.media-link.audio {
  .bubble {
    padding: 0;
    width: $bubble-width;
    color: $color-content-default;
  }

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
  }
  .right {
    color: $vue-cotton;
    .slider {
      background-color: $color-content-ghost;
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
  }

  .notification {
    color: $color-content-disable;
  }

  .form {
    form {
      width: auto;
    }
  }

  .audio-player-wrapper {
    padding: $bubble-padding;
    .audio-player-controls {
      display: flex;
      justify-content: space-around;
      margin-top: 5px;
    }

    .audio-player-button {
      flex-grow: 0;
      width: 14px;
      margin-right: 15px;
      color: inherit;
      cursor: pointer;
    }

     .blip-change-playback-rate {
      display: inline-block;
      cursor: pointer;
      margin: 0;
      overflow: hidden;
      text-align: center;
      white-space: nowrap;
      font-weight: 600;
	    background-color: transparent;
      border-width: 1px;
	    border-style: solid;
	    border-radius: 8px;
	    outline: none;
      text-decoration: none;
      width: 2.75rem;
	    height: 2rem;
	  }

    .audio-play-pause {
      margin-top: 6px;
    }

    .audio-player-bar {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      margin-top: 13px;
      margin-right: 16px;
    }

    .audio-player-time {
      display: flex;
      justify-content: space-between;
      font-size: x-small;
      line-height: 10px;
      color: inherit;
    }
    .audio-player-range {
      position: relative;
      bottom: 10px;
      opacity: 0;
      margin: 0 0 -9px 0;
      width: 100%;
      padding: 0;
      height: 16px;
      cursor: pointer;
    }

    .audio-loading {
      padding-right: 12px;
    }
    .audio-player-loading {
      flex-grow: 0;
      width: 20px;
      height: 20px;
      margin-right: 12px;
    }

    .slider {
      border-radius: 1.5px;
      height: 3px;
      position: relative;

      .progress {
        width: 0;
        height: 100%;
        background-color: $color-primary;
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
          box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.32);
        }
      }
    }
  }

  .blip-media-link-metadata {
    margin-top: -10px;
    padding: 0 10px 5px 0;
  }
}
</style>
