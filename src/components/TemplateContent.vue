<template>
  <div :class="'blip-container template-content ' + position">
    <div :class="'bubble ' + position">
      <div class="template-content-icons">
        <bds-icon v-if="fromMessageTemplate == true && position === 'right'" size="small" color="white" alt="Alert" name="paperplane"></bds-icon>
        <bds-icon v-else-if="fromMessageTemplate == true" size="small" alt="Alert" name="paperplane"></bds-icon>
        <bds-icon v-else-if="position === 'right'" size="small" alt="Alert" name="warning"></bds-icon>
        <bds-icon v-else size="small" alt="Alert" name="warning"></bds-icon>
        <span>
          {{ showTemplateContentTitle }}
        </span>
      </div>
      <div class="flex flex-column justify-start">
        <span v-for="(link, index) in showTemplateContentLinks" :key="index">
          <a :href="link">{{ link }}</a>
        </span>
        <span>
          {{ showTemplateContentBody }}
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
import paperplaneSvg from '../assets/img/paperplane.svg'

export default {
  name: 'template-content',
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
    contentTemplateName: {
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
      paperplaneSvg
    }
  },
  computed: {
    showTemplateContentTitle() {
      return this.unsupportedContentMsg.replace(/_/g, ' ')
    },
    showTemplateContentBody() {
      let componentTemplateBody = this.document.template_content.Components
        .filter(m => m.Type === 'BODY')

      let bodyFilledVariables = this.document.template.components
        .filter(m => m.type === 'body')

      if (componentTemplateBody) {
        componentTemplateBody = componentTemplateBody[0].Text

        if (bodyFilledVariables.length) {
          bodyFilledVariables = bodyFilledVariables[0].parameters

          componentTemplateBody = componentTemplateBody.replace(/\{\{(\d+)\}\}/g, (match, index) => {
            const value = bodyFilledVariables[index - 1].text
            return value !== undefined ? value : match
          })
        }
      }

      return componentTemplateBody
    },
    showTemplateContentLinks() {
      const attachments = this.document.template.components
        .filter((m) => (m.type === 'header'))

      if (attachments) {
        const links = []
        attachments.forEach(item => {
          item.parameters.forEach(parameter => {
            if (parameter.image) {
              links.push(parameter.image.link)
            } else if (parameter.video) {
              links.push(parameter.video.link)
            } else if (parameter.audio) {
              links.push(parameter.audio.link)
            }
          })
        })
        return links
      }
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables.scss';

.icon-active-message-failed {
  position: relative;
  margin-left: 5px;
  margin-right: -1px;
  margin-top: -5px;
  color: #E60F0F;
  cursor: pointer;
}

.template-content {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.template-content.right {
    justify-content: right;
    margin-left: 0.5em;
}

.template-content.left {
    justify-content: left;
}

.blip-container.template-content .alert-icon {
  height: 20px;
  margin-right: 2px;
}

.template-content-icons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.template-content-icons span{
  max-width: calc(100% - 25px);
}

.blip-container.template-content .bubble.left {
  .template-content-icons {
    display: flex;
    gap: 8px;
    align-items: center;
  }
}

.blip-container.template-content .bubble.right {
  .template-content-icons {
    display: flex;
    gap: 8px;
    align-items: center;
  }
}

.blip-container.template-content.blip-card .bubble {
  padding: 4px 16px;
  word-wrap: break-word;
  border-radius: 15px;
  white-space: normal;
  font-size: 13px;
}
</style>
