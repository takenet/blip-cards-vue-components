

<template>
 <div class="blip-container unsuported-content">
    <div :class="'bubble ' + position">
      <div class="flex flex-column">
        <img v-if="position === 'right'" :src="alertWhiteSvg" alt="Alert" class="alert-icon">
        <img v-else :src="alertSvg" alt="Alert" class="alert-icon">
        <span>
          Unsuported Content
        </span>
      </div>
    </div>

    <div class="flex" :class="'notification ' + position" v-if="date">
      <span v-if="this.position === 'right'">
        <img v-if="this.status === 'waiting'" :src="clockSvg">
        <img
          v-else-if="this.status === 'accepted'"
          :src="checkSentSvg">
        <img
          v-else-if="this.status === 'received'"
          :src="doubleCheckReceivedSvg">
        <img
          v-else-if="this.status === 'consumed'"
          :src="doubleCheckReadSvg">
        <div
          v-else-if="this.status === 'failed'"
          class="failure">
            Falha ao enviar a mensagem.
        </div>
      </span>
      <div>{{ date }}</div>
    </div>
  </div>
</template>

<script>

import { default as base } from '../mixins/baseComponent.js'
import alertSvg from '../assets/img/alert.svg'
import alertWhiteSvg from '../assets/img/alertWhite.svg'

export default {
  name: 'unsuported-content',
  mixins: [
    base
  ],
  props: {
    document: { },
    status: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
      alertSvg,
      alertWhiteSvg
    }
  }
}
</script>


<style lang="scss">
   @import '../styles/variables.scss';

   .blip-container.unsuported-content .alert-icon {
     height: 20px;
     margin-right: 2px;
   }

    .blip-container.unsuported-content .bubble.left {
      background-color: #DEE8EC;
      color: $vue-rooftop;
    }

    .blip-container.unsuported-content .bubble.right {
      background-color: #0CC8CC;
    }

    .blip-container.unsuported-content.blip-card .bubble {
      padding: 4px 16px;
      word-wrap: break-word;
      border-radius: 15px;
      white-space: normal;
      font-size: 13px;
      box-shadow: 0px 0px 0px;
    }
</style>
