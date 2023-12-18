<template>
  <div>
    <bds-button-icon v-if="deletable && !isEditing"
        class="editIco trashIco"
        icon="trash"
        variant="delete"
        size="short"
        v-on:click="trash(document)"
    ></bds-button-icon>
    <bds-button-icon v-if="editable && !isEditing"
        class="editIco"
        icon="edit"
        variant="primary"
        size="short"
        v-on:click="toggleEdit"
    ></bds-button-icon>
    <div v-if="!isEditing">
      <div v-if="simplified">
        <bds-grid gap="3" align-items="center" justify-content="space-between">
          <bds-grid align-items="center" gap="1">
            <bds-icon class="typo" size="small" name="video" theme="outline"></bds-icon>
            <bds-typo class="typo" v-if="!isLoading" tag="span">{{ getTimeFromSeconds(this.totalTime) }}</bds-typo>
          </bds-grid>
          <div class="video-preview-container">
            <video width="56px" height="56px" v-if="!isLoading" id="simplifiedVideo"></video>
            <bds-loading-spinner class="preview-loading" v-if="isLoading" size="extra-small" color="light"></bds-loading-spinner>
          </div>
        </bds-grid>
      </div>
      <div class="video-player-wrapper" id="blipVideoPlayerWrapper" v-if="!simplified">
        <div class="video-player">
          <div class="sk-circle-wrapper" id="animation">
            <bds-loading-spinner size="small" color="main"></bds-loading-spinner>
          </div>
          <video id="blipVideo"></video>
        </div>
        <div class="video-player-controls" id="videoPlayerControls">
          <span v-if="isPlaying" @click="togglePlay">
            <svg class="video-player-button player-button-left player-button" width="12px" height="18px" viewBox="0 0 12 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g id="Pause" stroke="none" stroke-width="1" fill-rule="nonzero">
                  <path d="M4.61538462,17.351355 C4.61538462,17.7095549 4.33986449,18 4,18 L0.615384615,18 C0.275520128,18 0,17.7095885 0,17.351355 L0,0.648645015 C0,0.290411481 0.275520128,0 0.615384615,0 L4,0 C4.33986449,0 4.61538462,0.290411481 4.61538462,0.648645015 L4.61538462,17.351355 Z" id="Shape"></path>
                  <path d="M12,17.351355 C12,17.7095549 11.7244799,18 11.3846154,18 L8,18 C7.66013551,18 7.38461538,17.7095885 7.38461538,17.351355 L7.38461538,0.648645015 C7.38461538,0.290411481 7.66013551,0 8,0 L11.3846154,0 C11.7244799,0 12,0.290411481 12,0.648645015 L12,17.351355 Z" id="Shape"></path>
                </g>
            </svg>
          </span>
          <span v-else @click="togglePlay">
            <svg class="video-player-button player-button-left player-button" width="14px" height="18px" viewBox="0 0 14 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g id="Play" stroke="none" stroke-width="1" fill-rule="nonzero">
                <path d="M13.3805199,7.82862117 C14.2064934,8.35374536 14.2064934,9.64760806 13.3805199,10.1700254 L1.21459333,17.8790651 C0.677273234,18.2201251 0,17.7992137 0,17.1238607 L0,0.876139285 C0,0.200786266 0.677273234,-0.220125134 1.21459333,0.120934907 L13.3805199,7.82862117 Z" id="play-copy-3"></path>
              </g>
            </svg>
          </span>
          <div class="video-player-bar">
            <div class="slider" id="videoSlider">
              <div class="progress" id="videoProgress">
                <div class="pin" id="progress-pin"></div>
              </div>
            </div>
            <input class="video-player-range" type="range" :value="this.currentTime" :max="this.totalTime" @input="setVideoPosition($event)" @change="setVideoPosition($event)">
            <div class="video-player-time">
              <span>{{getTimeFromSeconds(this.currentTime)}}</span>
              <span>{{getTimeFromSeconds(this.totalTime)}}</span>
            </div>
          </div>
          <div class='volume-control'>
            <span @click="toggleVolumeControl()">
              <svg class="video-player-button player-button-right player-button" width="24px" height="18px" viewBox="0 0 24 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g id="Volume" stroke="none" stroke-width="1" fill-rule="evenodd">
                  <path d="M10.9420052,14.5708313 C10.9420052,14.9579788 10.7192747,15.3094215 10.3704869,15.473192 C10.2362021,15.5378149 10.091633,15.5687985 9.94794531,15.5687985 C9.72198253,15.5687985 9.49690127,15.4906018 9.31442677,15.3383395 L3.88544324,10.8212247 L0.992884572,10.8212247 C0.444285728,10.8212247 0,10.3738805 0,9.82296245 L0,5.84968376 C0,5.29876573 0.444285728,4.85142146 0.992884572,4.85142146 L3.88544324,4.85142146 L9.31442677,0.333126381 C9.61179261,0.0864378564 10.0225806,0.0333231023 10.3716623,0.199159168 C10.7192747,0.36292966 10.9420052,0.714667365 10.9420052,1.10181491 L10.9420052,14.5708313 Z M17.3101537,13.5890087 C17.2860588,13.590189 17.2628455,13.5913693 17.2387506,13.5913693 C16.9760579,13.5913693 16.7233557,13.4877956 16.5364736,13.2998283 L16.4033642,13.1661562 C16.0554579,12.8167792 16.0140265,12.2635005 16.3078663,11.86573 C17.0518686,10.8595005 17.4444385,9.66530376 17.4444385,8.41356605 C17.4444385,7.06622179 16.997802,5.80297589 16.1553634,4.75956605 C15.8339027,4.36327097 15.8638744,3.78697589 16.2229466,3.42609064 L16.356056,3.29241851 C16.5546917,3.0929431 16.820029,2.98464802 17.107992,3.00176278 C17.3880212,3.01563163 17.6498325,3.14841851 17.8276055,3.366189 C18.9973817,4.80353327 19.6159144,6.54982835 19.6159144,8.41356605 C19.6159144,10.1495333 19.0684909,11.8014021 18.0341749,13.1915333 C17.8619848,13.4231726 17.5981167,13.5683529 17.3101537,13.5890087 Z M13.8949359,11.7253604 C13.8783247,11.7261101 13.8623213,11.7268597 13.8457102,11.7268597 C13.6646084,11.7268597 13.4903942,11.6610773 13.3615567,11.5416943 L13.2697904,11.4567956 C13.0299419,11.2348969 13.0013789,10.883495 13.2039536,10.6308604 C13.7168727,9.99177731 13.9875125,9.23331129 13.9875125,8.43829946 C13.9875125,7.58256536 13.679599,6.78024437 13.0988173,6.11754709 C12.8772006,5.86584957 12.8978632,5.49982927 13.1454095,5.27062147 L13.2371759,5.18572276 C13.3741163,5.05903063 13.5570413,4.99024955 13.7555645,5.00111959 C13.9486182,5.00992806 14.1291122,5.09426454 14.2516699,5.23257635 C15.0581197,6.14547184 15.4845394,7.25459018 15.4845394,8.43829946 C15.4845394,9.5408583 15.1071428,10.590004 14.3940799,11.4729132 C14.2753711,11.6200335 14.0934591,11.7122414 13.8949359,11.7253604 Z M20.9948997,17.0946346 C20.814776,17.3076838 20.5553154,17.4357493 20.2776369,17.4472575 C20.2638264,17.4484379 20.2500159,17.4484379 20.2350301,17.4484379 C19.9723373,17.4484379 19.7196351,17.3433887 19.5327531,17.1568969 L19.4028759,17.0252903 C19.0379269,16.6599788 19.013832,16.0745362 19.3444018,15.6779461 C20.94671,13.7655198 21.8294047,11.3358149 21.8294047,8.83676573 C21.8294047,6.23650343 20.8847098,3.73509359 19.1698609,1.79050343 C18.8222485,1.39538868 18.8392912,0.798142774 19.2089416,0.425749332 L19.3397003,0.294437856 C19.5327531,0.099683758 19.7839861,-0.00861132394 20.071949,0.000536217045 C20.34522,0.00850343016 20.6035052,0.130667365 20.7859797,0.336044414 C22.8578439,2.67929032 23.999999,5.69827392 23.999999,8.83676573 C24.0011744,11.8557493 22.9336545,14.7879788 20.9948997,17.0946346 Z" id="Fill-1"></path>
                </g>
              </svg>
            </span>
            <div class="volume-slider-wrapper hide" id="volumeSliderWrapper">
              <div class="volume-slider">
                <div class="slider" id="volumeSlider">
                  <div class="progress" id="volumeProgress">
                    <div class="pin" id="progress-pin"></div>
                  </div>
                </div>
                <input class="video-player-volume" type="range" value="0" max="100" @input="setVolume($event)" @change="setVolume($event)">
              </div>
            </div>
          </div>
          <div class='volume-control' @click="toggleFullScreen()">
            <svg v-if="this.isFullScreen" class="video-player-button player-button-right player-button" width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g id="FullScreen" stroke="none" stroke-width="1" fill-rule="nonzero">
                <path d="M0.0780693648,6.13503995 L4.36301393e-05,0.516244875 C-0.00367188104,0.230291656 0.230405323,-0.00367006956 0.516499683,4.36086149e-05 L6.13806809,0.0817445285 C6.58764494,0.0891718848 6.81057561,0.631368898 6.49104165,0.950745222 L4.92681145,2.51420373 L7.52766927,5.11377846 L5.11258701,7.52766927 L2.51172918,4.92809455 L0.94749898,6.49155306 C0.63168053,6.8072157 0.0855003872,6.58439501 0.0780693648,6.13503995 Z" id="Shape" transform="translate(3.763835, 3.763835) rotate(-180.000000) translate(-3.763835, -3.763835) "></path>
                <path d="M15.5522025,4.92924443 L17.115661,6.49424709 C17.4350374,6.81393884 17.9772344,6.59089808 17.9846617,6.14109922 L18.0663626,0.516754744 C18.0700763,0.230519103 17.8361146,-0.0036736943 17.5501614,4.36516849e-05 L11.9313663,0.0818252633 C11.4820112,0.0892599553 11.2591905,0.631992469 11.5785669,0.951684224 L13.1383117,2.50925219 L10.538737,5.11139438 L12.9526278,7.52766927 L15.5522025,4.92924443 Z" id="Shape" transform="translate(14.302572, 3.763835) rotate(-180.000000) translate(-14.302572, -3.763835) "></path>
                <path d="M11.5785669,16.9479102 C11.2591905,17.2674442 11.4820112,17.8099088 11.9313663,17.8173398 L17.5501614,17.8990811 C17.8361146,17.9027966 18.0700763,17.6687194 18.0663626,17.382625 L17.9846617,11.7610566 C17.9772344,11.3114798 17.4350374,11.0885491 17.115661,11.4080831 L15.5522025,12.9723133 L12.9526278,10.3714554 L10.538737,12.7865377 L13.1383117,15.3873955 L11.5785669,16.9479102 Z" id="Shape" transform="translate(14.302572, 14.135290) rotate(-180.000000) translate(-14.302572, -14.135290) "></path>
                <path d="M0.519917957,17.5276256 L6.13874559,17.4458844 C6.58810325,17.4384534 6.81092523,16.8959887 6.49154706,16.5764548 L4.92807949,15.0159401 L7.52766927,12.4150823 L5.11376447,10 L2.51417469,12.6008578 L0.950707121,11.0366276 C0.631328947,10.7170937 0.0891287926,10.9400243 0.0817013932,11.3896012 L0,17.0111696 C0,17.2972639 0.23396308,17.5313412 0.519917957,17.5276256 Z" id="Shape" transform="translate(3.763835, 13.763835) rotate(-180.000000) translate(-3.763835, -13.763835) "></path>
              </g>
            </svg>
            <svg v-else class="video-player-button player-button-right player-button" width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g id="FullScreen" stroke="none" stroke-width="1" fill-rule="nonzero">
                <path d="M0.0780693648,6.13503995 L4.36301393e-05,0.516244875 C-0.00367188104,0.230291656 0.230405323,-0.00367006956 0.516499683,4.36086149e-05 L6.13806809,0.0817445285 C6.58764494,0.0891718848 6.81057561,0.631368898 6.49104165,0.950745222 L4.92681145,2.51420373 L7.52766927,5.11377846 L5.11258701,7.52766927 L2.51172918,4.92809455 L0.94749898,6.49155306 C0.63168053,6.8072157 0.0855003872,6.58439501 0.0780693648,6.13503995 Z" id="Shape"></path>
                <path d="M15.5522025,4.92924443 L17.115661,6.49424709 C17.4350374,6.81393884 17.9772344,6.59089808 17.9846617,6.14109922 L18.0663626,0.516754744 C18.0700763,0.230519103 17.8361146,-0.0036736943 17.5501614,4.36516849e-05 L11.9313663,0.0818252633 C11.4820112,0.0892599553 11.2591905,0.631992469 11.5785669,0.951684224 L13.1383117,2.50925219 L10.538737,5.11139438 L12.9526278,7.52766927 L15.5522025,4.92924443 Z" id="Shape"></path>
                <path d="M11.5785669,16.9479102 C11.2591905,17.2674442 11.4820112,17.8099088 11.9313663,17.8173398 L17.5501614,17.8990811 C17.8361146,17.9027966 18.0700763,17.6687194 18.0663626,17.382625 L17.9846617,11.7610566 C17.9772344,11.3114798 17.4350374,11.0885491 17.115661,11.4080831 L15.5522025,12.9723133 L12.9526278,10.3714554 L10.538737,12.7865377 L13.1383117,15.3873955 L11.5785669,16.9479102 Z" id="Shape"></path>
                <path d="M0.519917957,17.8990811 L6.13874559,17.8173398 C6.58810325,17.8099088 6.81092523,17.2674442 6.49154706,16.9479102 L4.92807949,15.3873955 L7.52766927,12.7865377 L5.11376447,10.3714554 L2.51417469,12.9723133 L0.950707121,11.4080831 C0.631328947,11.0885491 0.0891287926,11.3114798 0.0817013932,11.7610566 L0,17.382625 C0,17.6687194 0.23396308,17.9027966 0.519917957,17.8990811 Z" id="Shape"></path>
              </g>
            </svg>
          </div>
        </div>
        <div v-if="this.text" class="video-description">
          <bds-typo class="typo" tag="p" variant="fs-16" bold="regular" margin="false">{{ this.text }}</bds-typo>
        </div>
      </div>
    </div>
    <div class="form" v-else>
      <form novalidate v-on:submit.prevent>
        <bds-button-icon
          class="btn saveIco closeIco"
          icon="close"
          variant="ghost"
          size="short"
          v-on:click="cancel()"
        ></bds-button-icon>
        <bds-button-icon
          class="btn saveIco"
          icon="check"
          variant="primary"
          size="short"
          :disabled="errors.any()"
          v-on:click="videoSave()"
        ></bds-button-icon>
        <div class="form-group">
          <input type="text" name="video" class="form-control" v-model="videoUri" :placeholder="videoUriMsg" :class="{'input-error': errors.has('video') }" v-validate="'required|url'"/>
          <span v-if="errors.has('video')" class="help input-error">{{ errors.first('video') }}</span>
          <input type="text" name="text" class="form-control text" v-model="text" placeholder="Text"/>
        </div>
        <button v-if="typeof onMetadataEdit === 'function'" class="define-metadata blip-media-link-metadata" @click="editMetadata(fullDocument)">
          {{ metadataButtonText }}
        </button>
      </form>
    </div>
  </div>
