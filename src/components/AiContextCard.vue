<template>
  <div class="blip-container ai-context">
    <div class="ai-context__card">
      <div class="ai-context__header">
        <svg
          class="ai-context__icon"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient :id="gradientId" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#0099ff" />
              <stop offset="1" stop-color="#e180ff" />
            </linearGradient>
          </defs>
          <g :fill="`url(#${gradientId})`">
            <path d="M18.9998 12.5C19.0036 12.39 18.9396 12.2801 18.8116 12.2644C16.9664 12.0209 13.2196 11.4005 12.1652 10.3206C11.2389 9.36641 10.6138 6.27209 10.2862 4.18695C10.2636 4.02595 10.113 3.97098 10 4.01417C9.88703 3.97098 9.73641 4.02595 9.71381 4.18695C9.3862 6.27209 8.76111 9.36641 7.83477 10.3206C6.78039 11.4005 3.03359 12.0209 1.18844 12.2644C1.06041 12.2801 0.996391 12.39 1.00016 12.4961V12.5V12.5039C0.996391 12.6099 1.06041 12.7199 1.18844 12.7356C3.03359 12.9791 6.78039 13.5995 7.83477 14.6794C8.76111 15.6336 9.3862 18.7279 9.71381 20.813C9.73641 20.974 9.88703 21.029 10 20.9858C10.113 21.029 10.2636 20.974 10.2862 20.813C10.6138 18.7279 11.2389 15.6336 12.1652 14.6794C13.2196 13.5995 16.9664 12.9791 18.8116 12.7356C18.9396 12.7199 19.0036 12.61 18.9998 12.5C18.9998 12.5039 18.9998 12.5039 18.9998 12.5Z" />
            <path d="M21.9997 6.00364C22.0034 5.95273 21.9701 5.90182 21.9071 5.89092C20.985 5.77456 19.111 5.48367 18.5851 4.97461C18.1222 4.52736 17.8111 3.06926 17.6444 2.0875C17.6333 2.01114 17.5593 1.98569 17.5 2.00751C17.4444 1.98569 17.3704 2.01114 17.3556 2.0875C17.1926 3.06926 16.8778 4.52372 16.4149 4.97461C15.889 5.48367 14.015 5.77456 13.0929 5.89092C13.0299 5.89819 12.9966 5.94909 13.0003 6C12.9966 6.05091 13.0299 6.10181 13.0929 6.10908C14.015 6.22544 15.889 6.51633 16.4149 7.02539C16.8778 7.47264 17.1889 8.93074 17.3556 9.9125C17.3667 9.98886 17.4407 10.0143 17.5 9.99249C17.5556 10.0143 17.6296 9.98886 17.6444 9.9125C17.8074 8.93074 18.1222 7.47628 18.5851 7.02539C19.111 6.51633 20.985 6.22544 21.9071 6.10908C21.9664 6.10908 21.9997 6.05454 21.9997 6.00364Z" />
            <path d="M23 18.5049C23 18.4464 22.9657 18.3878 22.897 18.3781C21.8715 18.2513 19.7911 17.9196 19.2023 17.349C18.6871 16.8418 18.3388 15.2031 18.1572 14.1009C18.1425 14.018 18.064 13.9887 18.0002 14.0083C17.9364 13.9839 17.853 14.0131 17.8432 14.1009C17.6617 15.2031 17.3133 16.8418 16.7981 17.349C16.2142 17.9196 14.1289 18.2513 13.1034 18.3781C13.0348 18.3878 12.9955 18.4464 13.0004 18.5C13.0004 18.5585 13.0348 18.6122 13.1034 18.6219C14.1289 18.7487 16.2093 19.0804 16.7981 19.651C17.3133 20.1582 17.6617 21.7969 17.8432 22.8991C17.8579 22.982 17.9364 23.0113 18.0002 22.9917C18.064 23.0161 18.1474 22.9869 18.1572 22.8991C18.3388 21.7969 18.6871 20.1582 19.2023 19.651C19.7862 19.0804 21.8715 18.7487 22.897 18.6219C22.9657 18.6219 23 18.5634 23 18.5049C23 18.5098 23 18.5098 23 18.5049Z" />
          </g>
        </svg>
        <div>
          <bds-typo class="ai-context__title" variant="fs-16" bold="bold">{{ titleText }}</bds-typo>
          <bds-typo class="ai-context__subtitle" variant="fs-14">{{ subtitleText }}</bds-typo>
        </div>
      </div>
      <p
        :id="textId"
        ref="text"
        class="ai-context__text"
        :class="{ 'ai-context__text--collapsed': !expanded }"
      >{{ text }}</p>
      <div class="ai-context__actions">
        <bds-button
          v-if="canToggle"
          variant="text"
          size="short"
          color="primary"
          :aria-expanded="expanded ? 'true' : 'false'"
          :aria-controls="textId"
          :icon-right="expanded ? 'arrow-up' : 'arrow-down'"
          @click="expanded = !expanded"
        >{{ expanded ? collapseText : readMoreText }}</bds-button>
        <span v-else></span>
        <bds-button
          variant="text"
          size="short"
          color="content"
          icon-right="copy"
          @click="copy"
        >{{ copyText }}</bds-button>
      </div>
    </div>
    <blip-card-date class="ai-context__date" position="left" :status="status" :date="date" />
  </div>
