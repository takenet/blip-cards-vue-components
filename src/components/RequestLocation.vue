<template>
  <div v-if="!isEditing" class="blip-container request-location">
    <div class="bubble left">
      <!-- <div v-if="editable" class="editIco trashIco" @click="trash(document)">
        <img :src="trashSvg" />
      </div>
      <div v-if="editable" class="editIco" @click="toggleEdit">
        <img :src="editSvg" />
      </div> -->
      <div class="label-wrappper">
        <span>{{ document.label.value }}</span>
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
    <div class="bubble left">
    </div>
  </div>
</template>


<script>

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
    }
  },
  data: function () {
    return {
      hide: this.hideOptions
    }
  },
  methods: {
    select: function () {
      if (this.onSelected) {
        this.onSelected()
      }

      this.hide = true
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
