<template>
  <div class="header">
    <a :href="document.uri" target="_blank">
      <img :src="previewUri" />
    </a>
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
      return this.document.previewUri ? this.document.previewUri : this.document.uri
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
        max-width: 300px;

        img {
          width: 100%;
          display: block;
        }
      }
   }
</style>
