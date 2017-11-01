<template>
  <div v-if="document.content != null" class="container select">
    <div :class="'bubble ' + position">
      {{ text }}
    </div>

    <div :class="'notification ' + position" v-if="date">
      {{ date }}
    </div>

    <div class="options">
      <ul>
        <li v-for="(item, index) in options">
          {{ item.text }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

import { linkify } from '../utils'

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
    }
  },
  data: function () {
    return {
      text: linkify(this.document.content.text),
      options: this.document.content.options
    }
  }
}
</script>

<style lang="scss">

   .select .options ul {
     list-style-type: none;
     clear: both;
   }

   .select .options li {
     display: inline-block;
     background-color: #DAF2F4;
     border: 1px solid #0CC8CC;
     box-shadow: 0 -1px 12px 0 #EEEEEE;
     border-radius: 19px;
     padding: 10px;
     margin-right: 8px;
     color: #0CC8CC;
     font-size: 14px;
     font-weight: 500;
   }

</style>
