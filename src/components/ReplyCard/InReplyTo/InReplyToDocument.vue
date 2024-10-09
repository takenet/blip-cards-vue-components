<template>
    <bds-grid container direction="row" gap="8" justifyContent="space-between" align-items="center">
      <blip-file
        title-msg="titleMsg"
        document="replied"
        full-document="replied"
       
        simplified
      />    
    </bds-grid>
</template>
  
<script>
  import BlipFile from '../../../components/MediaLink/BlipFile.vue'
  
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
    methods: {
      created() {
        console.log(this.inReplyTo.value.previewUri)
      }
    }
  }
</script>

<style scoped>
  .image-replied {
    height: 80px;
  }
</style>