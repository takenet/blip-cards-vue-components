<template>
    <bds-grid container direction="row" gap="8" justifyContent="space-between" align-items="center">
      <bds-grid container direction="row" gap="2" justifyContent="space-between" align-items="flex-end">
        <bds-icon theme="outline" name="file-empty-file" size="large" />
        <bds-typo>
            {{ this.inReplyTo.value.title }}
        </bds-typo>
      </bds-grid>

    

      <div 
      class="image-replied"
        :style="'background-image: url(&quot;' + inReplyTo.value.previewUri + '&quot;)'"
      ></div>
    </bds-grid>
</template>
  
<script>
  export default {
    name: 'in-reply-to-document',
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