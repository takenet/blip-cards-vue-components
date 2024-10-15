<template>
  <bds-grid direction="row" justifyContent="space-between" gap="3">
    <bds-grid direction="row" justifyContent="space-between" align-items="center" padding="y-2">
      <bds-grid margin="x-1" align-items="center" style="height: 100%;" >
        <bds-icon theme="outline" name="file-image" size="medium" class="typo" />
      </bds-grid>
      <bds-grid direction="column" >
        <bds-typo tag="span" variant="fs-14" bold="regular" class="typo">{{ this.inReplyTo.value.title }}</bds-typo>
        <bds-typo tag="span" variant="fs-14" bold="regular" class="typo multiline-text-overflow-ellipsis"
          v-if="this.inReplyTo.value.text">{{ this.inReplyTo.value.text }}</bds-typo>
      </bds-grid>
    </bds-grid>
    <bds-grid>
      <img class="image-replied" :src="inReplyTo.value.uri" />
    </bds-grid>
  </bds-grid>
</template>

<script>
export default {
  name: 'in-reply-to-image',
  mixins: [],
  props: {
    inReplyTo: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped>
  .image-replied {
    max-height: 95px;
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
