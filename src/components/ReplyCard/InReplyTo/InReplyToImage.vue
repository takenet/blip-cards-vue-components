<template>
  <bds-grid direction="row" justifyContent="space-between" gap="2">
    <bds-grid direction="row"  gap="1"  align-items="center">
      <bds-grid direction="row" padding="1" gap="1" >
        <bds-grid>
          <bds-icon theme="outline" name="file-image" size="medium" class="typo" />
        </bds-grid>
        <bds-grid direction="column" >
          <bds-typo tag="span" variant="fs-14" bold="regular" class="typo">{{ this.inReplyTo.value.title }}</bds-typo>
          <bds-typo tag="span" variant="fs-14" bold="regular" class="typo multiline-text-overflow-ellipsis"
            v-if="this.inReplyTo.value.text">{{ this.inReplyTo.value.text }}</bds-typo>
        </bds-grid>
      </bds-grid>
    </bds-grid>
    
    <bds-grid>
      <img class="image-replied" :src="uriImage" />
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
    }
  },
  data: () => ({
    uriImage: undefined
  }),
  mounted: async function() {
    const me = this
    const document = me.inReplyTo.value

    if (isAuthenticatedMediaLink(document)) {
      let url = await tryCreateLocalMediaUri(me.inReplyTo.value, me.asyncFetchMedia)
      me.initImage(url)
    } else {
      me.initImage(me.inReplyTo.value.uri)
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
  max-height: 80px;
}
</style>
