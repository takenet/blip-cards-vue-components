<template>
  <div v-if="previewDocument.content != null && previewDocument.content.length > 0">
    <div :class="'bubble plain-text ' + position" style="max-width: 90%">
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
  </div>
</template>

<script>
function linkify (inputText) {
  // http://, https://, ftp://
  var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#/%?=~_|!:,.;]*[a-z0-9-+&@#/%=~_|]/gim

  // www. sans http:// or https://
  var pseudoUrlPattern = /(^|[^/])(www\.[\S]+(\b|$))/gim

  // Email addresses
  var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim

  return inputText
      .replace(urlPattern, '<a href="$&" target="_blank">$&</a>')
      .replace(pseudoUrlPattern, '$1<a href="http://$2" target="_blank">$2</a>')
      .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>')
}

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

   .plain-text a {
     cursor: pointer;
     text-decoration: underline;
   }

  .plain-text.left a {
    color: $vue-blue;
  }

  .plain-text.left a:visited {color: $vue-blue;}  /* visited link */
  .plain-text.left a:hover {color: $vue-blue;}  /* mouse over link */
  .plain-text.left a:active {color: $vue-blue;}  /* selected link */

  .plain-text.right a {
    font-weight: bold;
    color: $vue-white;
  }

  .plain-text.right a:visited {color: $vue-white;}  /* visited link */
  .plain-text.right a:hover {color: $vue-white;}  /* mouse over link */
  .plain-text.right a:active {color: $vue-white;}  /* selected link */

</style>