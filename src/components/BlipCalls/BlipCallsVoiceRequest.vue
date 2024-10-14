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
          <div class="divider" />
          <div class="action">
            <bds-icon :color="position == 'right' ? 'white' : null" name="voip-call"/>
            <bds-typo
              class="typo title-action"
              variant="fs-16"
              bold="regular">{{ actionText }}
            </bds-typo>
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
                class="form-control"    
                :class="{'input-error': errors.has('bodyText') }"        
                maxlength="1024"
                placeholder="Body text"
                v-model="bodyText"
                v-auto-expand
                v-validate="'required'"
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
                name="actionText"
                class="form-control"
                maxlength="20"
                placeholder="Button text"
                v-validate="'required'"
                v-model="actionText"
              >
              <span
                v-show="errors.has('actionText')"
                class="help input-error"
              >{{ errors.first('actionText') }}</span>
            </div>
          </form>
        </div>
      </div> 
    </div>
  </div>
</template>

<script>
import { default as base } from '../../mixins/baseComponent.js'

export default {
  name: 'blip-calls-voice-request',
  mixins: [base],
  props: {
    bodyText: {
      type: String,
      required: true
    },
    actionText: {
      type: String,
      required: true
    }
  },
  methods: {
    init: function() {
      this.actionText = this.document.interactive.action.parameters.display_text
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
      this.document.interactive.action.parameters.display_text = this.actionText
      this.save(this.document)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/variables.scss';

.blip-container.calls-voice-request {
  .bubble {
    text-align: start;
    padding: 8px 16px;
    max-width: 368px !important;
  }

  .divider {
    border-top: 1px solid $color-content-ghost;
    margin-top: 8px;
    margin-bottom: 8px;
    width: 100%;
  }

  .action {
    display: flex;
    justify-content: center;
    padding-top: 8px;
    margin-bottom: 8px;

    .title-action {
      margin-left: 8px;
    }
  }
}
</style>
