<template>
  <bds-grid direction="row" padding="y-2" margin="x-1" align-items="center" gap="1">
    <bds-grid>
      <bds-icon name="warning" theme="outline" size="medium" class="typo" />
    </bds-grid>
    <bds-grid>
      <bds-typo variant="fs-14" bold="regular" class="typo">{{ translations.unsupportedContent }}</bds-typo>
    </bds-grid>
  </bds-grid>
</template>

<script>
export default {
  name: 'in-reply-to-unsupported-content',
  props: {
    inReplyTo: {
      type: Object,
      default: () => ({})
    },
    translations: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
