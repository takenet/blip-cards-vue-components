<template>
  <div class="blip-container copy-and-paste-card" id="copy-and-paste-container">
    <div :class="'bubble ' + position">
        <bds-grid direction="column" align-items="flex-start">
          <bds-grid direction="column" align-items="flex-start" padding="y-1" margin="x-2" gap="1">
            <bds-typo v-show="this.document.header" bold="bold">{{ this.document.header }}</bds-typo>
            <bds-typo>{{ this.document.body }}</bds-typo>
            <bds-typo v-show="this.document.footer" italic="true" variant="fs-10">{{ this.document.footer }}</bds-typo>
          </bds-grid>
          <hr class="copy-and-paste-horizontal-divider">
          <bds-grid direction="row" align-items="center" justify-content="center" class="action-container" padding="y-1" margin="x-2" gap="1" @click="writeToClipboard">
            <bds-icon name="copy" class="action-container-text"></bds-icon>
            <bds-typo class="action-container-text">{{ this.document.action.button.text }}</bds-typo>
          </bds-grid>
        </bds-grid>
    </div>
    <blip-card-date
      :status="status"
      :position="position"
      :date="date"
      :failed-to-send-msg="failedToSendMsg" />
  </div>
</template>

<script>
  import { default as base } from '../mixins/baseComponent.js'
  export default {
    name: 'copy-and-paste-card',
    mixins: [base],
    props: {
      translations: {
        type: Object,
        default: () => ({})
      },
      failedToSendMsg: {
        type: String,
        default: 'Falha ao enviar a mensagem.'
      }
    },
    computed: {
    },
    methods: {
      writeToClipboard() {
        navigator.clipboard.writeText(this.document.action.button.value)
      }
    }
  }
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';

.copy-and-paste-horizontal-divider {
  width: 100%;
  margin: 0;
  color: $color-content-ghost;
}

.action-container {
  width: -webkit-fill-available;
  cursor: pointer;
}

.action-container-text {
  color: $color-primary;
}
</style>