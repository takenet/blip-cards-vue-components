<template>
  <div class="standby-card">
    <span
      v-if="directionLabel"
      class="standby-card__label"
      :class="innerPosition"
    >
      {{ directionLabel }}
    </span>
    <blip-card
      v-if="innerDocument"
      :document="innerDocument"
      :position="innerPosition"
      :date="date"
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
  </div>
</template>

<script>
import { default as base } from '../mixins/baseComponent.js'
import {
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
    },
    userToBotText: {
      type: String,
      default: 'Usuário > Bot'
    },
    botToUserText: {
      type: String,
      default: 'Bot > Usuário'
    }
  },
  computed: {
    direction() {
      return getStandbyDirection(this.document)
    },
    directionLabel() {
      if (this.direction === 'inbound') return this.userToBotText
      if (this.direction === 'outbound') return this.botToUserText
      return undefined
    },
    innerPosition() {
      if (this.direction === 'inbound') return 'left'
      if (this.direction === 'outbound') return 'right'
      return this.position
    },
    innerDocument() {
      return getStandbyInnerDocument(this.document)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';

.standby-card {
  width: 100%;

  &__label {
    display: block;
    margin-bottom: 4px;
    font-size: 12px;
    line-height: 16px;
    color: $color-content-disable;

    &.left {
      text-align: left;
    }

    &.right {
      text-align: right;
    }
  }
}
</style>
