<template>
  <bds-grid direction="row" padding="y-2" margin="x-1" align-items="center" gap="1">
    <bds-grid>
      <bds-icon name="warning" theme="outline" size="medium"></bds-icon>
    </bds-grid>
    <bds-grid>
      <bds-typo variant="fs-14" bold="regular">{{ translations.unsupportedContent }}</bds-typo>
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
