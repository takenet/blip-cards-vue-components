<template>
  <div v-if="!isEditing" class="container document-select">
    <div v-if="editable && !isEditing" class="editIco" @click="toggleEdit">
      <img :src="editSvg" />
    </div>
    <div :class="'bubble ' + position">
      <div class="header">
        <div :class="'ratio ratio' + aspectRatio" :style="'background-image: url(' + document.header.value.uri + ')'">
        </div>

        <div class="title" v-if="document.header.value.title || document.header.value.text">
            <strong v-if="document.header.value.title" v-html="document.header.value.title"></strong>
            <span v-if="previewContent && !showContent" v-html="previewContent"></span>
            <transition name="slide-fade">
              <div v-if="showContent && hasPreview" v-html="document.header.value.text">
              </div>
            </transition>
            <a style="display: block;" v-if="!showContent && hasPreview" @click="showContent = true">Ver mais</a>
        </div>
      </div>

      <div class="fixed-options" v-if="options">
        <ul>
          <li v-for="(item, index) in options" v-bind:key="index" @click="select(item)">
            <span v-if="!item.isLink" v-html="item.previewText"></span>
            <a v-if="item.isLink" :href="item.label.value.uri" target="_blank" v-html="item.previewText"></a>
          </li>
        </ul>
      </div>
    </div>

    <div :class="'notification ' + position" v-if="date">
      {{ date }}
    </div>
  </div>

  <div v-else class="container document-select">
    <form :class="'bubble ' + position" novalidate v-on:submit.prevent>
      <div class="saveIco" @click="documentSelectSave()" :class="{'is-disabled': errors.any() }">
        <img :src="approveSvg" />
      </div>
      <div class="header">
        <div :class="'ratio ratio' + aspectRatio" :style="'background-image: url(' + document.header.value.uri + ')'">
        </div>

        <div class="title" v-if="document.header.value.title || document.header.value.text">
          <div class="form-group">
            <input type="title" name="title" :class="{'input-error': errors.has('title') }" v-validate="'required'" class="form-control" v-model="title" />
            <span v-show="errors.has('title')" class="help input-error">{{ errors.first('title') }}</span>
          </div>
          <div class="form-group">
            <textarea type="text" name="text" :class="{'input-error': errors.has('text') }" v-validate="'required'" class="form-control" v-model="content" />
            <span v-show="errors.has('text')" class="help input-error">{{ errors.first('text') }}</span>
          </div>
        </div>
      </div>

      <div class="fixed-options" v-if="options">
        <ul>
          <li v-for="(item, index) in options" v-bind:key="index">
            <span @click="editOption(item)" v-html="item.previewText"></span>
            <span @click="deleteOption(item)">X</span>
          </li>
        </ul>
        <div @click="editOption()" class="add primary-color btn" style="margin-top: 10px;">
          <span>Add Button</span>
        </div>
      </div>
    </form>
    <div v-if="isAddingOption">
      <form novalidate v-on:submit.prevent>
        <div class="form-group">
          <input type="text" name="optionText" :class="{'input-error': errors.has('optionText') }"
          v-validate="'required'" class="form-control" v-model="selectedOption.previewText" placeholder="Text" />
          <span v-show="errors.has('optionText')" class="help input-error">{{ errors.first('optionText') }}</span>
        </div>
        <div class="form-group">
          <input type="text" name="type" v-validate="'mime'"  class="form-control" v-model="selectedOption.value.type" placeholder="Postback mime type" />
          <span v-show="errors.has('type')" class="help input-error">{{ errors.first('type') }}</span>
        </div>
        <div class="form-group">
          <textarea type="text" name="value" v-validate="'json'" class="form-control" v-model="selectedOption.value.value" placeholder="Postback value" />
          <span v-show="errors.has('value')" class="help input-error">{{ errors.first('value') }}</span>
        </div>
        <div class="form-group">
          <button @click="saveOption()">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

import { linkify } from '../utils'
import { default as base } from '../mixins/baseComponent.js'

export default {
  name: 'document-select',
  mixins: [
    base
  ],
  props: {
    length: {
      type: Number,
      default: 532
    },
    onSelected: {
      type: Function
    }
  },
  data: function () {
    return {
      showContent: false,
      title: this.document.header.value.title,
      content: this.document.header.value.text,
      isAddingOption: false,
      selectedOption: {}
    }
  },
  computed: {
    aspectRatio: function () {
      return this.document.header.value.aspectRatio ? this.document.header.value.aspectRatio.replace(':', '-') : '2-1'
    },
    previewTitle: function () {
      if (this.title && this.title.length > this.length) {
        return linkify(this.title.substring(0, this.length)) + '...'
      }
      return this.title ? linkify(this.title) : ''
    },
    previewContent: function () {
      if (this.content && this.content.length > this.length) {
        return linkify(this.content.substring(0, this.length)) + '...'
      }
      return this.content ? linkify(this.content) : ''
    },
    hasPreview: function () {
      return this.content && this.content.length > this.length
    },
    options: function () {
      if (!this.document.options) {
        return null
      }

      let getOptionContent = function (text) {
        if (text.length > 34) {
          return text.substring(0, 34) + '...'
        } else {
          return text
        }
      }

      return this.document.options.map(function (x) {
        let opts = {
          ...x,
          isLink: x.label.type === 'application/vnd.lime.web-link+json',
          previewText: x.label.type === 'application/vnd.lime.web-link+json' ? getOptionContent(x.label.value.title || x.label.value.text) : getOptionContent(x.label.value),
          value: x.value ? {type: x.value.type, value: JSON.stringify(x.value.value)} : {}
        }
        return opts
      })
    }
  },
  methods: {
    select: function (item) {
      if (item.isLink) {
        let win = window.open(item.label.value.uri, '_blank')
        win.focus()
        return
      }

      if (this.onSelected) {
        this.onSelected(item.previewText, {
          type: item.value.type,
          content: item.value.value
        })
      }
    },
    documentSelectSave: function () {
      this.selectedOption = {}
      this.isAddingOption = false
      var newDocument =
        {
          ...this.document,
          options: this.options.map(function (x) {
            return {
              label: { type: x.label.type, value: x.previewText },
              value: x.value && x.value.value ? { type: x.value.type, value: JSON.parse(x.value.value) } : null
            }
          })
        }
      newDocument.header.value.title = this.title
      newDocument.header.value.text = this.content
      this.save(newDocument)
    },
    editOption: function (item) {
      this.isAddingOption = true
      if (item) {
        this.selectedOption = item
      } else {
        this.selectedOption = { label: {}, value: {} }
      }
    },
    deleteOption: function (item) {
      let index = this.options.indexOf(item)
      this.document.options.splice(index, 1)
    },
    saveOption: function () {
      if (!this.options.includes(this.selectedOption) && this.selectedOption.previewText) {
        this.selectedOption.label.type = 'text/plain'
        this.options.push(this.selectedOption)
      }

      this.selectedOption = {}
      this.isAddingOption = false
    }
  }
}
</script>

<style lang="scss">
   @import '../styles/variables.scss';

   .container.document-select {
   }

  .document-select {

    .header {

      .title {
        margin: 0;
        padding: 10px 20px;
        border-bottom: 0.5px solid #e4e2e2;
      }
    }

    .fixed-options ul {
      margin: 0px;
    }

    .fixed-options li:first-child {
      border-top: 0px;
    }
  }

</style>
