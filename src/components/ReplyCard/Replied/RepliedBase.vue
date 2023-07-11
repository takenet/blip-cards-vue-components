<template>
  <div>
    <replied-with-text 
      v-if="replied.type === 'text/plain'"
      :text="repliedValue"
    />
    <replied-with-media-link
      v-if="replied.type === 'application/vnd.lime.media-link+json'"
      :replied="repliedValue"
      :on-media-selected="onMediaSelected"
      :video-uri-msg="translations.videoUri"
      :async-fetch-media="asyncFetchMedia"
    />

  </div>
</template>
  
<script>
  export default {
    name: 'replied-base',
    mixins: [],
    props: {
      replied: {
        type: Object,
        default: {}
      },
      onMediaSelected: {
        type: Function
      },
      asyncFetchMedia: {
        type: Function
      },
      translations: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      repliedValue() {
        return this.replied.value
      }
    }
  }
</script>
  