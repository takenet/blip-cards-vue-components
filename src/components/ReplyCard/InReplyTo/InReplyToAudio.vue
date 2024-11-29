<template>
  <bds-grid direction="row" justifyContent="space-between" gap="2" class="container-reply-item">
    <bds-grid direction="row" gap="1" align-items="center">
      <bds-grid direction="column" padding="1" gap="1">
        <bds-typo variant="fs-14" bold="bold" :margin="false" v-if="replyingToText" class="typo text-replying">{{replyingToText}}</bds-typo>
        <bds-grid direction="row" gap="1" >
          <bds-grid>
            <bds-icon theme="outline" name="audio" size="medium" class="typo" />
          </bds-grid>
          <bds-grid direction="column" >
            <bds-typo variant="fs-14" bold="regular" class="typo">{{ timeAudio || translations.labelAudio  }}</bds-typo>
          </bds-grid>
        </bds-grid>
      </bds-grid>
    </bds-grid>
  </bds-grid>
</template>

<script>
import { tryCreateLocalMediaUri, isAuthenticatedMediaLink } from '../../../utils/media.js'

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
    },
    document: {
      type: Object
    },
    asyncFetchMedia: {
      type: Function
    },
    replyingToText: {
      type: String,
      default: null
    }
  },
  data: () => ({
    timeAudio: null,
    audio: undefined
  }),
  mounted: async function() {
    const { previewUri } = this.inReplyTo.value
    const document = Object.assign(this.inReplyTo.value, { uri: previewUri })
    const uri = isAuthenticatedMediaLink(document)
      ? await tryCreateLocalMediaUri(document, this.asyncFetchMedia)
      : document.uri

    this.initAudio(uri)
  },
  methods: {
    initAudio(uri) {
      this.audio = new Audio()

      this.audio.addEventListener('loadedmetadata', this.audioLoaded)

      this.audio.src = uri
      this.audio.load()
    },
    audioLoaded() {
      const duration = this.audio.duration
      const minutes = Math.floor(duration / 60)
      const seconds = Math.floor(duration % 60)

      this.timeAudio = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }
  }
}
</script>
