<template>
  <div v-if="!isEditing" class="blip-container request-location">
    <div class="bubble left">
      <div v-if="editable" class="editIco trashIco" @click="trash(document)">
        <img :src="trashSvg" />
      </div>
      <div v-if="editable" class="editIco" @click="toggleEdit">
        <img :src="editSvg" />
      </div>

      <div v-if="!previewDocument.hasPreview" class="label-wrappper">
        <span>{{ previewDocument.content }}</span>
      </div>
      <div v-else class="label-wrapper">
        <div v-show="!showContent">
          <span>{{ previewDocument.previewContent }}</span>
        </div>
        <transition name="slide-fade">
          <div v-show="showContent">
            <span>{{ previewDocument.content }}</span>
          </div>
        </transition>
        <a style="display: block;" v-show="!showContent" v-on:click="showContent = true">Ver mais</a>
      </div>
    </div>

    <div v-if="date" :class="'notification ' + position">
      {{ date }}
    </div>

    <transition name="fade">
      <div v-if="!hide" class="options">
        <ul>
          <li @click="select()">
            <div class="wrapper">
              <div class="locationIcon">
                <img :src="editSvg"/>
              </div>
              <div class="text">
                <span>Send location</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
  <div v-else>
    <div class="blip-container">
      <div class="bubble left">
        <form novalidate v-on:submit.prevent>
          <div class="saveIco closeIco" @click="cancel()" >
            <img :src="closeSvg" />
          </div>
          <div class="saveIco" @click="saveLocation()" :class="{'is-disabled': errors.any() }">
            <img :src="approveSvg" />
          </div>
          <div class="form-group">
            <textarea name="text" class="form-control" v-validate="'required'" :class="{'input-error': errors.has('text') }" v-model="text"></textarea>
            <span v-show="errors.has('text')" class="help input-error">{{ errors.first('text') }}</span>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script>

import { linkify } from '../utils'
import { default as base } from '../mixins/baseComponent.js'

export default {
  name: 'request-location',
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
    },
    length: {
      type: Number,
      default: 532
    }
  },
  computed: {
    previewDocument: function () {
      return {
        hasPreview: this.document.label.value.length > this.length,
        previewContent: linkify(this.document.label.value.substring(0, this.length - 3) + '...'),
        content: linkify(this.document.label.value)
      }
    }
  },
  data: function () {
    return {
      hide: this.hideOptions,
      text: this.document.label.value,
      showContent: false
    }
  },
  methods: {
    select: function () {
      if (this.onSelected) {
        this.onSelected()
      }

      if (!this.editable) {
        this.hide = true
      }
    },
    cancel: function () {
      this.text = this.document.label.value
      this.showContent = false
      this.isEditing = false
    },
    saveLocation: function () {
      this.showContent = false
      this.save({
        ...this.document,
        label: {
          value: this.text
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import '../styles/variables.scss';
  .request-location{
    .bubble {
      padding: $bubble-padding;
    }
    .options {
      ul {
        list-style-type: none;
        clear: both;
        margin: 0;
        padding: 10px;
      }

      li {
        cursor: pointer;
        display: inline-block;
        background-color: #DAF2F4;
        border: 1px solid #0CC8CC;
        box-shadow: 0 -1px 12px 0 #EEEEEE;
        border-radius: 20px;
        padding: 7px 10px;
        margin: 2px;
        color: #0CC8CC;
        text-align: center;
        align-self: center;
        font-size: 14px;
        font-weight: 500;
        min-width: 70px;

        .wrapper {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;

          .locationIcon {
            justify-content: center;
            background-color: $vue-light-blip;
            padding: 5px;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            text-align: center;
          }
          .text {
            margin: 0px 10px;
          }
        }
      }
    }
  }
</style>
