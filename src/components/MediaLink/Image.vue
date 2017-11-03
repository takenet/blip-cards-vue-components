<template>
  <div class="header image">
    <img :src="previewUri" />
  </div>

</template>

<script>

export default {
  props: {
    document: {
      type: Object,
      required: true
    },
    position: {
      type: String,
      default: 'left'
    },
    date: {
      type: String
    }
  },
  computed: {
    previewUri: function () {
      return this.document.content.previewUri ? this.document.content.previewUri : this.document.content.uri
    }
  }
}
</script>


<style lang="scss">
   @import '../../styles/variables.scss';

   .media-link.image {

      .bubble {
        padding: 0;
      }

      .header {
        img {
          width: 100%;
          display: block;
        }
      }
   }
</style>
