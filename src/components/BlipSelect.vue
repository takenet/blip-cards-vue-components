<template>
  <div v-if="!isEditing" class="container select">
   <div v-if="document.scope === 'immediate'">
      <div :class="'bubble ' + position">
        <div v-if="editable && !isEditing" class="editIco" @click="toggleEdit">
          <img :src="editSvg" />
        </div>
        <span v-html="text" v-if="text"></span>
      </div>

      <div :class="'notification ' + position" v-if="date">
        {{ date }}
      </div>

      <transition name="fade">
        <div class="options" v-if="!hide">
          <ul>
            <li v-for="(item, index) in options" v-bind:key="index" @click="select(item)">
              <span v-html="item.previewText"></span>
            </li>
          </ul>
        </div>
      </transition>
    </div>

    <div v-else>
      <div :class="'bubble ' + position">
        <div v-if="editable && !isEditing" class="editIco" @click="toggleEdit">
          <img :src="editSvg" />
        </div>
        <span v-html="text"></span>
        <div class="fixed-options">
          <ul>
            <li v-for="(item, index) in options" v-bind:key="index" @click="select(item)">
              <span v-html="item.text"></span>
            </li>
          </ul>
        </div>
      </div>

      <div :class="'notification ' + position" v-if="date">
        {{ date }}
      </div>
    </div>
  </div>

  <div class="container select" v-else>
    <form class="bubble left" novalidate v-on:submit.prevent>
      <div v-if="errors.any()" class="saveIco" @click="cancel()" >
        <img :src="closeSvg" />
      </div>
      <div v-else class="saveIco" @click="selectSave(text)">
        <img :src="approveSvg" />
      </div>
      <div class="form-group">
        <input type="text" name="text" :class="{'input-error': errors.has('text') }" v-validate="'required'" class="form-control" v-model="text" />
        <span v-show="errors.has('text')" class="help input-error">{{ errors.first('text') }}</span>
      </div>

      <div class="text-center" :class="{ 'fixed-options': document.scope !== 'immediate', 'options': document.scope === 'immediate'}">
        <ul>
          <li v-for="(item, index) in options" v-bind:key="index">
            <span @click="editOption(item, index, $event)" v-html="item.text"></span>
            <span @click="deleteOption(index)">X</span>
          </li>
          <li class="btn-dashed primary-color" v-if="document.scope === 'immediate'" @click="editOption({}, -1, $event)">
            <span>Add option</span>
          </li>
        </ul>
        <div v-if="document.scope !== 'immediate'" @click="editOption({}, -1, $event)" class="btn-dashed primary-color btn" style="margin-top: 10px; width: 100%;">
          <span>Add Button</span>
        </div>
        <div class="form-group">
          <span v-show="errors.any()" class="help input-error">{{ errors.all() }}</span>
        </div>
      </div>
    </form>

    <div v-bind:style="styleObject" class="modal">
      <form novalidate v-on:submit.prevent class="bubble left" style="float: none">
        <div class="tabs">
          <span :class="{ 'active': headerTab === 'plainText'}" @click="setTab('plainText')">Text</span>
        </div>

        <div v-if="headerTab === 'plainText'">
          <div class="form-group">
            <input type="text" name="optionText" v-validate="'required'" class="form-control" v-model="selectedOption.text" placeholder="Text" />
            <span v-show="errors.has('optionText')" class="help input-error">{{ errors.first('optionText') }}</span>
          </div>

          <input id="showPayload" type="checkbox" v-model="showPayload"><label for="showPayload">Set Payload</label>
          <div class="line"></div>

          <div v-show="showPayload">
            <div class="form-group">
              <input type="text" name="type" v-validate="showPayload ? 'required|mime' : ''"  class="form-control" v-model="selectedOption.type" placeholder="Postback mime type" />
              <span v-show="errors.has('type')" class="help input-error">{{ errors.first('type') }}</span>
            </div>
            <div class="form-group">
              <textarea name="value" v-validate="showPayload ? 'required|json' : ''" class="form-control" v-model="selectedOption.value" placeholder="Postback value" />
              <span v-show="errors.has('value')" class="help input-error">{{ errors.first('value') }}</span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <button @click="cancelOption()" class="btn btn-dashed delete-color w-49">Cancel</button>
          <button @click="saveOption()" class="btn btn-dashed primary-color w-49" :class="{'is-disabled': errors.any() }">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

