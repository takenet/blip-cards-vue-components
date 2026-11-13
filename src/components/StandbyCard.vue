<template>
  <div class="standby-card" :class="'standby-card--' + innerPosition">
    <blip-card
      v-if="innerDocument"
      :document="innerDocument"
      :position="innerPosition"
      :date="displayDate"
      :status="status"
      :editable="false"
      :deletable="false"
      :readonly="true"
      :hide-options="true"
      :disable-link="disableLink"
      :on-media-selected="onMediaSelected"
      :on-open-link="onOpenLink"
      :on-audio-validate-uri="onAudioValidateUri"
      :async-fetch-media="asyncFetchMedia"
      :on-image-selected="onImageSelected"
      :translations="translations"
      :transcription="transcription"
    />
    <unsuported-content
      v-else
      class="blip-card"
      :position="innerPosition"
      :document="document"
      :full-document="fullDocument"
      :date="date"
      :translations="translations"
    />
    <bds-icon
      v-if="showIcon"
      class="standby-card__icon"
      name="message-received"
      theme="outline"
      size="small"
      color="var(--color-surface-4, #141414)"
    />
  </div>
</template>

<script>
import { default as base } from '../mixins/baseComponent.js'
import {
  getExternalMessageText,
  getStandbyDirection,
  getStandbyInnerDocument
} from '../utils/standby.js'

export default {
  name: 'standby-card',
  mixins: [base],
  props: {
    status: {
      type: String,
      default: ''
    },
    disableLink: {
      type: Boolean,
      default: false
    },
    onMediaSelected: {
      type: Function
    },
    onOpenLink: {
      type: Function
    },
    onAudioValidateUri: {
      type: Function
    },
    asyncFetchMedia: {
      type: Function
    },
    onImageSelected: {
      type: Function
    },
    transcription: {
      type: Object
    },
    translations: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    direction() {
      return getStandbyDirection(this.document)
    },
    innerPosition() {
      if (this.direction === 'inbound') return 'left'
      if (this.direction === 'outbound') return 'right'
      return this.position
    },
    innerDocument() {
      return getStandbyInnerDocument(this.document)
    },
    showIcon() {
      return Boolean(this.innerDocument) && this.innerPosition === 'right'
    },
    isTemplate() {
      const inner = this.innerDocument
      return Boolean(inner && inner.content && inner.content.type === 'template-content')
    },
    displayDate() {
      if (!this.isTemplate || !this.date) return this.date

      const text = this.translations.standbyExternalMessage || getExternalMessageText(navigator.language)
      return `${this.date} - ${text}`
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables.scss';

.standby-card {
  position: relative;
  width: 100%;

  .standby-card__icon {
    position: absolute;
    left: 100%;
    bottom: 24px;
    margin-left: 4px;
  }

  &.standby-card--left .bubble.left {
    background-color: $color-surface-1;
    border: 1px dashed $color-content-ghost;
    border-radius: 12px 12px 12px 0;
  }

  &.standby-card--right .bubble.right {
    background-color: $color-surface-3;
    border: 1px dashed $color-surface-4;
    border-radius: 12px 12px 0 12px;
    color: $color-surface-4;

    .typo {
      color: $color-surface-4;
    }

    bds-icon[name='paperplane'] {
      filter: invert(92%);
    }
  }

  .blip-container .bubble.template-width {
    width: auto;
    min-width: 0;
  }
}
</style>
