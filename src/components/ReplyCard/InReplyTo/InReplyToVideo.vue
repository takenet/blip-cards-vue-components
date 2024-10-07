<template>
    <bds-grid container direction="row" gap="8" justifyContent="space-between">
      <bds-grid container direction="row" gap="1" align-items="center" style="margin-top: 10px;">
        <bds-icon theme="outline" name="video" size="large" />
        <bds-typo style="margin-top: -25px;">
            {{ this.timeVideo }}
        </bds-typo>
      </bds-grid>
    
      <video
        :src="inReplyTo.value.uri"
        ref="video"
        @loadedmetadata="captureThumbnail"
        class="video-replied"
      />
    </bds-grid>    
</template>
  
<script>
  export default {
    name: 'in-reply-to-video',
    mixins: [],
    props: {
      inReplyTo: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        thumbnail: null,
        timeVideo: 'testando'
      }
    },
    methods: {
      captureThumbnail() {
        const video = this.$refs.video

        video.currentTime = 2
        this.timeVideo = this.formatDuration(video.duration)

        video.addEventListener('seeked', () => {
          this.canvasRendered = true
          this.$nextTick(() => {
            const canvas = this.$refs.canvas
            const context = canvas.getContext('2d')
            context.drawImage(video, 0, 0, 80, 80)
          })
        })
      },
      formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = Math.floor(seconds % 60)

        const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds

        return `${minutes}:${formattedSeconds}`
      }
    }
  }
</script>

<style scoped>
  .video-replied {
    width: 70px;
    height: 70px;
    border-radius: 0 !important;
    object-fit: cover;
  }
</style>