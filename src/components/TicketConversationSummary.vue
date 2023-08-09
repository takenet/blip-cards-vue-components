<template>
  <div class="blip-container summary">
    <div :class="'bubble ' + position">
      <div v-if="document.isLoad">
        <div class="typing">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>        
        </div>
      </div>
      <div v-else>
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

export default {
  name: 'ticket-conversation-summary',
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
    length: {
      type: Number,
      default: 532
    },
    disableLink: {
      type: Boolean,
      default: false
    },
    showMoreMsg: {
      type: String,
      default: 'Ver mais'
    },
    failedToSendMsg: {
      type: String,
      default: 'Bla bla bla'
    }
  },
  data: function() {
    return {
      showContent: undefined
    }
  },
  methods: {
    init: function() {
      this.showContent = false
    },
    sanitizeText: function(text) {
      return this.sanitize(text)
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
  .typing {
    display: inline-block;
  }
  .typing .typing-dot {
    float: left;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin: 2px;
    background: $color-content-default;
    animation-name: bounce;
    animation-duration: 0.8s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
  }
  .typing .typing-dot:nth-child(2) {
    animation-delay: 0.1s;
  }
  .typing .typing-dot:nth-child(3) {
    animation-delay: 0.2s;
  }

  @keyframes bounce {
    0% {
      transform: translateY(0px);
    }
    30% {
      transform: translateY(-6px);
    }
    100% {
      transform: translateY(0px);
    }
  }
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
