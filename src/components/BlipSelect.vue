<template>
  <div v-if="!isEditing" class="blip-container select">
   <div v-if="document.scope === 'immediate'">
      <div :class="'bubble ' + position">
        <div v-if="deletable" class="editIco trashIco" @click="trash(document)">
          <img :src="trashSvg" />
        </div>
        <div v-if="editable && !isEditing" class="editIco" @click="toggleEdit">
          <img :src="editSvg" />
        </div>
        <div v-html="computedText" v-if="computedText"></div>
      </div>

      <div :class="'notification ' + position" v-if="date">
        {{ date }}
      </div>

      <transition name="fade">
        <div class="options" v-if="!hide">
          <ul>
            <li v-for="(item, index) in options" v-bind:key="index" @click="select(item)">
              <div v-html="item.previewText"></div>
            </li>
          </ul>
        </div>
      </transition>
    </div>

    <div v-else>
      <div :class="'bubble ' + position">
        <div v-if="deletable" class="editIco trashIco" @click="trash(document)">
          <img :src="trashSvg" />
        </div>
        <div v-if="editable && !isEditing" class="editIco" @click="toggleEdit">
          <img :src="editSvg" />
        </div>
        <div class="text-left" v-html="computedText"></div>
        <div class="fixed-options">
          <ul>
            <li v-for="(item, index) in options" v-bind:key="index" @click="select(item)">
              <div v-html="item.text"></div>
            </li>
          </ul>
        </div>
      </div>

      <div :class="'notification ' + position" v-if="date">
        {{ date }}
      </div>
    </div>
  </div>

  <div class="blip-container select" v-else-if="!addOption">
    <form class="bubble left" novalidate v-on:submit.prevent>
      <button class="btn saveIco closeIco" @click="cancel()" >
        <img :src="closeSvg" />
      </button>
      <button class="btn saveIco" :class="{'is-disabled': errors.any() }" @click="selectSave(text)">
        <img :src="approveSvg" />
      </button>
      <div class="form-group">
        <textarea @keydown.enter="selectSave(text, $event)" type="text" name="text" :class="{'input-error': errors.has('text') }" v-validate="'required'" class="form-control" v-auto-expand v-model="text" />
        <span v-show="errors.has('text')" class="help input-error">{{ errors.first('text') }}</span>
      </div>

      <div class="text-center" :class="{ 'fixed-options': document.scope !== 'immediate', 'options': document.scope === 'immediate'}">
        <ul>
          <li v-for="(item, index) in options" v-bind:key="index">
            <span @click="editOption(item, index, $event)" v-html="item.text"></span>
            <span @click="deleteOption(index)" class="remove-option"><img :src="closeBlueSvg"></span>
          </li>
          <li class="btn-dashed primary-color" v-if="document.scope === 'immediate'" @click="editOption({}, -1, $event)">
            <span>Add option</span>
          </li>
        </ul>
        <div v-if="document.scope !== 'immediate'" @click="editOption({}, -1, $event)" class="btn-dashed primary-color btn" style="margin-top: 10px; width: 100%;">
          <span>Add Button</span>
        </div>
      </div>
    </form>
  </div>

  <div class="blip-container" v-else>
    <form novalidate v-on:submit.prevent class="bubble left">
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
            <textarea @keydown.enter="saveOption($event)" v-if="selectedOption.type && selectedOption.type.includes('json')" name="value" v-validate="showPayload ? 'required|json' : ''" class="form-control" v-model="selectedOption.value" placeholder="Postback value" />
            <textarea @keydown.enter="saveOption($event)" v-else name="value" v-validate="showPayload ? 'required' : ''" class="form-control" v-model="selectedOption.value" placeholder="Postback value" />
            <span v-show="errors.has('value')" class="help input-error">{{ errors.first('value') }}</span>
          </div>
        </div>
      </div>

      <div class="form-group blip-card-flex">
        <div class="flex-item">
          <button type="button" @click="cancelOption()" class="btn btn-white color-gray">Cancel</button>
        </div>
        <div class="flex-item">
          <button @click="saveOption()" class="btn btn-white primary-color" :class="{'is-disabled': errors.any() }">Apply</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>

