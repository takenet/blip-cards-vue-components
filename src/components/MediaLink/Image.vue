<template>
  <div class="header" :id="id" >
    <a :href="document.uri" target="_blank">
      <div :class="'ratio ratio' + aspectRatio" :style="'background-image: url(' + previewUri + ')'">
      </div>
    </a>

    <div class="title" v-if="document.title || document.text">
        <strong v-if="document.title" v-html="document.title"></strong>
        <span v-if="document.text" v-html="document.text"></span>
    </div>
  </div>
</template>

<script>

import { guid } from '../../utils'
import { default as base } from '../../mixins/baseComponent.js'

export default {
  mixins: [
    base
  ],
  data: function () {
    return {
      id: guid()
    }
  },
  computed: {
    aspectRatio: function () {
      return this.document.aspectRatio ? this.document.aspectRatio.replace(':', '-') : '1-1'
    },
    previewUri: function () {
      return this.document.previewUri ? this.document.previewUri : this.document.uri
    }
  },
  mounted: function () {
    let element = this.$el
    let container = element.parentNode.parentNode

    let width = parseInt(window.getComputedStyle(container).width.toString().replace('px', ''))

    if (width <= 400) {
      element.style.width = width + 'px'
    } else if (width < 700) {
      element.style.width = (width / 2) + 'px'
    } else {
      element.style.width = (width / 3) + 'px'
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
