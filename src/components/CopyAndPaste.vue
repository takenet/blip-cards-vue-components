<template>
  <div class="blip-container copy-and-paste-card" id="copy-and-paste-container">
    <div :class="'bubble ' + position">
      <bds-button-icon
        v-if="deletable && !isEditing"
        class="editIco trashIco"
        icon="trash"
        variant="delete"
        size="short"
        v-on:click="trash(document)"
      ></bds-button-icon>
      <bds-button-icon
        v-if="editable && !isEditing"
        class="editIco"
        icon="edit"
        variant="primary"
        size="short"
        v-on:click="toggleEdit"
      ></bds-button-icon>
      <div v-if="!isEditing">
        <bds-grid direction="column" align-items="flex-start">
          <bds-grid direction="column" align-items="flex-start" padding="y-1" margin="x-2" gap="1">
            <bds-typo class="typo copy-and-paste-info-text" v-show="this.document.header" bold="bold">{{ this.document.header }}</bds-typo>
            <bds-typo class="typo copy-and-paste-info-text">{{ this.document.body }}</bds-typo>
            <bds-typo class="typo copy-and-paste-info-text" v-show="this.document.footer" italic="true" variant="fs-10">{{ this.document.footer }}</bds-typo>
          </bds-grid>
          <hr class="copy-and-paste-horizontal-divider">
          <bds-grid direction="row" align-items="center" justify-content="center" class="button-container" gap="1" @click="writeToClipboard">
            <bds-icon name="copy" :class="'button-container-text-' + (position == 'right' ? 'white' : 'primary')"></bds-icon>
            <bds-typo :class="'button-container-text-' + (position == 'right' ? 'white' : 'primary')">{{ this.document.button.text }}</bds-typo>
          </bds-grid>
        </bds-grid>
      </div>
      <div v-if="isEditing">
        <div v-if="!isEditingButton" class="form">
          <form novalidate v-on:submit.prevent>
            <bds-button-icon
              class="btn saveIco closeIco"
              icon="close"
              variant="ghost"
              size="short"
              v-on:click="backToOriginalDocumentAndCancel()"
            ></bds-button-icon>
            <bds-button-icon
              class="btn saveIco"
              icon="check"
              variant="primary"
              size="short"
              :disabled="errors.any()"
              v-on:click="copyAndPasteSave()"
            >
            </bds-button-icon>
            <div class="form-group">
              <bds-grid direction="column" gap="2">
                <input
                  type="text"
                  name="header"
                  class="form-control"
                  v-model="header"
                  :placeholder="headerMessage"
                />
                <bds-grid direction="column" gap="half">
                  <input
                    type="text"
                    name="body"
                    :class="{ 'input-error': errors.has('body') }"
                    v-validate="'required'"
                    class="form-control"
                    v-model="body"
                    :placeholder="bodyMessage"
                  />
                  <bds-grid direction="row" align-items="center" gap="half">
                    <bds-icon class="typo" name="info" size="x-small"></bds-icon>
                    <bds-typo class="typo" tag="span" variant="fs-12">{{ requiredFieldText }}</bds-typo>
                  </bds-grid>
                </bds-grid>
                <input
                  type="text"
                  name="footer"
                  class="form-control"
                  v-model="footer"
                  :placeholder="footerMessage"
                />
                <div class="button-container">
                  <bds-button variant="ghost" icon="copy" class="in-edit-button" v-on:click="toggleEditButton">
                    <div class="edit-copy-and-paste-button">
                      <bds-typo bold="bold" class="typo">{{ this.document.button.text }}</bds-typo>
                    </div>
                  </bds-button>
                </div>
              </bds-grid>
            </div>
            <button
              v-if="typeof onMetadataEdit === 'function'"
              class="define-metadata blip-media-link-metadata"
              @click="editMetadata(fullDocument)"
            >
              {{ metadataButtonText }}
            </button>
          </form>
        </div>
        <div v-else="isEditingButton" class="form">
          <form novalidate v-on:submit.prevent>
            <div class="form-group">
              <bds-grid direction="column" gap="2">
                <input
                  type="text"
                  name="text"
                  class="form-control"
                  v-model="text"
                  :placeholder="copyButtonMessage"
                />
                <bds-grid direction="column" gap="half">
                  <input
                    type="text"
                    name="value"
                    :class="{ 'input-error': errors.has('value') }"
                    v-validate="'required'"
                    class="form-control"
                    v-model="value"
                    :placeholder="copyContentMessage"
                  />
                  <bds-grid direction="row" align-items="center" gap="half">
                    <bds-icon class="typo" name="info" size="x-small"></bds-icon>
                    <bds-typo class="typo" tag="span" variant="fs-12">{{ copyContentText }}</bds-typo>
                  </bds-grid>
                </bds-grid>
                <bds-grid direction="row" align-items="center" justify-content="center" gap="2">
                  <bds-button variant="ghost" v-on:click="cancelEditButton">{{ cancelText }}</bds-button>
                  <bds-button :disabled="!value" variant="ghost" v-on:click="saveButton">{{ saveText }}</bds-button>
                </bds-grid>
              </bds-grid>
            </div>
          </form>
        </div>
      </div>
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
      requiredFieldText: {
        type: String,
        default: 'Campo obrigatório'
      },
      copyContentText: {
        type: String,
        default: 'Escolha o conteúdo a ser copiado'
      },
      cancelText: {
        type: String,
        default: 'Cancelar'
      },
      saveText: {
        type: String,
        default: 'Salvar'
      },
      headerMessage: {
        type: String,
        default: 'Mensagem de cabeçalho'
      },
      bodyMessage: {
        type: String,
        default: 'Mensagem de corpo'
      },
      footerMessage: {
        type: String,
        default: 'Mensagem de rodapé'
      },
      copyButtonMessage: {
        type: String,
        default: 'Mensagem do botão de copiar'
      },
      copyContentMessage: {
        type: String,
        default: 'Valor a ser copiado'
      },
      status: {
        type: String,
        default: ''
      },
      position: {
        type: String,
        default: 'left'
      },
      failedToSendMsg: {
        type: String,
        default: 'Falha ao enviar a mensagem.'
      }
    },
    data: function() {
      return {
        header: undefined,
        body: undefined,
        footer: undefined,
        text: undefined,
        value: undefined,
        isEditingButton: false,
        originalDocument: undefined
      }
    },
    watch: {
      document: function() {
        this.init()
      }
    },
    computed: {
    },
    methods: {
      init: async function() {
        this.header = this.document.header
        this.body = this.document.body
        this.footer = this.document.footer
        this.text = this.document.button.text
        this.value = this.document.button.value
        this.isEditingButton = false
        this.originalDocument = { ...this.document }
      },
      writeToClipboard() {
        navigator.clipboard.writeText(this.document.button.value)
      },
      toggleEditButton() {
        this.isEditingButton = !this.isEditingButton
      },
      cancelEditButton() {
        this.toggleEditButton()

        this.document.button = {
          ...this.document.button
        }
      },
      saveButton: function($event) {
        if (!this.value) {
          return
        }

        this.document.button = {
          ...this.document.button,
          text: this.text,
          value: this.value
        }

        this.toggleEditButton()
      },
      backToOriginalDocumentAndCancel: function() {
        this.document = {
          ...this.originalDocument,
          button: {
            ...this.originalDocument.button
          }
        }

        this.cancel()
      },
      copyAndPasteSave: function($event) {
        if (this.errors.any() || ($event && $event.shiftKey)) {
          return
        }

        if ($event) {
          $event.stopPropagation()
          $event.preventDefault()
          $event.returnValue = false
        }

        this.$validator.validateAll().then((result) => {
          if (!result) {
            return
          }

          this.save({
            ...this.document,
            header: this.header,
            body: this.body,
            footer: this.footer,
            button: {
              ...this.document.button,
              text: this.text,
              value: this.value
            }
          })
        })
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

.button-container {
  width: 100%;
  padding: 8px 16px;
  cursor: pointer;
}

.button-container-text-primary {
  color: $color-primary;
}

.button-container-text-white {
  color: $color-surface-1;
}

.in-edit-button {
  display: grid;
}

.copy-and-paste-info-text {
  word-wrap: break-word;
  min-width: auto !important;
  text-align: left;
  word-break: break-word;
}

.edit-copy-and-paste-button {
  width: 200px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: ltr;
}
</style>
