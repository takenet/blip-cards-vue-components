<template>
  <div>
    <bds-typo tag="span" variant="fs-16" margin="false">{{ repliedVideo.uri }}</bds-typo>
  </div>
</template>
  
<script>
  export default {
    name: 'replied-with-video',
    mixins: [],
    props: {
      repliedVideo: {
        type: Object,
        default: () => ({})
      },
      videoUriMsg: String,
      translations: {
        type: Object,
        default: () => ({})
      },
      asyncFetchMedia: {
        type: Function
      }
    },
    computed: {
      repliedText() {
        return 'this.text'
      }
    }
  }
</script>
  