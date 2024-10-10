<template>
  <bds-grid container direction="row" gap="8" justifyContent="space-between">
    <bds-grid container direction="row" gap="1" align-items="center" class="container-audio" padding="1">
      <bds-icon theme="outline" name="audio" size="large" />
      <bds-typo style="margin-top: -20px;">
        {{ this.timeAudio }}
      </bds-typo>
    </bds-grid>
    <audio id="audio" :src="inReplyTo.value.uri" preload="metadata"></audio>
  </bds-grid>
</template>

<script>
export default {
  name: 'in-reply-to-audio',
  mixins: [],
  props: {
    inReplyTo: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    timeAudio: null
  }),
  mounted() {
    const audioElement = this.$el.querySelector('#audio')

    audioElement.onloadedmetadata = () => {
      const duration = audioElement.duration
      const minutes = Math.floor(duration / 60)
      const seconds = Math.floor(duration % 60)

      this.timeAudio = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }
  }
}
</script>
