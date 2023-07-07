<template>
  <div>
    <replied-with-video
      v-if="replied.type.indexOf('video') != -1"
      :video="replied"
      :video-uri-msg="translations.videoUri"
    />
    <replied-with-document 
      v-else
      :document="replied"
      :on-media-selected="onMediaSelected"
    />
  </div>
</template>
  
<script>
  export default {
    name: 'replied-with-media-link',
    mixins: [],
    props: {
      replied: {
        type: Object,
        default: {}
      },
      onMediaSelected: {
        type: Function
      },
      translations: {
        type: Object,
        default: () => ({})
      }
    }
  }
</script>
  