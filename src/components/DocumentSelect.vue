<template>
  <div v-if="!isEditing" class="blip-container document-select">
    <div :class="'bubble ' + position">
      <div v-if="editable && !isEditing" class="editIco" @click="toggleEdit">
        <img :src="editSvg" />
      </div>
      <div class="header">
        <div :class="'ratio ratio' + aspect" :style="'background-image: url(' + previewUri + ')'">
        </div>

        <div class="title" v-if="document.header.value.title || document.header.value.text">
            <strong class="hide-overflow" v-if="document.header.value.title" v-html="document.header.value.title"></strong>
            <span class="hide-overflow" v-if="previewContent && !showContent" v-html="previewContent"></span>
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
            <span v-html="item.previewText"></span>
          </li>
        </ul>
      </div>
    </div>

    <div :class="'notification ' + position" v-if="date">
      {{ date }}
    </div>
  </div>

  <div v-else class="blip-container document-select">
    <form v-if="!showOptionDialog" class="editing bubble left" novalidate v-on:submit.prevent>
      <div class="saveIco" @click="documentSelectSave()" :class="{'is-disabled': errors.any() }">
        <img :src="approveSvg" />
      </div>
      <div class="saveIco closeIco" @click="documentSelectCancel()">
        <img :src="closeSvg" />
      </div>
      <div class="header">
        <div class="form-group">
          <input type="text" name="image" :class="{'input-error': errors.has('image') }" v-validate="'required|url'" class="form-control" v-model="previewUri" placeholder="Image Uri" />
          <span v-if="errors.has('image')" class="help input-error">{{ errors.first('image') }}</span>
          <div class="upload-intructions">
            <span>Supported formats: JPEG,JPG,PNG,GIF.</span>
          </div>
        </div>
        <div class="form-check">
          <div>
            <span>Aspect Ratio:</span>
          </div>
          <div class="form-check-wrapper">
            <span class="form-check-container">
              <input type="radio" name="aspect-selector" :id="_uid+'1-1'" class="form-check-input" v-model="aspect" value="1-1"/>
              <label class="form-check-label" :for="_uid+'1-1'"><span class="radio">1:1</span></label>
              <div class="check"></div>
            </span>
            <span class="form-check-container">
              <input type="radio" name="aspect-selector" :id="_uid+'2-1'" class="form-check-input" v-model="aspect" value="2-1"/>
              <label class="form-check-label" :for="_uid+'2-1'"><span class="radio">2:1</span></label>
              <div class="check"></div>
            </span>
          </div>
        </div>
        <div class="form-group">
          <input type="title" name="title" :class="{'input-error': errors.has('title') }" v-validate="'required'" class="form-control" v-model="title" />
          <span v-show="errors.has('title')" class="help input-error">{{ errors.first('title') }}</span>
          <textarea type="text" name="text" :class="{'input-error': errors.has('text') }" v-validate="'required'" class="form-control textarea" v-model="content" />
          <span v-show="errors.has('text')" class="help input-error">{{ errors.first('text') }}</span>
        </div>
      </div>

      <div class="fixed-options" v-if="options">
        <ul>
          <li v-for="(item, index) in options" v-bind:key="index">
            <span @click="editOption(item, index, $event)" v-html="item.previewText"></span>
            <span @click="deleteOption(index)">X</span>
          </li>
        </ul>
        <div @click="editOption({label: {}, value: {}}, -1, $event, true)" class="add-button">
          <span>Add Button</span>
        </div>
      </div>
    </form>
    <form v-else novalidate v-on:submit.prevent class="editing bubble left" style="min-width: 250px">

      <div class="tabs">
        <span :class="{ 'active': headerTab === 'plainText'}" @click="setTab('plainText')">Text</span>
        <span :class="{ 'active': headerTab === 'weblink'}" @click="setTab('weblink')">Link</span>
      </div>

      <div class="form-group" v-if="headerTab === 'weblink'">
        <input type="text" name="optionText" class="form-control" v-validate="'required'" v-model="selectedOption.label.value.text" placeholder="Text" />
        <span v-show="errors.has('optionText')" class="help input-error">{{ errors.first('optionText') }}</span>
      </div>
      <div class="form-group" v-if="headerTab === 'weblink'">
        <input type="text" name="weblinkUri" class="form-control" v-validate="'required|url'" v-model="selectedOption.label.value.uri" placeholder="Uri" />
        <span v-show="errors.has('weblinkUri')" class="help input-error">{{ errors.first('weblinkUri') }}</span>
      </div>
      <div class="form-group" v-if="headerTab === 'weblink'">
        <select v-model="selectedOption.label.value.target" class="form-control">
          <option disabled value="">Target</option>
          <option value='blank'>Blank</option>
          <option value='self'>Self</option>
          <option value='selfCompact'>SelfCompact</option>
          <option value='selfTall'>SelfTall</option>
        </select>
      </div>

      <div v-if="headerTab === 'plainText'">
        <div class="form-group">
          <input type="text" name="optionText" v-validate="'required'" class="form-control" v-model="selectedOption.label.value" placeholder="Text" />
          <span v-show="errors.has('optionText')" class="help input-error">{{ errors.first('optionText') }}</span>
        </div>

        <input id="showPayload" type="checkbox" v-model="showPayload"><label for="showPayload">Set Payload</label>
        <div class="line"></div>

        <div v-if="showPayload">
          <div class="form-group">
            <input type="text" name="type" v-validate="'required|mime'"  class="form-control" v-model="selectedOption.value.type" placeholder="Postback mime type" />
            <span v-show="errors.has('type')" class="help input-error">{{ errors.first('type') }}</span>
          </div>
          <div class="form-group">
            <textarea type="text" name="value" v-validate="'required|json'" class="form-control" v-model="selectedOption.value.value" placeholder="Postback value" />
            <span v-show="errors.has('value')" class="help input-error">{{ errors.first('value') }}</span>
          </div>
        </div>
      </div>

      <div class="form-group">
        <button @click="cancelOption()" class="btn btn-dashed delete-color w-49">Cancel</button>
        <button @click="saveOption()" class="btn btn-dashed primary-color w-49" :class="{'is-disabled': errors.any() }">Apply</button>
      </div>
    </form>
  </div>