import { default as base } from '../mixins/baseComponent.js'
import { linkify } from '../utils/misc'
import debounce from 'lodash/debounce'
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
      addOption: undefined,
      showPayload: undefined,
      headerTab: undefined,
      selectedOption: undefined,
      hide: undefined,
      text: undefined,
      options: undefined
    }
  },
  computed: {
    computedText: function () {
      return linkify(this.document.text)
    }
  },
  watch: {
    hideOptions: function() {
      this.hide = this.hideOptions
    }
  },
  methods: {
    init: function() {
      this.addOption = false
      this.showPayload = false
      this.headerTab = 'plainText'
      this.selectedOption = { value: {} }
      this.hide = this.hideOptions
      this.text = this.document.text
      this.options = this.document.options.map(function (x) {
        let value
        if (x.value) {
          if (x.type && x.type.includes('json')) {
            value = JSON.stringify(x.value)
          } else {
            value = x.value
          }
        } else {
          value = ''
        }

        let opts = {
          ...x,
          previewText: x.text.length > optionSize ? x.text.substring(0, optionSize) + '...' : x.text,
          value
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
      this.addOption = false
    },
    saveOption: function ($event) {
      if (this.errors.any() || ($event && $event.shiftKey)) { return }

      if ($event) {
        $event.stopPropagation()
        $event.preventDefault()
        $event.returnValue = false
      }

      this.addOption = false
      this.selectedOption.previewText = this.selectedOption.text.length > optionSize ? this.selectedOption.text.substring(0, optionSize) + '...' : this.selectedOption.text
      if (!this.showPayload) {
        this.selectedOption.value = this.selectedOption.type = null
      }
      if (this.selectedOption.index === -1) {
        this.options.push(this.selectedOption)
      } else {
        this.options.splice(this.selectedOption.index, 1, this.selectedOption)
      }

      this.selectedOption = {}
      this.errors.clear()
      this.$validator.clean()

      this.addOption = false
    },
    editOption: function (item, index, $event) {
      this.addOption = true

      this.selectedOption = { ...item }

      if (!this.selectedOption.value || !this.selectedOption.type) {
        this.showPayload = false
      } else {
        this.showPayload = true
      }

      this.selectedOption.index = index
    },
    selectSave: function (text, $event) {
      if (this.errors.any() || ($event && $event.shiftKey)) { return }

      if ($event) {
        $event.stopPropagation()
        $event.preventDefault()
        $event.returnValue = false
      }

      this.$validator.validateAll().then((result) => {
        if (!result) return
        this.selectedOption = {}
        this.addOption = false

        this.save({
          ...this.document,
          text: this.text,
          options: this.options.map(function (x) {
            let value
            if (x.value) {
              if (x.type.includes('json')) {
                value = JSON.parse(x.value)
              } else {
                value = x.value
              }
            } else {
              value = null
            }

            return {
              ...x,
              value
            }
          })
        })
      })
    },
    select: debounce(
      function (item) {
        if (!this.editable) {
          this.hide = true
        }

        if (this.onSelected) {
          if (item.value) {
            this.onSelected(item.text, {
              type: item.type,
              content: (item.type.indexOf('json') !== -1) ? JSON.parse(item.value) : item.value
            })
          } else {
            this.onSelected(item.text, {
              content: item.order ? item.order.toString() : item.text,
              type: 'text/plain'
            })
          }
        }
      },
      500,
      { leading: true, trailing: false }
    )
  }
}
</script>

<style lang="scss">
   @import '../styles/variables.scss';

    .select .bubble {
      padding: $bubble-padding;
      min-width: auto;
    }

    .select .options ul {
      list-style-type: none;
      clear: both;
      margin: 0;
      padding: 10px;
    }

   .select .options li {
     cursor: pointer;
     display: inline-flex;
     align-items: end;
     background-color: #DAF2F4;
     border: 1px solid #0CC8CC;
     box-shadow: 0 -1px 12px 0 rgba(0, 0, 0, .1);
     border-radius: 19px;
     padding: 10px 16px;
     margin: 2px;
     color: #0CC8CC;
     font-size: 16px;
     font-weight: 500;
     min-width: 70px;

     span { line-height: 1; }

     .remove-option {
       margin-left: 8px;

       img {
         width: 12px; height: 14px;
       }
     }
   }

  .select .fixed-options li:last-child {
    padding-bottom: 0px;
  }

</style>
