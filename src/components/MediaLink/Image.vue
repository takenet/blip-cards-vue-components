<template>
  <div class="header">
    <div :class="'ratio' + aspectRatio">
      <a :href="document.uri" target="_blank">
        <img :src="previewUri" />
      </a>
    </div>

    <div class="title" v-if="document.title || document.text">
        <strong v-if="document.title" v-html="document.title"></strong>
        <span v-if="document.text" v-html="document.text"></span>
    </div>
  </div>
</template>

<script>

import { default as base } from '../../mixins/baseComponent.js'

export default {
  mixins: [
    base
  ],
  computed: {
    aspectRatio: function () {
      return this.document.aspectRatio ? this.document.aspectRatio.replace(':', '-') : '1-1'
    },
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
        min-width: 300px;

        img {
          width: 100%;
          display: block;
        }
      }
   }
</style>
