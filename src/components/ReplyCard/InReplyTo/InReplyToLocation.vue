<template>
  <div class="container-location">
    <location
      class="blip-card"   
      :document="getDocument()"
      simplified
      :replying-to-text="replyingToText"
      :translations="translations"
    />
  </div>
</template>
  
<script>
  export default {
    name: 'in-reply-to-location',
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
    },
    methods: {
      getDocument() {
        const { latitude, longitude } = this.inReplyTo.value

        return {
          latitude,
          longitude,
          text: this.translations.location
        }
      }
    }
  }
</script>

<style scoped>
  .container-location {
    padding-left: 10px;
  }  
</style>