</template>

<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
<script>

import { default as base } from '../../mixins/baseComponent.js'
import { isAuthenticatedMediaLink, tryCreateLocalMediaUri } from '../../utils/media.js'
import mime from 'mime-types'

export default {
  mixins: [base],
  props: {
    videoUriMsg: {
      type: String,
      default: 'Video Uri'
    },
    asyncFetchMedia: {
      type: Function
    },
    simplified: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      videoUri: undefined,
      isPlaying: undefined,
      isFullScreen: undefined,
      video: undefined,
      currentTime: undefined,
      totalTime: undefined,
      progress: undefined,
      videoPlayerControls: undefined,
      volumeProgress: undefined,
      volumeSliderWrapper: undefined,
      videoPlayerWrapper: undefined,
      inactivityTimeout: undefined,
      animation: undefined,
      text: undefined,
      isLoading: undefined
    }
  },
  mounted: function() {
    if (!this.simplified) {
      this.initVideo()
    } else {
      this.initSimplifiedVideo()
    }
    document.addEventListener('fullscreenchange', this.fullScreenChange)
    document.addEventListener('webkitfullscreenchange', this.fullScreenChange)
    document.addEventListener('mozfullscreenchange', this.fullScreenChange)
    document.addEventListener('MSFullscreenChange', this.fullScreenChange)
  },
  destroyed: function() {
    document.removeEventListener('fullscreenchange', this.fullScreenChange)
    document.removeEventListener(
      'webkitfullscreenchange',
      this.fullScreenChange
    )
    document.removeEventListener('mozfullscreenchange', this.fullScreenChange)
    document.removeEventListener('MSFullscreenChange', this.fullScreenChange)
    this.video.removeEventListener('timeupdate', this.videoTimeUpdated)
    this.video.removeEventListener('loadedmetadata', this.videoLoaded)
    this.video.removeEventListener('seeking', this.readyToPlay)
    this.video.removeEventListener('waiting', this.readyToPlay)
    this.video.removeEventListener('seeked', this.readyToPlay)
    this.video.removeEventListener('canplay', this.readyToPlay)
    this.video.removeEventListener('ended', this.resetPlay)
    this.asyncFetchMedia && URL.revokeObjectURL(this.videoUri)
  },
  methods: {
    init: function() {
      this.videoUri = undefined
      this.text = this.document.text
      this.isPlaying = false
      this.isFullScreen = false
      this.video = undefined
      this.currentTime = 0
      this.totalTime = 0
      this.progress = undefined
      this.videoPlayerControls = undefined
      this.volumeProgress = undefined
      this.volumeSliderWrapper = undefined
      this.videoPlayerWrapper = undefined
      this.inactivityTimeout = undefined
      this.animation = undefined
    },
    initVideo: async function() {
      this.isLoading = true
      this.videoUri = isAuthenticatedMediaLink(this.document)
        ? await tryCreateLocalMediaUri(this.document, this.asyncFetchMedia)
        : this.document.uri

      if (!this.video) {
        this.video = this.$el.querySelector('#blipVideo')
      }
      if (!this.progress) {
        this.progress = this.$el.querySelector('#videoProgress')
      }
      if (!this.videoPlayerControls) {
        this.videoPlayerControls = this.$el.querySelector(
          '#videoPlayerControls'
        )
      }
      if (!this.volumeProgress) {
        this.volumeProgress = this.$el.querySelector('#volumeProgress')
      }
      if (!this.volumeSliderWrapper) {
        this.volumeSliderWrapper = this.$el.querySelector(
          '#volumeSliderWrapper'
        )
      }
      if (!this.videoPlayerWrapper) {
        this.videoPlayerWrapper = this.$el.querySelector(
          '#blipVideoPlayerWrapper'
        )
      }
      if (!this.animation) {
        this.animation = this.$el.querySelector('#animation')
      }

      this.volumeProgress.style.width = this.video.volume * 100 + '%'

      this.video.addEventListener('timeupdate', this.videoTimeUpdated)
      this.video.addEventListener('loadedmetadata', this.videoLoaded)
      this.video.addEventListener('seeking', this.readyToPlay)
      this.video.addEventListener('waiting', this.readyToPlay)
      this.video.addEventListener('seeked', this.readyToPlay)
      this.video.addEventListener('canplay', this.readyToPlay)
      this.video.addEventListener('ended', this.resetPlay)

      this.video.src = this.videoUri

      this.video.load()
    },
    initSimplifiedVideo: async function() {
      this.loading = true

      this.videoUri = isAuthenticatedMediaLink(this.document)
        ? await tryCreateLocalMediaUri(this.document, this.asyncFetchMedia)
        : this.document.uri

      if (!this.video) {
        this.video = this.$el.querySelector('#simplifiedVideo')
      }

      this.video.addEventListener('seeked', this.readyToPlay)
      this.video.addEventListener('canplay', this.readyToPlay)
      this.video.addEventListener('loadedmetadata', this.videoLoaded)

      this.video.src = this.videoUri

      this.video.load()
    },
    toggleEdit: function() {
      this.isEditing = !this.isEditing
      this.isPlaying = false
      this.video.pause()
      this.video.src = ''
      this.video.load()
    },
    videoSave: function() {
      this.$validator.validateAll().then((result) => {
        if (!result) return
        this.video = null
        this.progress = null
        this.videoPlayerControls = null
        this.volumeProgress = null
        this.volumeSliderWrapper = null
        this.videoPlayerWrapper = null
        this.animation = null
        this.save({
          ...this.document,
          text: this.text,
          uri: this.videoUri,
          type: mime.lookup(this.videoUri)
            ? mime.lookup(this.videoUri)
            : 'video/mp4'
        })
      })
    },
    togglePlay: function() {
      if (this.isPlaying) {
        this.video.pause()
      } else {
        this.video.play()
      }

      this.isPlaying = !this.isPlaying
    },
    resetPlay: function() {
      if (this.isPlaying && (this.video.currentTime = this.totalTime)) {
        this.isPlaying = false
        this.video.pause()
        this.video.currentTime = 0
      }
    },
    readyToPlay: function(event) {
      if (event.type === 'seeked' || event.type === 'canplay') {
        this.loading = false
        if (this.simplified && this.video) {
          return
        }
        this.animation.classList.add('hide')
      } else {
        this.animation.classList.remove('hide')
      }
    },
    videoTimeUpdated: function() {
      var current = this.video.currentTime
      var percent = current / this.totalTime * 100
      this.progress.style.width = percent + '%'

      this.currentTime = this.video.currentTime
    },
    videoLoaded: function() {
      this.totalTime = this.video.duration
    },
    setVideoPosition: function(event) {
      // srcElement is no supported in FF, but needed if working with IE6-8
      this.video.currentTime = (event.target || event.srcElement).value
    },
    setVolume: function(event) {
      // srcElement is no supported in FF, but needed if working with IE6-8
      this.video.volume = (event.target || event.srcElement).value / 100

      var percent = this.video.volume * 100
      this.volumeProgress.style.width = percent + '%'
    },
    toggleVolumeControl: function() {
      if (this.volumeSliderWrapper.classList.contains('hide')) {
        this.volumeSliderWrapper.classList.remove('hide')
      } else {
        this.volumeSliderWrapper.classList.add('hide')
      }
    },
    toggleFullScreen: function() {
      if (
        document.fullScreen ||
        document.mozFullScreen ||
        document.webkitIsFullScreen
      ) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (this.videoPlayerWrapper.requestFullscreen) {
          this.videoPlayerWrapper.requestFullscreen()
        } else if (this.videoPlayerWrapper.msRequestFullscreen) {
          this.videoPlayerWrapper.msRequestFullscreen()
        } else if (this.videoPlayerWrapper.mozRequestFullScreen) {
          this.videoPlayerWrapper.mozRequestFullScreen()
        } else if (this.videoPlayerWrapper.webkitRequestFullscreen) {
          this.videoPlayerWrapper.webkitRequestFullscreen(this)
        }
      }
    },
    fullScreenChange: function() {
      this.isFullScreen =
        document.fullScreen ||
        document.mozFullScreen ||
        document.webkitIsFullScreen
      if (this.isFullScreen) {
        this.videoPlayerWrapper.classList.add('video-full-screen')
        this.videoPlayerWrapper.addEventListener(
          'mousemove',
          this.showPlayerControls
        )
        this.showPlayerControls()
      } else {
        this.videoPlayerWrapper.removeEventListener(
          'mousemove',
          this.showPlayerControls
        )
        clearTimeout(this.inactivityTimeout)
        this.videoPlayerControls.classList.remove('hide-player')
        this.videoPlayerWrapper.classList.remove('video-full-screen')
      }
    },
    showPlayerControls: function() {
      clearTimeout(this.inactivityTimeout)
      this.videoPlayerControls.classList.remove('hide-player')
      this.inactivityTimeout = setTimeout(() => {
        this.videoPlayerControls.classList.add('hide-player')
        this.volumeSliderWrapper.classList.add('hide')
      }, 3000)
    },
    getTimeFromSeconds: function(seconds) {
      var timeMin = Math.floor(seconds / 60)
      var timeSec = Math.floor(seconds % 60)
      return (
        (timeMin < 10 ? '0' + timeMin : timeMin) +
        ':' +
        (timeSec < 10 ? '0' + timeSec : timeSec)
      )
    }
  }
}
</script>


