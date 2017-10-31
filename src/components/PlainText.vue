<template>
  <div>
    <div :class="'bubble plain-text ' + pos">
      <div v-if="!previewDocument.hasPreview">
        {{ previewDocument.content }}
      </div>
      <div v-else>
        <div v-show="!previewDocument.showContent">
          {{ previewDocument.previewContent }}
        </div>
        <transition name="slide-fade">
          <div v-show="previewDocument.showContent">
            {{ previewDocument.content }}
          </div>
        </transition>
        <a v-show="!previewDocument.showContent" v-on:click="showContent(previewDocument)">Ver mais</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    length: {
      type: Number,
      default: 10
    },
    document: {
      type: Object,
      required: true
    },
    pos: {
      type: String,
      default: 'left'
    }
  },
  data: function () {
    return {
      previewDocument: {
        ...this.document,
        previewContent: this.document.content.substring(0, this.length),
        hasPreview: this.document.content.length > this.length,
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

<style lang="scss" scoped>
   @import '../styles/common.scss';

   a {
     text-decoration: none;
     color: blue;
     display: block;
     color: #0CC8CC;
   }
</style>