<template>
  <div>
    <replied-with-video
      v-if="replied.type.indexOf('video') != -1"
      :replied-video="replied"
      :video-uri-msg="translations.videoUri"
      :async-fetch-media="asyncFetchMedia"
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
      asyncFetchMedia: {
        type: Function
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
  