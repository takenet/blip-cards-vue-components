<template>
  <bds-grid direction="row" justifyContent="space-between">
    <bds-grid container direction="row" justifyContent="space-between" align-items="flex-start" padding="y-2">
      <bds-grid>
        <bds-icon theme="outline" name="file-empty-file" size="medium" />
      </bds-grid>
      <bds-grid direction="column">
        <bds-typo margin="false" tag="span" variant="fs-14" bold="regular">{{ this.inReplyTo.value.title }}</bds-typo>
        <bds-typo margin="false" tag="span" variant="fs-14" bold="regular" class="multiline-text-overflow-ellipsis"
          v-if="this.inReplyTo.value.text">{{ this.inReplyTo.value.text }}</bds-typo>
      </bds-grid>
    </bds-grid>
    <bds-grid>
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
