<template>
  <div v-if="!isEditing">
    <div v-if="previewDocument.content != null && previewDocument.content.length > 0" class="blip-container plain-text">
      <div :class="'bubble ' + position">
        <div v-if="editable" class="editIco trashIco" @click="trash(document)">
          <img :src="trashSvg" />
        </div>
        <div v-if="editable" class="editIco" @click="toggleEdit">
          <img :src="editSvg" />
        </div>

        <div v-if="!previewDocument.hasPreview" v-html="previewDocument.content">
        </div>
        <div v-else >
          <div v-show="!showContent" v-html="previewDocument.previewContent">
          </div>
          <transition name="slide-fade">
            <div v-show="showContent" v-html="previewDocument.content">
            </div>
          </transition>
          <a style="display: block;" v-show="!showContent" v-on:click="showContent = true">Ver mais</a>
        </div>
      </div>

      <div :class="'notification ' + position" v-if="date">
        {{ date }}
      </div>
    </div>
  </div>

  <div class="blip-container" v-else>
  <div :class="'bubble ' + position">
      <form novalidate v-on:submit.prevent>
        <div class="saveIco closeIco" @click="cancel()" >
          <img :src="closeSvg" />
        </div>
        <div class="saveIco" @click="saveText()" :class="{'is-disabled': errors.any() }">
          <img :src="approveSvg" />
        </div>
        <div class="form-group">
          <textarea name="text" class="form-control" v-validate="'required'" :class="{'input-error': errors.has('text') }" v-model="text"></textarea>
          <span v-show="errors.has('text')" class="help input-error">{{ errors.first('text') }}</span>
        </div>
      </form>
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
        hasPreview: this.document.length > this.length,
        previewContent: linkify(this.document.substring(0, this.length - 3) + '...'),
        content: linkify(this.document)
      }
    }
  },
  data: function () {
    return {
      text: this.document,
      showContent: false
    }
  },
  methods: {
    saveText: function () {
      this.showContent = false
      this.save(this.text)
    },
    cancel: function () {
      this.text = this.document
      this.showContent = false
      this.isEditing = false
    }
  }
}
</script>


<style lang="scss">
   @import '../styles/variables.scss';

    .plain-text .bubble {
      padding: $bubble-padding;
      word-wrap: break-word;
      min-width: auto;
   }
</style>
