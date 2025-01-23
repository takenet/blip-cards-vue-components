<template>
  <div class="sticker-replied-container"> 
    <bds-grid direction="row" justifyContent="space-between" gap="2" class="container-reply-item">
      <bds-grid direction="row" gap="1" align-items="center">
        <bds-grid direction="column" gap="1">
          <bds-typo variant="fs-14" bold="bold" :margin="false" v-if="replyingToText" class="typo text-replying">{{replyingToText}}</bds-typo>
          <bds-grid direction="row" gap="1" >
              <img class='sticker-replied' :src="uriImage" />
          </bds-grid>
        </bds-grid>
      </bds-grid>
    </bds-grid>
  </div>
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

<style lang="scss"  scoped>
@import '../../../styles/variables.scss';

.sticker-replied-container {
  padding: 0.5rem;
}
.sticker-replied {
  max-height: 80px;
  border-radius: $soft-round ;
}
</style>
