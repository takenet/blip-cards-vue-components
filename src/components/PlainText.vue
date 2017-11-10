<template>
  <div v-if="!isEditing">
    <div v-if="previewDocument.content != null && previewDocument.content.length > 0" class="container plain-text">
      <div v-if="editable" class="editIco" @click="toggleEdit">
        <img :src="editSvg" />
      </div>

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
  </div>

  <div class="container plain-text" v-else>
    <div class="saveIco" @click="save(text)">
      <img :src="approveSvg" />
    </div>

    <div :class="'bubble ' + position">
      <editable class="editable" :content="text" @update="text = $event"></editable>
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
</style>
