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
  max-height: 80px;
}
</style>
