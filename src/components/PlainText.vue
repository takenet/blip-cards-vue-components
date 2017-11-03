<template>
  <div v-if="previewDocument.content != null && previewDocument.content.length > 0" class="container plain-text">
    <div :class="'bubble ' + position">
      <div v-if="!previewDocument.hasPreview" v-html="previewDocument.content">
      </div>
      <div v-else >
        <div v-show="!previewDocument.showContent" v-html="previewDocument.previewContent">
        </div>
        <transition name="slide-fade">
          <div v-show="previewDocument.showContent" v-html="previewDocument.content">
          </div>
        </transition>
        <a style="display: block;" v-show="!previewDocument.showContent" v-on:click="showContent(previewDocument)">Ver mais</a>
      </div>
    </div>

    <div :class="'notification ' + position" v-if="date">
      {{ date }}
    </div>
  </div>
</template>

<script>

import { linkify } from '../utils'

export default {
  props: {
    length: {
      type: Number,
      default: 532
    },
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
  data: function () {
    return {
      previewDocument: {
        ...this.document,
        hasPreview: this.document.content.length > this.length,
        previewContent: linkify(this.document.content.substring(0, this.length)),
        content: linkify(this.document.content),
        showContent: false
      }
    }
  },
  methods: {
    showContent: function (document) {
      document.showContent = true
    }
  }
}
</script>


<style lang="scss">
   @import '../styles/common.scss';
   @import '../styles/variables.scss';

   .plain-text .bubble {
     padding: $bubble-padding
   }
</style>
