<template>
  <div v-if="document.content != null" class="container select">
   <div v-if="document.content.scope === 'immediate'">
      <div :class="'bubble ' + position" v-html="text" v-if="text">
      </div>

      <div :class="'notification ' + position" v-if="date">
        {{ date }}
      </div>

      <transition name="fade">
        <div class="options" v-if="!hide">
          <ul>
            <li v-for="(item, index) in options">
              <span @click="select(item)" v-html="item.previewText"></span>
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
            <li v-for="(item, index) in options">
              <span @click="select(item)" v-html="item.text"></span>
            </li>
          </ul>
        </div>
      </div>

      <div :class="'notification ' + position" v-if="date">
        {{ date }}
      </div>
    </div>
  </div>
</template>

<script>

import { linkify } from '../utils'
const optionSize = 34

export default {
  props: {
    document: {
      type: Object,
      required: true
    },
    position: {
      type: String,
      default: 'left'
    },
    date: {
      type: String
    },
    hideOptions: {
      type: Boolean,
      default: false
    },
    onSelected: {
      type: Function
    }
  },
  computed: {
    options: function () {
      return this.document.content.options.map(function (x) {
        let opts = {
          ...x,
          previewText: x.text.length > optionSize ? x.text.substring(0, optionSize) + '...' : x.text
        }
        return opts
      })
    }
  },
  data: function () {
    return {
      text: linkify(this.document.content.text),
      hide: this.hideOptions
    }
  },
  methods: {
    select: function (item) {
      if (this.onSelected) {
        if (item.value) {
          this.onSelected({
            type: item.type,
            content: item.value
          })
        } else {
          this.onSelected({
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
   @import '../styles/common.scss';

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
   }

   .select .fixed-options ul {
     list-style-type: none;
     clear: both;
     margin: 0;
     margin-top: 15px;
     padding: 0px;
   }

   .select .fixed-options li {
     cursor: pointer;
     text-align: center;
     padding: 10px;
     margin: 2px;
     font-size: 14px;
     font-weight: 500;
   }

    .select .fixed-options li:last-child {
     padding-bottom: 0px;
   }

    .select .fixed-options ul {
      margin-left: -16px;
      margin-right: -16px;
    }

    .select .left .fixed-options li {
      color: $vue-blue;
      border-top: 0.5px solid #e4e2e2;
    }

   .select .right .fixed-options li {
     color: $vue-white;
     border-top: 0.5px solid $vue-white;
   }

</style>
