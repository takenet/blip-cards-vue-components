<template>
  <bds-grid direction="row" justifyContent="space-between" gap="3">
    <bds-grid direction="row" justifyContent="space-between" align-items="center" gap="1" padding="y-2">
      <bds-grid margin="x-1" align-items="center" style="height: 100%;" >
        <bds-icon theme="outline" name="video" size="medium" class="typo" />
      </bds-grid>
      <bds-grid direction="column" >
        <bds-typo tag="span" variant="fs-14" bold="regular" class="typo">{{ timeVideo }}</bds-typo>
        <bds-typo tag="span" variant="fs-14" bold="regular" class="typo multiline-text-overflow-ellipsis"
          v-if="this.inReplyTo.value.text">{{ this.inReplyTo.value.text }}</bds-typo>
      </bds-grid>
    </bds-grid>
    <bds-grid>
      <video
        :src="inReplyTo.value.uri"
        ref="video"
        @loadedmetadata="captureThumbnail"
        class="video-replied"
      />
    </bds-grid>
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

  .video-replied {
    max-height: 95px;
  }

  .multiline-text-overflow-ellipsis {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