<style lang="scss">
@import '../../styles/variables.scss';
@import '../../styles/loading.scss';

#simplifiedVideo {
  background-color: $color-surface-1;
  object-fit: fill;
  border-radius: 0 !important;
}

.video-preview-container {
  background-color: $color-surface-1;
  width: 56px;
  height: 56px;
  align-items: center;
}

.preview-loading {
  padding-left: 20px;
  padding-top: 20px;
}

#blipVideo {
  max-height: 300px;
}

.media-link.video {
  .bubble {
    max-width: $bubble-width;
    padding: 0;
    .video-player-wrapper .video-player-controls {
      padding: $bubble-padding;
    }
  }
}

.media-link.video,
.calls-card {
  .left, .middle {
    .slider {
      background-color: $color-surface-3;
    }
    .progress .pin {
      background-color: $color-content-default;
    }
    .video-player-button {
      fill: $color-content-default;
    }

    .video-player-time{
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
    .video-player-button {
      fill: $color-surface-1;
    }
    .video-player-time{
      color: $color-surface-1;
    }
  }

  .form {
    form {
      width: auto;
    }
    .form-group .form-control.text {
      margin-top: 10px;
    }
  }

  .notification {
    color: $color-content-disable;
  }

  .video-player-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    flex-direction: column;

    .sk-circle-wrapper {
      position: absolute;
      left: 50%;
      padding: 5px;
      border-radius: 100%;
      margin-left: -25px;

      .sk-circle {
        position: relative;
        color: white;
      }
    }

    .video-player {
      height: 100%;
      width: 100%;
      display: flex;
      align-self: top;
      align-items: center;
      justify-content: center;
      border-radius: 13px 13px 13px 2px !important;
    }

    video {
      height: 100%;
      width: 100%;
    }

    .video-player-controls {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-top: 5px;
    }

    .volume-control {
      height: 100%;
      position: relative;
    }

    .volume-slider-wrapper {
      background-color: $vue-black-transparent;
      padding: 15px;
      bottom: 90px;
      left: -40px;
      position: absolute;
      border-radius: 10px;
      -ms-transform: rotate(90deg); /* IE 9 */
      -webkit-transform: rotate(90deg); /* Chrome, Safari, Opera */
      transform: rotate(-90deg);
      transition: all 0.15s linear;
    }
    .volume-slider {
      width: 100px;
      position: relative;
      margin: 0;
    }

    .hide {
      opacity: 0;
      visibility: hidden;
    }

    .video-player-volume {
      position: absolute;
      width: 100%;
      bottom: -11px;
      opacity: 0;
      cursor: pointer;
    }

    video::-webkit-media-controls-enclosure {
      display: none;
    }

    .video-player-button {
      flex-grow: 0;
    }

    .player-button {
      cursor: pointer;
    }
    .player-button-left {
      margin-right: 15px;
      width: 14px;
    }

    .player-button-right {
      margin-left: 15px;
    }

    .video-player-bar {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      margin-top: 10px;
    }

    .video-player-time {
      display: flex;
      justify-content: space-between;
      font-family: 'Nunito Sans', sans-serif;
      font-size: x-small;
      line-height: 10px;
    }

    .video-player-range {
      position: relative;
      bottom: 10px;
      opacity: 0;
      margin: 0 0 -9px 0;
      width: 100%;
      padding: 0;
      height: 16px;
      cursor: pointer;
    }

    .slider {
      border-radius: 1.5px;
      height: 3px;
      flex-grow: 1;
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

    .video-description {
      text-align: left;
      padding: 0.5rem 1rem;
    }
  }

  .video-full-screen {
    background-color: $vue-black;
    display: flex;
    width: 100%;
    height: 100%;

    #blipVideo {
      max-height: 100%;
      border-radius: 0 !important;
    }

    .video-player-controls.hide-player {
      bottom: -50px;
      visibility: hidden;
      opacity: 0;
    }

    .video-player-controls {
      background-color: $vue-black-transparent;
      margin: 0;
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 0;
      transition: all 0.5s linear;
      .player-button {
        fill: $vue-london !important;
      }
      .video-player-time {
        color: $vue-london !important;
      }
      .pin {
        background-color: $vue-light-blip !important;
      }
    }
  }

  .blip-media-link-metadata {
    margin-top: -20px;
    padding: 0 10px 10px 0;
  }
}
</style>
