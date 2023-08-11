<template>
  <div class="blip-container summary">
    <div v-if="document.isLoading">
      <chat-state
        class="blip-card"
        :ms-to-wait-msg="translations.msToWait"
        :status="status"
        :position="position"
        :document="document"
        :full-document="document"
        :date="date"
      />
    </div>
    <div v-else>
      <div :class="'bubble ' + position">
        <div>
          <div class="title-summary">
            <div class="title-icon">
              <bds-icon
                theme="outline"
                name="robot"
                style="margin-right: 8px;"
                size="x-large"
              />
            </div>
            <div class="flex justify-between title-text">
              <bds-typo
                variant="fs-16"
                bold="bold"
                tag="h1"
                style="margin: 4px 8px 0px 0px"
              >
                {{ this.translations.titleConversationSummary }}
              </bds-typo>
              <bds-chip-tag color="outline">
                Ticket #{{
                  `${this.document.sequentialId}${
                    this.document.sequentialSuffix
                      ? this.document.sequentialSuffix
                      : ''
                  }`
                }}
              </bds-chip-tag>
            </div>
          </div>
          <div v-if="status !== 'failed'" class="itens-summary">
            <ul>
              <li
                v-for="(item, index) in this.document.summary"
                v-bind:key="index"
              >
                <bds-typo variant="fs-16" bold="regular">{{
                  sanitizeText(item)
                }}</bds-typo>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <blip-card-date
        :status="status"
        :position="position"
        :date="date"
        :failed-to-send-msg="failedToSendMsg"
      />
  </div>
</template>

<script>
import { default as base } from '../mixins/baseComponent.js'
import { linkify } from '../utils/misc'

export default {
  name: 'conversation-summary',
  mixins: [base],
  props: {
    document: {
      type: Object,
      required: true
    },
    translations: {
      type: Object,
      default: () => ({})
    },
    status: {
      type: String,
      default: ''
    },
    disableLink: {
      type: Boolean,
      default: false
    },
    failedToSendMsg: {
      type: String,
      default: 'Falha ao enviar a mensagem'
    }
  },
  methods: {
    init: function() {
      console.log('date ' + this.date)
    },
    sanitizeText: function(text) {
      return linkify(this.sanitize(text), this.disableLink)
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables.scss';

.summary .bubble {
  padding: $bubble-padding;
  word-wrap: break-word;
  min-width: auto !important;
  text-align: left;
  background-color: $color-warning !important;
  color: $color-content-default !important;
}

ul {
  font-size: 24px;
  margin-block: 0px;
  padding-left: 35px;
}
.itens-summary {
  padding-top: 8px;
}
.title-summary {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  .title-icon {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0px;
    gap: 8px;
  }
  .title-text {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    align-items: center;
  }
}
</style>