</template>

<script>

import { linkify } from '../utils'
import _ from 'lodash'
import { default as base } from '../mixins/baseComponent.js'
import mime from 'mime-types'
const optionSize = 34

let getOptionContent = function (item) {
  let text = item.label.type === item.label.value.title || item.label.value.text || item.label.value.uri || item.label.value
  if (text.length > optionSize) {
    return text.substring(0, optionSize) + '...'
  } else {
    return text
  }
}

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
    },
    onOpenLink: {
      type: Function
    }

  },
  data: function () {
    return {
      showOptionDialog: false,
      headerTab: null,
      showPayload: false,
      showContent: false,
      title: this.document.header.value.title,
      content: this.document.header.value.text,
      aspect: this.document.header.value.aspectRatio ? this.document.header.value.aspectRatio.replace(':', '-') : '2-1',
      previewUri: this.document.header.value.uri,
      selectedOption: { label: {}, value: {} },
      options: this.document.options.map(function (x) {
        let opts = {
          ...x,
          isLink: x.label.type === 'application/vnd.lime.web-link+json',
          value: x.value ? {type: x.value.type, value: JSON.stringify(x.value.value)} : {}
        }
        opts.previewText = getOptionContent(opts)
        return opts
      })
    }
  },
  computed: {
    type: function () {
      return mime.lookup(this.previewUri)
    },
    previewContent: function () {
      if (this.content && this.content.length > this.length) {
        return linkify(this.content.substring(0, this.length)) + '...'
      }
      return this.content ? linkify(this.content) : ''
    },
    hasPreview: function () {
      return this.content && this.content.length > this.length
    }
  },
  methods: {
    setTab: function (name) {
      this.headerTab = name
      if (this.headerTab === 'weblink' && typeof this.selectedOption.label.value !== 'object') {
        this.selectedOption.label.value = { text: this.selectedOption.label.value, uri: this.selectedOption.LinkUri, target: this.selectedOption.LinkTarget }
      }
      if (this.headerTab === 'plainText' && typeof this.selectedOption.label.value !== 'string') {
        this.selectedOption.LinkUri = this.selectedOption.label.value.uri
        this.selectedOption.LinkTarget = this.selectedOption.label.value.target || ''
        this.selectedOption.label.value = this.selectedOption.label.value.text
      }
    },
    toggleShowPayload: function () {
      this.showPayload = !this.showPayload
    },
    select: function (item) {
      if (item.isLink) {
        if (item.label.value.target === 'blank' || item.label.value.target === '' || item.label.value.target === undefined) {
          let win = window.open(item.label.value.uri, '_blank')
          win.focus()
        } else if (this.onOpenLink) {
          this.onOpenLink(item.label.value.uri, item.label.value.target)
        }
        return
      }

      if (this.onSelected) {
        this.onSelected(item.label.value, {
          type: item.value.type || 'text/plain',
          content: item.value.value || item.label.value
        })
      }
    },
    documentSelectCancel: function () {
      this.selectedOption = {}
      this.title = this.document.header.value.title
      this.content = this.document.header.value.text
      this.aspect = this.document.header.value.aspectRatio ? this.document.header.value.aspectRatio.replace(':', '-') : '2-1'
      this.previewUri = this.document.header.value.uri
      this.options = this.document.options.map(function (x) {
        let opts = {
          ...x,
          isLink: x.label.type === 'application/vnd.lime.web-link+json',
          value: x.value ? {type: x.value.type, value: JSON.stringify(x.value.value)} : {}
        }
        opts.previewText = getOptionContent(opts)
        return opts
      })
      this.headerTab = null
      this.showOptionDialog = false
      this.isEditing = false
    },
    documentSelectSave: function () {
      this.$validator.validateAll().then((result) => {
        if (!result) return
        this.selectedOption = { label: {}, value: {} }
        var newDocument =
          {
            ...this.document,
            options: this.options.map(function (x) {
              return {
                label: {
                  type: x.label.type,
                  value: x.label.type === 'text/plain' ? x.label.value : { text: x.label.value.text, uri: x.label.value.uri, target: x.label.value.target }
                },
                value: x.value && x.value.value ? { type: x.value.type, value: JSON.parse(x.value.value) } : null
              }
            })
          }
        newDocument.header.value.title = this.title
        newDocument.header.value.text = this.content
        newDocument.header.value.type = this.type
        newDocument.header.value.aspectRatio = this.aspect.replace('-', ':')
        newDocument.header.value.uri = this.previewUri

        this.headerTab = null
        this.showOptionDialog = false
        this.save(newDocument)
      })
    },
    editOption: function (item, index, $event) {
      this.showOptionDialog = true

      this.selectedOption = _.cloneDeep(item)
      this.selectedOption.index = index

      this.showPayload = typeof this.selectedOption.value.type === 'string'
      this.headerTab = this.selectedOption.label.type === 'application/vnd.lime.web-link+json' ? 'weblink' : 'plainText'
      if (this.headerTab === 'weblink') this.selectedOption.label.value.target = this.selectedOption.label.value.target || ''
    },
    deleteOption: function (index) {
      this.options.splice(index, 1)
    },
    saveOption: function () {
      this.$validator.validateAll().then((result) => {
        if (!result) return
        if (this.headerTab === 'weblink') {
          this.selectedOption.label.type = 'application/vnd.lime.web-link+json'
          this.selectedOption.isLink = true
          this.selectedOption.value = {}
        } else {
          this.selectedOption.label.type = 'text/plain'
          this.selectedOption.isLink = false
          this.selectedOption.value = this.showPayload ? this.selectedOption.value : {}
        }
        this.selectedOption.label.value = this.selectedOption.label.value
        this.selectedOption.previewText = getOptionContent(this.selectedOption)

        if (this.selectedOption.index === -1) {
          this.options.push(this.selectedOption)
        } else {
          this.options.splice(this.selectedOption.index, 1, this.selectedOption)
        }

        this.selectedOption = { label: {}, value: {} }
        this.headerTab = null
        this.showOptionDialog = false
      })
    },
    cancelOption: function (item) {
      this.errors.clear()
      this.selectedOption = { label: {}, value: {} }
      this.headerTab = null
      this.showOptionDialog = false
    }
  }
}
</script>

