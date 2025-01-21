<template>
  <bds-grid direction="row" justifyContent="space-between" gap="2" class="container-reply-item">
    <bds-grid direction="row" gap="1" align-items="center" padding="1">
      <bds-grid direction="column" gap="1">
        <bds-typo variant="fs-14" bold="bold" :margin="false" v-if="replyingToText" class="typo text-replying">{{replyingToText}}</bds-typo>
        <bds-grid direction="row" gap="1" >
          <bds-grid>
            <bds-icon theme="outline" name="file-empty-file" size="medium" class="typo" />
          </bds-grid>
          <bds-grid direction="column" >
            <bds-typo tag="span" variant="fs-14" bold="regular" class="typo">{{ this.inReplyTo.value.title || translations.document }}</bds-typo>
            <bds-typo tag="span" variant="fs-14" bold="regular" class="typo multiline-text-overflow-ellipsis"
              v-if="this.inReplyTo.value && this.inReplyTo.value.text">{{ this.inReplyTo.value.text }}</bds-typo>
          </bds-grid>
        </bds-grid>
      </bds-grid>
    </bds-grid>
    
    <bds-grid margin="x-1">
      <img class="image-replied" :src="mimeType | fileIconFilter" />
    </bds-grid>
  </bds-grid>
</template>

<script>
import mime from 'mime-types'

export default {
  name: 'in-reply-to-document',
  props: {
    inReplyTo: {
      type: Object,
      default: () => ({})
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
  computed: {
    mimeType() {
      return mime.extension(this.inReplyTo.value.type) ? this.inReplyTo.value.type : mime.lookup(this.inReplyTo.value.uri)
    }
  }
}
</script>

<style scoped>
.image-replied {
  min-height: 40px;
  max-width: 40px;
  width: 40px;
}
</style>
