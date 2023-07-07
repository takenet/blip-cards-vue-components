<template>
  <div>
    <bds-typo tag="span" variant="fs-16" margin="false">{{ video.uri }}</bds-typo>
  </div>
</template>
  
<script>
  export default {
    name: 'replied-with-video',
    mixins: [],
    props: {
      video: {
        type: Object,
        default: () => ({})
      },
      videoUriMsg: String,
      translations: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      repliedText() {
        return 'this.text'
      }
    }
  }
</script>
  