import { linkify } from '../utils'
import _ from 'lodash'
import { default as base } from '../mixins/baseComponent.js'
const optionSize = 34

export default {
  name: 'blip-select',
  mixins: [
    base
  ],
  props: {
    hideOptions: {
      type: Boolean,
      default: false
    },
    onSelected: {
      type: Function
    }
  },
  data: function () {
    return {
      styleObject: {
        display: 'none'
      },
      showPayload: false,
      headerTab: 'plainText',
      selectedOption: { value: {} },
      text: linkify(this.document.text),
      hide: this.hideOptions,
      options: this.document.options.map(function (x) {
        let opts = {
          ...x,
          previewText: x.text.length > optionSize ? x.text.substring(0, optionSize) + '...' : x.text,
          value: x.value ? JSON.stringify(x.value) : ''
        }
        return opts
      })
    }
  },
  methods: {
    cancel: function () {
      this.isEditing = false
      this.styleObject = {
        display: 'none'
      }
      this.showPayload = false
      this.headerTab = 'plainText'
      this.selectedOption = {}
      this.text = linkify(this.document.text)
      this.hide = this.hideOptions
      this.options = this.document.options.map(function (x) {
        let opts = {
          ...x,
          previewText: x.text.length > optionSize ? x.text.substring(0, optionSize) + '...' : x.text,
          value: x.value ? JSON.stringify(x.value) : ''
        }
        return opts
      })
    },
    setTab: function (name) {
      this.headerTab = name
    },
    deleteOption: function (index) {
      this.options.splice(index, 1)
    },
    cancelOption: function (item) {
      this.errors.clear()
      this.$validator.clean()
      this.selectedOption = {}
      this.styleObject = {
        display: 'none'
      }
    },
    saveOption: function () {
      if (this.selectedOption.index === -1) {
        this.selectedOption.previewText = this.selectedOption.text.length > optionSize ? this.selectedOption.text.substring(0, optionSize) + '...' : this.selectedOption.text
        this.options.push(this.selectedOption)
      } else {
        this.selectedOption.previewText = this.selectedOption.text.length > optionSize ? this.selectedOption.text.substring(0, optionSize) + '...' : this.selectedOption.text
        this.options.splice(this.selectedOption.index, 1, this.selectedOption)
      }

      this.selectedOption = {}
      this.errors.clear()
      this.$validator.clean()

      this.styleObject = {
        display: 'none'
      }
    },
    editOption: function (item, index, $event) {
      this.styleObject = {
        top: $event.layerY + 'px',
        left: $event.layerX + 'px',
        width: '350px'
      }

      this.selectedOption = _.clone(item)
      console.log(this.selectedOption)

      if (!this.selectedOption.value || !this.selectedOption.type) {
        this.showPayload = false
      } else {
        this.showPayload = true
      }

      this.selectedOption.index = index
    },
    selectSave: function () {
      this.selectedOption = {}
      this.styleObject = {
        display: 'none'
      }

      this.save({
        ...this.document,
        text: this.text,
        options: this.options.map(function (x) {
          return {
            ...x,
            value: x.value ? JSON.parse(x.value) : null
          }
        })
      })
    },
    select: function (item) {
      if (this.onSelected) {
        if (item.value) {
          this.onSelected(item.text, {
            type: item.type,
            content: JSON.parse(item.value)
          })
        } else {
          this.onSelected(item.text, {
            content: item.order ? item.order.toString() : item.text,
            type: 'text/plain'
          })
        }
      }

      this.hide = true
    }
  }
}
</script>

<style lang="scss">
   @import '../styles/variables.scss';

    .select .bubble {
      padding: $bubble-padding
    }

    .select .options ul {
      list-style-type: none;
      clear: both;
      margin: 0;
      padding: 10px;
    }

   .select .options li {
     cursor: pointer;
     display: inline-block;
     background-color: #DAF2F4;
     border: 1px solid #0CC8CC;
     box-shadow: 0 -1px 12px 0 #EEEEEE;
     border-radius: 19px;
     padding: 10px 16px;
     margin: 2px;
     color: #0CC8CC;
     font-size: 14px;
     font-weight: 500;
     min-width: 70px;
   }

  .select .fixed-options li:last-child {
    padding-bottom: 0px;
  }

</style>
