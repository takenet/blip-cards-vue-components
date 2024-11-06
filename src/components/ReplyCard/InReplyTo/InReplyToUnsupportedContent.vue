<template>
  <bds-grid direction="column" padding="1" gap="1">
    <bds-typo variant="fs-14" bold="bold" :margin="false" class="typo text-replying">{{replyingToText}}</bds-typo>
    <bds-grid direction="row" align-items="center" gap="1" class="container-reply-item">
      <bds-grid>
        <bds-icon name="warning" theme="outline" size="medium" class="typo" />
      </bds-grid>
      <bds-grid>
        <bds-typo variant="fs-14" bold="regular" class="typo">{{ translations.unsupportedContent }}</bds-typo>
      </bds-grid>
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
    },
    replyingToText: {
      type: String,
      default: null
    }
  }
}
</script>
