<template>
  <div class="header">
    <a :href="document.uri" target="_blank">
      <img :src="previewUri" />
    </a>
  </div>

</template>

<script>

import { default as base } from '../../mixins/baseComponent.js'

export default {
  mixins: [
    base
  ],
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
