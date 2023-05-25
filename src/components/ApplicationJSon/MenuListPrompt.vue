<template>
  <div v-if="!isEditing" class="blip-container menu-list-prompt">
    
    <div :class="isFailedMessage(status, position)">
      <div :class="'bubble ' + position">
        <div v-if="deletable" class="editIco trashIco" @click="trash(document)">
          <img :src="trashSvg" />
        </div>
        <div v-if="editable && !isEditing" class="editIco" @click="toggleEdit">
          <img :src="editSvg" />
        </div>
        <div class="disable-selection">
          <div class="header-text">
            <bds-typo variant="fs-16" bold="bold" line-height="plus" class="disable-selection menu-list-prompt-option" v-bind:class="{ readonly: readonly }">{{ headerText }}</bds-typo>
          </div>
          <div class="body-text">
            <bds-typo variant="fs-16" bold="regular" line-height="plus" class="disable-selection menu-list-prompt-option" v-bind:class="{ readonly: readonly }">{{ bodyText }}</bds-typo>
          </div>
          <div class="button-text text-center pointer">
            <div>
              <div class="menu-list-options-button">
                <bds-icon name="list" theme="outline" class="menu-list-options-button-icon"></bds-icon>
                <bds-typo variant="fs-16" bold="regular" line-height="simple" class="disable-selection menu-list-prompt-option menu-list-options-button-text" v-bind:class="{ readonly: readonly }">
                  {{ buttonText }}
                </bds-typo>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="blip-container menu-list-prompt" v-else>
    <form :class="'bubble ' + position" novalidate v-on:submit.prevent>
      <button class="btn saveIco closeIco" @click="menuListEditCancel()" >
        <img :src="closeSvg" />
      </button>
      <button class="btn saveIco" :class="{'is-disabled': errors.any() }" @click="menuListSave(headerText)">
        <img :src="approveSvg" />
      </button>
      <div class="form-group">
        <div>
          <textarea @keydown.enter="menuListSave($event)" type="text" name="headerText" :class="{'input-error': errors.has('headerText') }" v-validate="'required'" class="form-control" v-auto-expand v-model="headerText" />
          <bds-typo variant="fs-12" v-show="errors.has('headerText')" class="help input-error">{{ errors.first('headerText') }}</bds-typo>
        </div>
        <div>
          <textarea @keydown.enter="menuListSave($event)" type="text" name="bodyText" :class="{'input-error': errors.has('bodyText') }" v-validate="'required'" class="form-control" v-auto-expand v-model="bodyText" />
          <bds-typo variant="fs-12" v-show="errors.has('bodyText')" class="help input-error">{{ errors.first('bodyText') }}</bds-typo>
        </div>
        <div>
          <textarea @keydown.enter="menuListSave($event)" type="text" name="buttonText" :class="{'input-error': errors.has('buttonText') }" v-validate="'required'" class="form-control" v-auto-expand v-model="buttonText" />
          <bds-typo variant="fs-12" v-show="errors.has('buttonText')" class="help input-error">{{ errors.first('buttonText') }}</bds-typo>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { default as base } from '../../mixins/baseComponent.js'
import { isFailedMessage } from '../../utils/misc'
import Editable from '../Editable'

export default {
  name: 'menu-list-prompt',
  mixins: [base],
  props: {
    status: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: 'right'
    }
  },
  data: function() {
    return {
      headerText: undefined,
      buttonText: undefined,
      bodyText: undefined,
      isFailedMessage
    }
  },
  updated: function() {
    this.$emit('updated')
  },
  mounted: function() {
    this.updateImageMarginTop()
  },
  methods: {
    init: function() {
      this.headerText = this.document.interactive.header.text
      this.bodyText = this.document.interactive.body.text
      this.buttonText = this.document.interactive.action.button
    },
    updateImageMarginTop: function() {
      this.$emit('updated')

      if (!Editable) return

      setTimeout(() => {
        this.updateImageMarginTop()
      }, 100)
    },
    menuListSave: function($event) {
      if (this.errors.any() || ($event && $event.shiftKey)) {
        return
      }

      this.$validator.validateAll().then((result) => {
        if (!result) return

        this.save({
          ...this.document.interactive.header,
          text: this.headerText
        })

        this.save({
          ...this.document.interactive.body,
          text: this.bodyText
        })

        this.save({
          ...this.document.interactive.action,
          button: this.buttonText
        })
      })
    },
    menuListEditCancel: function() {
      this.cancel()
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';

.menu-list-prompt-option {
  color: $vue-white; // verificar cor para o rebranding
}

.menu-list-prompt .bubble {
  padding: $bubble-padding;
  padding-left: 0px;
  padding-right: 0px;
  min-width: 206px;
  text-align: left;
  border-top: 1px solid #6E7B91!important;
  border-left: 1px solid #6E7B91!important;
  border-bottom: 1px solid #6E7B91!important;
  border-right: 1px solid #6E7B91!important;
}

.header-text {
  padding-top: 0px!important;
  padding-bottom: 0px!important;
  padding: $bubble-padding;
}

.body-text {
  padding-top: 0px!important;
  padding-bottom: 10px!important;
  padding: $bubble-padding;
}

.button-text {
  padding-top: 0px!important;
  padding-bottom: 0px!important;
  padding: $bubble-padding;
  border-top: 0.5px solid #6E7B91;

  div:first-child {
    text-align: center;
    display: inline-flex;
  }
}

.menu-list-options-button {
  .menu-list-options-button-icon
  .lmenu-list-options-button-text {
    float: left;
  }

  .menu-list-options-button-icon {
    margin-top: 12px;
  }
}


.blip-card .form-group .help {
  padding: 0px;
}
</style>