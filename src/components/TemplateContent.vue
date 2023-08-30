<template>
  <div :class="'blip-container template-content ' + position">
    <div :class="'bubble ' + position">
      <div class="template-content-text flex flex-column">
        <div class="template-content-header">
          <bds-icon v-if="position === 'right'" size="small" color="white" alt="paperplane" name="paperplane"></bds-icon>
          <bds-icon v-else size="small" alt="paperplane" name="paperplane"></bds-icon>
          <bds-typo :class="'typo template-content-text-body ' + position" variant="fs-16" bold="semi-bold">{{ showTemplateContentTitle }}</bds-typo>
        </div>
        <bds-typo class="span" variant="fs-16" bold="semi-bold" v-for="(link, index) in showTemplateContentLinks()" :key="index">
          <a :href="link" target="_blank">{{ link }}</a>
        </bds-typo>
        <bds-typo :class="'span template-content-text-body ' + position" variant="fs-16" bold="regular" v-if="hasTemplateContentBody" v-html="formatText(showTemplateContentBody(), 'template-content-text-body ' + position)"/>
      </div>
    </div>
    <bds-icon v-if="this.position === 'right' && this.status === 'failed' && this.onFailedClickIcon"
        name="info" theme="solid"
        aria-label="Active message failed reason"
        class="icon-active-message-failed"
        @click="onFailedClickIcon(fullDocument)"></bds-icon>
    <blip-card-date
      :status="status"
      :position="position"
      :date="date"
      :failed-to-send-msg="failedToSendMsg" />
  </div>
</template>

<script>

import { default as base } from '../mixins/baseComponent.js'
import alertSvg from '../assets/img/alert.svg'
import alertWhiteSvg from '../assets/img/alertWhite.svg'
import paperplaneSvg from '../assets/img/paperplane.svg'
import { formatText } from '@/utils/FormatTextUtils'

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
    messageTemplateTitle: {
      type: String,
      default: 'Unsuported Content'
    },
    contentTemplateName: {
      type: String,
      default: 'Unsuported Content'
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
      return this.messageTemplateTitle.replace(/_/g, ' ')
    },
    hasTemplateContentBody() {
      return this.document.templateContent && this.document.templateContent.components
    },
    hasTemplateContentHeader() {
      return this.document.template && this.document.template.components
    }
  },
  methods: {
    showTemplateContentBody() {
      let componentTemplateBody = this.document.templateContent.components
        .filter(m => m.type === 'BODY')

      let bodyFilledVariables = this.document.template.components
        .filter(m => m.type === 'body')

      if (componentTemplateBody) {
        componentTemplateBody = componentTemplateBody[0].text

        if (bodyFilledVariables.length) {
          bodyFilledVariables = bodyFilledVariables[0].parameters
          const regexFindVariablesInText = /\{\{(\d+)\}\}/g
          componentTemplateBody = componentTemplateBody.replace(regexFindVariablesInText, (match, index) => {
            const value = bodyFilledVariables[index - 1].text
            return value !== undefined ? value : match
          })
        }
      }

      return componentTemplateBody
    },
    showTemplateContentLinks() {
      if (!this.hasTemplateContentHeader) {
        return
      }

      const attachments = this.document.template.components
        .filter((m) => (m.type === 'header'))

      if (attachments) {
        const links = []
        attachments.forEach(item => {
          item.parameters.forEach(parameter => {
            const { type } = parameter
            if (['image', 'video', 'audio'].includes(type)) {
              links.push(parameter[type].link)
            }
          })
        })
        return links
      }
    },
    formatText(text, style) {
      if (!text) {
        return ''
      }
      return formatText(text, style)
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
  font-size: 16px;
}

.template-content.right {
  justify-content: right;
  margin-left: 0.5em;
}

.template-content-text {
  flex-wrap: wrap;
  text-align: left;
  row-gap: 1em;
  font-size: 16px;
}

.template-content.left {
  justify-content: left;
}

.blip-container.template-content .alert-icon {
  height: 20px;
  margin-right: 2px;
}

.template-content-header {
  display: flex;
  gap: 8px;
  align-self: flex-start;
}

.blip-container.template-content .bubble {
  &.left,
  &.right {
    display: flex;
    flex-direction: column;
    align-content: start;
    row-gap: 1em;
    flex-wrap: wrap;
    word-wrap: break-word;
    .template-content-header {
      display: flex;
      gap: 8px;
      align-self: flex-start;
    }
  }
}

.blip-container.template-content.blip-card .bubble {
  padding: 10px 16px;
  word-wrap: break-word;
  border-radius: 15px;
  white-space: normal;
  text-align: left;
  font-size: 16px;
}

.text-line-through {
  text-decoration: line-through;
}

.template-content-text-body.right {
  color: $color-surface-1;
}

.template-content-text-body.left {
  color: $color-content-default;
}
</style>
