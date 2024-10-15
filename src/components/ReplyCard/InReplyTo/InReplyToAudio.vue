<template>
  <bds-grid direction="row" padding="y-2" margin="x-1" align-items="center" gap="1">
    <bds-grid>
      <bds-icon name="audio" theme="outline" size="medium" class="typo" />
    </bds-grid>
    <bds-grid>
      <bds-typo variant="fs-14" bold="regular" class="typo">{{ timeAudio || translations.labelAudio }}</bds-typo>
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
    },
    translations: {
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
