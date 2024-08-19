<template>
  <div>  
    <div :class="'blip-container calls-voice-request ' + position">
      <div :class="'bubble ' + position">
        <div v-if="!isEditing">
          <bds-button-icon
            v-if="deletable && !isEditing"
            class="editIco trashIco icon-button-margin icon-button-top"
            icon="trash"
            variant="delete"
            size="short"
            v-on:click="trash(document)"
          ></bds-button-icon>
          <bds-button-icon
            v-if="editable && !isEditing"
            class="icon-button-margin editIco icon-button-top"
            icon="edit"
            variant="primary"
            size="short"
            v-on:click="toggleEdit"
          ></bds-button-icon>
          <bds-typo
            class="typo"
            variant="fs-16"
            bold="regular"
            >{{ bodyText }}
          </bds-typo>
          <div class="action">
            <bds-grid margin="y-1" direction="row" justify-content="center" padding="x-2">
              <bds-icon v-if="position === 'right'" color="white" name="voip-call"/>
              <bds-icon v-else name="voip-call"/>
              <bds-typo
                class="typo title-action"
                variant="fs-16"
                bold="regular">{{ buttonText }}
              </bds-typo>
            </bds-grid>
          </div>
        </div>
        <div v-else>
          <form :class="'editing ' + position" novalidate v-on:submit.prevent>
            <bds-button-icon
              class="btn saveIco closeIco"
              icon="close"
              variant="ghost"
              size="short"
              v-on:click="cancel()"
            ></bds-button-icon>
            <bds-button-icon 
              class="btn saveIco"
              icon="check"
              variant="primary"
              size="short"
              :disabled="errors.any()"
              v-on:click="saveData()"
            ></bds-button-icon>
            <div class="form-group">
              <textarea
                @keydown.enter="saveData($event)"
                name="bodyText"
                v-auto-expand
                class="form-control"
                v-validate="'required'"
                :class="{'input-error': errors.has('bodyText') }"
                v-model="bodyText"
                maxlength="1024"
                placeholder="Body text"
              ></textarea>
              <span
                v-show="errors.has('bodyText')"
                class="help input-error"
              >{{ errors.first('bodyText') }}</span>
            </div>
            <div class="form-group">
              <input
                @keydown.enter="saveData($event)"
                type="text"
                name="buttonText"
                class="form-control"
                v-validate="'required'"
                v-model="buttonText"
                maxlength="20"
                placeholder="Button text"
              >
              <span
                v-show="errors.has('buttonText')"
                class="help input-error"
              >{{ errors.first('buttonText') }}</span>
            </div>
          </form>
        </div>
      </div> 
    </div>
  </div>
</template>

<script>
import { default as base } from '../mixins/baseComponent.js'

export default {
  name: 'blip-calls-voice-request',
  mixins: [base],
  data: function() {
    return {
      buttonText: undefined,
      bodyText: undefined
    }
  },
  methods: {
    init: function() {
      this.buttonText = this.document.interactive.action.parameters.display_text
      this.bodyText = this.document.interactive.body.text
    },
    saveData: function($event) {
      if (this.errors.any() || ($event && $event.shiftKey)) {
        return
      }

      if ($event) {
        $event.stopPropagation()
        $event.preventDefault()
        $event.returnValue = false
      }

      this.document.interactive.body.text = this.bodyText
      this.document.interactive.action.parameters.display_text = this.buttonText
      this.save(this.document)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';

.blip-container.calls-voice-request {
  .bubble {
    text-align: left;
    padding: 10px 20px;
    max-width: 368px !important;
  }

  .action {
    text-align: center;
    border-top: 1px solid $color-content-ghost;
    margin-top: 10px;
    padding-top: 12px;

    .title-action {
      margin-left: 8px;
    }
  }
}
</style>
