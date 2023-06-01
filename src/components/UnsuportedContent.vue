<template>
  <div :class="'blip-container unsuported-content ' + position">
    <div :class="'bubble ' + position">
      <div class="unsuported-content-icons">
        <bds-icon v-if="fromMessageTemplate == true" size="small" alt="Alert" name="megaphone"></bds-icon>
        <bds-icon v-else-if="position === 'right'" size="small" alt="Alert" name="warning"></bds-icon>
        <bds-icon v-else size="small" alt="Alert" name="warning"></bds-icon>
        <span>
          {{ unsupportedContentMsg }}
        </span>
      </div>
    </div>
    <bds-icon v-if="this.position === 'right' && this.status === 'failed' && this.onFailedClickIcon"
        name="info" theme="solid" 
        aria-label="Active message failed reason" 
        class="icon-active-message-failed" 
        @click="onFailedClickIcon(fullDocument)"></bds-icon>
    <div class="flex" :class="'notification ' + position" v-if="date">
      <span v-if="this.position === 'right'">
        <img v-if="this.status === 'waiting'" :src="clockSvg">
        <img v-else-if="this.status === 'accepted'" :src="checkSentSvg">
        <img v-else-if="this.status === 'received'" :src="doubleCheckReceivedSvg">
        <img v-else-if="this.status === 'consumed'" :src="doubleCheckReadSvg">
        <div v-else-if="this.status === 'failed'" class="failure">
          {{ failedToSendMsg }}
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
import megaphoneSvg from '../assets/img/megaphone.svg'

export default {
  name: 'unsuported-content',
  mixins: [
    base
  ],
  props: {
    document: {},
    status: {
      type: String,
      default: ''
    },
    unsupportedContentMsg: {
      type: String,
      default: 'Unsuported Content'
    },
    fromMessageTemplate: {
      type: Boolean,
      default: false
    },
    failedToSendMsg: {
      type: String,
      default: 'Falha ao enviar a mensagem'
    },
    onFailedClickIcon: {
      type: Function
    }
  },
  data: function () {
    return {
      alertSvg,
      alertWhiteSvg,
      megaphoneSvg
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables.scss';

.icon-active-message-failed {
  position: relative;
  margin-left: 10px;
  margin-right: -5px;
  margin-top: -5px;
  color: #E60F0F;
  cursor: pointer;  
}

.unsuported-content {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.unsuported-content.right {
    justify-content: right;
}

.unsuported-content.left {
    justify-content: left;
}

.blip-container.unsuported-content .alert-icon {
  height: 20px;
  margin-right: 2px;
}

.unsuported-content-icons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.blip-container.unsuported-content .bubble.left {
  background-color: $color-surface-3;
  color: $color-content-default;

  .unsuported-content-icons {
    display: flex;
    gap: 8px;
    align-items: center;
  }
}

.blip-container.unsuported-content .bubble.right {
  background-color: $color-surface-3;
  color: $color-content-default;
  margin-right: -4px;

  .unsuported-content-icons {
    display: flex;
    gap: 8px;
    align-items: center;
  }
}

.blip-container.unsuported-content.blip-card .bubble {
  padding: 4px 16px;
  word-wrap: break-word;
  border-radius: 15px;
  white-space: normal;
  font-size: 13px;
}
</style>
