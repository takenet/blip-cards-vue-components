<template>
  <div v-if="!isEditing" class="container select">
    <div v-if="editable && !isEditing" class="editIco" @click="toggleEdit">
      <img :src="editSvg" />
    </div>
   <div v-if="document.scope === 'immediate'">
      <div :class="'bubble ' + position" v-html="text" v-if="text">
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
      <div class="saveIco" @click="selectSave()" :class="{'is-disabled': errors.any() }">
        <img :src="approveSvg" />
      </div>
      <div class="form-group">
        <input type="text" name="text" :class="{'input-error': errors.has('text') }" v-validate="'required'" class="form-control" v-model="text" />
        <span v-show="errors.has('text')" class="help input-error">{{ errors.first('text') }}</span>
      </div>

      <div class="text-center" :class="{ 'fixed-options': document.scope !== 'immediate', 'options': document.scope === 'immediate'}">
        <ul>
          <li v-for="(item, index) in options" v-bind:key="index">
            <span @click="editOption(item, $event)" v-html="item.text"></span>
            <span @click="deleteOption(item)">X</span>
          </li>
          <li class="add" v-if="document.scope === 'immediate'" @click="editOption({}, $event)">
            <span>Add option</span>
          </li>
        </ul>
        <div v-if="document.scope !== 'immediate'" @click="editOption({}, $event)" class="btn-dashed primary-color btn" style="margin-top: 10px; width: 100%;">
          <span>Add Button</span>
        </div>
      </div>
    </form>

    <div v-bind:style="styleObject" class="modal">
      <div class="bubble left" style="float: none">
        <div class="form-group">
          <input type="text" name="optionText" :class="{'input-error': errors.has('optionText') }"
          v-validate="'required'" class="form-control" v-model="selectedOption.text" placeholder="Text" />
          <span v-show="errors.has('optionText')" class="help input-error">{{ errors.first('optionText') }}</span>
        </div>

        <div class="line"></div>

        <div class="tabs">
          <span :class="{ 'active': tab === 'mime'}" @click="setTab('mime')">MIME Type</span>
          <span :class="{ 'active': tab === 'value'}" @click="setTab('value')">Value</span>
        </div>

        <div>
          <div class="form-group" v-if="tab === 'mime'">
            <input type="text" name="type" v-validate="'mime'"  class="form-control" v-model="selectedOption.type" placeholder="Type" />
            <span v-show="errors.has('type')" class="help input-error">{{ errors.first('type') }}</span>
          </div>

          <div class="form-group" v-if="tab === 'value'">
            <textarea type="text" name="value" v-validate="'json'" class="form-control" v-model="selectedOption.value" placeholder="Value" />
            <span v-show="errors.has('value')" class="help input-error">{{ errors.first('value') }}</span>
          </div>

          <div class="form-group">
            <button @click="cancelOption()" class="btn btn-dashed delete-color">Cancel</button>
            <button @click="saveOption()" class="btn btn-dashed primary-color" :class="{'is-disabled': errors.any() }">Save</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { linkify } from '../utils'
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
      tab: 'mime',
      selectedOption: {},
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
    setTab: function (name) {
      this.tab = name
    },
    deleteOption: function (item) {
      let index = this.options.indexOf(item)
      this.options.splice(index, 1)
    },
    cancelOption: function () {
      this.errors.clear()
      this.selectedOption = {}
      this.styleObject = {
        display: 'none'
      }
    },
    saveOption: function () {
      if (this.options.indexOf(this.selectedOption) === -1 && this.selectedOption.text) {
        this.selectedOption.previewText = this.selectedOption.text.length > optionSize ? this.selectedOption.text.substring(0, optionSize) + '...' : this.selectedOption.text
        this.options.push(this.selectedOption)
      } else {
        this.selectedOption.previewText = this.selectedOption.text.length > optionSize ? this.selectedOption.text.substring(0, optionSize) + '...' : this.selectedOption.text
      }

      this.selectedOption = {}
      this.styleObject = {
        display: 'none'
      }
    },
    editOption: function (item, $event) {
      this.styleObject = {
        top: $event.layerY + 'px',
        left: $event.layerX + 'px',
        width: '350px'
      }

      this.selectedOption = item
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