</template>

<script>
import { default as base } from '../mixins/baseComponent.js'
import { getAiContextText } from '../utils/aiContext.js'

let instanceCount = 0

export default {
  name: 'ai-context-card',
  mixins: [base],
  props: {
    status: {
      type: String,
      default: ''
    },
    titleText: {
      type: String,
      default: 'Contexto da conversa'
    },
    subtitleText: {
      type: String,
      default: 'Resumo de IA da Meta'
    },
    readMoreText: {
      type: String,
      default: 'Ler mais'
    },
    collapseText: {
      type: String,
      default: 'Recolher'
    },
    copyText: {
      type: String,
      default: 'Copiar'
    }
  },
  data() {
    const id = ++instanceCount

    return {
      expanded: false,
      overflowing: undefined,
      gradientId: `ai-context-gradient-${id}`,
      textId: `ai-context-text-${id}`
    }
  },
  computed: {
    text() {
      return getAiContextText(this.document) || ''
    },
    canToggle() {
      return this.expanded || this.overflowing !== false
    }
  },
  watch: {
    text() {
      this.expanded = false
      this.$nextTick(this.measure)
    },
    expanded() {
      this.$nextTick(() => this.$emit('updated'))
    }
  },
  mounted() {
    if (typeof window.ResizeObserver !== 'undefined') {
      this.resizeObserver = new window.ResizeObserver(() => {
        this.measure()
        this.$emit('updated')
      })
      this.resizeObserver.observe(this.$refs.text)
    }
    this.measure()
  },
  beforeDestroy() {
    if (this.resizeObserver) this.resizeObserver.disconnect()
  },
  methods: {
    // Without a ResizeObserver the cut cannot be tracked, so Read more stays available
    measure() {
      const element = this.$refs.text
      if (this.resizeObserver && element && !this.expanded) {
        this.overflowing = element.scrollHeight > element.clientHeight + 1
      }
    },
    copy() {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(this.text).catch(() => this.copyWithTextarea())
      } else {
        this.copyWithTextarea()
      }
    },
    copyWithTextarea() {
      const textArea = document.createElement('textarea')
      textArea.value = this.text
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()

      try {
        document.execCommand('copy')
      } catch (error) {
        // Nothing else to try when the browser blocks copying
      }

      document.body.removeChild(textArea)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';

.ai-context__card {
  width: 100%;
  padding: 16px;
  text-align: left;
  color: $color-content-default;
  border: 1px solid transparent;
  border-radius: 16px;
  background:
    linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)) padding-box,
    linear-gradient(#0073e5, #0073e5) padding-box,
    linear-gradient(135deg, #0099ff 0%, #a85aed 50%, #00c6d7 100%) border-box;
}

.ai-context__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.ai-context__icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
}

.ai-context__date {
  margin-top: 8px;
}

.ai-context__title {
  display: block;
  color: $color-primary;
}

.ai-context__subtitle {
  display: block;
}

.ai-context__text {
  margin: 0;
  font-size: 14px;
  line-height: 22px;
  white-space: pre-line;
  word-break: break-word;
}

.ai-context__text--collapsed {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ai-context__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
}
</style>
