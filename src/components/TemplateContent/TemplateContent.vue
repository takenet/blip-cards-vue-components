<template>
  <div class="blip-container">
    <bds-grid direction="column" :align-items="position === 'right' ? 'flex-end' : 'flex-start'">
      <div :class="bubbleClass">
        <bds-grid direction="column" padding="y-1" gap="1" class="wrap">
          <bds-grid margin="y-1" direction="row" justify-content="flex-start" padding="x-2">
            <bds-icon v-if="position === 'right'" size="small" color="white" alt="paperplane" name="paperplane" />
            <bds-icon v-else size="small" alt="paperplane" name="paperplane" />
            <bds-typo :class="'typo ' + position + ' title-template'" variant="fs-16" bold="semi-bold">{{ showTemplateContentTitle }}</bds-typo>
          </bds-grid>

          <media-content class="blip-card"
            :failed-to-send-msg="translations.failedToSend"
            :aspect-ratio-msg="translations.aspectRatio"
            :supported-formats-msg="translations.supportedFormats"
            :title-msg="translations.title"
            :text-msg="translations.text"
            :status="status"
            :position="position"
            :document="document"
            :date="date"
            :on-metadata-edit="isMetadataReady"
            :on-audio-validate-uri="onAudioValidateUri"
            :async-fetch-media="asyncFetchMedia"/>

          <bds-grid direction="column" justify-content="flex-start" padding="x-2">
            <bds-typo v-if="hasTemplateContentBody"
              v-html="showTemplateContentBody()"
              :class="'typo ' + position" variant="fs-16"
              type="span" />
          </bds-grid>
          <bds-grid
            direction="column"
            align-items="center"
            justify-content="center"
            v-for="(button, index) in componentButtons" v-bind:key="index"
          >
            <website-button v-if="isWebsiteButton(button)" :button="button" :position="position" />
            <phone-number-button v-if="isPhoneNumberButton(button)" :button="button" :position="position" />
          </bds-grid>
        </bds-grid>
      </div>
      <bds-grid
        flex-wrap="wrap"
        direction="row"
        align-items="center"
        justify-content="space-between"
        class="quick-reply-buttons"
        v-if="hasQuickReplyInComponentButtons()"
      >
        <div v-for="(button, index) in componentButtons" v-bind:key="index">
          <span :class="buttonClass">{{ button.text }}</span>
        </div>
      </bds-grid>
    </bds-grid>
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
import base from '@/mixins/baseComponent.js'
import { formatText } from '@/utils/FormatTextUtils'
import { linkify } from '@/utils/misc'
import { BUTTON_TYPE, parseComponentButtons } from '@/utils/TemplateContent'

export default {
  name: 'template-content',
  mixins: [
    base
  ],
  props: {
    translations: {
      type: Object,
      default: () => ({})
    },
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
    onMediaSelected: {
      type: Function
    },
    onAudioValidateUri: {
      type: Function
    },
    onFailedClickIcon: {
      type: Function
    },
    disableLink: {
      type: Boolean,
      default: false
    },
    asyncFetchMedia: {
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
    bubbleClass() {
      const cssClass = ['bubble', this.position, 'template-width']

      return cssClass.join(' ')
    },
    buttonClass() {
      return this.position === 'right' ? 'right' : ''
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

      componentTemplateBody = this.sanitize(componentTemplateBody)
      componentTemplateBody = formatText(componentTemplateBody, '')
      componentTemplateBody = linkify(componentTemplateBody, this.disableLink)

      return componentTemplateBody
    },
    isWebsiteButton(button) {
      return button.type === BUTTON_TYPE.URL
    },
    isPhoneNumberButton(button) {
      return button.type === BUTTON_TYPE.PHONE_NUMBER
    },
    hasQuickReplyInComponentButtons() {
      return this.componentButtons.some(button => button.type === BUTTON_TYPE.QUICK_REPLY)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/variables.scss';

$template-width: 368px;

.icon-active-message-failed {
  position: relative;
  margin-left: 5px;
  margin-right: -1px;
  margin-top: -5px;
  color: $color-extended-red;
  cursor: pointer;
}

.title-template {
  margin-left: 8px;
}

.bubble {
  text-align: left;

  &.template-width {
    width: $template-width;
  }

  > .wrap {
    overflow-wrap: anywhere;
  }
}

.quick-reply-buttons {
  width: $template-width;
  max-width: 90%;
  min-width: 160px;
  margin-top: 3px;
  margin-bottom: 5px;
  
  > div {
    flex: 1 0 calc(50%);
    &:not(:only-child):nth-child(1) {
      padding-right: 4px;
    }

    &:nth-child(2) {
      padding-left: 4px;
    }

    &:nth-child(3) {
      padding-top: 8px;
    }

    > span {
      width: 100%;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;

      border: 1px solid $color-content-ghost;
      border-radius: 13px;
      background-color: $color-surface-1;
      color: $color-content-default;
      cursor: pointer;

      &.right {
        background-color: $color-content-default;
        color: $color-surface-1;
      }
    }
  }
}
</style>
