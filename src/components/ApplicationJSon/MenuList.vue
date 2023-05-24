<template>
  <div v-if="!isEditing" class="blip-container menu-list">
    
    <div :class="isFailedMessage(status, position)">
      <div :class="'bubble ' + position">
        <div v-if="deletable" class="editIco trashIco" @click="trash(document)">
          <img :src="trashSvg" />
        </div>
        <div v-if="editable && !isEditing" class="editIco" @click="toggleEdit">
          <img :src="editSvg" />
        </div>
        <div class="fixed-options disable-selection">
          <ul>
            <div class="button-text">
              <bds-typo variant="fs-16" bold="regular" italic="true" class="disable-selection menu-list-option" v-bind:class="{ readonly: readonly }">{{ buttonText }}</bds-typo>
            </div>
            <li v-for="(section, index) in sections" v-bind:key="index" class="disable-selection" v-bind:class="{ readonly: readonly }">
              <div>
                <li v-if="section.title" class="section-title" v-bind:class="{ readonly: readonly }">
                  <bds-typo variant="fs-16" bold="semi-bold" class="menu-list-option">{{ sanitize(section.title) }}</bds-typo>
                </li>
                <li v-for="(row, index) in section.rows" v-bind:key="index" class="disable-selection" v-bind:class="{ readonly: readonly }">
                  <div>
                    <bds-typo variant="fs-16" bold="regular" class="menu-list-option">{{ sanitize(row.title) }}</bds-typo>
                  </div>
                </li>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div class="blip-container menu-list" v-else-if="!addOption">
    <form :class="'bubble ' + position" novalidate v-on:submit.prevent>
      <button class="btn saveIco closeIco" @click="menuListEditCancel()" >
        <img :src="closeSvg" />
      </button>
      <button class="btn saveIco" :class="{'is-disabled': errors.any() }" @click="menuListSave(buttonText)">
        <img :src="approveSvg" />
      </button>
      <div class="form-group">
        <textarea @keydown.enter="menuListSave(buttonText, $event)" type="text" name="text" :class="{'input-error': errors.has('text') }" v-validate="'required'" class="form-control" v-auto-expand v-model="buttonText" />
        <span v-show="errors.has('text')" class="help input-error">{{ errors.first('text') }}</span>
      </div>

      <div class="text-center" :class="{ 'fixed-options': document.scope !== 'immediate', 'options': document.scope === 'immediate'}">
        <ul>
          <li v-for="(section, indexSection) in sections" v-bind:key="indexSection">
            <div>
              <li v-if="section.title" class="section-title" @click="editOption(section, index, $event)">
                <bds-typo variant="fs-16" bold="semi-bold" class="menu-list-option">{{ sanitize(section.title) }}</bds-typo>
              </li>
              <li v-for="(row, indexRow) in section.rows" v-bind:key="indexRow" @click="editOption(row, indexSection, indexRow, $event)">
                <div>
                  <bds-typo variant="fs-16" bold="regular" class="menu-list-option">{{ sanitize(row.title) }}</bds-typo>
                  <bds-typo variant="fs-16" @click="deleteOption(indexSection, indexRow, $event)" class="remove-option menu-list-option">
                    <img :src="(position !== 'right')? closeBlueSvg : closeSvg">
                  </bds-typo>
                </div>
              </li>
              <span v-show="hasDeleteOptionError" class="remove-option-error">{{ notEnoughOptionsMsg }}</span>
              <div @click="editOption({}, indexSection, -1, $event)" :class="'btn-dashed primary-color ' + (position !== 'right'? 'btn': 'btn-white pointer')" style="margin-top: 10px; width: 100%;">
                <span>{{ addButtonMsg }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>

    </form>
  </div>

  <div class="blip-container" v-else>
    <form novalidate v-on:submit.prevent :class="'bubble ' + position">
      <div class="tabs">
        <span :class="{ 'active': headerTab === 'plainText'}" @click="setTab('plainText')">{{ textMsg }}</span>
      </div>

      <div v-if="headerTab === 'plainText'">
        <div class="form-group">
          <input type="text" name="optionText" v-validate="'required'" class="form-control" v-model="selectedOption.title" :placeholder="textMsg" />
          <span v-show="errors.has('optionText')" class="help input-error">{{ errors.first('optionText') }}</span>
        </div>
      </div>

      <div class="form-group blip-card-flex">
        <div class="flex-item">
          <button type="button" @click="cancelOption()" class="btn btn-white color-gray">{{ cancelMsg }}</button>
        </div>
        <div class="flex-item">
          <button @click="saveOption()" class="btn btn-white primary-color" :class="{'is-disabled': errors.any() }">{{ applyMsg }}</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { default as base } from '../../mixins/baseComponent.js'
import { guid, isFailedMessage } from '../../utils/misc'
import Editable from '../Editable'
const optionSize = 34

export default {
  name: 'menu-list',
  mixins: [base],
  props: {
    hideOptions: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: ''
    },
    failedToSendMsg: {
      type: String,
      default: 'Falha ao enviar a mensagem.'
    },
    addOptionMsg: {
      type: String,
      default: 'Add option'
    },
    addButtonMsg: {
      type: String,
      default: 'Add button'
    },
    notEnoughOptionsMsg: {
      type: String,
      default: 'Requires at least 1 option'
    },
    textMsg: {
      type: String,
      default: 'Text'
    },
    applyMsg: {
      type: String,
      default: 'Apply'
    },
    cancelMsg: {
      type: String,
      default: 'Cancel'
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
      addOption: undefined,
      headerTab: undefined,
      selectedOption: undefined,
      hide: undefined,
      text: undefined,
      options: undefined,
      sections: undefined,
      buttonText: undefined,
      id: undefined,
      slideIndex: undefined,
      endOfSlider: undefined,
      hasDeleteOptionError: false,
      isFailedMessage
    }
  },
  updated: function() {
    this.$emit('updated')
  },
  mounted: function() {
    this.updateImageMarginTop()
  },
  watch: {
    hideOptions: function() {
      this.hide = this.hideOptions
    }
  },
  methods: {
    init: function() {
      this.id = guid()
      this.slideIndex = 1
      this.endOfSlider = false
      this.addOption = false
      this.headerTab = 'plainText'
      this.selectedOption = { value: {} }
      this.hide = this.hideOptions
      this.text = this.document.text
      this.sections = this.document.interactive.action.sections
      this.buttonText = this.document.interactive.action.button
    },
    updateImageMarginTop: function() {
      this.$emit('updated')

      if (!Editable) return

      setTimeout(() => {
        this.updateImageMarginTop()
      }, 100)
    },
    deleteOption: function(indexSection, indexRow, $event) {
      if ($event) {
        $event.stopPropagation()
      }
      if (this.sections[indexSection].rows.length < 2) {
        this.hasDeleteOptionError = true
        return
      }
      this.sections[indexSection].rows.splice(indexRow, 1)
    },
    cancelOption: function(item) {
      this.errors.clear()
      this.$validator.reset()
      this.selectedOption = {}
      this.addOption = false
    },
    saveOption: function($event) {
      this.$validator.validateAll()
      if (this.errors.any() || ($event && $event.shiftKey)) {
        return
      }

      if ($event) {
        $event.stopPropagation()
        $event.preventDefault()
        $event.returnValue = false
      }

      this.addOption = false
      this.selectedOption.title =
        this.selectedOption.title.length > optionSize
          ? this.selectedOption.title.substring(0, optionSize) + '...'
          : this.selectedOption.title

      if (this.selectedOption.indexRow === -1) {
        this.sections[this.selectedOption.indexSection].rows.push(this.selectedOption)
      } else {
        this.sections[this.selectedOption.indexSection].rows.splice(this.selectedOption.indexRow, 1, this.selectedOption)
      }

      this.selectedOption = {}
      this.errors.clear()
      this.$validator.reset()
      this.addOption = false
    },
    editOption: function(item, indexSection, indexRow, $event) {
      this.hasDeleteOptionError = false
      this.addOption = true
      this.selectedOption = { ...item }
      this.selectedOption.indexSection = indexSection
      this.selectedOption.indexRow = indexRow
    },
    menuListSave: function(buttonText, $event) {
      this.hasDeleteOptionError = false
      if (this.errors.any() || ($event && $event.shiftKey)) {
        return
      }
      this.slideIndex = 1
      if ($event) {
        $event.stopPropagation()
        $event.preventDefault()
        $event.returnValue = false
      }

      this.$validator.validateAll().then((result) => {
        if (!result) return
        this.selectedOption = {}
        this.addOption = false

        this.save({
          ...this.document.interactive.action,
          button: buttonText
        })
      })
    },
    menuListEditCancel: function() {
      this.hasDeleteOptionError = false
      this.cancel()
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';

.menu-list-option {
  color: $vue-white; // verificar cor para o rebranding
}

.menu-list .bubble {
  padding: $bubble-padding;
  min-width: 206px;
  text-align: left;
}

.menu-list .fixed-options li:last-child {
  padding-bottom: 0px;
}

.remove-option-error {
  color: $vue-warning;
  size: 5px;
  font-size: 12px;
  text-align: left;
  display: flex;
  padding-left: 15px;
  margin-top: -10px;
}

.button-text {
  padding-top: 0px!important;
  padding-bottom: 0px!important;
  padding-left: 10px;
}

.section-title {
  border-top: none!important;
  border-bottom: none!important;
  padding-top: 0px;
  padding-bottom: 0px;
}

.blip-card .fixed-options li {
  padding-right: 5px;
  padding-left: 5px;
}

.blip-card .fixed-options ul {
  margin-top: 0px!important;
}

.blip-card .left .fixed-options li, 
.middle .fixed-options li, 
.right .fixed-options li {
  color: $vue-light-blip;
  border-top: none!important;
  border-bottom: 0.5px solid #e4e2e2;
}

.blip-card .left .fixed-options li li:first, 
.middle .fixed-options li:first, 
.right .fixed-options li:first {
  border-top: none!important;
  border-bottom: none!important;
  padding-top: 0px;
  padding-bottom: 0px;
}

.blip-card .left .fixed-options li:last-child, 
.middle .fixed-options li:last-child, 
.right .fixed-options li:last-child {
  border-top: none!important;
  border-bottom: none!important;
}
</style>
