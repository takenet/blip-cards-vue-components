<template>
  <bds-grid direction="row" justifyContent="space-between">
    <bds-grid direction="row" justifyContent="space-between" align-items="center" padding="y-2">
      <bds-grid margin="x-1" align-items="flex-start" style="height: 100%;">
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
import BlipFile from '../../../components/MediaLink/BlipFile.vue'
import mime from 'mime-types'

export default {
  name: 'in-reply-to-document',
  props: {
    inReplyTo: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    BlipFile
  },
  computed: {
    mimeType() {
      let extension = mime.extension(this.inReplyTo.value.type)
      if (extension) {
        return this.inReplyTo.value.type
      }
      return mime.lookup(this.inReplyTo.value.uri)
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

.multiline-text-overflow-ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
