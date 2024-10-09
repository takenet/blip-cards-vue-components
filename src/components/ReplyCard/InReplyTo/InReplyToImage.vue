<template>
  <bds-grid container direction="row" gap="3" justifyContent="space-between" align-items="center" >
    <bds-grid container direction="row" gap="1" justifyContent="space-between" align-items="flex-start" class="container-video">
      <bds-icon theme="outline" name="file-image" size="large" />        
      <bds-grid direction="column" style="margin-top: -23px;">
        <bds-typo margin="false">
          {{ this.inReplyTo.value.title }}      
        </bds-typo>
        <bds-typo margin="false" class="text-in-reply" v-if="this.inReplyTo.value.text">
          {{ this.inReplyTo.value.text }}  
        </bds-typo>
      </bds-grid>
    </bds-grid>
    <img class="image-replied" :src="inReplyTo.value.uri"/>
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
  max-width: 150px;
}

.text-in-reply {
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 30px;
  width: 100%;
}
</style>
