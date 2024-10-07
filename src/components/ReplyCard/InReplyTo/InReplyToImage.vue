<template>
    <bds-grid container direction="row" gap="8" justifyContent="space-between" align-items="center">
      <bds-grid container direction="row" gap="2" justifyContent="space-between" align-items="flex-end">
        <bds-icon theme="outline" name="file-image" size="large" />
        <bds-typo>
            {{ this.inReplyTo.value.title }}
        </bds-typo>
      </bds-grid>

      <img class="image-replied":src="inReplyTo.value.uri"/>
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
    height: 80px;
  }
</style>