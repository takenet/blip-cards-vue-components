<template>
  <bds-grid container direction="row" gap="3" justifyContent="space-between" align-items="center" >
    <bds-grid container direction="row" gap="1" justifyContent="space-between" align-items="flex-start" class="container-video">
        <bds-icon theme="outline" name="video" size="large" />        

        <bds-grid direction="column"  style="margin-top: -23px;">
            <bds-typo margin="false">
            {{ timeVideo }}      
          </bds-typo>
          <bds-typo margin="false" class="text-video " v-if="this.inReplyTo.value.text">
            {{ this.inReplyTo.value.text }}  
          </bds-typo>
        </bds-grid>
    </bds-grid>

    <video
      :src="inReplyTo.value.uri"
      ref="video"
      @loadedmetadata="captureThumbnail"
      class="image-replied"
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
      timeVideo: null
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
.container-video {
  max-height: 150px;
}

.image-replied {
  max-width: 180px;
}

.text-video {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px; 
}
</style>
