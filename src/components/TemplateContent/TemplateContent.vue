<template>
  <div class="blip-container">
    <div :class="bubbleClass">
      <bds-grid direction="column" padding="x-2">
        <bds-grid direction="row" justify-content="flex-start" padding="y-1" gap="1">
          <bds-icon v-if="position === 'right'" size="small" color="white" alt="paperplane" name="paperplane" />
          <bds-icon v-else size="small" alt="paperplane" name="paperplane" />
          <bds-typo :class="'typo ' + position" variant="fs-16" bold="semi-bold">{{ showTemplateContentTitle }}</bds-typo>
        </bds-grid>
        <bds-grid direction="column" justify-content="flex-start" padding="y-1">
          <bds-typo class="span" variant="fs-16" bold="semi-bold" v-for="(link, index) in showTemplateContentLinks()" :key="index">
            <a :href="link" target="_blank">{{ link }}</a>
          </bds-typo>
          <bds-typo :class="'typo ' + position" variant="fs-16" bold="regular" v-if="hasTemplateContentBody" v-html="localFormatText(showTemplateContentBody())" />
        </bds-grid>
        <bds-grid
          direction="column"
          align-items="center"
          justify-content="center"
          v-for="(button, index) in componentButtons" v-bind:key="index"
        >
          <website-button v-if="isWebsiteButton(button)" :button="button" :position="position" />
        </bds-grid>
      </bds-grid>
    </div>
    <bds-icon v-if="this.position === 'right' && this.status === 'failed' && this.onFailedClickIcon"
      name="info" theme="solid"
      aria-label="Active message failed reason"
      class="icon-active-message-failed"
      @click="onFailedClickIcon(fullDocument)"
    />
    <blip-card-date
      :status="status"
      :position="position"
      :date="date"
      :failed-to-send-msg="failedToSendMsg"
    />
  </div>
</template>

<script>

import { default as base } from '@/mixins/baseComponent.js'
import { formatText } from '@/utils/FormatTextUtils'
import { BUTTON_TYPE, parseComponentButtons } from '@/utils/TemplateContentButtons'
import WebsiteButton from './Buttons/WebsiteButton.vue'

export default {
  name: 'template-content',
  mixins: [
    base
  ],
  components: {
    WebsiteButton
  },
  props: {
    document: {},
    status: {
      type: String,
      default: ''
    },
    messageTemplateTitle: {
      type: String,
      default: 'Unsupported Content'
    },
    contentTemplateName: {
      type: String,
      default: 'Unsupported Content'
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
      componentButtons: []
    }
  },
  created() {
    this.componentButtons = parseComponentButtons(this.document)
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
    },
    bubbleClass() {
      const cssClass = ['bubble', this.position]

      if (this.componentButtons.length > 0) {
        cssClass.push('buttons')
      }

      return cssClass.join(' ')
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
      if (!this.hasTemplateContentHeader || !this.hasTemplateContentBody) {
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
    localFormatText(text, style) {
      if (!text) {
        return ''
      }
      return formatText(text, style)
    },
    isWebsiteButton(button) {
      return button.type === BUTTON_TYPE.URL
    },
    isPhoneNumberButton(button) {
      return button.type === BUTTON_TYPE.PHONE_NUMBER
    },
    isQuickReplyButton(button) {
      return button.type === BUTTON_TYPE.QUICK_REPLY
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/variables.scss';

.w-100 {
  width: 100%;
}

.icon-active-message-failed {
  position: relative;
  margin-left: 5px;
  margin-right: -1px;
  margin-top: -5px;
  color: $color-extended-red;
  cursor: pointer;
}

.bubble {
  text-align: left;

  &.buttons {
    width: 368px;
  }
}

.template-content-blocks {
  padding: 10px 20px;
}
</style>