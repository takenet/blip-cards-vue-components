<template>
  <div v-if="!isEditing">
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
      <div class="editIco" @click="toggleEdit">
      </div>

      <div :class="'notification ' + position" v-if="date">
        {{ date }}
      </div>
    </div>
  </div>

  <div class="container plain-text" v-else>
    <div :class="'bubble ' + position">
      <textarea v-model="text"></textarea>
    </div>
    <div class="saveIco" @click="save(text)">
    </div>
  </div>
</template>

<script>

import { linkify } from '../utils'
import { default as base } from '../mixins/baseComponent.js'

export default {
  name: 'plain-text',
  mixins: [
    base
  ],
  props: {
    document: {
      type: String,
      required: true
    },
    length: {
      type: Number,
      default: 532
    }
  },
  computed: {
    previewDocument: function () {
      return {
        ...this.document,
        hasPreview: this.text.length > this.length,
        previewContent: linkify(this.text.substring(0, this.length - 3) + '...'),
        content: linkify(this.text),
        showContent: false
      }
    }
  },
  data: function () {
    return {
      text: this.document
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
   @import '../styles/variables.scss';

   .plain-text .bubble {
     padding: $bubble-padding
   }

   .plain-text {
      /* Make an input blend into its parent */
      textarea {
        /* Eliminate borders and padding */
        border: none;
        padding: 0;
        margin: 0;

        /* Inherit the parent element's typography */
        font: inherit;
        color: inherit;
        line-height: inherit;
        font-size: inherit;
        text-align: inherit;

        /* Seems to help alignment in headers */
        vertical-align: top;
      }

      /* Add interaction cues on hover and focus */
      textarea:hover,
      textarea:focus {

        /* A subtle transition never hurts */
        -webkit-transition: background-color 0.5s;
        -moz-transition: background-color 0.5s;
        -ie-transition: background-color 0.5s;
        transition: background-color 0.5s;
      }
   }
</style>
