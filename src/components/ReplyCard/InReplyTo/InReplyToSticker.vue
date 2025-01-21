<template>
  <bds-grid direction="row" justifyContent="space-between" gap="2" class="container-reply-item">
    <bds-grid>
      <img :class="replyValueHasText ? 'image-replied' : 'image-replied-simplified'" :src="uriImage" />
    </bds-grid>
  </bds-grid>
</template>

<script>
import { tryCreateLocalMediaUri, isAuthenticatedMediaLink } from '../../../utils/media.js'

export default {
  name: 'in-reply-to-sticker',
  mixins: [],
  props: {
    inReplyTo: {
      type: Object,
      default: () => ({})
    },
    asyncFetchMedia: {
      type: Function
    },
    replyingToText: {
      type: String,
      default: null
    },
    translations: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    uriImage: undefined
  }),
  computed: {
    replyValueHasText() {
      return this.inReplyTo.value && this.inReplyTo.value.text
    }
  },
  mounted: async function() {
    const document = this.inReplyTo.value

    if (isAuthenticatedMediaLink(document)) {
      let url = await tryCreateLocalMediaUri(this.inReplyTo.value, this.asyncFetchMedia)
      this.initImage(url)
    } else {
      this.initImage(this.inReplyTo.value.uri)
    }
  },
  methods: {
    initImage(uri) {
      this.uriImage = uri
    }
  }
}
</script>

<style scoped>
.image-replied { 
  max-height: 110px;
}

.image-replied-simplified {
  max-height: 80px;
}
</style>
