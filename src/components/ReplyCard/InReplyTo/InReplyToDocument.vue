<template>
  <bds-grid direction="row" justifyContent="space-between">
    <bds-grid direction="row" justifyContent="space-between" align-items="center" padding="y-2" margin="x-1" gap="1">
      <bds-grid align-items="flex-start" style="height: 100%;">
        <bds-icon theme="outline" name="file-empty-file" size="medium" class="typo" />
      </bds-grid>
      <bds-grid direction="column">
        <bds-typo tag="span" variant="fs-14" bold="regular" class="typo">{{ this.inReplyTo.value.title }}</bds-typo>
        <bds-typo tag="span" variant="fs-14" bold="regular" class="typo multiline-text-overflow-ellipsis"
          v-if="this.inReplyTo.value.text">{{ this.inReplyTo.value.text }}</bds-typo>
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
