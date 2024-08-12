<template>
  <div v-if="!isEditing" class="blip-container menu-list-prompt">
    <div :class="isFailedMessage(status, position)">
      <div :class="'bubble ' + position">
        <bds-button-icon v-if="deletable && !isEditing"
        class="editIco trashIco icon-margin"
        icon="trash"
        variant="delete"
        size="short"
        v-on:click="trash(document)"
      ></bds-button-icon>
      <bds-button-icon v-if="editable && !isEditing"
        class="editIco icon-margin"
        icon="edit"
        variant="primary"
        size="short"
        v-on:click="toggleEdit"
      ></bds-button-icon>         
        <div class="disable-selection">
          <div class="header-text">
            <bds-typo
              variant="fs-16"
              bold="bold"
              line-height="plus"
              class="disable-selection typo"
              v-bind:class="{ readonly: readonly }"
              >{{ bodyText }}</bds-typo
            >
          </div>
          <div class="footer-text">
            <bds-typo
              variant="fs-16"
              bold="regular"
              line-height="plus"
              class="disable-selection typo"
              v-bind:class="{ readonly: readonly }"
              >{{ footerText }}</bds-typo
            >
          </div>

          <div class="fixed-options">
            <ul>
              <li
                v-on:click="callToActionSelectedOption()"
                :class="editable ? '' : ' pointer'"
              >
                <div class="align-center">
                  <bds-icon class="typo" name="link" size="medium"  ></bds-icon>
                  <bds-typo variant="fs-16">{{displayText}}</bds-typo>
                </div>
              </li>
            </ul>
          </div> 

        </div>
      </div>
    </div>
  </div>

  <div class="blip-container menu-list-prompt" v-else>
    <form :class="'bubble ' + position" novalidate v-on:submit.prevent>
      <bds-button-icon 
      class="btn saveIco closeIco"
      icon="close"
      variant="ghost"
      size="short"
      v-on:click="callToActionEditCancel()"
    ></bds-button-icon>
    <bds-button-icon 
      class="btn saveIco"
      icon="check"
      variant="primary"
      size="short"
      :disabled="errors.any()"
      v-on:click="callToActionSave(bodyText)"
    ></bds-button-icon>      
      <div class="form-group">
        <div>
          <textarea
            @keydown.enter="callToActionSave($event)"
            type="text"
            name="bodyText"
            :class="{ 'input-error': errors.has('bodyText') }"
            v-validate="'required'"
            class="form-control"
            v-auto-expand
            v-model="bodyText"
          />
          <bds-typo
            variant="fs-12"
            v-show="errors.has('bodyText')"
            class="help input-error"
            >{{ errors.first('bodyText') }}</bds-typo
          >
        </div>
        <div>
          <textarea
            @keydown.enter="callToActionSave($event)"
            type="text"
            name="footerText"
            :class="{ 'input-error': errors.has('footerText') }"
            v-validate="'required'"
            class="form-control"
            v-auto-expand
            v-model="footerText"
          />
          <bds-typo
            variant="fs-12"
            v-show="errors.has('footerText')"
            class="help input-error"
            >{{ errors.first('footerText') }}</bds-typo
          >         
        </div>
        <div>
          <textarea
            @keydown.enter="callToActionSave($event)"
            type="text"
            name="headerText"
            :class="{ 'input-error': errors.has('headerText') }"
            v-validate="'required'"
            class="form-control"
            v-auto-expand
            v-model="displayText"
          />
          <bds-typo
            variant="fs-12"
            v-show="errors.has('headerText')"
            class="help input-error"
            >{{ errors.first('headerText') }}</bds-typo
          >         
        </div>
        <div>
          <textarea
            @keydown.enter="callToActionSave($event)"
            type="text"
            name="url"
            :class="{ 'input-error': errors.has('url') }"
            v-validate="'required'"
            class="form-control"
            v-auto-expand
            v-model="url"
          />
          <bds-typo
            variant="fs-12"
            v-show="errors.has('url')"
            class="help input-error"
            >{{ errors.first('url') }}</bds-typo
          >
        </div>      
      </div>
    </form>
  </div>
</template>

<script>
import { default as base } from '../../mixins/baseComponent.js'
import { isFailedMessage } from '../../utils/misc'

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
      footerText: undefined,
      selectedOption: undefined,
      displayText: undefined,
      url: undefined,
      isFailedMessage
    }
  },
  updated: function() {
    this.$emit('updated')
  },

  methods: {
    init: function() {
      this.headerText = this.document.interactive.header.text
      this.bodyText = this.document.interactive.body.text
      this.footerText = this.document.interactive.footer.text
      this.url = this.document.interactive.action.parameters.url
      this.displayText = this.document.interactive.action.parameters.display_text
    },
    callToActionSelectedOption: function() {
      let win = window.open(this.url, '_blank')
      win.focus()
    },
    callToActionSave: function($event) {
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
          ...this.document.interactive.footer,
          text: this.footerText
        })

        this.save({
          ...this.document.interactive.action,
          button: this.buttonText
        })
      })
    },
    callToActionEditCancel: function() {
      this.cancel()
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';

.menu-list-prompt .bubble {
  padding: $bubble-padding;
  padding-left: 0px;
  padding-right: 0px;
  min-width: 206px;
  text-align: left;
}

.header-text {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  padding: $bubble-padding;
}

.body-text, .footer-text {
  padding-top: 0px !important;
  padding-bottom: 10px !important;
  padding: $bubble-padding;
}

.button-text {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  padding: $bubble-padding;
  border-top: 0.5px solid $color-content-ghost;

  div:first-child {
    text-align: center;
    display: inline-flex;
  }
}

.menu-list-options-button-icon .lmenu-list-options-button-text {
  float: left;
}

.menu-list-options-button-icon {
  margin-top: 12px;
}
.bubble {
  &.right {
    .disable-selection {
      .button-text {
        .menu-list-options-button-icon {
          color: $color-surface-1;
        }
      }
    }
  }
  
  &.left {
    .disable-selection {
      .button-text {
        .menu-list-options-button-icon {
          color: $color-content-default;
        }
      }
    }
  }
}
.blip-card .form-group .help {
  padding: 0px;
}

.fixed-options ul {
    margin: 0px;
}

.editing .fixed-options ul {
  margin: 0px -10px;
}

.fixed-options ul .align-center {
  display: flex;
  align-items: center;
  margin: 0 auto;
  > bds-icon {
    margin-right: 10px;
    color: var(--color-primary, #1E6BF1) !important;    
  }
  > bds-typo {
    color: var(--color-primary, #1E6BF1);
  }

}

.blip-card .fixed-options li div, .blip-card .fixed-options li span{
  width: auto;
}

.menu-list-prompt .bubble{
  padding: 10px 0 0 0;
}


</style>