<style lang="scss">
   @import '../styles/variables.scss';

  .document-select {

    .header {

      .title {
        margin: 0;
        padding: 10px 20px;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    .hide-overflow {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .fixed-options ul {
      margin:  0px;
    }
    .editing .fixed-options ul {
      margin:  0px -10px;
    }

    .add-button {
      cursor: pointer;
      text-align: center;
      padding: 5px;
      margin: 2px;
      font-size: 14px;
      font-weight: 500;
      color: $vue-light-blip;
      background-color: $vue-white !important;
      border: 1px dashed $vue-london !important;
    }

    .form-check {
      padding: 0px 10px;
      color: $vue-cloud;
      margin: 0;

      input[type="radio"] {
        position: absolute;
        visibility: hidden;
      }

      .form-check-container {
        margin-left: 5px;
        margin-top: 8px;
        position: relative;
        width: 40px;
        height: 20px;
        display: inline-block;
      }

      label{
        position: absolute;
        z-index: 1;
        cursor: pointer;
      }
      .check{
        display: block;
        position: absolute;
        border: 1px solid $vue-time;
        border-radius: 100%;
        height: 16px;
        width: 16px;
        top: 0px;
        left: 0px;
        transition: border .25s linear;
        -webkit-transition: border .25s linear;
        -moz-transition: border .25s linear;
        -ms-transition: border .25s linear;
      }
      .check::before {
        display: block;
        position: absolute;
        content: '';
        border-radius: 100%;
        height: 8px;
        width: 8px;
        top: 3px;
        left: 3px;
        margin: auto;
        transition: background 0.25s linear;
        -webkit-transition: background 0.25s linear;
        -moz-transition: background 0.25s linear;
        -ms-transition: background 0.25s linear;
      }
      input[type=radio]:checked ~ .check {
        border: 1px solid $vue-light-blip;
      }

      input[type=radio]:checked ~ .check::before{
        background: $vue-light-blip;
      }
    }

  }

</style>
