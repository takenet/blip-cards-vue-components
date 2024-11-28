<template>
  <bds-grid direction="row" justifyContent="space-between" gap="2" class="container-reply-item">
    <bds-grid direction="row" gap="1" align-items="center">
      <bds-grid direction="column" padding="1" gap="1">
        <bds-typo variant="fs-14" bold="bold" :margin="false" v-if="replyingToText" class="typo text-replying">{{replyingToText}}</bds-typo>
        <bds-grid direction="row" gap="1" >
          <bds-grid>
            <bds-icon theme="outline" name="file-image" size="medium" class="typo" />
          </bds-grid>
          <bds-grid direction="column" >
            <bds-typo tag="span" variant="fs-14" bold="regular" class="typo">{{ this.inReplyTo.value.title || translations.image }}</bds-typo>
            <bds-typo tag="span" variant="fs-14" bold="regular" class="typo multiline-text-overflow-ellipsis"
              v-if="replyValueHasText">{{ this.inReplyTo.value.text }}</bds-typo>
          </bds-grid>
        </bds-grid>
      </bds-grid>
    </bds-grid>
    
    <bds-grid>
      <img :class="replyValueHasText ? 'image-replied' : 'image-replied-simplified'" :src="uriImage" />
    </bds-grid>
  </bds-grid>
</template>

<script>
import { tryCreateLocalMediaUri, isAuthenticatedMediaLink } from '../../../utils/media.js'

export default {
  name: 'in-reply-to-image',
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
    initImage: function(uri) {
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
